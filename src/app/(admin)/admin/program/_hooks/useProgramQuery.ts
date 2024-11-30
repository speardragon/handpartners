import { getPrograms } from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useProgramQuery = (pagination: {
  pageIndex: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["programs", pagination],
    queryFn: () => getPrograms(pagination.pageIndex + 1, pagination.pageSize),
  });
};
