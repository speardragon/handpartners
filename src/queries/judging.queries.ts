import { queryOptions } from "@tanstack/react-query";
import {
  getAllJudgingWorkspaces,
  checkParticipation,
  type AllJudgingWorkspacesResult,
} from "@/actions/program-action";

export const judgingQueries = {
  all: () => ["judging_workspaces"] as const,

  list: (
    page: number,
    size: number,
    isAdmin: boolean,
    judgingRoundId?: string
  ) =>
    queryOptions({
      queryKey: [
        ...judgingQueries.all(),
        "list",
        page,
        size,
        isAdmin,
        judgingRoundId,
      ] as const,
      queryFn: () =>
        getAllJudgingWorkspaces(page, size, isAdmin, judgingRoundId),
    }),
  detailKeyPrefix: () => [...judgingQueries.all(), "detail"] as const,
  detail: (judgingRoundId: string, isAdmin: boolean) =>
    queryOptions({
      queryKey: [
        ...judgingQueries.detailKeyPrefix(),
        judgingRoundId,
        isAdmin,
      ] as const,
      queryFn: async () => {
        const result: AllJudgingWorkspacesResult =
          await getAllJudgingWorkspaces(1, 1, isAdmin, judgingRoundId);
        const judging = result.result[0] ?? null;
        return judging
          ? { ...judging, isAdminView: result.isAdminView ?? false }
          : null;
      },
    }),
  participation: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [
        ...judgingQueries.all(),
        "participation",
        judgingRoundId,
      ] as const,
      queryFn: () => checkParticipation(judgingRoundId),
    }),
};
