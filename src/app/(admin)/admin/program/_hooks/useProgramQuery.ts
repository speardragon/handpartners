import { getPrograms } from "@/actions/program-action";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProgramQuery = (
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  search?: string
) => {
  return useQuery({
    queryKey: ["programs", pagination, search],
    queryFn: () =>
      getPrograms(pagination.pageIndex + 1, pagination.pageSize, search),
    placeholderData: keepPreviousData,
  });
};
