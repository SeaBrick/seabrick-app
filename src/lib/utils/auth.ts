import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { UserRole } from "../interfaces/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

export function decodeJWT<T>(
  accessToken: string
): JwtPayload & { user_role: UserRole } & T {
  return jwtDecode(accessToken);
}

export async function getUserRole(
  supabaseClient: SupabaseClient<any, "public", any>
) {
  const { data } = await supabaseClient.auth.getSession();
  const session = data?.session;
  if (!session) return null;

  const decodedToken = decodeJWT(session.access_token);
  return decodedToken.user_role || null;
}
