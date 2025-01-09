import { CompanyResult } from "@/actions/company-action";
import { useQuery } from "@tanstack/react-query";

const getCompanies = async (page: number, size: number) => {
  const response = await fetch(`/api/admin/company?page=${page}&size=${size}`);
  if (!response.ok) {
    let errorMsg = "Failed to fetch screenings.";

    const errorData = await response.json();
    if (errorData?.error) {
      errorMsg = errorData.error;
    }

    throw new Error(errorMsg);
  }
  return response.json();
};

export const useCompanyQuery = (pagination: {
  pageIndex: number;
  pageSize: number;
}) => {
  return useQuery<CompanyResult>({
    queryKey: ["companies", pagination],
    queryFn: () => getCompanies(pagination.pageIndex + 1, pagination.pageSize),
  });
};
