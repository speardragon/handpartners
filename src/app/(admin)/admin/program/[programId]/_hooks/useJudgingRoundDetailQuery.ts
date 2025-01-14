import { JudgingRoundDetail } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

const fetchJudgingRoundDetail = async (judgingRoundId: number) => {
  const response = await fetch(`/api/judge/${judgingRoundId}/detail`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error || "심사 라운드 정보를 가져오지 못했습니다."
    );
  }
  return response.json() as Promise<JudgingRoundDetail>;
};

/**
 * 특정 judgingRoundId에 대한 심사 상세 정보를 불러오는 React Query 훅
 */
export function useJudgingRoundDetailQuery(judgingRoundId: number) {
  return useQuery<JudgingRoundDetail>({
    queryKey: ["judgingRoundDetail", judgingRoundId],
    queryFn: () => fetchJudgingRoundDetail(judgingRoundId),
    enabled: !!judgingRoundId, // 유효한 roundId일 때만 동작
  });
}
