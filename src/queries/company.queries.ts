import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import {
  getCompanies,
  getCompanyById,
  type CompanyResult,
} from "@/actions/company-action";

export const companyQueries = {
  all: () => ["companies"] as const,
  lists: () => [...companyQueries.all(), "list"] as const,
  list: (
    pagination: { pageIndex: number; pageSize: number },
    search?: string
  ) =>
    queryOptions({
      queryKey: [...companyQueries.lists(), pagination, search] as const,
      queryFn: () =>
        getCompanies(pagination.pageIndex + 1, pagination.pageSize, search),
    }),
  detail: (companyId: number) =>
    queryOptions({
      queryKey: [...companyQueries.all(), companyId, "detail"] as const,
      queryFn: () => getCompanyById(companyId),
    }),
  infinite: (search: string) =>
    infiniteQueryOptions({
      queryKey: [...companyQueries.all(), "infinite", search] as const,
      queryFn: ({ pageParam }) => getCompanies(pageParam as number, 10, search),
      initialPageParam: 1,
      getNextPageParam: (lastPage: CompanyResult) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    }),
};
