"use client";

import Loading from "@/app/_components/Loading";
import { useQuery } from "@tanstack/react-query";
import { judgingRoundQueries } from "@/queries";

type JudgingRoundDetailDialogContentProps = {
  judgingRoundId: string;
};

export default function JudgingRoundDetailDialogContent({
  judgingRoundId,
}: JudgingRoundDetailDialogContentProps) {
  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useQuery(judgingRoundQueries.detail(judgingRoundId));

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        에러 발생: {(error as Error).message}
      </div>
    );
  }
  if (!detail) {
    return <div className="p-4">데이터가 없습니다.</div>;
  }

  const { companies } = detail;

  // 모든 기업 평가에서 유니크한 심사위원(평가자) 목록 생성 (user_id 기준)
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
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-blue-50 font-bold text-black">
          <tr>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              No.
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              기업명
            </th>
            <th
              colSpan={judges.length}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              심사자
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              총점
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              평균
            </th>
            <th
              rowSpan={2}
              className="border border-gray-300 px-4 py-2 text-xs uppercase"
            >
              순위
            </th>
          </tr>
          <tr>
            {judges.map((judge) => (
              <th
                key={judge.user_id}
                className="border border-gray-300 px-4 py-2 text-xs uppercase"
              >
                {judge.username}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-xs">
          {companies.map((company, index) => (
            <tr key={company.company_id} className="border border-gray-200">
              <td className="border border-gray-200 px-4 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-200 px-4 py-2">
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
                    className="border border-gray-200 px-4 py-2 text-center"
                  >
                    {judgeScore !== null ? judgeScore : "-"}
                  </td>
                );
              })}
              <td className="border border-gray-200 px-4 py-2 text-center">
                {company.totalScore}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-center">
                {company.evaluations.length > 0
                  ? (company.totalScore / company.evaluations.length).toFixed(2)
                  : "-"}
              </td>
              <td className="border border-gray-200 px-4 py-2 text-center">
                {index + 1}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
