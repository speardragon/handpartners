import { CompanyResult } from "@/actions/company-action";
import { useInfiniteQuery } from "@tanstack/react-query";

const getCompanies = async (page: number, search: string) => {
  const response = await fetch(
    `/api/admin/company?page=${page}&size=10&search=${search}`
  );
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

export const useCompanyInfiniteQuery = (search: string) => {
  return useInfiniteQuery<CompanyResult>({
    queryKey: ["companies", search],
    queryFn: ({ pageParam = 0 }) => getCompanies(pageParam as number, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
