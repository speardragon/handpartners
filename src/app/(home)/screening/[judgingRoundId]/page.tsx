"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/app/_hooks/useUserQuery";

import {
  useScreeningDetailQuery,
  useParticipationQuery,
} from "./_hooks/useScreeningDetailQuery";
import { columns } from "@/app/(home)/_components/columns";
import { DataTable } from "@/app/(home)/_components/data-table";
import ScreeningHeader from "./_components/screening-header";
import ScoreDistributionTable from "./_components/score-distribution-table";
import StatusDistributionTable from "./_components/status-distribution-table";
import ExportDropdown from "./_components/export-dropdown";
import AdminPanel from "./_components/admin-panel";
import ProgramSkeleton from "@/app/(home)/_components/ProgramSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ScreeningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const judgingRoundId = params.judgingRoundId as string;

  const { data: profile } = useUserProfileQuery();
  const isAdmin = profile?.role === "관리자";

  const { data: isParticipating } = useParticipationQuery(
    judgingRoundId,
    isAdmin
  );

  // 관리자 비참여 시 관리자 뷰, 그 외는 심사자 뷰
  const isAdminView = isAdmin && !isParticipating;

  const { data: screening, isLoading } = useScreeningDetailQuery(
    judgingRoundId,
    isAdmin,
    isAdmin ? isParticipating : undefined
  );

  if (isLoading || !screening) {
    return <ProgramSkeleton />;
  }

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4">
        {/* 뒤로가기 */}
        <Button
          variant="ghost"
          className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} />
          목록으로 돌아가기
        </Button>

        {/* 헤더 */}
        <ScreeningHeader screening={screening} isAdminView={isAdminView} />

        {/* 관리자 전용 패널 */}
        {isAdmin && (
          <AdminPanel
            judgingRoundId={screening.id}
            programId={screening.program.id}
            programName={screening.program.name}
            currentStatus={screening.status}
          />
        )}

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ScoreDistributionTable
            companies={screening.companies}
            isAdminView={isAdminView}
          />
          <StatusDistributionTable
            companies={screening.companies}
            isAdminView={isAdminView}
          />
        </div>

        {/* 내보내기 */}
        <ExportDropdown
          judgingRoundId={screening.id}
          programId={screening.program.id}
        />

        {/* 기업 DataTable */}
        <div className="rounded-lg border bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={screening.companies.map((company) => ({
              ...company,
              judgeRoundId: screening.id,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
