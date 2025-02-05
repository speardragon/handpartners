"use client";

import Loading from "@/app/_components/Loading";
import { useJudgingRoundDetailQuery } from "../_hooks/useJudgingRoundDetailQuery";

type JudgingRoundDetailDialogContentProps = {
  judgingRoundId: number;
};

export default function JudgingRoundDetailDialogContent({
  judgingRoundId,
}: JudgingRoundDetailDialogContentProps) {
  const {
    data: detail,
    isLoading,
    isError,
    error,
  } = useJudgingRoundDetailQuery(judgingRoundId);

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
            <tr key={company.company_id} className="border border-gray-200">
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
                  ? (company.totalScore / company.evaluations.length).toFixed(2)
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
  );
}
