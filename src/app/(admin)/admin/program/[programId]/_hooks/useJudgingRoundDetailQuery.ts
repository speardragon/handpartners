import {
  getJudgingRoundDetails,
  JudgingRoundDetail,
} from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

/**
 * 특정 judgingRoundId에 대한 심사 상세 정보를 불러오는 React Query 훅
 */
export function useJudgingRoundDetailQuery(judgingRoundId: string) {
  return useQuery<JudgingRoundDetail>({
    queryKey: ["judgingRoundDetail", judgingRoundId],
    queryFn: () => getJudgingRoundDetails(judgingRoundId),
    enabled: !!judgingRoundId,
  });
}
