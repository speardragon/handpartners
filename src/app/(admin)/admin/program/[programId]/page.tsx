"use client";

import { use, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { JudgeDataTable } from "./_components/JudgeDataTable";
import { useJudgingRoundsByProgram } from "./_hooks/useJudgingRoundsByProgram";
import { judgeColumns } from "./_components/JudgeColumns";

type Props = {
  params: Promise<{
    programId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { programId } = use(params);
  const programIdNumber = Number(programId);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isFetching } = useJudgingRoundsByProgram(
    programIdNumber,
    pagination
  );

  return (
    <div className="flex min-h-screen w-full flex-col space-y-4 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900 sm:text-xl">
          심사 관리
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {data?.result?.[0]?.program?.name}
        </p>
      </div>
      <JudgeDataTable
        isFetching={isFetching}
        programId={programIdNumber}
        totalPages={data?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        data={data?.result || []}
        columns={judgeColumns}
      />
    </div>
  );
}
