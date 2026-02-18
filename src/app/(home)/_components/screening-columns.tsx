"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ScreeningWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "../_lib/lib";

export const screeningColumns: ColumnDef<ScreeningWithStatus>[] = [
  {
    accessorKey: "program",
    header: "프로그램명",
    cell: ({ row }) => {
      return <div>{row.original.program.name}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "심사명",
  },
  {
    id: "companyCount",
    header: "참여 기업수",
    cell: ({ row }) => {
      return <div>{row.original.companies.length}개</div>;
    },
  },
  {
    id: "schedule",
    header: "심사 일정",
    cell: ({ row }) => {
      const startDate = row.original.start_date?.slice(0, 10) ?? "";
      const endDate = row.original.end_date?.slice(0, 10) ?? "";
      return (
        <div className="whitespace-nowrap text-sm">
          {startDate} ~ {endDate}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      return getStatusBadge(row.original.status);
    },
  },
];
