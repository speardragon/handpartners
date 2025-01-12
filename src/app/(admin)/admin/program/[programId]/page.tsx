"use client";

import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { JudgeDataTable } from "./_components/JudgeDataTable";
import { useJudgingRoundsByProgram } from "./_hooks/useJudgingRoundsByProgram";
import { judgeColumns } from "./_components/JudgeColumns";
import Loading from "@/app/_components/Loading";

type Props = {
  params: {
    programId: string;
  };
};

export default function Page({ params }: Props) {
  const programId = Number(params.programId);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useJudgingRoundsByProgram(programId, pagination);

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 justify-center w-full min-h-screen p-10 px-24 bg-gray-50">
      <div className="text-xl font-semibold">프로그램 {">"} 심사</div>
      <div>{data?.result?.[0]?.program?.name}</div>
      <JudgeDataTable
        programId={programId}
        totalPages={data.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        data={data.result || []}
        columns={judgeColumns}
      />
    </div>
  );
}
