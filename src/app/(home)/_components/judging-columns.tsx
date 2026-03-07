"use client";

import { ColumnDef } from "@tanstack/react-table";
import { JudgingWorkspaceWithStatus } from "@/actions/program-action";
import { getStatusBadge } from "../_lib/lib";

export const judgingColumns: ColumnDef<JudgingWorkspaceWithStatus>[] = [
  {
    accessorKey: "program",
    header: "프로그램명",
    cell: ({ row }) => {
      return <div>{row.original.program.name}</div>;
    },
  },
  {
    accessorKey: "program.description",
    header: "프로그램 소개",
    cell: ({ row }) => {
      const description = row.original.program.description?.trim();
      return (
        <div className="max-w-[320px] truncate text-sm text-neutral-600">
          {description || "설명 없음"}
        </div>
      );
    },
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
        <div className="text-sm whitespace-nowrap">
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
