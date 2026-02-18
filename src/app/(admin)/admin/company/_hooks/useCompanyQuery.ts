import { CompanyResult, getCompanies } from "@/actions/company-action";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCompanyQuery = (
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  search?: string
) => {
  return useQuery<CompanyResult>({
    queryKey: ["companies", pagination, search],
    queryFn: () =>
      getCompanies(pagination.pageIndex + 1, pagination.pageSize, search),
    placeholderData: keepPreviousData,
  });
};
