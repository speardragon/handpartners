import { useQuery } from "@tanstack/react-query";

export const useJudgeQuery = (judgeRoundId: number) => {
  return useQuery({
    queryKey: ["judge", judgeRoundId],
    queryFn: async () => {
      const res = await fetch(`/api/judge/${judgeRoundId}`);
      if (!res.ok) {
        let errorMsg = "Failed to fetch judge data.";
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch (parseError) {
          // JSON 파싱 중 에러가 나면 기본 메시지 유지
        }
        throw new Error(errorMsg);
      }
      return res.json();
    },
  });
};
