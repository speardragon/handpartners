"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthProvider({ accessToken, children }: { accessToken: string | null; children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription: authListner },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("login");
      }
      if (session?.access_token !== accessToken) {
        router.refresh();
      }
    });

    return () => {
      authListner.unsubscribe();
    };
  }, [accessToken, supabase, router]);

  return children;
}
