import { useQuery } from "@tanstack/react-query";
import { ProgramRow, Screening } from "@/actions/program-action";

const getProgramById = async (programId: number) => {
  const response = await fetch(`/api/program/${programId}`);
  if (!response.ok) {
    let errorMsg = "Failed to fetch screenings.";

    const errorData = await response.json();
    if (errorData?.error) {
      errorMsg = errorData.error;
    }

    throw new Error(errorMsg);
  }
  return response.json();
};

export const useProgramQuery = (
  programId: number,
  options?: { enabled?: boolean }
) => {
  return useQuery<ProgramRow>({
    queryKey: ["program", programId],
    queryFn: () => getProgramById(programId),
  });
};
