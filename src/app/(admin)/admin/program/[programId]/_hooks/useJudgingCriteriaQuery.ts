import { useQuery } from "@tanstack/react-query";

const getJudgingRoundsCriteria = async (judgingRoundId: number) => {
  const res = await fetch(`/api/judge/${judgingRoundId}/criteria`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.error || "Error fetching judging round criteria");
  }
  return res.json();
};

/**
 * 심사 기준(evaluation_criteria) 목록을 불러오는 React Query Hook
 */
export function useJudgingCriteriaQuery(judgingRoundId: number) {
  return useQuery({
    queryKey: ["judging_round_criteria", judgingRoundId],
    queryFn: () => getJudgingRoundsCriteria(judgingRoundId),
    // 옵션이 필요하다면 추가 가능합니다.
  });
}
