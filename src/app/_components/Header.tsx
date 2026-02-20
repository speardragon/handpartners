"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { USER_ROLES } from "@/constants/auth";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";

export default function Header() {
  const { user } = useAuthStore();

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <header className="z-50 flex h-16 w-full items-center border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex w-full items-center justify-between p-2 px-6 font-medium text-gray-900">
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

const headerActionClassName =
  "inline-flex items-center text-[15px] font-semibold leading-6 tracking-[-0.01em] text-gray-700 transition-colors hover:text-gray-900 hover:underline hover:underline-offset-4";

// 공통 로그아웃 로직을 위한 커스텀 훅
function useSignOut() {
  return async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };
}

// 로그아웃 버튼 컴포넌트
function SignOutButton() {
  const handleSignOut = useSignOut();

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={headerActionClassName}
    >
      로그아웃
    </button>
  );
}

function UserHeaderActions() {
  return <SignOutButton />;
}

function AdminHeaderActions() {
  return (
    <>
      <Link className={headerActionClassName} href="/admin/user">
        관리자 페이지
      </Link>
      <SignOutButton />
    </>
  );
}

function GuestHeaderActions() {
  return (
    <Link href="/login" className={headerActionClassName}>
      로그인
    </Link>
  );
}
