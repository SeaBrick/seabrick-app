"use server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAccess } from "../../utils";
import { checkAddress } from "@/lib/utils";
import { mintSeabrickTokens } from "@/lib/contracts/transactions";
import { MintSeabrickResp } from "@/lib/interfaces/api";

export async function POST(request: NextRequest) {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "admin");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

  let email: string;
  let amount: number;

  try {
    // Log request headers and method to confirm it's a POST with JSON content-type

    const body = await request.json();
    if (!body.email) {
      throw new Error("Not email in the request body");
    }

    if (!body.amount) {
      throw new Error("Not valid amount");
    }

    email = body.email;
    amount = Number(body.amount);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Bad Request", details: "Malformed request" },
      { status: 400 }
    );
  }

  const { data: dataUser, error: errorUser } = await supabaseClient
    .rpc("get_user_id_by_email", {
      email: email,
    })
    .returns()
    .single<{ id: string }>();

  // 'PGRST116' code is 'JSON object requested, multiple (or no) rows returned'
  // We handle that as not email found
  if (errorUser && errorUser.code != "PGRST116") {
    console.error("Error when getting the user: ");
    console.error(errorUser);
    return NextResponse.json(
      { error: "Internal server error", details: errorUser.message },
      { status: 500 }
    );
  }

  if ((errorUser && errorUser.code == "PGRST116") || !dataUser) {
    return NextResponse.json(
      { error: "Not found", details: "User with this email not found" },
      { status: 404 }
    );
  }

  const { data: userAddress } = await supabaseClient
    .rpc("get_user_address", {
      user_id: dataUser.id,
    })
    .returns<string | null>();

  // Mint resp
  let mintResp: MintSeabrickResp;
  let saveAsBuys = false;

  if (userAddress && checkAddress(userAddress)) {
    // Mint directly to wallet
    mintResp = await mintSeabrickTokens(amount, userAddress);
  } else {
    // Mint to vaul wallet and save it as buys not claimed
    mintResp = await mintSeabrickTokens(amount);
    saveAsBuys = true;
  }

  // Tokens were not minted
  if (!mintResp.isMinted) {
    return NextResponse.json(
      { error: "Internal server error", details: "Tokens were not minted" },
      { status: 500 }
    );
  }

  if (saveAsBuys) {
    // Save them as buys
    const { error: insertError } = await supabaseClient
      .from("stripe_buys")
      .insert({
        tx_hash: mintResp.txHash,
        tokens_id: mintResp.ids,
        user_id: dataUser.id,
        // No attached to a session stripe
        session_id: null,
        amount: amount,
        claimed: false,
      });

    if (insertError) {
      console.error(
        "Failed to save the minted tokens in Database. IDs: ",
        JSON.stringify(mintResp.ids)
      );
      console.error(insertError)

      return NextResponse.json(
        {
          error: "Internal server error",
          details: "Tokens were not saved in database. IDs: " + JSON.stringify(mintResp.ids),
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({
    message: "ok",
    ids: mintResp.ids,
    txHash: mintResp.txHash,
    needClaim: saveAsBuys, // if `saveAsBuys` is true, tokens need to be claimed
  });
}
