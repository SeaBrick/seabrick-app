"use server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkAccess } from "../utils";

export async function GET() {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "owner");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

  // Gettin all the admins with role "admin"
  const { data, error } = await supabaseClient.rpc("get_admin_user_details", {
    role_name: "admin",
  });

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

export async function POST(request: NextRequest) {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "owner");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

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

  const { error } = await supabaseClient
    .from("user_roles")
    .insert({ user_id: dataUser.id, role: "admin" });

  if (error) {
    // '23505' is the code for 'duplicate key value unique constraint'
    if (error.code == "23505") {
      return NextResponse.json(
        { error: "Conflict", details: "Admin already added" },
        { status: 409 }
      );
    }
    console.error("Error adding adming:");
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

export async function DELETE(request: NextRequest) {
  const supabaseClient = createClient();

  const checkAccessResp = await checkAccess(supabaseClient, "owner");

  if (!checkAccessResp.haveAccess) {
    return checkAccessResp.nextResponse;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Bad Request", details: "Admin ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseClient
    .from("user_roles")
    .delete()
    .eq("user_id", id);

  if (error) {
    console.error("Error when deleting the admin:");
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
