// useEvaluationMutation.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { executeAction, getErrorMessage } from "@/lib/action";
import { createEvaluation } from "@/actions/evaluation-action";

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
  return useMutation({
    // 필요하다면 mutationKey를 좀 더 구체적으로 설정
    // 예: ["evaluation", judgeRoundId, companyId]
    mutationKey: ["evaluation"],
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
    onSuccess: () => {
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
