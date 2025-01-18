"use client";

import { useUserProfileQuery } from "../_hooks/useUserQuery";
import { useAuth } from "../_hooks/useAuth"; // 새로 만든 훅 import
import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";

export default function Header() {
  // 커스텀 훅에서 user, supabase 가져오기
  const { user, supabase } = useAuth();

  // role 정보를 가져오는 기존 훅 (예: react-query 기반으로 추정)
  const { data: userProfile } = useUserProfileQuery();

  // 로그아웃 처리
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // useAuth 훅에서 user 상태가 자동으로 null로 업데이트됩니다.
  };

  return (
    <header className="flex z-50 w-full items-center h-16 border-b border-gray-200">
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
                onClick={handleSignOut}
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
