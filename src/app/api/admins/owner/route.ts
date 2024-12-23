"use server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAccess } from "../../utils";
import { checkAddress } from "@/lib/utils";
import { getContractsOwner } from "@/lib/contracts/transactions";
import { Address } from "viem";

// TODO: Make a transaction at front end and then check the transaction here...
// I mean, a transaction for transfering the ownership...
// THere are few options here (I like more the 3rd but need tecnically two transactions):
// - Fullfil (NOT SENT) a transaction wherethe user at frontend (current owner) will sign it. Then
//     we go and send it now here on the backend. This way we make sure that the transaction
//     was made and we can change the owner of the app right away.
// - Make the transfer ownership at the frontend, then we can use the transaction hash here
//     (or just check the new current owner) and transfer it to that. The only risk is something
//     fail at the backend, so the ownership will be sent to the address but the owner role
//     will stay on the previous user account.
// - Make a transfer ownership at the frontend to send the ownership to our wallet at database
//      and then we can transfer the ownership again to the desired wallet user. We can have
//      some error catches in case something bad happened at backend, we still letting the user
//      to retry to send the ownership to his desired address

export async function POST(request: NextRequest) {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "owner");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

  const user = checkAccessResp.user;

  let email: string;

  try {
    const body = await request.json();
    if (!body.email) {
      throw new Error("Not email in the request body");
    }

    email = body.email;
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

  // Query from `wallet_users`
  const { data: queryData, error: queryError } = await supabaseClient
    .from("wallet_users")
    .select("address")
    .eq("user_id", dataUser.id)
    .single<{ address: string }>();

  if (queryError) {
    console.error("Failed to get the User Address");
    console.error(queryError);
    return NextResponse.json(
      { error: "Internal server error", details: queryError.message },
      { status: 500 }
    );
  }

  // Assign it to better readability
  const userAddress = queryData.address;

  if (!userAddress) {
    return NextResponse.json(
      {
        error: "Bad Request",
        details: "User do not have a wallet address linked",
      },
      { status: 400 }
    );
  }

  if (!checkAddress(userAddress)) {
    return NextResponse.json(
      {
        error: "Bad Request",
        details: "User have a malformed wallet address",
      },
      { status: 400 }
    );
  }

  let ownerAddress: Address;

  try {
    ownerAddress = await getContractsOwner();
  } catch (error) {
    let message = "Failed to get contracts owner address";
    console.error("Failed to get contracts owner address");

    if (error instanceof Error) {
      message = error.message;
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }

  if (ownerAddress !== userAddress) {
    return NextResponse.json(
      {
        error: "Bad Request",
        details: "User wallet address is not the owner of the contracts",
      },
      { status: 400 }
    );
  }

  const { error } = await supabaseClient.from("user_roles").upsert(
    [
      { user_id: dataUser.id, role: "owner" },
      { user_id: user.id, role: "admin" },
    ],
    { ignoreDuplicates: false, onConflict: "user_id" }
  );

  if (error) {
    console.error("Transfering ownership failed");
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ok",
  });
}
