import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import { createEvaluation } from "@/actions/evaluation-action";
import {
  EVALUATION_SAVE_SCOPE,
  syncEvaluationCache,
} from "../_lib/sync-evaluation-cache";

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
    // 임시 저장·제출 요청을 순서대로 처리 (늦게 도착한 이전 값이 최신 값을 덮어쓰지 않도록)
    scope: { id: EVALUATION_SAVE_SCOPE },
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

      return executeAction(
        createEvaluation(judgeRoundId, companyId, evaluationRecords)
      );
    },
    onSuccess: (data, variables) => {
      syncEvaluationCache(
        queryClient,
        variables.judgeRoundId,
        variables.companyId,
        data
      );
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "임시 저장에 실패했습니다."));
    },
  });
}
