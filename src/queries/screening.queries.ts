import { queryOptions } from "@tanstack/react-query";
import {
  getAllScreenings,
  checkParticipation,
  type AllScreeningsResult,
} from "@/actions/program-action";

export const screeningQueries = {
  all: () => ["screenings"] as const,

  list: (
    page: number,
    size: number,
    isAdmin: boolean,
    judgingRoundId?: string
  ) =>
    queryOptions({
      queryKey: [
        ...screeningQueries.all(),
        "list",
        page,
        size,
        isAdmin,
        judgingRoundId,
      ] as const,
      queryFn: () => getAllScreenings(page, size, isAdmin, judgingRoundId),
    }),
  detailKeyPrefix: () => [...screeningQueries.all(), "detail"] as const,
  detail: (judgingRoundId: string, isAdmin: boolean) =>
    queryOptions({
      queryKey: [
        ...screeningQueries.detailKeyPrefix(),
        judgingRoundId,
        isAdmin,
      ] as const,
      queryFn: async () => {
        const result: AllScreeningsResult = await getAllScreenings(
          1,
          1,
          isAdmin,
          judgingRoundId
        );
        const screening = result.result[0] ?? null;
        return screening
          ? { ...screening, isAdminView: result.isAdminView ?? false }
          : null;
      },
    }),
  participation: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [
        ...screeningQueries.all(),
        "participation",
        judgingRoundId,
      ] as const,
      queryFn: () => checkParticipation(judgingRoundId),
    }),
};
