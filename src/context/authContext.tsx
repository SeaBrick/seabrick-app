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

type UserType = "wallet" | "email";

interface AuthContextAuthenticated {
  user: Session["user"];
  userType: UserType;
  refetch: () => Promise<void>;
}

interface AuthContextUnauthenticated {
  user: null;
  userType: null;
  refetch: () => Promise<void>;
}

type AuthContextProps = AuthContextAuthenticated | AuthContextUnauthenticated;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userType: null,
  refetch: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const supabaseClient = createClient();

  useAccountEffect({
    onDisconnect() {
      // FIXME: After a reload page, this does not trigger
      async function signOut() {
        await supabaseClient.auth.signOut();
      }
      signOut();
    },
  });

  const refetch = useCallback(async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    setUser(session?.user || null);
    setUserType(session?.user?.user_metadata?.type || null);
  }, [supabaseClient.auth]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setUserType(session?.user?.user_metadata?.type || null);
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
          refetch,
        }
      : {
          user: null,
          userType: null,
          refetch,
        };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
