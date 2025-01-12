import { useQuery } from "@tanstack/react-query";

const getJudgingRoundsUsers = async (judgingRoundId: number) => {
  const res = await fetch(`/api/judge/${judgingRoundId}/user`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.error || "Error fetching judging round users");
  }
  return res.json();
};

export function useJudgingRoundUserQuery(judgingRoundId: number) {
  return useQuery({
    queryKey: ["judging_round_users", judgingRoundId],
    queryFn: () => getJudgingRoundsUsers(judgingRoundId),
  });
}
