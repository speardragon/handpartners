import { Suspense } from "react";
import { DashboardOverview } from "./_components/dashboard-overview";
import { ProgramStatusTable } from "./_components/program-status-table";
import { PendingCompaniesTable } from "./_components/pending-companies-table";
import {
  DashboardCardsSkeleton,
  DashboardTableSkeleton,
} from "./_components/dashboard-section-skeleton";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-neutral-50 p-4 sm:p-6 lg:p-10">
      <section className="space-y-2">
        <p className="text-sm font-medium text-neutral-500">Admin Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          심사 운영 대시보드
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base">
          느린 데이터 로딩 환경에서도 운영자가 먼저 필요한 정보를 빠르게 확인할 수 있도록,
          요약 카드와 프로그램 현황, 조치가 필요한 기업 목록을 섹션 단위로 나눠 점진적으로 보여줍니다.
        </p>
      </section>

      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardOverview />
      </Suspense>

      <Suspense fallback={<DashboardTableSkeleton rows={6} />}>
        <ProgramStatusTable />
      </Suspense>

      <Suspense fallback={<DashboardTableSkeleton rows={5} />}>
        <PendingCompaniesTable />
      </Suspense>
    </div>
  );
}
