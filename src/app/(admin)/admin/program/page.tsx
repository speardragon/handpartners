"use client";

import { useState } from "react";
import { useProgramQuery } from "./_hooks/useProgramQuery";
import { PaginationState } from "@tanstack/react-table";
import { ProgramDataTable } from "./_components/ProgramDataTable";
import { programColumns } from "./_components/ProgramColumns2";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: programs, isFetching } = useProgramQuery(pagination);

  return (
    <div className="flex min-h-screen w-full flex-col space-y-4 p-4 sm:p-6 lg:p-10">
      <h1 className="text-lg font-semibold sm:text-xl">프로그램 관리</h1>
      <ProgramDataTable
        totalPages={programs?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        data={programs?.result || []}
        columns={programColumns}
        isFetching={isFetching}
      />
    </div>
  );
}
