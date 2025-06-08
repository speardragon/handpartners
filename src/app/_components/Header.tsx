"use client";

import { useUserProfileQuery } from "../_hooks/useUserQuery";
import { useAuth } from "../_hooks/useAuth"; // 새로 만든 훅 import
import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfileQuery();

  const isAdmin = userProfile?.role === "관리자";

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
            isAdmin ? (
              <AdminHeaderActions />
            ) : (
              <UserHeaderActions />
            )
          ) : (
            <GuestHeaderActions />
          )}
        </div>
      </div>
    </header>
  );
}

// 공통 로그아웃 로직을 위한 커스텀 훅
function useSignOut() {
  const { supabase } = useAuth();
  const router = useRouter();

  return async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
}

// 로그아웃 버튼 컴포넌트
function SignOutButton() {
  const handleSignOut = useSignOut();

  return (
    <div onClick={handleSignOut} className="hover:underline cursor-pointer">
      로그아웃
    </div>
  );
}

function UserHeaderActions() {
  return <SignOutButton />;
}

function AdminHeaderActions() {
  return (
    <>
      <Link className="hover:underline" href="/admin/user">
        관리자 페이지
      </Link>
      <SignOutButton />
    </>
  );
}

function GuestHeaderActions() {
  return (
    <Link href="/login" className="hover:underline cursor-pointer">
      로그인
    </Link>
  );
}
