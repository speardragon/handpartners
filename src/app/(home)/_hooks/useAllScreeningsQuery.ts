import {
  getAllScreenings,
  AllScreeningsResult,
} from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useAllScreeningsQuery = (
  page: number,
  size: number,
  isAdmin: boolean,
  judgingRoundId?: number
) => {
  return useQuery<AllScreeningsResult>({
    queryKey: ["allScreenings", page, size, isAdmin, judgingRoundId],
    queryFn: () =>
      getAllScreenings(
        page,
        size,
        isAdmin,
        judgingRoundId !== undefined ? String(judgingRoundId) : undefined
      ),
  });
};
