import { JudgingRow } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

interface ScoreData {
  companies: {
    name: string; // 회사명
    judgings: JudgingRow[]; // [{judgingUserName, score}, ...]
    totalScore: number;
    avgScore: number;
    ranking: number; // totalScore 내림차순 순위
  }[];
}

async function fetchScores(judgingRoundId: number) {
  const res = await fetch(
    `/api/evaluation/score?judging_round_id=${judgingRoundId}`
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData?.error || "Failed to fetch scores";
    throw new Error(errorMsg);
  }
  return res.json() as Promise<ScoreData>;
}

export function useScoresQuery(judgingRoundId: number, enabled = true) {
  return useQuery<ScoreData>({
    queryKey: ["scores", judgingRoundId],
    queryFn: () => fetchScores(judgingRoundId),
    enabled,
  });
}
