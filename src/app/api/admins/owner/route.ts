"use server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAccess } from "../../utils";

export async function POST(request: NextRequest) {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "owner");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

  const user = checkAccessResp.user;

  let email: string;

  try {
    // Log request headers and method to confirm it's a POST with JSON content-type

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
