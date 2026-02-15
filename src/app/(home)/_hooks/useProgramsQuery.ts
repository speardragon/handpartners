import { getScreenings, Screening } from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useProgramsQuery = (options?: { enabled?: boolean }) => {
  return useQuery<Screening[]>({
    queryKey: ["programs"],
    queryFn: () => getScreenings(),
    staleTime: 0,
  });
};
