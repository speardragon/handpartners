import { CompanyResult, getCompanies } from "@/actions/company-action";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCompanyInfiniteQuery = (search: string) => {
  return useInfiniteQuery<CompanyResult>({
    queryKey: ["companies", search],
    queryFn: ({ pageParam = 0 }) =>
      getCompanies(pageParam as number, 10, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
