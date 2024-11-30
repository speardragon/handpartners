"use client";

import { ProgramRow } from "@/actions/program-action";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export interface Program {
  name: string;
  description: string; // or Date if you're using Date objects
  start_date: string;
  end_date: string;
  categories: string[];
}

export const programColumns: ColumnDef<Partial<ProgramRow>>[] = [
  {
    accessorKey: "id",
    cell: (info) => info.getValue(),
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: "프로그램 이름",
  },
  {
    accessorKey: "description",
    header: "설명",
  },
  {
    accessorKey: "start_date",
    header: "시작일",
  },
  {
    accessorKey: "end_date",
    header: "종료일",
  },
  {
    accessorKey: "categories",
    header: "카테고리",
  },
  {
    accessorKey: "created_at",
    header: "생성일",
    cell: ({ row }) => {
      return <div>{formatDate(new Date(row.getValue("created_at")))}</div>;
    },
  },
];
