"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { useFetchAllPrograms } from "./_hooks/useProjectQuery";
import { Company, Screening } from "@/actions/program-action";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// 더미 데이터 - 심사와 프로그램, 팀 정보 포함
const screenings = [
  {
    id: "screening-1", // 심사ID
    name: "1차 심사", // 심사 이름
    date: "2024-10-12", // 심사 날짜
    program: {
      name: "노원구 스타트업 IR 데모데이", // 프로그램 이름
      description: "유망 스타트업의 성장과 네트워킹을 위한 IR 데모데이", // 프로그램 설명
    },
    teams: [
      {
        id: "1001", // 심사대상 기업 접수번호(순번judging_num)
        companyName: "스타트업 A", // 심사대상 기업이름
        ideaName: "AI 기반 리포트 자동화 서비스", // 심사대상 기업의 사업 아이템 이름
        field: "AI", // 심사대상 기업 지원분야
        status: "심사 완료", // 심사대상 기업 심사 여부
        participantId: 1, // 심사대상 기업 ID
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

function calculateScoreDistribution(companies: Company[]) {
  const scoreDistribution = {
    "90점 이상": 0,
    "80점 이상": 0,
    "70점 이상": 0,
    "60점 이상": 0,
    "60점 미만": 0,
  };

  companies.forEach((company) => {
    const score = parseInt(company.score, 10);

    if (score >= 90) {
      scoreDistribution["90점 이상"]++;
    } else if (score >= 80) {
      scoreDistribution["80점 이상"]++;
    } else if (score >= 70) {
      scoreDistribution["70점 이상"]++;
    } else if (score >= 60) {
      scoreDistribution["60점 이상"]++;
    } else {
      scoreDistribution["60점 미만"]++;
    }
  });

  return scoreDistribution;
}

export default function Home() {
  const { data, isLoading, error } = useFetchAllPrograms();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  if (isLoading) {
    return (
      <main className="w-full h-full">
        <div className="flex flex-col w-full h-full p-4 space-y-4 px-16">
          <div className="text-center text-2xl font-bold">
            현재 진행 중인 심사
          </div>
          <div className="mt-4">
            {/* 스켈레톤 로딩 애니메이션 */}
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
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
            현재 진행 중인 심사가 없습니다.🤔
          </div>
        ) : (
          <Accordion type="single" collapsible>
            {filteredData.map((screening: Screening) => {
              const scoreDistribution = calculateScoreDistribution(
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
                        <ul className="flex flex-wrap gap-4 mt-2">
                          <li className="flex flex-col items-center">
                            <span>90점 이상</span>
                            <span>{scoreDistribution["90점 이상"]}개</span>
                          </li>
                          <li className="flex flex-col items-center">
                            <span>80점 이상</span>
                            <span>{scoreDistribution["80점 이상"]}개</span>
                          </li>
                          <li className="flex flex-col items-center">
                            <span>70점 이상</span>
                            <span>{scoreDistribution["70점 이상"]}개</span>
                          </li>
                          <li className="flex flex-col items-center">
                            <span>60점 이상</span>
                            <span>{scoreDistribution["60점 이상"]}개</span>
                          </li>
                          <li className="flex flex-col items-center">
                            <span>60점 미만</span>
                            <span>{scoreDistribution["60점 미만"]}개</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <DataTable columns={columns} data={screening.companies} />
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
