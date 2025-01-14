import { useQuery } from "@tanstack/react-query";
import { Screening } from "@/actions/program-action";

const getPrograms = async () => {
  const response = await fetch("/api/screening");
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

export const useProgramsQuery = (options?: { enabled?: boolean }) => {
  return useQuery<Screening[]>({
    queryKey: ["programs"],
    queryFn: () => getPrograms(),
  });
};
