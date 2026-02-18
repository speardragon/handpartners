import { getJudgingRoundsByProgramId } from "@/actions/judging_round-action";
import { useQuery } from "@tanstack/react-query";

export function useJudgingRoundsByProgram(
  programId: number,
  pagination: {
    pageIndex: number;
    pageSize: number;
  }
) {
  return useQuery({
    queryKey: ["judging_rounds", programId, pagination],
    queryFn: () =>
      getJudgingRoundsByProgramId(
        programId,
        pagination.pageIndex + 1,
        pagination.pageSize
      ),
  });
}
