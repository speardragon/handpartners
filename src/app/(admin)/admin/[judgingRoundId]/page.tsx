"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useJudgingRoundDetailQuery } from "../program/[programId]/_hooks/useJudgingRoundDetailQuery";

export default function JudgingRoundDetailPage() {
  const params = useParams();
  const judgingRoundId = Number(params.judgingRoundId);

  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useJudgingRoundDetailQuery(judgingRoundId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        <span className="ml-2 text-gray-600">로딩 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 font-semibold p-4">
        에러 발생: {(error as Error).message}
      </div>
    );
  }

  if (!detail) {
    return <div className="text-gray-500 p-4">데이터가 없습니다.</div>;
  }

  const { name, start_date, end_date, program_name, criteriaList, companies } =
    detail;

  const judgeMap = new Map<string, string>();
  companies.forEach((company) => {
    company.evaluations.forEach((evaluation) => {
      if (!judgeMap.has(evaluation.user_id)) {
        judgeMap.set(evaluation.user_id, evaluation.username);
      }
    });
  });
  const judges = Array.from(judgeMap.entries()).map(([user_id, username]) => ({
    user_id,
    username,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 라운드 정보 */}
      <h1 className="text-2xl font-bold mb-6">심사 라운드 상세</h1>
      <div className="border rounded-lg p-4 mb-8 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          라운드 정보
        </h2>
        <p className="text-gray-700">
          <span className="font-medium">라운드명:</span> {name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">프로그램명:</span> {program_name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">시작일:</span> {start_date || "-"}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">종료일:</span> {end_date || "-"}
        </p>
      </div>

      {/* 평가 기준 목록 */}
      <div className="border rounded-lg p-4 mb-8 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-2 text-blue-600">
          평가 기준 목록
        </h2>
        {criteriaList.length === 0 ? (
          <p className="text-gray-600">평가 기준이 없습니다.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {criteriaList.map((criteria) => (
              <li key={criteria.id} className="leading-relaxed">
                <span className="font-medium">{criteria.item_name}</span> (배점:{" "}
                {criteria.points})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 심사 결과 요약 */}
      <div className="border rounded-lg p-4 mb-8 shadow-sm bg-white">
        <Accordion type="multiple">
          <AccordionItem className="border-none" value="resultSummary">
            <AccordionTrigger className="px-4 py-2 text-xl font-semibold text-blue-600">
              심사 결과 요약
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead className="bg-blue-50 font-bold text-black">
                    <tr>
                      <th
                        rowSpan={2}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        No.
                      </th>
                      <th
                        rowSpan={2}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        기업명
                      </th>
                      <th
                        colSpan={judges.length}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        심사자
                      </th>
                      <th
                        rowSpan={2}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        총점
                      </th>
                      <th
                        rowSpan={2}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        평균
                      </th>
                      <th
                        rowSpan={2}
                        className="px-4 py-2 text-xs uppercase border border-gray-300"
                      >
                        순위
                      </th>
                    </tr>
                    <tr>
                      {judges.map((judge) => (
                        <th
                          key={judge.user_id}
                          className="px-4 py-2 text-xs uppercase border border-gray-300"
                        >
                          {judge.username}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white text-xs">
                    {companies.map((company, index) => (
                      <tr
                        key={company.company_id}
                        className="border border-gray-200"
                      >
                        <td className="px-4 py-2 text-center border border-gray-200">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {company.company_name}
                        </td>
                        {judges.map((judge) => {
                          const evaluation = company.evaluations.find(
                            (evalItem) => evalItem.user_id === judge.user_id
                          );
                          const judgeScore = evaluation
                            ? evaluation.criteriaScores.reduce(
                                (sum, cs) => sum + cs.grade,
                                0
                              )
                            : null;
                          return (
                            <td
                              key={judge.user_id}
                              className="px-4 py-2 text-center border border-gray-200"
                            >
                              {judgeScore !== null ? judgeScore : "-"}
                            </td>
                          );
                        })}
                        <td className="px-4 py-2 text-center border border-gray-200">
                          {company.totalScore}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-200">
                          {company.evaluations.length > 0
                            ? (
                                company.totalScore / company.evaluations.length
                              ).toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-200">
                          {index + 1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* 참여 기업 (Accordion) */}
      <div className="border rounded-lg p-4 mb-8 shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          참여 기업 및 평가 결과
        </h2>
        {companies.length === 0 ? (
          <p className="text-gray-600">참여 기업이 없습니다.</p>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {companies.map((company, idx) => (
              <AccordionItem
                className="border border-gray-300 rounded-md"
                key={company.company_id}
                value={String(company.company_id)}
              >
                {/* 아코디언 헤더(Trigger) */}
                <AccordionTrigger className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-left text-lg font-semibold text-gray-800 transition-colors">
                  {idx + 1}위{`(${company.totalScore}점)`} :{" "}
                  {company.company_name}{" "}
                </AccordionTrigger>

                {/* 아코디언 내용(Panel) */}
                <AccordionContent className="px-4 py-3 bg-white rounded-b-md">
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">설명:</span>{" "}
                    {company.description || "-"}
                  </p>

                  {/* 세부 평가 내역 */}
                  <h4 className="text-md font-semibold text-gray-800 mb-2">
                    세부 평가 내역
                  </h4>
                  {company.evaluations.length === 0 ? (
                    <p className="text-gray-600">평가 정보가 없습니다.</p>
                  ) : (
                    <ul className="space-y-4">
                      {company.evaluations.map((evalItem, eIdx) => {
                        // 각 심사위원이 부여한 점수 합계
                        const userTotal = evalItem.criteriaScores.reduce(
                          (sum, score) => sum + score.grade,
                          0
                        );
                        return (
                          <li
                            key={eIdx}
                            className="bg-gray-50 rounded p-3 text-gray-700"
                          >
                            {/* 유저 이름 + 피드백 + 각 심사위원 총점 */}
                            <p className="font-medium text-blue-700 mb-1">
                              심사자: {evalItem.username}{" "}
                              <span className="ml-1 text-sm text-gray-600">
                                ({userTotal}점)
                              </span>
                              {evalItem.feedback && (
                                <span className="ml-2 text-sm text-gray-600">
                                  (피드백: {evalItem.feedback})
                                </span>
                              )}
                            </p>

                            {/* 해당 유저의 (기준, 점수) 목록 */}
                            <ul className="pl-4 list-disc space-y-1">
                              {evalItem.criteriaScores.map((cs, i) => {
                                // criteriaList에서 매칭
                                const matchedCriterion = criteriaList.find(
                                  (c) => c.id === cs.evaluation_criterion_id
                                );
                                const criterionName =
                                  matchedCriterion?.item_name ??
                                  `기준 #${cs.evaluation_criterion_id}`;

                                return (
                                  <li key={i}>
                                    <span className="font-medium">
                                      {criterionName}
                                    </span>
                                    : {cs.grade}
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
