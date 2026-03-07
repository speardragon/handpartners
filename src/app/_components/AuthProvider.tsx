"use client";

import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "@/actions/user-actions";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, setAccessToken, clearAuth } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        try {
          if (session) {
            const profile = await getUserProfile();
            if (mounted) {
              setUser(profile);
              setAccessToken(session.access_token);
            }
          } else {
            if (mounted) setUser(null);
          }
        } catch (error) {
          if (mounted) setUser(null);
        } finally {
          if (mounted) setLoading(false);
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const profile = await getUserProfile();
          if (mounted) {
            setUser(profile);
            setAccessToken(session?.access_token ?? null);
          }
        } catch (error) {
          console.error("[AuthProvider] profile fetch error:", error);
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) clearAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [clearAuth, setAccessToken, setLoading, setUser]);

  return <>{children}</>;
}
