"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

export type ReviewStatus = {
  score: string; // 접수번호
  companyName: string; // 기업(팀)명/이름
  description: string; // 아이디어/창업아이템 명
  category: string; // 지원분야
  status: string; // 심사현황
  companyId: number;
};

export const columns: ColumnDef<ReviewStatus>[] = [
  {
    accessorKey: "score",
    header: "점수",
  },
  {
    accessorKey: "companyName",
    header: "기업(팀)명/이름",
  },
  {
    accessorKey: "description",
    header: "아이디어/창업아이템 명",
  },
  {
    accessorKey: "category",
    header: "지원분야",
  },
  {
    accessorKey: "status",
    header: "심사현황",
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "companyId",
    header: "",
    cell: ({ row }) => {
      return (
        <Link href={`/grading/${row.getValue("companyId")}`}>
          <Button
            variant="secondary"
            className="px-4 space-x-2 border border-gray-200 hover:bg-gray-300"
            onClick={() => {}}
          >
            심사하기
          </Button>
        </Link>
      );
    },
    enableHiding: false,
  },
];
