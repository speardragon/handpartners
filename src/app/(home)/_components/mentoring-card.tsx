"use client";

import type { MentoringListItem } from "@/actions/mentoring-action";
import { getStatusBadge } from "../_lib/lib";
import { Building2, Calendar, History, Users } from "lucide-react";

interface Props {
  mentoring: MentoringListItem;
  isAdminView: boolean;
  onClick: (mentoring: MentoringListItem) => void;
}

export function MentoringCard({ mentoring, isAdminView, onClick }: Props) {
  const startDate = mentoring.program.start_date?.slice(0, 10) ?? "";
  const endDate = mentoring.program.end_date?.slice(0, 10) ?? "";

  return (
    <div
      onClick={() => onClick(mentoring)}
      className="relative cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="absolute right-5 top-5">
        {getStatusBadge(mentoring.status)}
      </div>

      <h3 className="mt-1 line-clamp-1 pr-20 text-lg font-semibold text-neutral-950">
        {mentoring.program.name}
      </h3>
      <p className="mt-2 line-clamp-2 pr-20 text-sm leading-6 text-neutral-600">
        {mentoring.program.description?.trim() || "프로그램 설명이 없습니다."}
      </p>

      <div className="mt-4 grid gap-2 text-sm text-neutral-500 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          전체 기업 {mentoring.number_of_companies}개
        </span>
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {isAdminView
            ? `배정 완료 ${mentoring.assigned_company_count}개`
            : `내 담당 ${mentoring.my_company_count}개`}
        </span>
        <span className="flex items-center gap-2">
          <History className="h-4 w-4" />
          기록 {mentoring.number_of_sessions}건
        </span>
        <span className="flex items-center gap-2 truncate">
          <Calendar className="h-4 w-4 shrink-0" />
          {startDate} ~ {endDate}
        </span>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        {mentoring.recent_mentored_at
          ? `최근 멘토링 ${mentoring.recent_mentored_at
              .slice(0, 16)
              .replace("T", " ")}`
          : "아직 멘토링 기록이 없습니다."}
      </p>
    </div>
  );
}
