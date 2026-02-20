import { queryOptions } from "@tanstack/react-query";
import {
  getEvaluationByUser,
  getDetailedEvaluationsByUser,
} from "@/actions/evaluation-action";

export const evaluationQueries = {
  all: () => ["evaluations"] as const,

  byUser: (judgeRoundId: string, companyId: number) =>
    queryOptions({
      queryKey: [...evaluationQueries.all(), judgeRoundId, companyId] as const,
      queryFn: () => getEvaluationByUser(judgeRoundId, companyId),
    }),
  report: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [...evaluationQueries.all(), "report", judgingRoundId] as const,
      queryFn: () => getDetailedEvaluationsByUser(judgingRoundId),
    }),
};
