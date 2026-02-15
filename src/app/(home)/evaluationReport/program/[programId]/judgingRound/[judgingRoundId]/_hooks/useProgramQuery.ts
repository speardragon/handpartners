import { getProgramById } from "@/actions/program-action";
import { ProgramRow } from "@/actions/program-action";
import { useQuery } from "@tanstack/react-query";

export const useProgramQuery = (
  programId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery<ProgramRow>({
    queryKey: ["program", programId],
    queryFn: () => getProgramById(programId),
  });
};
