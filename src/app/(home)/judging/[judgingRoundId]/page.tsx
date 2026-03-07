"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { judgingQueries } from "@/queries";
import { useAuthStore } from "@/store/useAuthStore";
import { USER_ROLES } from "@/constants/auth";
import { columns } from "@/app/(home)/_components/columns";
import { DataTable } from "@/app/(home)/_components/data-table";
import JudgingHeader from "../../screening/[judgingRoundId]/_components/screening-header";
import ScoreDistributionTable from "../../screening/[judgingRoundId]/_components/score-distribution-table";
import StatusDistributionTable from "../../screening/[judgingRoundId]/_components/status-distribution-table";
import ExportDropdown from "../../screening/[judgingRoundId]/_components/export-dropdown";
import AdminPanel from "../../screening/[judgingRoundId]/_components/admin-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function JudgingDetailSkeleton() {
  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4 pb-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </main>
  );
}

export default function JudgingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const judgingRoundId = params.judgingRoundId as string;

  const { user, isLoading: isAuthLoading } = useAuthStore();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data: judging, isLoading } = useQuery({
    ...judgingQueries.detail(judgingRoundId, isAdmin ?? false),
    enabled: !isAuthLoading && !!judgingRoundId,
  });

  if (isLoading || !judging) {
    return <JudgingDetailSkeleton />;
  }

  const isAdminView = judging.isAdminView;

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4 pb-10">
        <Button
          variant="ghost"
          className="flex items-center gap-1 self-start px-2 text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} />
          목록으로 돌아가기
        </Button>

        <JudgingHeader judging={judging} isAdminView={isAdminView} />

        {isAdmin && (
          <AdminPanel
            judgingRoundId={judging.id}
            programId={judging.program.id}
            programName={judging.program.name}
            currentStatus={judging.status}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ScoreDistributionTable
            companies={judging.companies}
            isAdminView={isAdminView}
          />
          <StatusDistributionTable
            companies={judging.companies}
            isAdminView={isAdminView}
          />
        </div>

        <ExportDropdown
          judgingRoundId={judging.id}
          programId={judging.program.id}
        />

        <div className="rounded-lg border bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={judging.companies.map((company) => ({
              ...company,
              judgeRoundId: judging.id,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
