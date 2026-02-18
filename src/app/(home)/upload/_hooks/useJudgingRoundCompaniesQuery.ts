import { getJudgingRoundCompaniesPublic } from "@/actions/judging_rounds_company-action";
import { useQuery } from "@tanstack/react-query";

export const useJudgingRoundCompaniesQuery = (
  judgingRoundId: string | null
) => {
  return useQuery({
    queryKey: ["public_judging_round_companies", judgingRoundId],
    queryFn: () => getJudgingRoundCompaniesPublic(judgingRoundId!),
    enabled: !!judgingRoundId,
  });
};
