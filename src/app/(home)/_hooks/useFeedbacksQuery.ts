import { getCompanyFeedbacksByRoundId } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

interface FeedbackData {
  companies: {
    name: string;
    feedbacks: string[];
  }[];
}

export function useFeedbacksQuery(judgingRoundId: string, enabled = true) {
  return useQuery<FeedbackData>({
    queryKey: ["feedbacks", judgingRoundId],
    queryFn: () => getCompanyFeedbacksByRoundId(judgingRoundId),
    enabled,
  });
}
