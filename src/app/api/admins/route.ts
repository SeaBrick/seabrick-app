"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/utils/auth";
import { NextResponse } from "next/server";

export async function GET() {
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

  const userRole = await getUserRole(supabaseClient);

  if (userRole !== "owner") {
    return NextResponse.json(
      { error: "Unauthorized", details: "No access" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseClient
    .from("user_roles")
    .select("id, user_id")
    .eq("role", "admin");

  if (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data,
    length: data.length,
  });
}
