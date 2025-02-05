"use client";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useProgramsQuery } from "./_hooks/useProgramsQuery";
import { Screening } from "@/actions/program-action";
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
import PdfDownloadButton from "./_components/PdfDownloadButton";
import FeedbackToExcelButton from "./_components/FeedbackToExcelButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "../_hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Pencil,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import ScoreToExcelButton from "./_components/ScoreToExcelButton";

export default function Home() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { user, supabase } = useAuth();

  const { data, isLoading, error } = useProgramsQuery();

  useEffect(() => {
    queryClient.invalidateQueries();
  }, []);

  if (isLoading || !data) {
    return <ProgramSkeleton />;
  }

  if (error) {
    return <div>Error loading data: {error?.message}</div>;
  }

  return (
    <main className="w-full h-full overflow-y-auto">
      <div className="flex flex-col items-center w-full h-full p-4 px-16 space-y-4">
        <div className="text-2xl font-bold text-center">
          현재 진행 중인 심사
        </div>
        {data.length === 0 ? (
          <div className="mt-4 text-center">
            현재 진행 중인 심사가 없습니다. 🤔
          </div>
        ) : (
          <Accordion
            className="flex flex-col max-w-[960px] w-full"
            defaultValue={`${data[0]?.id}`}
            type="single"
            collapsible
          >
            {data.map((screening: Screening) => {
              const scoreDistribution = calculateScoreDistribution(
                screening.companies
              );
              const statusDistribution = calculateStatusDistribution(
                screening.companies
              );

              return (
                <AccordionItem
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  key={screening.id}
                  value={`${screening.id}`}
                >
                  <AccordionTrigger>
                    {`${screening.name} (${screening.start_date} ~ ${screening.end_date})`}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4">
                      <div className="flex justify-between w-full">
                        <div className="text-xl font-bold">
                          프로그램: {screening.program.name}
                        </div>
                        <div className="flex gap-2 p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className="p-1 px-2" variant="outline">
                                <EllipsisVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>심사 관리</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                {user && (
                                  <DropdownMenuItem>
                                    <Button
                                      className="flex w-full justify-evenly"
                                      onClick={() => {
                                        router.push(`/admin/${screening.id}`);
                                      }}
                                    >
                                      <SquareArrowOutUpRight size={18} />
                                      심사 현황 보러가기
                                    </Button>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <ScoreToExcelButton
                                    className="flex w-full p-2 rounded-md text-white gap-2 bg-blue-600 justify-evenly hover:bg-blue-700"
                                    judgingRoundId={screening.id}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FeedbackToExcelButton
                                    className="flex w-full p-2 rounded-md text-white gap-2 bg-green-600 justify-evenly hover:bg-green-700"
                                    judgingRoundId={screening.id}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PdfDownloadButton
                                    className="flex w-full p-2 rounded-md text-white gap-2 pr-6 text-sm bg-red-500 justify-evenly hover:bg-red-700"
                                    programId={screening.program.id}
                                    judgingRoundId={screening.id}
                                  />
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="text-gray-600">
                        설명: {screening.program.description}
                      </div>
                      <div className="mt-4">
                        <div className="font-bold">-점수 분포 현황-</div>
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
                      <div className="mt-4">
                        <div className="font-bold">-심사 상태 분포-</div>
                        <table className="w-full mt-2 border border-collapse border-gray-300 table-auto">
                          <tbody>
                            <tr className="font-semibold bg-gray-100 border border-gray-300">
                              <td className="px-4 py-2 text-center text-red-400 border border-gray-300">
                                심사 예정
                              </td>
                              {/* <td className="px-4 py-2 text-center border border-gray-300">
                                심사 중
                              </td> */}
                              <td className="px-4 py-2 text-center text-green-600 border border-gray-300">
                                심사 완료
                              </td>
                            </tr>
                            <tr className="border border-gray-300">
                              <td className="px-4 py-2 text-center border border-gray-300">
                                {statusDistribution["심사 예정"]}개
                              </td>
                              {/* <td className="px-4 py-2 text-center border border-gray-300">
                                {statusDistribution["심사 중"]}개
                              </td> */}
                              <td className="px-4 py-2 text-center border border-gray-300">
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
