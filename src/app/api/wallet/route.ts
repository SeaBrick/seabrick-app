"use server";

import { createClient } from "@/lib/supabase/server";
import { checkAddress } from "@/lib/utils";
import { getUniquePassword } from "@/lib/utils/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

  let walletAddress: string;

  try {
    const body = await request.json();
    if (!body.walletAddress) {
      throw new Error("Not wallet address in the request body");
    }

    walletAddress = body.walletAddress;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Bad Request", details: "Malformed request" },
      { status: 400 }
    );
  }

  if (!checkAddress(walletAddress)) {
    return NextResponse.json(
      {
        error: "Bad Request",
        details: "Malformed or not valid wallet address",
      },
      { status: 400 }
    );
  }

  const respCheckTaken = await supabaseClient
    .from("wallet_users")
    .select("address")
    .eq("address", walletAddress.toLowerCase())
    .single();

  // address is taken
  if (respCheckTaken.data) {
    return NextResponse.json(
      {
        error: "Wallet address taken",
        details: "The wallet address provided is already used by another user",
      },
      { status: 409 }
    );
  }

  // TODO: Verify signature

  // Since the signature was verified, we link the address to the user
  // We update the password right away so the user can log in with this wallet
  const { error: updatePassworError } = await createClient(
    true
  ).auth.admin.updateUserById(user.id, {
    password: await getUniquePassword(walletAddress),
  });

  // We were not able to update the password
  if (updatePassworError) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: "Failed to add the new address",
      },
      { status: 500 }
    );
  }

  // And update the wallet users
  const { error: updateError } = await supabaseClient
    .from("wallet_users")
    .update("address")
    .eq("user_id", walletAddress.toLowerCase());

  if (updateError) {
    console.error("Failed to add the new address");
    console.error(updateError);

    return NextResponse.json({
      message: "ok",
      fullUpdated: false,
      details: "wallet_users table was not updated",
    });
  }

  return NextResponse.json({ message: "ok", fullUpdated: true });
}
