"use client";
import { createClient } from "@/app/lib/supabase/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { useAccountEffect } from "wagmi";

const AuthContext = createContext<{
  user: Session["user"] | null;
  refetch: () => Promise<void>;
}>({
  user: null,
  refetch: async () => {},
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const supabaseClient = createClient();

  useAccountEffect({
    onDisconnect() {
      async function signOut() {
        await supabaseClient.auth.signOut();
      }
      signOut();
    },
  });

  //   Refetch to update the user auth context
  const refetch = useCallback(async () => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      setUser(session?.user || null);
    };

    fetchUser();
  }, [supabaseClient.auth]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    // Use the authListener to listen auth changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log("onAuthStateChange.event: ", event, "- session: ", session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient.auth]);

  return (
    <AuthContext.Provider value={{ user, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
