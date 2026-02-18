import { getProgramCompanies, ProgramCompanyRow } from "@/actions/program-company-action";
import { useQuery } from "@tanstack/react-query";

interface ProgramCompanyResult extends ProgramCompanyRow {
  company: { name: string };
}
export const useProgramCompanyQuery = (programId: number) => {
  return useQuery<ProgramCompanyResult[]>({
    queryKey: ["programs", programId, "companies"],
    queryFn: () => getProgramCompanies(programId) as Promise<ProgramCompanyResult[]>,
  });
};
