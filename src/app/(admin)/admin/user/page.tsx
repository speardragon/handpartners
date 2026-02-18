"use client";

import { useUserQuery } from "@/app/_hooks/useUserQuery";
import { UserDataTable } from "./_components/UserDataTable";
import { userColumns } from "./_components/userColumns";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useDebounce } from "@/app/_hooks/useDebounce";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: users, isFetching } = useUserQuery(pagination, debouncedSearch);

  return (
    <div className="flex min-h-screen w-full flex-col space-y-4 p-4 sm:p-6 lg:p-10">
      <h1 className="text-lg font-semibold sm:text-xl">사용자 관리</h1>
      <UserDataTable
        totalPages={users?.totalPages ?? 0}
        pagination={pagination}
        setPagination={setPagination}
        data={users?.result || []}
        columns={userColumns}
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
