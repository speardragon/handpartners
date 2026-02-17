import {
  getAllScreenings,
  AllScreeningsResult,
  ScreeningWithStatus,
  checkParticipation,
} from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useParticipationQuery = (
  judgingRoundId: number,
  enabled: boolean = true
) => {
  return useQuery<boolean>({
    queryKey: ["participation", judgingRoundId],
    queryFn: () => checkParticipation(judgingRoundId),
    enabled: judgingRoundId > 0 && enabled,
  });
};

export const useScreeningDetailQuery = (
  judgingRoundId: number,
  isAdmin: boolean,
  isParticipating?: boolean
) => {
  return useQuery<ScreeningWithStatus | null>({
    queryKey: ["screeningDetail", judgingRoundId, isAdmin, isParticipating],
    queryFn: async () => {
      const result: AllScreeningsResult = await getAllScreenings(
        1,
        1,
        isAdmin,
        judgingRoundId,
        isParticipating
      );
      return result.result[0] ?? null;
    },
    enabled: judgingRoundId > 0 && (isAdmin ? isParticipating !== undefined : true),
  });
};
