"use client";

import "../../globals.css";
import SideNav from "./_components/side-nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="mt-14 flex-1 overflow-y-auto lg:mt-0 lg:ml-[260px]">
        {children}
      </main>
    </div>
  );
}
