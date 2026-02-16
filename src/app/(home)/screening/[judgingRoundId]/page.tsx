"use client";

import { useParams, useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/app/_hooks/useUserQuery";
import { useAuth } from "@/app/_hooks/useAuth";
import { useScreeningDetailQuery } from "./_hooks/useScreeningDetailQuery";
import { columns } from "@/app/(home)/_components/columns";
import { DataTable } from "@/app/(home)/_components/data-table";
import ScreeningHeader from "./_components/screening-header";
import ScoreDistributionTable from "./_components/score-distribution-table";
import StatusDistributionTable from "./_components/status-distribution-table";
import ExportDropdown from "./_components/export-dropdown";
import ProgramSkeleton from "@/app/(home)/_components/ProgramSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ScreeningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const judgingRoundId = Number(params.judgingRoundId);

  const { user } = useAuth();
  const { data: profile } = useUserProfileQuery();
  const isAdmin = profile?.role === "관리자";

  const { data: screening, isLoading } = useScreeningDetailQuery(
    judgingRoundId,
    isAdmin,
  );

  if (isLoading || !screening) {
    return <ProgramSkeleton />;
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex flex-col space-y-4 w-full max-w-[960px] p-4">
        {/* 뒤로가기 */}
        <Button
          variant="ghost"
          className="self-start flex items-center gap-1 text-gray-600 hover:text-gray-900 px-2"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} />
          목록으로 돌아가기
        </Button>

        {/* 헤더 */}
        <ScreeningHeader screening={screening} />

        {/* 점수 분포 */}
        <ScoreDistributionTable companies={screening.companies} />

        {/* 상태 분포 */}
        <StatusDistributionTable companies={screening.companies} />

        {/* 내보내기 */}
        <div className="flex justify-end">
          <ExportDropdown
            judgingRoundId={screening.id}
            programId={screening.program.id}
            showAdminLink={!!user}
          />
        </div>

        {/* 기업 DataTable */}
        <DataTable
          columns={columns}
          data={screening.companies.map((company) => ({
            ...company,
            judgeRoundId: screening.id,
          }))}
        />
      </div>
    </main>
  );
}
