"use server";

import { getUserRole } from "@/lib/utils/auth";
import { CheckAccessResponse, type UserRole } from "@/lib/interfaces/auth";
import { type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function checkAccess(
  supabaseClient: SupabaseClient<never, "public", never>,
  roleRequired: UserRole
): Promise<CheckAccessResponse> {
  // Get the current user from supabase client
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  // If no user logged, it's an error
  if (!user) {
    return {
      haveAccess: false,
      nextResponse: NextResponse.json(
        { error: "Unauthorized", details: "No user logged" },
        { status: 401 }
      ),
    };
  }

  // Get the role of the user
  const userRole = await getUserRole(supabaseClient);

  // Define access rules based on role requirements
  const hasAccess =
    roleRequired === null
      ? true
      : roleRequired === "owner"
        ? userRole === "owner" // Only owner has access
        : userRole === "admin" || userRole === "owner";

  // Check if has access
  if (!hasAccess) {
    return {
      haveAccess: false,
      nextResponse: NextResponse.json(
        { error: "Unauthorized", details: "No access" },
        { status: 401 }
      ),
    };
  }

  return { haveAccess: true, user: user };
}
