import {
  getAllScreenings,
  AllScreeningsResult,
  ScreeningWithStatus,
} from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useScreeningDetailQuery = (
  judgingRoundId: number,
  isAdmin: boolean
) => {
  return useQuery<ScreeningWithStatus | null>({
    queryKey: ["screeningDetail", judgingRoundId, isAdmin],
    queryFn: async () => {
      const result: AllScreeningsResult = await getAllScreenings(
        1,
        1,
        isAdmin,
        judgingRoundId
      );
      return result.result[0] ?? null;
    },
    enabled: judgingRoundId > 0,
  });
};
