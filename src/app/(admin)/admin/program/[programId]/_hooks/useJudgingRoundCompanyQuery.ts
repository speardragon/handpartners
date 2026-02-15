import { getJudgingRoundCompaniesById } from "@/actions/judging_rounds_company-action";
import { useQuery } from "@tanstack/react-query";

export function useJudgingRoundCompanyQuery(judgingRoundId: number) {
  return useQuery({
    queryKey: ["judging_round_companies", judgingRoundId],
    queryFn: () => getJudgingRoundCompaniesById(judgingRoundId),
  });
}
