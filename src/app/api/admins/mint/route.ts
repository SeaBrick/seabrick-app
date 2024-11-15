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

  const { data: queryData } = await supabaseClient
    .from("wallet_users")
    .select("address")
    .eq("user_id", dataUser.id)
    .single<{ address: string }>();

  // Mint resp
  let mintResp: MintSeabrickResp;
  let saveAsBuys = false;

  if (queryData && queryData.address) {
    if (!checkAddress(queryData.address)) {
      return NextResponse.json(
        {
          error: "Internal server error",
          details: "Invalid address linked to user",
        },
        { status: 500 }
      );
    }

    // Mint directly to wallet
    mintResp = await mintSeabrickTokens(amount, queryData.address);
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
    const dataInsert = mintResp.ids.map((id_) => {
      return {
        tx_hash: mintResp.txHash,
        token_id: id_,
        user_id: dataUser.id,
        // No attached to a session stripe
        session_id: null,
        claimed: false,
      };
    });

    // Save them as buys
    const { error: insertError } = await supabaseClient
      .from("stripe_buys")
      .insert(dataInsert);

    if (insertError) {
      console.error(
        "Failed to save the minted tokens in Database. IDs: ",
        JSON.stringify(mintResp.ids)
      );
      console.error(insertError);

      return NextResponse.json(
        {
          error: "Internal server error",
          details:
            "Tokens were not saved in database. IDs: " +
            JSON.stringify(mintResp.ids),
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
