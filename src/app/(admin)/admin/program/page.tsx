"use client";

import { useState } from "react";
import { useProgramQuery } from "./_hooks/useProgramQuery";
import { PaginationState } from "@tanstack/react-table";
import { ProgramDataTable } from "./_components/ProgramDataTable";
import { ProgramColumns } from "./_components/ProgramColumns";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: programs } = useProgramQuery(pagination);

  return (
    <div className="flex flex-col space-y-2 justify-center w-full min-h-screen p-10 px-24 bg-gray-50">
      <div className="text-xl font-semibold">프로그램</div>
      <ProgramDataTable
        totalPages={programs?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        data={programs?.result || []}
        columns={ProgramColumns}
      />
    </div>
  );
}
