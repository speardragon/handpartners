"use client";

import { Company } from "@/actions/program-action";
import { calculateScoreDistribution } from "@/app/(home)/_lib/lib";

interface ScoreDistributionTableProps {
  companies: Company[];
}

export default function ScoreDistributionTable({
  companies,
}: ScoreDistributionTableProps) {
  const scoreDistribution = calculateScoreDistribution(companies);

  return (
    <div>
      <div className="font-bold">* 점수 분포 현황</div>
      <table className="w-full mt-2 border border-collapse border-gray-300 table-auto">
        <tbody>
          <tr className="font-semibold bg-gray-100 border border-gray-300">
            <td className="px-4 py-2 text-center border border-gray-300">
              90점 이상
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              80점 이상
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              70점 이상
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              60점 이상
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              60점 미만
            </td>
          </tr>
          <tr className="border border-gray-300">
            <td className="px-4 py-2 text-center border border-gray-300">
              {scoreDistribution["90점 이상"]}개
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              {scoreDistribution["80점 이상"]}개
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              {scoreDistribution["70점 이상"]}개
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              {scoreDistribution["60점 이상"]}개
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              {scoreDistribution["60점 미만"]}개
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
