import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getAllMentorings,
  getMentoringByProgramId,
  getMentoringDetail,
  type MentoringListResult,
} from "@/actions/mentoring-action";

export const mentoringQueries = {
  all: () => ["mentorings"] as const,
  list: (page: number, size: number, search?: string) =>
    queryOptions({
      queryKey: [
        ...mentoringQueries.all(),
        "list",
        page,
        size,
        search,
      ] as const,
      queryFn: () => getAllMentorings(page, size, search),
      staleTime: 0,
    }),
  infinite: (search?: string, size = 12) =>
    infiniteQueryOptions({
      queryKey: [...mentoringQueries.all(), "infinite", size, search] as const,
      queryFn: ({ pageParam }) =>
        getAllMentorings(pageParam as number, size, search),
      initialPageParam: 1,
      getNextPageParam: (lastPage: MentoringListResult) =>
        lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
      staleTime: 0,
    }),
  byProgram: (programId: number) =>
    queryOptions({
      queryKey: [...mentoringQueries.all(), programId, "program"] as const,
      queryFn: () => getMentoringByProgramId(programId),
    }),
  detail: (mentoringId: string) =>
    queryOptions({
      queryKey: [...mentoringQueries.all(), mentoringId, "detail"] as const,
      queryFn: () => getMentoringDetail(mentoringId),
    }),
};
