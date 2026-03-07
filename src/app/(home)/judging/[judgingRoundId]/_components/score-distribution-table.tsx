"use client";

import { Company } from "@/actions/program-action";
import { calculateScoreDistribution } from "@/app/(home)/_lib/lib";

interface ScoreDistributionTableProps {
  companies: Company[];
  isAdminView: boolean;
}

const SCORE_RANGES = [
  "90점 이상",
  "80점 이상",
  "70점 이상",
  "60점 이상",
  "60점 미만",
] as const;

export default function ScoreDistributionTable({
  companies,
  isAdminView,
}: ScoreDistributionTableProps) {
  const scoreDistribution = calculateScoreDistribution(companies);

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        {isAdminView ? "전체 점수 분포 현황" : "내 점수 분포 현황"}
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {SCORE_RANGES.map((key) => (
          <div key={key} className="rounded-md bg-gray-50 p-3 text-center">
            <p className="text-muted-foreground text-xs">{key}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {scoreDistribution[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
