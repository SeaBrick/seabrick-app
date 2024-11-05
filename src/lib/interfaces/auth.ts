import type { Session } from "@supabase/supabase-js";
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