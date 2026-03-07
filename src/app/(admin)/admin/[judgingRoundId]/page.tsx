"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { judgingRoundQueries } from "@/queries";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function JudgingRoundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const judgingRoundId = params.judgingRoundId as string;

  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useQuery(judgingRoundQueries.detail(judgingRoundId));

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        <span className="text-sm text-neutral-500">불러오는 중...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          에러 발생: {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <p className="text-sm text-neutral-500">데이터가 없습니다.</p>
      </div>
    );
  }

  const {
    name,
    start_date,
    end_date,
    program_description,
    criteriaList,
    companies,
  } = detail;

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

  // 동순위 처리된 순위 맵 (company_id → rank)
  const rankMap = new Map<number, number>();
  companies.forEach((company, index) => {
    if (index === 0) {
      rankMap.set(company.company_id, 1);
    } else {
      const prevCompany = companies[index - 1];
      rankMap.set(
        company.company_id,
        company.totalScore === prevCompany.totalScore
          ? rankMap.get(prevCompany.company_id)!
          : index + 1
      );
    }
  });

  const totalMaxScore = criteriaList.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* 뒤로가기 */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-neutral-500 hover:text-neutral-900"
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/admin/program");
          }
        }}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        뒤로가기
      </Button>

      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
        {program_description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-500">
            {program_description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-neutral-500">
          <span>
            {start_date || "-"} ~ {end_date || "-"}
          </span>
          <span className="text-neutral-300">|</span>
          <span>심사위원 {judges.length}명</span>
          <span className="text-neutral-300">|</span>
          <span>참여기업 {companies.length}개</span>
        </div>
      </div>

      {/* 평가 기준 */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold tracking-wider text-neutral-400 uppercase">
          평가 기준
        </h2>
        {criteriaList.length === 0 ? (
          <p className="text-sm text-neutral-500">평가 기준이 없습니다.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {criteriaList.map((criteria) => (
              <Badge
                key={criteria.id}
                variant="secondary"
                className="px-3 py-1 text-sm font-normal"
              >
                {criteria.item_name}
                <span className="ml-1.5 text-neutral-400">
                  {criteria.points}점
                </span>
              </Badge>
            ))}
            <Badge variant="outline" className="px-3 py-1 text-sm font-normal">
              총 {totalMaxScore}점
            </Badge>
          </div>
        )}
      </section>

      <Separator className="mb-8" />

      {/* 심사 결과 요약 테이블 */}
      <section className="mb-8">
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-neutral-400 uppercase">
          심사 결과 요약
        </h2>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="w-14 text-center font-semibold text-neutral-700">
                    순위
                  </TableHead>
                  <TableHead className="min-w-[120px] font-semibold text-neutral-700">
                    기업명
                  </TableHead>
                  {judges.map((judge) => (
                    <TableHead
                      key={judge.user_id}
                      className="min-w-[80px] text-center font-semibold text-neutral-700"
                    >
                      {judge.username}
                    </TableHead>
                  ))}
                  <TableHead className="w-20 text-center font-semibold text-neutral-700">
                    총점
                  </TableHead>
                  <TableHead className="w-20 text-center font-semibold text-neutral-700">
                    평균
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => {
                  const rank = rankMap.get(company.company_id)!;
                  const avg =
                    company.evaluations.length > 0
                      ? (
                          company.totalScore / company.evaluations.length
                        ).toFixed(1)
                      : "-";

                  return (
                    <TableRow key={company.company_id}>
                      <TableCell className="text-center">
                        {rank <= 3 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                            {rank}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-500">
                            {rank}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-neutral-900">
                        {company.company_name}
                      </TableCell>
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
                          <TableCell
                            key={judge.user_id}
                            className="text-center tabular-nums"
                          >
                            {judgeScore !== null ? (
                              <span className="text-neutral-700">
                                {judgeScore}
                              </span>
                            ) : (
                              <span className="text-neutral-300">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center font-semibold text-neutral-900 tabular-nums">
                        {company.totalScore}
                      </TableCell>
                      <TableCell className="text-center text-neutral-500 tabular-nums">
                        {avg}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Separator className="mb-8" />

      {/* 참여 기업 상세 평가 */}
      <section>
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-neutral-400 uppercase">
          기업별 상세 평가
        </h2>
        {companies.length === 0 ? (
          <p className="text-sm text-neutral-500">참여 기업이 없습니다.</p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {companies.map((company) => {
              const rank = rankMap.get(company.company_id)!;
              return (
                <AccordionItem
                  className="overflow-hidden rounded-lg border border-neutral-200 data-[state=open]:border-neutral-300"
                  key={company.company_id}
                  value={String(company.company_id)}
                >
                  <AccordionTrigger className="w-full px-5 py-3 text-left transition-colors hover:bg-neutral-50 [&[data-state=open]]:bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
                        {rank}
                      </span>
                      <span className="font-medium text-neutral-900">
                        {company.company_name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {company.totalScore}점
                      </Badge>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-0 pt-0 pb-0">
                    {company.description && (
                      <p className="px-5 py-6 text-sm text-neutral-500">
                        {company.description}
                      </p>
                    )}

                    {company.evaluations.length === 0 ? (
                      <p className="px-5 pb-4 text-sm text-neutral-400">
                        평가 정보가 없습니다.
                      </p>
                    ) : (
                      <>
                        {/* 기준 × 심사위원 비교 테이블 */}
                        <div className="overflow-x-auto border-t border-neutral-100">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-neutral-100 bg-neutral-50">
                                <th className="w-[40%] px-5 py-2.5 text-left text-xs font-semibold text-neutral-500">
                                  평가 기준
                                </th>
                                <th className="w-16 px-3 py-2.5 text-center text-xs font-medium text-neutral-400">
                                  배점
                                </th>
                                {company.evaluations.map((evalItem, i) => (
                                  <th
                                    key={i}
                                    className="min-w-[80px] px-4 py-2.5 text-center text-xs font-semibold text-neutral-700"
                                  >
                                    {evalItem.username}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                              {criteriaList.map((criterion) => (
                                <tr
                                  key={criterion.id}
                                  className="transition-colors hover:bg-neutral-50/50"
                                >
                                  <td className="px-5 py-2.5 text-neutral-700">
                                    {criterion.item_name}
                                  </td>
                                  <td className="px-3 py-2.5 text-center text-xs text-neutral-400 tabular-nums">
                                    {criterion.points}
                                  </td>
                                  {company.evaluations.map((evalItem, i) => {
                                    const cs = evalItem.criteriaScores.find(
                                      (s) =>
                                        s.evaluation_criterion_id ===
                                        criterion.id
                                    );
                                    return (
                                      <td
                                        key={i}
                                        className="px-4 py-2.5 text-center tabular-nums"
                                      >
                                        {cs !== undefined ? (
                                          <span className="font-medium text-neutral-800">
                                            {cs.grade}
                                          </span>
                                        ) : (
                                          <span className="text-neutral-300">
                                            -
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t border-neutral-200 bg-neutral-50">
                                <td className="px-5 py-2.5 text-xs font-semibold text-neutral-600">
                                  합계
                                </td>
                                <td className="px-3 py-2.5 text-center text-xs text-neutral-400 tabular-nums">
                                  {totalMaxScore}
                                </td>
                                {company.evaluations.map((evalItem, i) => {
                                  const total = evalItem.criteriaScores.reduce(
                                    (sum, s) => sum + s.grade,
                                    0
                                  );
                                  return (
                                    <td
                                      key={i}
                                      className="px-4 py-2.5 text-center"
                                    >
                                      <span className="font-bold text-neutral-900 tabular-nums">
                                        {total}
                                      </span>
                                    </td>
                                  );
                                })}
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        {/* 피드백 목록 */}
                        {company.evaluations.some((e) => e.feedback) && (
                          <div className="divide-y divide-neutral-100 border-t border-neutral-100 px-5">
                            {company.evaluations
                              .filter((e) => e.feedback)
                              .map((evalItem, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 py-2.5 text-xs"
                                >
                                  <span className="shrink-0 font-medium text-neutral-600">
                                    {evalItem.username}
                                  </span>
                                  <span className="text-neutral-300">·</span>
                                  <span className="leading-relaxed text-neutral-500">
                                    {evalItem.feedback}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </section>
    </div>
  );
}
