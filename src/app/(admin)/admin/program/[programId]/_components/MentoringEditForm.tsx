"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mentoringQueries } from "@/queries";
import type {
  MentoringManagementSummary,
  MentoringStatus,
} from "@/actions/mentoring-action";
import {
  assignMentoringCompanyByAdmin,
  updateMentoringCompanies,
  updateMentoringUsers,
} from "@/actions/mentoring-action";
import MentoringCompanySelect, {
  type MentoringSelectableCompany,
} from "./MentoringCompanySelect";
import MentoringUserSelect, {
  type MentoringSelectableUser,
} from "./MentoringUserSelect";
import {
  Building2,
  ClipboardList,
  Clock3,
  Users,
  ArrowRightLeft,
  History,
} from "lucide-react";

type Props = {
  programId: number;
  mentoringId: string;
  data: MentoringManagementSummary;
};

const STATUS_LABEL: Record<MentoringStatus, string> = {
  PENDING: "진행 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "종료",
};

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-neutral-950">{value}</p>
      <p className="mt-2 text-sm text-neutral-600">{hint}</p>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-neutral-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function MentoringEditForm({
  programId,
  mentoringId,
  data,
}: Props) {
  const queryClient = useQueryClient();
  const [targetCompanies, setTargetCompanies] = useState<
    MentoringSelectableCompany[]
  >([]);
  const [targetUsers, setTargetUsers] = useState<MentoringSelectableUser[]>([]);

  useEffect(() => {
    setTargetCompanies(
      data.companies.map((company) => ({
        id: company.company_id,
        name: company.company_name,
        representative_name: company.representative_name,
      }))
    );
  }, [data.companies]);

  useEffect(() => {
    setTargetUsers(
      data.mentors.map((mentor) => ({
        id: mentor.id,
        name: mentor.name,
        affiliation: mentor.affiliation,
      }))
    );
  }, [data.mentors]);

  const companyMutation = useMutation({
    mutationFn: async () =>
      updateMentoringCompanies({
        mentoringId,
        companyIds: targetCompanies.map((company) => company.id),
      }),
    onSuccess: () => {
      toast.success("멘토링 대상 기업을 저장했습니다.");
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const userMutation = useMutation({
    mutationFn: async () =>
      updateMentoringUsers({
        mentoringId,
        userIds: targetUsers.map((user) => user.id),
      }),
    onSuccess: () => {
      toast.success("멘토링 참여 멘토를 저장했습니다.");
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const assignmentMutation = useMutation({
    mutationFn: async (payload: { companyId: number; mentorId: string | null }) =>
      assignMentoringCompanyByAdmin({
        mentoringId,
        companyId: payload.companyId,
        mentorId: payload.mentorId,
      }),
    onSuccess: () => {
      toast.success("멘토 배정을 수정했습니다.");
      queryClient.invalidateQueries({ queryKey: mentoringQueries.all() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const assignedCompanyCount = useMemo(
    () => data.companies.filter((company) => company.mentor_id).length,
    [data.companies]
  );

  return (
    <section className="space-y-6 rounded-[28px] border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm sm:p-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="상태"
          value={STATUS_LABEL[data.status]}
          hint="현재 멘토링 운영 단계"
        />
        <SummaryCard
          label="대상 기업"
          value={`${data.number_of_companies}개`}
          hint={`배정 완료 ${assignedCompanyCount}개`}
        />
        <SummaryCard
          label="참여 멘토"
          value={`${data.number_of_users}명`}
          hint="멘토링 참여 가능 사용자"
        />
        <SummaryCard
          label="기록 수"
          value={`${data.number_of_sessions}건`}
          hint={
            data.recent_mentored_at
              ? `최근 기록 ${data.recent_mentored_at.slice(0, 16).replace("T", " ")}`
              : "아직 기록이 없습니다"
          }
        />
      </div>

      <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-5">
        <SectionHeader
          icon={Building2}
          title="멘토링 대상 기업"
          description="프로그램 참여 기업 중 멘토링 대상으로 사용할 기업을 선택합니다. 멘토링 기록이 있는 기업은 안전하게 보호되며 제거되지 않습니다."
          action={
            <LoadingButton
              type="button"
              loading={companyMutation.isPending}
              onClick={() => companyMutation.mutate()}
            >
              대상 기업 저장
            </LoadingButton>
          }
        />
        <MentoringCompanySelect
          programId={programId}
          targetList={targetCompanies}
          onTargetListChange={setTargetCompanies}
        />
      </div>

      <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-5">
        <SectionHeader
          icon={Users}
          title="멘토링 참여 멘토"
          description="멘토링 페이지에서 기업을 선점하고 기록을 남길 수 있는 멘토를 선택합니다."
          action={
            <LoadingButton
              type="button"
              loading={userMutation.isPending}
              onClick={() => userMutation.mutate()}
            >
              멘토 저장
            </LoadingButton>
          }
        />
        <MentoringUserSelect
          targetList={targetUsers}
          onTargetListChange={setTargetUsers}
        />
      </div>

      <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-5">
        <SectionHeader
          icon={ArrowRightLeft}
          title="현재 배정 현황"
          description="아래 보드는 저장된 대상 기업/멘토 기준으로만 동작합니다. 목록을 바꿨다면 먼저 위 섹션에서 저장한 뒤 배정을 수정하세요."
        />
        {data.companies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-10 text-center text-sm text-neutral-400">
            저장된 멘토링 대상 기업이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {data.companies.map((company) => (
              <div
                key={company.company_id}
                className="grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:grid-cols-[minmax(0,1fr)_280px_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-neutral-950">
                      {company.company_name}
                    </p>
                    <Badge variant="secondary">
                      {company.session_count}회 기록
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    대표자 {company.representative_name || "-"}
                  </p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {company.last_mentored_at
                      ? `최근 멘토링 ${company.last_mentored_at.slice(0, 16).replace("T", " ")}`
                      : "아직 멘토링 기록이 없습니다."}
                  </p>
                </div>

                <Select
                  value={company.mentor_id ?? "__unassigned"}
                  onValueChange={(value) =>
                    assignmentMutation.mutate({
                      companyId: company.company_id,
                      mentorId: value === "__unassigned" ? null : value,
                    })
                  }
                  disabled={
                    assignmentMutation.isPending || data.mentors.length === 0
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="멘토 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__unassigned">미배정</SelectItem>
                    {data.mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name}
                        {mentor.affiliation ? ` · ${mentor.affiliation}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-end">
                  {company.mentor_name ? (
                    <Badge className="bg-neutral-900 text-white">
                      {company.mentor_name}
                    </Badge>
                  ) : (
                    <Badge variant="outline">미배정</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-5">
        <SectionHeader
          icon={History}
          title="최근 멘토링 기록"
          description="관리자는 기록을 읽기 전용으로 확인합니다. 자세한 내용은 실제 멘토링 페이지에서 열람합니다."
        />
        {data.recent_sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-10 text-center text-sm text-neutral-400">
            아직 등록된 멘토링 기록이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {data.recent_sessions.map((session) => (
              <div
                key={session.id}
                className="grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 lg:grid-cols-[minmax(0,1fr)_160px_180px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-950">
                      {session.company_name}
                    </p>
                    <Badge variant="secondary">{session.session_no}회차</Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    {session.result?.trim() || "결과 요약이 없습니다."}
                  </p>
                </div>
                <div className="text-sm text-neutral-600">
                  <p className="font-medium text-neutral-900">
                    {session.mentor_name || "담당자 없음"}
                  </p>
                  <p className="mt-1">{session.place || "장소 미입력"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Clock3 className="h-4 w-4" />
                  {session.mentored_at.slice(0, 16).replace("T", " ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2 font-medium text-neutral-900">
          <ClipboardList className="h-4 w-4" />
          운영 메모
        </div>
        <p className="mt-2 leading-6">
          멘토는 실제 멘토링 페이지에서 기업을 직접 선점하고 회차별 기록을
          남깁니다. 이 화면은 참여 대상과 배정, 전체 기록 현황을 관리하는 데
          집중합니다.
        </p>
      </div>
    </section>
  );
}
