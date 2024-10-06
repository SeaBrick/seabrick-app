"use client";
import { createClient } from "@/app/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"; // For client-side routing

const AuthContext = createContext<{ user: Session["user"] | null }>({
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const supabaseClient = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check the session and set the user on mount
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) {
        console.error("Error fetching session", error);
      } else {
        setUser(session?.user ?? null);
      }
    };

    getSession();

    // Listen for auth changes to reflect in the UI
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          // Session is null when it expires
          setUser(null);
          // Redirect to login page if the session has expired
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient, router]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
