import { getJudgeById } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

export const useJudgeQuery = (judgeRoundId: string) => {
  return useQuery({
    queryKey: ["judge", judgeRoundId],
    queryFn: () => getJudgeById(judgeRoundId),
  });
};
