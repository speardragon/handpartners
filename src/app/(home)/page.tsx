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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarX2,
  CircleCheck,
  EllipsisVertical,
  Loader,
  SquareArrowOutUpRight,
} from "lucide-react";
import ScoreToExcelButton from "./_components/ScoreToExcelButton";

export default function Home() {
  const router = useRouter();

  const { user } = useAuth();

  const { data, isLoading, isFetching } = useProgramsQuery();

  if (isLoading || !data) {
    return <ProgramSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center gap-2">
        <CalendarX2 size={48} />
        <div className="text-lg font-semibold text-gray-700">
          현재 진행 중인 심사가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex flex-col space-y-4 w-full max-w-[960px] p-4">
        <div className="w-full text-2xl font-bold text-center">
          현재 진행 중인 심사
        </div>
        <Accordion defaultValue={`${data[0]?.id}`} type="single" collapsible>
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
                    <div className="mt-4">
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
                            {/* <td className="px-4 py-2 text-center border border-gray-300">
                                심사 중
                              </td> */}
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
      </div>
    </main>
  );
}
