"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({ accessToken, children }) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const { user, setUser } = useAuthStore((state) => state);

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        // router.push("login");
      }
      if (session.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}