import type { QueryClient } from "@tanstack/react-query";
import type {
  EvaluationRow,
  getEvaluationByUser,
} from "@/actions/evaluation-action";
import { evaluationQueries, judgingQueries } from "@/queries";

// 임시 저장과 제출 mutation이 공유하는 직렬화 scope
export const EVALUATION_SAVE_SCOPE = "evaluation-save";

type EvaluationQueryData = Awaited<ReturnType<typeof getEvaluationByUser>>;

/**
 * 저장(임시 저장/제출) 결과를 evaluation 쿼리 캐시에 반영한다.
 * 캐시가 갱신되지 않으면 페이지에 다시 들어왔을 때 저장 이전 값으로 폼이 초기화된다.
 * pdfPath(presigned URL)를 유지하기 위해 refetch 대신 응답 데이터로 캐시를 직접 덮어쓴다.
 */
export function syncEvaluationCache(
  queryClient: QueryClient,
  judgeRoundId: string,
  companyId: number,
  savedRows: EvaluationRow[] | null
) {
  queryClient.invalidateQueries({
    queryKey: judgingQueries.detailKeyPrefix(),
  });

  if (!savedRows) return;

  const evaluations = savedRows.map((row) => ({
    ...row,
    user_id: row.user_id ?? "",
  }));

  queryClient.setQueryData<EvaluationQueryData>(
    evaluationQueries.byUser(judgeRoundId, companyId).queryKey,
    (old) => (old ? { ...old, evaluations } : old)
  );
}
