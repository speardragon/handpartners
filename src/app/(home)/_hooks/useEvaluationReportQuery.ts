import { getDetailedEvaluationsByUser } from "@/actions/evaluation-action";
import { useQuery } from "@tanstack/react-query";

export const useEvaluationReportQuery = (
  judgingRoundId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["evaluation", "report", judgingRoundId],
    queryFn: () => getDetailedEvaluationsByUser(judgingRoundId),
    enabled: !!judgingRoundId,
  });
};
