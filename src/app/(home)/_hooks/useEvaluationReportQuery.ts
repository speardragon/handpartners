import { getScreenings } from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";
import { Screening } from "@/actions/program-action";
import { getDetailedEvaluationsByUser } from "@/actions/evaluation-action";

/** [홈화면, 강의 목록 화면] 모든 코스 가져오기 (active) */
export const useEvaluationReportQuery = (
  judgingRoundId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["evaluation", "report", judgingRoundId],
    queryFn: () => getDetailedEvaluationsByUser(judgingRoundId),
  });
};
