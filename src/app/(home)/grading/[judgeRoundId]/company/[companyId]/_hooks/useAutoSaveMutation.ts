import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvaluation } from "@/actions/evaluation-action";
import { screeningQueries, evaluationQueries } from "@/queries";

interface AutoSaveArgs {
  judgeRoundId: string;
  companyId: number;
  feedback: string;
  evaluations: { id: number; grade: number }[];
}

export function useAutoSaveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["evaluation-auto-save"],
    mutationFn: async ({
      judgeRoundId,
      companyId,
      feedback,
      evaluations,
    }: AutoSaveArgs) => {
      const evaluationRecords = evaluations.map((item) => ({
        evaluation_criterion_id: item.id,
        grade: item.grade,
        user_id: "",
        status: "ONGOING",
        feedback,
        created_at: new Date().toISOString(),
      }));

      return createEvaluation(judgeRoundId, companyId, evaluationRecords);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: screeningQueries.detailKeyPrefix(),
      });
      // evaluation query cache의 status를 ONGOING으로 동기화
      queryClient.setQueryData(
        evaluationQueries.byUser(variables.judgeRoundId, variables.companyId)
          .queryKey,
        (old: any) =>
          old
            ? {
                ...old,
                evaluations: old.evaluations.map((e: any) => ({
                  ...e,
                  status: "ONGOING",
                })),
              }
            : old
      );
    },
  });
}
