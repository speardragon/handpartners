// useEvaluationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import { createEvaluation } from "@/actions/evaluation-action";
import {
  EVALUATION_SAVE_SCOPE,
  syncEvaluationCache,
} from "../_lib/sync-evaluation-cache";

interface EvaluationItem {
  id: number;
  grade: number;
}

interface UseEvaluationMutationArgs {
  judgeRoundId: string;
  companyId: number;
  feedback: string;
  evaluations: EvaluationItem[];
}

export function useEvaluationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    // 필요하다면 mutationKey를 좀 더 구체적으로 설정
    // 예: ["evaluation", judgeRoundId, companyId]
    mutationKey: ["evaluation"],
    // 대기 중인 임시 저장이 끝난 뒤 제출되도록 같은 scope로 직렬화
    scope: { id: EVALUATION_SAVE_SCOPE },
    retry: 2,
    mutationFn: async ({
      judgeRoundId,
      companyId,
      feedback,
      evaluations,
    }: UseEvaluationMutationArgs) => {
      const evaluationRecords = evaluations.map((item) => ({
        evaluation_criterion_id: item.id,
        grade: item.grade,
        user_id: "",
        status: "DONE",
        feedback,
        created_at: new Date().toISOString(),
      }));

      // createEvaluation server action 호출
      const result = await executeAction(
        createEvaluation(judgeRoundId, companyId, evaluationRecords),
        "저장 중 문제가 발생했습니다."
      );
      return result;
    },
    onSuccess: (data, variables) => {
      syncEvaluationCache(
        queryClient,
        variables.judgeRoundId,
        variables.companyId,
        data
      );
      toast.success("평가와 피드백이 성공적으로 저장되었습니다!", {
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "저장 중 문제가 발생했습니다."));
      console.error(error);
    },
  });
}
