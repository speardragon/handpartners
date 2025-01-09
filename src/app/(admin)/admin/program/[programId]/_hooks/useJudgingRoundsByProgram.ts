import { JudgingRoundPaginationResult } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

const getJudgingRounds = async (
  programId: number,
  page: number,
  size: number
) => {
  const res = await fetch(
    `/api/judge/program/${programId}?page=${page}&size=${size}`
  );
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData?.error || "Error fetching judging rounds");
  }
  return res.json();
};

export function useJudgingRoundsByProgram(
  programId: number,
  pagination: {
    pageIndex: number;
    pageSize: number;
  }
) {
  return useQuery<JudgingRoundPaginationResult>({
    queryKey: ["judging_rounds", programId, pagination],
    queryFn: () =>
      getJudgingRounds(
        programId,
        pagination.pageIndex + 1,
        pagination.pageSize
      ),
  });
}
