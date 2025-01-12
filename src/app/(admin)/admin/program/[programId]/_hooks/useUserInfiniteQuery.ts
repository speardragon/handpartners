import { UserResult } from "@/actions/user-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

const getUsers = async (page: number) => {
  const response = await fetch(`/api/admin/user?page=${page}&size=10`);
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

export const useUserInfiniteQuery = () => {
  return useInfiniteQuery<UserResult>({
    queryKey: ["users"],
    queryFn: ({ pageParam = 0 }) => getUsers(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
