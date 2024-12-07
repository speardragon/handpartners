"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useFetchAllPrograms } from "./_hooks/useScreeningQuery";
import { Company, Screening } from "@/actions/program-action";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProgramSkeleton from "./_components/ProgramSkeleton";
import {
  calculateScoreDistribution,
  calculateStatusDistribution,
} from "./_lib/lib";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useFetchAllPrograms();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  if (isLoading || !data) {
    return <ProgramSkeleton />;
  }

  if (error) {
    return <div>Error loading data: {error?.message}</div>;
  }

  // 오늘 날짜를 가져옵니다.
  const today = new Date();

  // 오늘 날짜가 심사 기간에 포함되는 심사만 필터링합니다.
  const filteredData = data.filter((screening: Screening) => {
    const startDate = new Date(screening.start_date);
    const endDate = new Date(screening.end_date);

    // 오늘 날짜가 start_date와 end_date 사이에 있는지 확인합니다.
    return startDate <= today && today <= endDate;
  });

  return (
    <main className="w-full h-full">
      <div className="flex flex-col w-full h-full p-4 space-y-4 px-16 ">
        <div className="text-center text-2xl font-bold">
          현재 진행 중인 심사
        </div>
        {filteredData.length === 0 ? (
          <div className="text-center mt-4">
            현재 진행 중인 심사가 없습니다. 🤔
          </div>
        ) : (
          <Accordion
            defaultValue={`${filteredData[0]?.id}`}
            type="single"
            collapsible
          >
            {filteredData.map((screening: Screening) => {
              const scoreDistribution = calculateScoreDistribution(
                screening.companies
              );
              const statusDistribution = calculateStatusDistribution(
                screening.companies
              );

              return (
                <AccordionItem
                  className="border border-gray-300 p-2 rounded-lg"
                  key={screening.id}
                  value={`${screening.id}`}
                >
                  <AccordionTrigger>
                    {`${screening.name} (${screening.start_date} ~ ${screening.end_date})`}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4">
                      <div className="text-xl font-bold">{screening.name}</div>
                      <div className="text-gray-600">
                        {screening.program.description}
                      </div>
                      <div className="mt-4">
                        <div className="font-bold">-점수 분포 현황-</div>
                        <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
                          <tbody>
                            <tr className="border border-gray-300 bg-gray-100">
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                90점 이상
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                80점 이상
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                70점 이상
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                60점 이상
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                60점 미만
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {scoreDistribution["90점 이상"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {scoreDistribution["80점 이상"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {scoreDistribution["70점 이상"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {scoreDistribution["60점 이상"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {scoreDistribution["60점 미만"]}개
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <div className="font-bold">-심사 상태 분포-</div>
                        <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
                          <tbody>
                            <tr className="border border-gray-300 bg-gray-100">
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                심사 예정
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                심사 중
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                심사 완료
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {statusDistribution["심사 예정"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {statusDistribution["심사 중"]}개
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                {statusDistribution["심사 완료"]}개
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <DataTable
                      columns={columns}
                      data={screening.companies.map((company) => ({
                        ...company,
                        judgeRoundId: screening.id, // 각 company에 screeningId 추가
                      }))}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </main>
  );
}
