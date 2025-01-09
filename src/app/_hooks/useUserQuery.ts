import { getUserProfile, getUsers } from "@/actions/user-actions";
import { UserProfile } from "@/types/evaluation-type";
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

export const useUserProfileQuery = () => {
  return useQuery<UserProfile>({
    queryKey: ["users", "me"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      
      if (!res.ok) {
        let errorMsg = "Failed to fetch user profile";
        try {
          const errorData = await res.json();
          if (errorData?.error) {
            errorMsg = errorData.error;
          }
        } catch (parseError) {
        }
        throw new Error(errorMsg);
      }

      return res.json();
    },
  });
};