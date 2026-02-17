"use client";

import { use, useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { JudgeDataTable } from "./_components/JudgeDataTable";
import { useJudgingRoundsByProgram } from "./_hooks/useJudgingRoundsByProgram";
import { judgeColumns } from "./_components/JudgeColumns";
import Loading from "@/app/_components/Loading";

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

  const { data, isPending } = useJudgingRoundsByProgram(
    programIdNumber,
    pagination
  );

  // if (!data) {
  //   return (
  //     <div className="animate-pulse space-y-4">
  //       <div className="w-full h-6 bg-gray-200 rounded" />
  //       <div className="w-5/6 h-6 bg-gray-200 rounded" />
  //       <div className="w-4/6 h-6 bg-gray-200 rounded" />
  //       <div className="w-3/6 h-6 bg-gray-200 rounded" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen w-full flex-col justify-center space-y-2 bg-gray-50 p-10 px-24">
      <div className="text-xl font-semibold">프로그램 {">"} 심사</div>
      <div>{data?.result?.[0]?.program?.name}</div>
      <JudgeDataTable
        isPending={isPending}
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
