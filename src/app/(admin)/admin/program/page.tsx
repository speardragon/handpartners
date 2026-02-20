"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { programQueries } from "@/queries";
import { PaginationState } from "@tanstack/react-table";
import { ProgramDataTable } from "./_components/ProgramDataTable";
import { programColumns } from "./_components/ProgramColumns2";
import { useDebounce } from "@/app/_hooks/useDebounce";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: programs, isFetching } = useQuery({
    ...programQueries.list(pagination, debouncedSearch),
    placeholderData: keepPreviousData,
  });

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
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        }}
      />
    </div>
  );
}
