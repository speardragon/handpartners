"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  current: "judging" | "mentoring";
};

const ITEMS = [
  { key: "judging", label: "심사", href: "/" },
  { key: "mentoring", label: "멘토링", href: "/mentoring" },
] as const;

export default function WorkspaceTabs({ current }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={cn(
            "inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors",
            current === item.key
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
