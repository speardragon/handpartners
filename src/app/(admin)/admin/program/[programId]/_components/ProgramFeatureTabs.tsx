"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  programId: number;
  current: "judging";
};

const FEATURE_ITEMS = [
  {
    key: "judging",
    label: "심사",
    href: (programId: number) => `/admin/program/${programId}/judging`,
  },
  { key: "mentoring", label: "멘토링", disabled: true },
] as const;

export default function ProgramFeatureTabs({ programId, current }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FEATURE_ITEMS.map((item) => {
        if ("href" in item) {
          return (
            <Link
              key={item.key}
              href={item.href(programId)}
              className={cn(
                "inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors",
                current === item.key
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
              )}
            >
              {item.label}
            </Link>
          );
        }

        if ("disabled" in item && item.disabled) {
          return (
            <div
              key={item.key}
              className="inline-flex items-center rounded-full border border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-400"
            >
              {item.label} 준비 중
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
