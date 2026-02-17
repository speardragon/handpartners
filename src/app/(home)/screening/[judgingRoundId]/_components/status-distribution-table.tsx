"use client";

import { Company } from "@/actions/program-action";
import { calculateStatusDistribution } from "@/app/(home)/_lib/lib";
import { CircleCheck, CircleDot, Clock } from "lucide-react";

interface StatusDistributionTableProps {
  companies: Company[];
  isAdminView: boolean;
}

export default function StatusDistributionTable({
  companies,
  isAdminView,
}: StatusDistributionTableProps) {
  const statusDistribution = calculateStatusDistribution(companies);
  const total =
    statusDistribution["심사 예정"] +
    statusDistribution["심사 중"] +
    statusDistribution["심사 완료"];
  const completedPct =
    total > 0 ? Math.round((statusDistribution["심사 완료"] / total) * 100) : 0;

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          {isAdminView ? "전체 심사 진행 현황" : "내 심사 진행 현황"}
        </h2>
        <span className="text-xs text-muted-foreground">
          {completedPct}% 완료
        </span>
      </div>

      <div className="mb-4 h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full bg-gray-900 transition-all"
          style={{ width: `${completedPct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
          <Clock size={16} className="text-gray-400" />
          <div>
            <p className="text-xs text-muted-foreground">심사 예정</p>
            <p className="text-lg font-bold text-gray-900">
              {statusDistribution["심사 예정"]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
          <CircleDot size={16} className="text-amber-500" />
          <div>
            <p className="text-xs text-muted-foreground">심사 중</p>
            <p className="text-lg font-bold text-gray-900">
              {statusDistribution["심사 중"]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
          <CircleCheck size={16} className="text-green-500" />
          <div>
            <p className="text-xs text-muted-foreground">심사 완료</p>
            <p className="text-lg font-bold text-gray-900">
              {statusDistribution["심사 완료"]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
