// hooks/useFeedbacksQuery.ts
import { useQuery } from "@tanstack/react-query";

interface FeedbackData {
  companies: {
    name: string;
    feedbacks: string[];
  }[];
}

async function fetchFeedbacks(judgingRoundId: number) {
  const res = await fetch(`/api/feedback?judging_round_id=${judgingRoundId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData?.error || "Failed to fetch feedbacks";
    throw new Error(errorMsg);
  }
  return res.json() as Promise<FeedbackData>;
}

export function useFeedbacksQuery(judgingRoundId: number, enabled = true) {
  return useQuery<FeedbackData>({
    queryKey: ["feedbacks", judgingRoundId],
    queryFn: () => fetchFeedbacks(judgingRoundId),
    enabled,
  });
}
