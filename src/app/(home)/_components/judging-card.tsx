"use client";

import { JudgingWorkspaceWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "../_lib/lib";
import { Building2, Calendar } from "lucide-react";

interface JudgingCardProps {
  judging: JudgingWorkspaceWithStatus;
  onClick: (judging: JudgingWorkspaceWithStatus) => void;
}

export function JudgingCard({ judging, onClick }: JudgingCardProps) {
  const startDate = judging.start_date?.slice(0, 10) ?? "";
  const endDate = judging.end_date?.slice(0, 10) ?? "";

  return (
    <div
      onClick={() => onClick(judging)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
              심사 세션
            </p>
            <h3
              title={judging.name}
              className="mt-2 line-clamp-1 text-lg font-semibold text-neutral-950"
            >
              {judging.name}
            </h3>
          </div>
          <div className="shrink-0">{getStatusBadge(judging.status)}</div>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
          {judging.program.description?.trim() || "프로그램 설명이 없습니다."}
        </p>

        <div className="mt-4 grid gap-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-neutral-400" />
            참여 기업 {judging.companies.length}개
          </span>
          <span className="flex items-center gap-2 sm:col-span-2">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
            {startDate} ~ {endDate}
          </span>
        </div>
      </div>
    </div>
  );
}
