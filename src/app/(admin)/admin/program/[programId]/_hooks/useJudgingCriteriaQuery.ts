import { getJudgingCriteriaByRound } from "@/actions/evaluation_criteria-action";
import { useQuery } from "@tanstack/react-query";

/**
 * 심사 기준(evaluation_criteria) 목록을 불러오는 React Query Hook
 */
export function useJudgingCriteriaQuery(judgingRoundId: number) {
  return useQuery({
    queryKey: ["judging_round_criteria", judgingRoundId],
    queryFn: () => getJudgingCriteriaByRound(judgingRoundId),
  });
}
