"use client";

import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { CompanyDataTable } from "./_components/CompanyDataTable";
import { useCompanyQuery } from "./_hooks/useCompanyQuery";
import { companyColumns } from "./_components/CompanyColumns";
import { useDebounce } from "@/app/_hooks/useDebounce";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: companies, isFetching } = useCompanyQuery(
    pagination,
    debouncedSearch
  );

  return (
    <div className="flex min-h-screen w-full flex-col space-y-4 p-4 sm:p-6 lg:p-10">
      <h1 className="text-lg font-semibold sm:text-xl">기업 관리</h1>
      <CompanyDataTable
        totalPages={companies?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        data={companies?.result || []}
        columns={companyColumns}
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
