import { getProjects } from "@/actions/project-action";
import { getUsers } from "@/actions/user-actions";
import { useQuery } from "@tanstack/react-query";

export interface ProjectResponse {
  id: number;
  title: string;
  created_at: string;
}

// async function getAllProject() {
//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
//     next: {
//       tags: ["allCourses"],
//     },
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to get allUser");
//   }

//   return response.json();
// }

/** [홈화면, 강의 목록 화면] 모든 코스 가져오기 (active) */
export const useFetchAllProject = (options?: { enabled?: boolean }) => {
  return useQuery<ProjectResponse[]>({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });
};

export const useFetchUser = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUsers(),
  });
};
