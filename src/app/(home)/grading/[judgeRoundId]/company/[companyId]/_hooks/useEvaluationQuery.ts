import { getEvaluationByUser } from "@/actions/evaluation-action";
import { useQuery } from "@tanstack/react-query";

export const useEvaluationQuery = (judgeRoundId: string, companyId: number) => {
  return useQuery({
    queryKey: ["evaluation", judgeRoundId, companyId],
    queryFn: () => getEvaluationByUser(judgeRoundId, companyId),
  });
};
