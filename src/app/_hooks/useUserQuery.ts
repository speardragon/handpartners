import { getUserProfile, getUsers } from "@/actions/user-actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useUserQuery = (
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  search?: string
) => {
  return useQuery({
    queryKey: ["users", pagination, search],
    queryFn: () =>
      getUsers(pagination.pageIndex + 1, pagination.pageSize, search),
    placeholderData: keepPreviousData,
  });
};

export const useUserProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => getUserProfile(),
    enabled,
  });
};
