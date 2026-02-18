"use client";

import { ScreeningWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "../_lib/lib";
import { Building2, Calendar } from "lucide-react";

interface ScreeningCardProps {
  screening: ScreeningWithStatus;
  onClick: (screening: ScreeningWithStatus) => void;
}

export function ScreeningCard({ screening, onClick }: ScreeningCardProps) {
  const startDate = screening.start_date?.slice(0, 10) ?? "";
  const endDate = screening.end_date?.slice(0, 10) ?? "";

  return (
    <div
      onClick={() => onClick(screening)}
      className="relative cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="absolute right-4 top-4">
        {getStatusBadge(screening.status)}
      </div>

      <p className="truncate pr-16 text-xs text-muted-foreground">
        {screening.program.name}
      </p>

      <h3 className="mt-1 line-clamp-1 pr-16 text-base font-semibold">
        {screening.name}
      </h3>

      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Building2 size={14} />
          {screening.companies.length}개 기업
        </span>
        <span className="flex items-center gap-1 truncate">
          <Calendar size={14} className="shrink-0" />
          {startDate} ~ {endDate}
        </span>
      </div>
    </div>
  );
}
