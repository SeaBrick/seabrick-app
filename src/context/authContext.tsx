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
import type {
  AuthContextAuthenticated,
  AuthContextUnauthenticated,
  UserRole,
  UserType,
} from "@/lib/interfaces/auth";
import { decodeJWT, getUserRole } from "@/lib/utils/auth";

type AuthContextProps = AuthContextAuthenticated | AuthContextUnauthenticated;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userType: null,
  userRole: null,
  refetch: async () => {},
});

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

    const userRole = await getUserRole(supabaseClient);

    setUser(user);
    setUserType(user?.user_metadata?.type || null);
    setUserRole(userRole);
  }, [supabaseClient]);

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
