"use client";

import Image from "next/image";
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
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
              멘토링 세션
            </p>
            <h3
              title={mentoring.program.name}
              className="mt-2 line-clamp-1 text-lg font-semibold text-neutral-950"
            >
              {mentoring.program.name}
            </h3>
          </div>
          {mentoring.report_logo_url ? (
            <div className="relative h-20 w-40 shrink-0 rounded-xl border border-white/80 bg-white/90 p-3 shadow-sm">
              <Image
                src={mentoring.report_logo_url}
                alt={`${mentoring.program.name} 로고`}
                fill
                sizes="160px"
                unoptimized
                className="object-contain p-3"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
              {mentoring.program.description?.trim() ||
                "프로그램 설명이 없습니다."}
            </p>
          </div>
          <div className="shrink-0">{getStatusBadge(mentoring.status)}</div>
        </div>

        <div className="mt-4 grid gap-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-neutral-400" />
            전체 기업 {mentoring.number_of_companies}개
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-400" />
            {isAdminView
              ? `배정 완료 ${mentoring.assigned_company_count}개`
              : `내 담당 ${mentoring.my_company_count}개`}
          </span>
          <span className="flex items-center gap-2">
            <History className="h-4 w-4 text-neutral-400" />
            기록 {mentoring.number_of_sessions}건
          </span>
          <span className="flex items-center gap-2 sm:col-span-2">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
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
    </div>
  );
}
