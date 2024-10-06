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
    // Call the function to get the user status
    refetch();

    // Use the authListener to listen auth changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [refetch, supabaseClient.auth]);

  return (
    <AuthContext.Provider value={{ user, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
