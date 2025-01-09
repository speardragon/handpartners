import { useQuery } from "@tanstack/react-query";

export const useEvaluationReportQuery = (
  judgingRoundId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["evaluation", "report", judgingRoundId],
    queryFn: async () => {
      const res = await fetch(`/api/evaluation/report/${judgingRoundId}`);
      if (!res.ok) {
        let errorMsg = "Failed to fetch evaluation report.";
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch (parseError) {
          // JSON 파싱 중 에러 발생 시 기본 메시지 사용
        }
        throw new Error(errorMsg);
      }
      return res.json();
    },
    enabled: options?.enabled,
  });
};
