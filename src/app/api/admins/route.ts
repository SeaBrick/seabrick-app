"use server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

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

  const userRole = await getUserRole(supabaseClient);

  if (userRole !== "owner") {
    return NextResponse.json(
      { error: "Unauthorized", details: "No access" },
      { status: 401 }
    );
  }

  const { data, error } = await supabaseClient
    .from("user_roles")
    .select("id, user_id")
    .eq("role", "admin");

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

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", details: "No user logged" },
      { status: 401 }
    );
  }

  const userRole = await getUserRole(supabaseClient);

  if (userRole !== "owner") {
    return NextResponse.json(
      { error: "Unauthorized", details: "No access" },
      { status: 401 }
    );
  }

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

  const { error } = await supabaseClient
    .from("user_roles")
    .insert({ user_id: dataUser.id, role: "admin" });

  if (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ok",
  });
}
