"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useUserProfileQuery } from "../_hooks/useUserQuery";

export default function Header() {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState(null);
  const { data: userProfile } = useUserProfileQuery();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="flex z-50 w-full items-center h-16 border-b border-gray-200">
      {/* <header className="fixed top-0 left-0 z-50 items-center w-full h-16 px-4 bg-white border-b border-gray-200"> */}
      <div className="flex items-center justify-between w-full p-2 px-6 font-medium text-gray-900">
        <Link href="/">
          <Image
            className="h-full w-auto"
            alt="logo"
            src={handpartnersLogo}
            width={180}
            height={180}
            priority
          />
        </Link>
        <div className="flex flex-row gap-4">
          {user ? (
            <>
              {userProfile?.role === "관리자" && (
                <Link href="/admin/user">관리자 페이지</Link>
              )}
              <div
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null); // 로그아웃 시 사용자 상태 초기화
                }}
                className="hover:underline cursor-pointer"
              >
                로그아웃
              </div>
            </>
          ) : (
            <Link href="/login" className="hover:underline cursor-pointer">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
