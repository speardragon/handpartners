import { CompanyResult, getCompanies } from "@/actions/company-action";
import { useQuery } from "@tanstack/react-query";

export const useCompanyQuery = (pagination: {
  pageIndex: number;
  pageSize: number;
}) => {
  return useQuery<CompanyResult>({
    queryKey: ["companies", pagination],
    queryFn: () => getCompanies(pagination.pageIndex + 1, pagination.pageSize),
  });
};
