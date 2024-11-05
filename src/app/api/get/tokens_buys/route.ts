"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { StripeBuysByUserResponse } from "@/lib/interfaces/api";

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

  const { data, error } = await supabaseClient
    .from("stripe_buys")
    .select("id, amount, claimed, tokens_id, created_at, updated_at")
    .eq("user_id", user.id)
    .returns<StripeBuysByUserResponse[]>();

  if (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  const flattenedResponse = data.flatMap((item) =>
    item.tokens_id.map((tokenId) => ({
      // Use each token ID as the new item ID
      id: tokenId,
      buyEntityId: item.id,
      claimed: item.claimed,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))
  );

  return NextResponse.json({
    data: flattenedResponse,
    length: flattenedResponse.length,
  });
}
