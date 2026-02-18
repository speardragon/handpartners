"use client";

import { Users, Building2, FolderKanban, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import handpartnersLogo from "../../../../../public/images/handpartners_logo.png";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/admin/user", label: "사용자 관리", icon: Users, key: "user" },
  {
    href: "/admin/program",
    label: "프로그램 관리",
    icon: FolderKanban,
    key: "program",
  },
  {
    href: "/admin/company",
    label: "기업 관리",
    icon: Building2,
    key: "company",
  },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center justify-center border-b border-neutral-100">
        <Link href="/" onClick={onNavigate}>
          <Image
            alt="Handpartners 로고"
            src={handpartnersLogo}
            width={180}
            height={180}
            priority={true}
            style={{ width: "100%", height: "auto" }}
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon, key }) => {
          const isActive = pathname.includes(key);
          return (
            <Link
              key={key}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-neutral-200 bg-white lg:flex">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="ml-3">
          <Link href="/">
            <Image
              alt="Handpartners 로고"
              src={handpartnersLogo}
              width={120}
              height={120}
              priority={true}
              style={{ width: "auto", height: "28px" }}
            />
          </Link>
        </div>
      </div>

      {/* Mobile sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] p-0">
          <SheetTitle className="sr-only">네비게이션</SheetTitle>
          <NavContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
