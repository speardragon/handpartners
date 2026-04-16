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
        "rounded-xl border border-neutral-200 bg-white px-6 py-10",
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
          <Icon className="h-5 w-5 text-neutral-400" />
        </div>

        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
          {description}
        </p>

        {actionLabel && onAction ? (
          <Button
            type="button"
            variant="outline"
            className="mt-5 h-9 rounded-lg border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-50"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
