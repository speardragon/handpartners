"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export type ReviewStatus = {
  score: number; // 접수번호
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
    cell: ({ row }) => {
      return <div className="font-bold">{row.getValue("score")}</div>;
    },
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
    accessorKey: "status",
    header: "",
    cell: ({ row }) => {
      const answerType = row.getValue("status") as string;
      const getColorClass = (type: string) => {
        switch (type) {
          case "심사 예정":
            return "text-red-500";
          case "심사 중":
            return "text-red-500";
          case "심사 완료":
            return "text-green-500";
          default:
            return "";
        }
      };

      return (
        <Badge variant="outline" className="flex gap-2 px-1.5 justify-center">
          {answerType === "심사 완료" ? (
            <CircleCheck
              size={12}
              className="fill-green-500 dark:fill-green-400 text-white"
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
    cell: ({ row }: any) => {
      const judgeRoundId = row.original.judgeRoundId; // 수정된 데이터에서 가져옴
      const companyId = row.original.companyId; // 기존 company의 id

      return (
        <Link href={`/grading/${judgeRoundId}/company/${companyId}`}>
          <Button
            variant="secondary"
            className="flex w-full px-4 border border-gray-200 hover:bg-gray-200"
          >
            심사하기
          </Button>
        </Link>
      );
    },
  },
];
