"use client";

import type { MentoringWithStatus } from "@/actions/mentoring-action";
import { getStatusBadge } from "@/app/(home)/_lib/lib";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Hash, History } from "lucide-react";

interface Props {
  mentoring: MentoringWithStatus;
}

export default function MentoringHeader({ mentoring }: Props) {
  const startDate = mentoring.program.start_date?.slice(0, 10) ?? "";
  const endDate = mentoring.program.end_date?.slice(0, 10) ?? "";

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.18em] text-neutral-400 uppercase">
            Program Mentoring
          </p>
          <h1 className="mt-2 line-clamp-1 text-2xl font-bold text-neutral-950">
            {mentoring.program.name}
          </h1>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
            {mentoring.program.description?.trim() ||
              "프로그램 설명이 아직 등록되지 않았습니다."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {mentoring.isAdminView && (
            <Badge variant="secondary" className="gap-1">
              <Eye className="h-3.5 w-3.5" />
              관리자 읽기 전용
            </Badge>
          )}
          {getStatusBadge(mentoring.status)}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            멘토링 ID
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
            <Hash className="h-4 w-4 text-neutral-400" />
            {mentoring.id}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            운영 기간
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
            <Calendar className="h-4 w-4 text-neutral-400" />
            {startDate} ~ {endDate}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            담당 기업
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            {mentoring.my_company_count}개
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
            누적 기록
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
            <History className="h-4 w-4 text-neutral-400" />
            {mentoring.number_of_sessions}건
          </p>
        </div>
      </div>
    </div>
  );
}
