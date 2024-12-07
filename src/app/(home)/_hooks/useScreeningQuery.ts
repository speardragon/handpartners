import { getScreenings } from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";
import { Screening } from "@/actions/program-action";

/** [홈화면, 강의 목록 화면] 모든 코스 가져오기 (active) */
export const useFetchAllPrograms = (options?: { enabled?: boolean }) => {
  return useQuery<Screening[]>({
    queryKey: ["programs"],
    queryFn: () => getScreenings(),
  });
};
