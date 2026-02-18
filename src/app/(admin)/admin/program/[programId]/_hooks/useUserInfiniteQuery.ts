import { UserResult, getUsers } from "@/actions/user-actions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useUserInfiniteQuery = (search?: string) => {
  return useInfiniteQuery<UserResult>({
    queryKey: ["users", search],
    queryFn: ({ pageParam = 0 }) =>
      getUsers(pageParam as number, 10, search),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
