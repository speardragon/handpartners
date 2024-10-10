"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useFetchAllProject } from "./_hooks/useProjectQuery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 더미 데이터 - 심사와 프로그램, 팀 정보 포함
const screenings = [
  {
    id: "screening-1",
    name: "1차 심사",
    date: "2024-10-12",
    program: {
      name: "노원구 스타트업 IR 데모데이",
      description: "유망 스타트업의 성장과 네트워킹을 위한 IR 데모데이",
    },
    teams: [
      {
        id: "1001",
        companyName: "스타트업 A",
        ideaName: "AI 기반 리포트 자동화 서비스",
        field: "AI",
        status: "심사 완료",
        participantId: 1,
      },
      {
        id: "1002",
        companyName: "스타트업 B",
        ideaName: "블록체인 기반 데이터 보호 솔루션",
        field: "블록체인",
        status: "심사 진행 중",
        participantId: 2,
      },
    ],
  },
  {
    id: "screening-2",
    name: "2차 심사",
    date: "2024-10-15",
    program: {
      name: "청년 창업 피칭 대회",
      description: "청년 창업가를 위한 피칭 기회와 멘토링 지원",
    },
    teams: [
      {
        id: "2001",
        companyName: "스타트업 C",
        ideaName: "친환경 소재 활용 에코백",
        field: "친환경",
        status: "심사 완료",
        participantId: 3,
      },
      {
        id: "2002",
        companyName: "스타트업 D",
        ideaName: "모바일 재무 관리 어플리케이션",
        field: "모바일 앱",
        status: "심사 진행 중",
        participantId: 4,
      },
    ],
  },
];

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="flex flex-col w-full h-full p-4 space-y-4 px-16 ">
        <div className="text-center text-2xl font-bold">
          현재 진행 중인 심사
        </div>
        <Accordion type="single" collapsible>
          {screenings.map((screening) => (
            <AccordionItem
              className=" border border-gray-300 p-2"
              key={screening.id}
              value={screening.id}
            >
              <AccordionTrigger>
                {screening.name} - {screening.date}
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-4">
                  <div className="text-xl font-bold">
                    {screening.program.name}
                  </div>
                  <div className="text-gray-600">
                    {screening.program.description}
                  </div>
                </div>
                <DataTable columns={columns} data={screening.teams} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
