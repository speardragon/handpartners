import { useQuery } from "@tanstack/react-query";

const getJudgingRoundsCompanies = async (judgingRoundId: number) => {
  const res = await fetch(`/api/judge/${judgingRoundId}/company`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.error || "Error fetching judging rounds");
  }
  return res.json();
};

export function useJudgingRoundCompanyQuery(judgingRoundId: number) {
  return useQuery({
    queryKey: ["judging_round_companies", judgingRoundId],
    queryFn: () => getJudgingRoundsCompanies(judgingRoundId),
  });
}
