"use client";

import { useUserQuery } from "@/app/_hooks/useUserQuery";
import { UserDataTable } from "./_components/UserDataTable";
import { userColumns } from "./_components/userColumns";
import Loading from "@/app/_components/Loading";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";

export default function Page() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: users } = useUserQuery(pagination);

  if (!users) {
    <Loading />;
  }

  return (
    <div className="flex flex-col space-y-2 justify-center w-full min-h-screen p-10">
      <div className="text-xl font-semibold">유저</div>
      <UserDataTable
        totalPages={users?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        data={users?.result || []}
        columns={userColumns}
      />
    </div>
  );
}
