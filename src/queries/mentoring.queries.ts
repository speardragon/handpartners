import { queryOptions } from "@tanstack/react-query";
import {
  getAllMentorings,
  getMentoringByProgramId,
  getMentoringDetail,
} from "@/actions/mentoring-action";

export const mentoringQueries = {
  all: () => ["mentorings"] as const,
  list: (search?: string) =>
    queryOptions({
      queryKey: [...mentoringQueries.all(), "list", search] as const,
      queryFn: () => getAllMentorings(search),
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
