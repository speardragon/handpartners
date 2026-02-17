"use client";

import "../../globals.css";
import SideNav from "./_components/side-nav";
import { useUserProfileQuery } from "@/app/_hooks/useUserQuery";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: userProfile } = useUserProfileQuery();

  useEffect(() => {
    if (userProfile && userProfile.role !== "관리자") {
      window.location.href = "/";
    }
  }, [userProfile]);

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="mt-14 flex-1 overflow-y-auto lg:ml-[260px] lg:mt-0">
        {children}
      </main>
    </div>
  );
}
