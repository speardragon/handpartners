"use client";

import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";
import { createBrowserSupabaseClient } from "@/utils/supabase/client";
import { useUserProfileQuery } from "../_hooks/useUserQuery";

export default function Header() {
  const supabase = createBrowserSupabaseClient();
  const { data: userProfile } = useUserProfileQuery();

  return (
    <header className="flex z-50 w-full items-center h-20 border-b border-gray-200">
      <div className="flex items-center justify-between w-full px-4 font-medium text-gray-900">
        <Link href="/">
          <Image
            className="h-full w-auto"
            alt="logo"
            src={handpartnersLogo}
            width={180}
            height={180}
            priority={true}
          />
        </Link>
        <div className="flex flex-row gap-4">
          <Link href="/admin">관리자 페이지</Link>
          <div
            onClick={async () => {
              supabase.auth.signOut();
            }}
            className="hover:underline cursor-pointer"
          >
            로그아웃
          </div>
        </div>
      </div>
    </header>
  );
}
