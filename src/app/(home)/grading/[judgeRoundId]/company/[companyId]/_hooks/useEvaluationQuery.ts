import { useQuery } from "@tanstack/react-query";

const getEvaluation = async (judgeRoundId: number, companyId: number) => {
  // 서버 액션을 직접 호출하던 부분을 fetch()로 교체
  const res = await fetch(`/api/evaluation/${judgeRoundId}/${companyId}`);
  if (!res.ok) {
    let errorMsg = "Failed to fetch evaluation.";
    try {
      const errorData = await res.json();
      if (errorData?.error) {
        errorMsg = errorData.error;
      }
    } catch (parseError) {
      // JSON 파싱 중 에러가 나면 기본 메시지 그대로 사용
    }
    throw new Error(errorMsg);
  }

  return res.json();
};

export const useEvaluationQuery = (judgeRoundId: number, companyId: number) => {
  return useQuery({
    queryKey: ["evaluation", judgeRoundId, companyId],
    queryFn: () => getEvaluation(judgeRoundId, companyId),
  });
};
