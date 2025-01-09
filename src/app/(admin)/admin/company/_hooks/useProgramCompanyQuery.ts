import { useQuery } from "@tanstack/react-query";

const getCompanies = async (programId: number) => {
  const response = await fetch(`/api/program/${programId}/company`);
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

export const useProgramCompanyQuery = (programId: number) => {
  return useQuery({
    queryKey: ["programs", programId, "companies"],
    queryFn: () => getCompanies(programId),
  });
};
