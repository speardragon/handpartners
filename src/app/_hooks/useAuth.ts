// src/app/_hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";

/**
 * 사용자 인증 정보를 관리하는 커스텀 훅
 */
export function useAuth() {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 세션 가져오기
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();

    // onAuthStateChange를 통해 실시간 세션 변화를 감지
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  // user 상태를 반환
  return { user, supabase };
}
