"use client";

import { ScreeningWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "@/app/(home)/_lib/lib";
import { Calendar, Eye, Hash } from "lucide-react";

interface ScreeningHeaderProps {
  screening: ScreeningWithStatus;
  isAdminView: boolean;
}

export default function ScreeningHeader({
  screening,
  isAdminView,
}: ScreeningHeaderProps) {
  const startDate = screening.start_date?.slice(0, 10) ?? "";
  const endDate = screening.end_date?.slice(0, 10) ?? "";

  return (
    <div className="space-y-3 rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">
            {screening.program.name}
          </p>
          <h1 className="mt-0.5 line-clamp-1 text-xl font-bold">
            {screening.name}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isAdminView && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              <Eye size={12} />
              전체 현황
            </span>
          )}
          {getStatusBadge(screening.status)}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Hash size={14} />
          {screening.id}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {startDate} ~ {endDate}
        </span>
      </div>
    </div>
  );
}
