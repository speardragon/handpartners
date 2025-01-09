"use client";

import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { CompanyDataTable } from "./_components/CompanyDataTable";
import { useCompanyQuery } from "./_hooks/useCompanyQuery";
import { companyColumns } from "./_components/CompanyColumns";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: companies } = useCompanyQuery(pagination);

  return (
    <div className="flex flex-col space-y-2 justify-center w-full min-h-screen p-10 px-24 bg-gray-50">
      <div className="text-xl font-semibold">기업</div>
      <CompanyDataTable
        totalPages={companies?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        data={companies?.result || []}
        columns={companyColumns}
      />
    </div>
  );
}
