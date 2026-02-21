"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { screeningQueries } from "@/queries";
import { useAuthStore } from "@/store/useAuthStore";
import { USER_ROLES } from "@/constants/auth";
import { columns } from "@/app/(home)/_components/columns";
import { DataTable } from "@/app/(home)/_components/data-table";
import ScreeningHeader from "./_components/screening-header";
import ScoreDistributionTable from "./_components/score-distribution-table";
import StatusDistributionTable from "./_components/status-distribution-table";
import ExportDropdown from "./_components/export-dropdown";
import AdminPanel from "./_components/admin-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function ScreeningDetailSkeleton() {
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

export default function ScreeningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const judgingRoundId = params.judgingRoundId as string;

  const { user, isLoading: isAuthLoading } = useAuthStore();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data: screening, isLoading } = useQuery({
    ...screeningQueries.detail(judgingRoundId, isAdmin ?? false),
    enabled: !isAuthLoading && !!judgingRoundId,
  });

  if (isLoading || !screening) {
    return <ScreeningDetailSkeleton />;
  }

  const isAdminView = screening.isAdminView;

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

        <ScreeningHeader screening={screening} isAdminView={isAdminView} />

        {isAdmin && (
          <AdminPanel
            judgingRoundId={screening.id}
            programId={screening.program.id}
            programName={screening.program.name}
            currentStatus={screening.status}
          />
        )}

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

        <ExportDropdown
          judgingRoundId={screening.id}
          programId={screening.program.id}
        />

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
