"use client";

import { ScreeningWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "@/app/(home)/_lib/lib";

interface ScreeningHeaderProps {
  screening: ScreeningWithStatus;
}

export default function ScreeningHeader({ screening }: ScreeningHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="text-xl font-bold">
        {screening.program.name} / {screening.name}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          심사 기간: {screening.start_date?.slice(0, 10)} ~{" "}
          {screening.end_date?.slice(0, 10)}
        </span>
        {getStatusBadge(screening.screeningStatus)}
      </div>
      <div className="text-sm text-gray-500">심사 번호: {screening.id}</div>
    </div>
  );
}
