import { getCompanyScoresByRoundId } from "@/actions/judging_round-action";
import { JudgingRow } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

interface ScoreData {
  companies: {
    name: string;
    judgings: JudgingRow[];
    totalScore: number;
    avgScore: number;
    ranking: number;
  }[];
}

export function useScoresQuery(judgingRoundId: number, enabled = true) {
  return useQuery<ScoreData>({
    queryKey: ["scores", judgingRoundId],
    queryFn: () => getCompanyScoresByRoundId(judgingRoundId),
    enabled,
  });
}
