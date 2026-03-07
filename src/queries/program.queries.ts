import { queryOptions } from "@tanstack/react-query";
import {
  getPrograms,
  getProgramById,
  getJudgingWorkspaces,
} from "@/actions/program-action";
import { getProgramCompanies } from "@/actions/program-company-action";

export const programQueries = {
  all: () => ["programs"] as const,
  lists: () => [...programQueries.all(), "list"] as const,
  list: (
    pagination: { pageIndex: number; pageSize: number },
    search?: string
  ) =>
    queryOptions({
      queryKey: [...programQueries.lists(), pagination, search] as const,
      queryFn: () =>
        getPrograms(pagination.pageIndex + 1, pagination.pageSize, search),
    }),
  detail: (programId: number) =>
    queryOptions({
      queryKey: [...programQueries.all(), programId, "detail"] as const,
      queryFn: () => getProgramById(programId),
    }),
  judgings: () =>
    queryOptions({
      queryKey: [...programQueries.all(), "judgings"] as const,
      queryFn: () => getJudgingWorkspaces(),
      staleTime: 0,
    }),
  companies: (programId: number) =>
    queryOptions({
      queryKey: [...programQueries.all(), programId, "companies"] as const,
      queryFn: () => getProgramCompanies(programId),
    }),
};
