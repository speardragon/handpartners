"use client";

import { Company } from "@/actions/program-action";
import { calculateStatusDistribution } from "@/app/(home)/_lib/lib";
import { CircleCheck, Loader } from "lucide-react";

interface StatusDistributionTableProps {
  companies: Company[];
}

export default function StatusDistributionTable({
  companies,
}: StatusDistributionTableProps) {
  const statusDistribution = calculateStatusDistribution(companies);

  return (
    <div>
      <div className="font-bold">* 심사 상태 분포</div>
      <table className="w-full mt-2 border border-collapse border-gray-300 table-auto">
        <tbody>
          <tr className="font-semibold bg-gray-100 border border-gray-300">
            <td className="border-r border-gray-300">
              <div className="flex justify-center items-center gap-2">
                <Loader size={12} />
                심사 예정
              </div>
            </td>
            <td>
              <div className="flex justify-center items-center gap-2">
                <CircleCheck
                  size={14}
                  className="fill-green-500 dark:fill-green-400 text-gray-200"
                />
                심사 완료
              </div>
            </td>
          </tr>
          <tr className="border border-gray-300">
            <td className="px-4 py-2 text-center border border-gray-300">
              {statusDistribution["심사 예정"]}개
            </td>
            <td className="px-4 py-2 text-center border border-gray-300">
              {statusDistribution["심사 완료"]}개
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
