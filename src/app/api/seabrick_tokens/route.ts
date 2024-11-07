"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type StripeBuysByUserResponse } from "@/lib/interfaces/api";
import { type PostgrestSingleResponse } from "@supabase/supabase-js";
import { type SupabaseClient } from "@supabase/supabase-js";
import { transferFromVault } from "@/lib/contracts/transactions";
import { checkAddress } from "@/lib/utils";

// Maybe we can add pagination logic
async function getUserStripeBuys(
  supabaseClient: SupabaseClient<never, "public", never>,
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

export async function PATCH() {
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

  const { data: walletData, error: walletError } = await supabaseClient
    .from("wallet_users")
    .select("address")
    .eq("user_id", user.id)
    .single<{ address: string }>();

  if (walletError) {
    return NextResponse.json(
      {
        error: "No wallet linked",
        details: "The user do not have a linked wallet to his account",
      },
      { status: 404 }
    );
  }

  const { address: userWalletAddress } = walletData;

  if (!userWalletAddress || !checkAddress(userWalletAddress)) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "The wallet address linked of the user is not a valid address",
      },
      { status: 500 }
    );
  }

  const { data: buysData, error: buysError } = await getUserStripeBuys(
    supabaseClient,
    user.id,
    {
      onlyNotClaimed: true,
      limit: 5,
    }
  );

  if (buysError) {
    return NextResponse.json(
      { error: "Internal server error", details: buysError.message },
      { status: 500 }
    );
  }

  // return NextResponse.json({
  //   walletData,
  //   walletError,
  //   buysData,
  // });

  if (buysData.length === 0) {
    return NextResponse.json(
      {
        error: "No tokens to claim",
        details: "The user do not have tokens available to be claimed",
      },
      { status: 404 }
    );
  }

  // Conver the tokens id from string to BigInt
  const tokenIds = buysData.map((buy_) => BigInt(buy_.token_id));

  const resp = await transferFromVault(tokenIds, userWalletAddress);

  if (resp.isTransfer === false) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to transfer the tokens to the user wallet",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ok",
    txHash: resp.txHash,
  });
}
