"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { StripeBuysByUserResponse } from "@/lib/interfaces/api";

export async function GET() {
  // Maybe we can add pagination logic
  // Limited by `10`,
  const limit = 10;
  // Descendng order
  const ascending = false;
  // Order by created_at
  const orderBy = "created_at";
  const supabaseClient = createClient();

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", details: "No user logged" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseClient
    .from("stripe_buys")
    .select("id, claimed, token_id, created_at, updated_at")
    .eq("user_id", user.id)
    .order(orderBy, { ascending })
    .limit(limit)
    .returns<StripeBuysByUserResponse[]>();

  if (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: data,
    length: data.length,
  });
}
