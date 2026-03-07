"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceEmptyStateProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function WorkspaceEmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: WorkspaceEmptyStateProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf9_100%)] px-6 py-10 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.45)]",
        className
      )}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300/80 to-transparent" />
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.08)_0%,_rgba(15,23,42,0)_72%)]" />

      <div className="relative flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <Icon className="h-6 w-6 text-neutral-500" />
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
          {description}
        </p>

        {actionLabel && onAction ? (
          <Button
            type="button"
            variant="outline"
            className="mt-6 h-10 rounded-full border-neutral-300 px-5 text-sm text-neutral-700 hover:bg-neutral-50"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
