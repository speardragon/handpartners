"use client";

import { Users } from "lucide-react";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { Files } from "lucide-react";
import Image from "next/image";
import handpartnersLogo from "../../../../../public/images/handpartners_logo.png";

export default function SideNav() {
  const pathname = usePathname();
  const linkClassName = (linkType: string) => {
    const isActivePage = pathname.includes(linkType);
    return `flex flex-row w-full rounded-lg p-4 font-normal space-x-2 ${
      isActivePage
        ? "bg-blue-500 text-white"
        : "hover:bg-blue-100 hover:text-blue-500 text-slate-500"
    }`;
  };

  return (
    // h-screen 뺌
    <div className="min-w-[270px] min-h-screen flex flex-col items-center border-r border-gray-300">
      <div className="flex flex-col items-center w-full h-full p-4 space-y-6">
        <Link href="/" className="">
          <Image
            alt="logo"
            src={handpartnersLogo}
            // className="-mr-1"
            width={180}
            height={180}
            priority={true}
            style={{ width: "100%", height: "auto" }}
          />
        </Link>
        <Link href="/admin/user" className={linkClassName("user")}>
          <Users />
          <div>유저 관리</div>
        </Link>
        <Link href="/admin/program" className={linkClassName("program")}>
          <FolderKanban />
          <div>프로그램 관리</div>
        </Link>
        {/* <Link href="/admin/judge" className={`${linkClassName("judge")}`}>
          <Files />
          <div>심사 관리</div>
        </Link> */}
        <Link href="/admin/company" className={`${linkClassName("company")}`}>
          <Building2 />
          <div>기업 관리</div>
        </Link>
      </div>
    </div>
  );
}
