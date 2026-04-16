"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader } from "lucide-react";
import Link from "next/link";

export type ReviewStatus = {
  score: number; // 접수번호
  companyName: string; // 기업(팀)명/이름
  description: string | null; // 아이디어/창업아이템 명
  category: string; // 지원분야
  status: string; // 심사현황
  companyId: number;
  judgeRoundId: string;
};

export const columns: ColumnDef<ReviewStatus>[] = [
  {
    accessorKey: "score",
    header: "점수",
    size: 72,
    cell: ({ row }) => {
      return <div className="font-bold">{row.getValue("score")}</div>;
    },
  },
  {
    accessorKey: "companyName",
    header: "기업(팀)명/이름",
    size: 180,
    cell: ({ row }) => (
      <div
        className="max-w-[180px] truncate"
        title={row.getValue("companyName")}
      >
        {row.getValue("companyName")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "아이디어/창업아이템 명",
    cell: ({ row }) => (
      <div
        className="max-w-[280px] truncate"
        title={row.getValue("description") ?? ""}
      >
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "",
    size: 110,
    cell: ({ row }) => {
      const answerType = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className="flex w-fit justify-center gap-2 px-1.5 whitespace-nowrap"
        >
          {answerType === "심사 완료" ? (
            <CircleCheck
              size={12}
              className="fill-green-500 text-white dark:fill-green-400"
            />
          ) : (
            <Loader size={12} />
          )}
          {answerType}
        </Badge>
      );
    },
    meta: {
      filterVariant: "select",
    },
  },
  {
    id: "action",
    header: "",
    size: 100,
    cell: ({ row }) => {
      const judgeRoundId = row.original.judgeRoundId;
      const companyId = row.original.companyId;

      return (
        <Link href={`/grading/${judgeRoundId}/company/${companyId}`}>
          <Button
            variant="secondary"
            className="border border-gray-200 px-4 whitespace-nowrap hover:bg-gray-200"
          >
            심사하기
          </Button>
        </Link>
      );
    },
  },
];
