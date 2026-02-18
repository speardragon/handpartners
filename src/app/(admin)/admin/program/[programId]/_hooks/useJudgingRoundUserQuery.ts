import { getJudgingRoundUsersById } from "@/actions/judging_round_user-action";
import { useQuery } from "@tanstack/react-query";

export function useJudgingRoundUserQuery(judgingRoundId: string) {
  return useQuery({
    queryKey: ["judging_round_users", judgingRoundId],
    queryFn: () => getJudgingRoundUsersById(judgingRoundId),
  });
}
