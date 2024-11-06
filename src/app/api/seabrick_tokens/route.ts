"use server";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type StripeBuysByUserResponse } from "@/lib/interfaces/api";
import { type PostgrestSingleResponse } from "@supabase/supabase-js";
import { type SupabaseClient } from "@supabase/supabase-js";

// Maybe we can add pagination logic
async function getUserStripeBuys(
  supabaseClient: SupabaseClient<any, "public", any>,
  userId: string,
  options: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    onlyNotClaimed?: boolean;
  } = {}
): Promise<PostgrestSingleResponse<StripeBuysByUserResponse[]>> {
  // Deconstruc the options
  const {
    orderBy = "created_at",
    ascending = false,
    limit = 10,
    onlyNotClaimed = false,
  } = options;

  let query = supabaseClient
    .from("stripe_buys")
    .select("id, claimed, token_id, created_at, updated_at")
    .order(orderBy, { ascending })
    .limit(limit)
    .eq("user_id", userId);

  // Add the filter to only get the no claimed
  if (onlyNotClaimed) {
    query = query.eq("claimed", false);
  }

  // Return the reponse
  return await query.returns<StripeBuysByUserResponse[]>();
}

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

  const { data, error } = await getUserStripeBuys(supabaseClient, user.id);

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

export async function PATCH(request: NextRequest) {
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

  const { data, error } = await getUserStripeBuys(supabaseClient, user.id, {
    onlyNotClaimed: true,
  });

  if (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  const a = data;
}
