// useEvaluationMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createEvaluation } from "@/actions/evaluation-action";

interface EvaluationItem {
  id: number;
  grade: number;
}

interface UseEvaluationMutationArgs {
  judgeRoundId: number;
  companyId: number;
  feedback: string;
  evaluations: EvaluationItem[];
}

export function useEvaluationMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      const result = await createEvaluation(
        judgeRoundId,
        companyId,
        evaluationRecords
      );
      return result;
    },
    onSuccess: () => {
      toast.success("평가와 피드백이 성공적으로 저장되었습니다!", {
        position: "top-center",
      });
      // 관련된 쿼리 재검증
      queryClient.invalidateQueries();
      // 다른 페이지로 이동
      router.push("/");
    },
    onError: (error: unknown) => {
      toast.error("저장 중 문제가 발생했습니다.");
      console.error(error);
    },
  });
}
