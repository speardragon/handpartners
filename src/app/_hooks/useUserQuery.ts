import { getUserProfile, getUsers } from "@/actions/user-actions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useUserQuery = (pagination: {
  pageIndex: number;
  pageSize: number;
}) => {
  return useQuery({
    queryKey: ["users", pagination],
    queryFn: () => getUsers(pagination.pageIndex + 1, pagination.pageSize),
    placeholderData: keepPreviousData,
  });
};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => getUserProfile(),
  });
};
