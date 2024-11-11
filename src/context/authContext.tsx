"use client";
import { createClient } from "@/lib/supabase/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAccountEffect } from "wagmi";
import type {
  AuthContextAuthenticated,
  AuthContextUnauthenticated,
  UserRole,
  UserType,
} from "@/lib/interfaces/auth";
import { decodeJWT, getUserRole } from "@/lib/utils/auth";
import { getAddress, type Address } from "viem";
import { useRouter } from "next/navigation";

type AuthContextProps = AuthContextAuthenticated | AuthContextUnauthenticated;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userType: null,
  userRole: null,
  userAddress: null,
  signOut: async () => {},
  refetch: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const supabaseClient = createClient();

  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (error) {
      // TODO: set error modal (??)
      console.log(error);
    }

    await refetch();
    router.push("/login");
  }

  useAccountEffect({
    onDisconnect() {
      signOut();
    },
  });

  const refetch = useCallback(async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const userRole = await getUserRole(supabaseClient);

    async function getUserAddress(user_: User | null) {
      if (user_) {
        const { data, error } = await supabaseClient
          .from("wallet_users")
          .select("address")
          .eq("user_id", user_.id)
          .single<{ address: string }>();

        if (!error) {
          return getAddress(data.address);
        }
      }

      return null;
    }

    const userAddress = await getUserAddress(user);

    setUserAddress(userAddress);
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
          userAddress,
          signOut,
          refetch,
        }
      : {
          user: null,
          userType: null,
          userRole: null,
          userAddress: null,
          signOut,
          refetch,
        };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
