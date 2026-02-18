import { CompanyRow, getCompanyById } from "@/actions/company-action";
import { useQuery } from "@tanstack/react-query";

export const useCompanyQuery = (companyId: number) => {
  return useQuery<CompanyRow | null>({
    queryKey: ["company", companyId],
    queryFn: () => getCompanyById(companyId),
  });
};
