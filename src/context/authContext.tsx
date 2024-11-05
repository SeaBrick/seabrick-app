"use client";
import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { useAccountEffect } from "wagmi";
import { jwtDecode, JwtPayload } from "jwt-decode";

type UserType = "wallet" | "email";

type UserRole = "owner" | "admin" | null;

interface AuthContextAuthenticated {
  user: Session["user"];
  userType: UserType;
  userRole: UserRole;
  refetch: () => Promise<void>;
}

interface AuthContextUnauthenticated {
  user: null;
  userType: null;
  userRole: null;
  refetch: () => Promise<void>;
}

type AuthContextProps = AuthContextAuthenticated | AuthContextUnauthenticated;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userType: null,
  userRole: null,
  refetch: async () => {},
});

function decodeJWT<T>(
  accessToken: string
): JwtPayload & { user_role: UserRole } & T {
  return jwtDecode(accessToken);
}

export async function getUserRole(session?: Session | null) {
  if (!session) {
    const { data } = await createClient().auth.getSession();
    session = data?.session;
    if (!session) return null;
  }

  const decodedToken = decodeJWT(session.access_token);
  return decodedToken.user_role || null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const supabaseClient = createClient();

  useAccountEffect({
    onDisconnect() {
      async function signOut() {
        await supabaseClient.auth.signOut();
        await refetch();
      }
      signOut();
    },
  });

  const refetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const userRole = await getUserRole();

    setUser(user);
    setUserType(user?.user_metadata?.type || null);
    setUserRole(userRole);
  }, [supabaseClient.auth]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setUserType(session?.user?.user_metadata?.type || null);
        setUserRole(
          session?.access_token
            ? decodeJWT(session?.access_token).user_role
            : null
        );
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient.auth]);

  const contextValue: AuthContextProps =
    user && userType
      ? {
          user,
          userType,
          userRole,
          refetch,
        }
      : {
          user: null,
          userType: null,
          userRole: null,
          refetch,
        };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
