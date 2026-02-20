import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import {
  getUsers,
  getUserProfile,
  type UserResult,
} from "@/actions/user-actions";

export const userQueries = {
  all: () => ["users"] as const,
  lists: () => [...userQueries.all(), "list"] as const,
  list: (
    pagination: { pageIndex: number; pageSize: number },
    search?: string
  ) =>
    queryOptions({
      queryKey: [...userQueries.lists(), pagination, search] as const,
      queryFn: () =>
        getUsers(pagination.pageIndex + 1, pagination.pageSize, search),
    }),
  profile: () =>
    queryOptions({
      queryKey: [...userQueries.all(), "me"] as const,
      queryFn: () => getUserProfile(),
    }),
  infinite: (search?: string) =>
    infiniteQueryOptions({
      queryKey: [...userQueries.all(), "infinite", search] as const,
      queryFn: ({ pageParam }) => getUsers(pageParam as number, 10, search),
      initialPageParam: 0,
      getNextPageParam: (lastPage: UserResult) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    }),
};
