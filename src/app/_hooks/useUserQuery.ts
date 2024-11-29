import { getUsers } from "@/actions/user-actions";
import { useQuery } from "@tanstack/react-query";

export const useUserQuery = (
  pagination: { pageIndex: number; pageSize: number }
  // name: string
) => {
  return useQuery({
    queryKey: ["users", pagination],
    queryFn: () => getUsers(pagination.pageIndex + 1, pagination.pageSize),
  });
};

// export const useOneUserQuery = (userId: number) => {
//   return useQuery({
//     queryKey: ["users", userId],
//     queryFn: () => getOneUser(userId),
//   });
// };
