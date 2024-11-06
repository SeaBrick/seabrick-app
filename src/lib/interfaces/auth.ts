import type { Session, User } from "@supabase/supabase-js";
import { type NextResponse } from "next/server";
export type UserType = "wallet" | "email";

export type UserRole = "owner" | "admin" | null;

export interface AuthContextAuthenticated {
  user: Session["user"];
  userType: UserType;
  userRole: UserRole;
  refetch: () => Promise<void>;
}

export interface AuthContextUnauthenticated {
  user: null;
  userType: null;
  userRole: null;
  refetch: () => Promise<void>;
}

interface HaveAccessResp {
  haveAccess: true;
  user: User;
}

interface NoAccessResp {
  haveAccess: false;
  nextResponse: NextResponse<{
    error: string;
    details: string;
  }>;
}

export type CheckAccessResponse = HaveAccessResp | NoAccessResp;
