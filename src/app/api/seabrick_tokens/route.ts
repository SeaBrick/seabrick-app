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
    ascending = true,
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
      limit: 10,
    }
  );

  if (buysError) {
    return NextResponse.json(
      { error: "Internal server error", details: buysError.message },
      { status: 500 }
    );
  }

  if (buysData.length === 0) {
    return NextResponse.json(
      {
        error: "No tokens to claim",
        details: "The user do not have tokens available to be claimed",
      },
      { status: 404 }
    );
  }

  // Mark them as claimed before transfering the tokens to avoid any possible attack
  const buysIdToUpdate = buysData.map((buyData_) => buyData_.id);

  // Sending the update
  const {
    error: updateError,
    data: updateData,
    count: updateCount,
  } = await supabaseClient
    .from("stripe_buys")
    .update({ claimed: true })
    .in("id", buysIdToUpdate)
    .select();

  // If we cannot update the claimed status, we fail
  if (updateError || updateData.length === 0 || updateCount == 0) {
    console.error(updateError);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to update the claimed status",
      },
      { status: 500 }
    );
  }

  // Convert the tokens id from string to BigInt
  const tokenIds = buysData.map((buy_) => BigInt(buy_.token_id));
  const tokenIdsString = tokenIds.map((val_) => val_.toString());

  // We send the transfer request
  const transferResp = await transferFromVault(tokenIds, userWalletAddress);

  // If the transfer failed, we change again the status
  if (transferResp.isTransfer === false) {
    // update_claimed_status
    const { error: unctionFallbackError } = await createClient(true).rpc(
      "update_claimed_status",
      {
        ids: buysIdToUpdate,
        claimed_value: false,
      }
    );

    // We get the error message based on the errors
    let messageDetail = "Failed to transfer the tokens to the user wallet";

    // We print everything so can be debug and maybe manually approach it
    if (unctionFallbackError) {
      const rollbackMessage = "Failed to rollback the claimed status";
      console.error(rollbackMessage);
      console.error("For buys IDs: ", JSON.stringify(buysIdToUpdate));
      console.error("Token IDs: ", JSON.stringify(tokenIdsString));
      console.error(unctionFallbackError);

      messageDetail = `${messageDetail}. ${rollbackMessage}`;
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: messageDetail,
      },
      { status: 500 }
    );
  }

  // We add the transfer tx hash to the correct ids
  const { error: updateTxError } = await createClient(true)
    .from("stripe_buys")
    .update({ claim_tx: transferResp.txHash })
    .in("id", buysIdToUpdate);

  // If there is an error on this update, we do not care since the
  // sensitive part (transfering the tokens), was already made
  if (updateTxError) {
    console.error("Transfer tx hash was not added to token IDs:");
    console.error(JSON.stringify(tokenIds.map((val_) => val_.toString())));
    console.error(updateTxError);
  }

  return NextResponse.json({
    message: "ok",
    txHash: transferResp.txHash,
    tokenIds: tokenIdsString,
  });
}
