import { createClient } from "@/lib/supabase/server";

type RoundRow = {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  program: {
    id: number;
    name: string;
    start_date: string | null;
    end_date: string | null;
  } | null;
};

type CompanyRow = {
  judging_round_id: string;
  company_id: number;
  company: {
    name: string;
  } | null;
};

type UserRow = {
  judging_round_id: string;
  user_id: string;
};

type CriteriaRow = {
  judging_round_id: string;
  id: number;
};

type EvaluationRow = {
  judging_round_id: string;
  company_id: number;
  user_id: string | null;
  evaluation_criterion_id: number;
  feedback: string | null;
};

export type DashboardOverview = {
  inProgressPrograms: number;
  totalCompanies: number;
  completedCompanies: number;
  pendingCompanies: number;
  feedbackMissingCount: number;
};

export type ProgramDashboardRow = {
  judgingRoundId: string;
  programId: number;
  programName: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  totalCompanies: number;
  completedCompanies: number;
  pendingCompanies: number;
  completionRate: number;
  feedbackMissingCount: number;
};

export type PendingCompanyRow = {
  judgingRoundId: string;
  programName: string;
  companyId: number;
  companyName: string;
  assignedJudges: number;
  completedJudges: number;
  completionRate: number;
  feedbackMissing: boolean;
  statusLabel: string;
};

function statusLabel(status: RoundRow["status"]) {
  switch (status) {
    case "COMPLETED":
      return "완료";
    case "IN_PROGRESS":
      return "진행 중";
    default:
      return "대기";
  }
}

function getProgramStatusMeta(status: RoundRow["status"]) {
  switch (status) {
    case "COMPLETED":
      return { label: "완료", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "IN_PROGRESS":
      return { label: "진행 중", className: "bg-blue-50 text-blue-700 border-blue-200" };
    default:
      return { label: "대기", className: "bg-neutral-100 text-neutral-700 border-neutral-200" };
  }
}

export function getProgramStatusBadge(status: RoundRow["status"]) {
  return getProgramStatusMeta(status);
}

async function fetchDashboardBaseData() {
  const supabase = await createClient();

  const [roundsResult, companiesResult, usersResult, criteriaResult, evaluationsResult] =
    await Promise.all([
      supabase.from("judging_round").select(`id, status, program:program_id ( id, name, start_date, end_date )`),
      supabase.from("judging_round_company").select(`judging_round_id, company_id, company:company_id ( name )`),
      supabase.from("judging_round_user").select("judging_round_id, user_id"),
      supabase.from("evaluation_criteria").select("judging_round_id, id"),
      supabase.from("evaluation").select("judging_round_id, company_id, user_id, evaluation_criterion_id, feedback"),
    ]);

  if (roundsResult.error) throw new Error(roundsResult.error.message);
  if (companiesResult.error) throw new Error(companiesResult.error.message);
  if (usersResult.error) throw new Error(usersResult.error.message);
  if (criteriaResult.error) throw new Error(criteriaResult.error.message);
  if (evaluationsResult.error) throw new Error(evaluationsResult.error.message);

  return {
    rounds: (roundsResult.data ?? []) as unknown as RoundRow[],
    companies: (companiesResult.data ?? []) as unknown as CompanyRow[],
    users: (usersResult.data ?? []) as UserRow[],
    criteria: (criteriaResult.data ?? []) as CriteriaRow[],
    evaluations: (evaluationsResult.data ?? []) as EvaluationRow[],
  };
}

function buildAggregates() {
  return fetchDashboardBaseData().then(({ rounds, companies, users, criteria, evaluations }) => {
    const companiesByRound = new Map<string, CompanyRow[]>();
    for (const company of companies) {
      const list = companiesByRound.get(company.judging_round_id) ?? [];
      list.push(company);
      companiesByRound.set(company.judging_round_id, list);
    }

    const usersByRound = new Map<string, Set<string>>();
    for (const user of users) {
      const set = usersByRound.get(user.judging_round_id) ?? new Set<string>();
      set.add(user.user_id);
      usersByRound.set(user.judging_round_id, set);
    }

    const criteriaCountByRound = new Map<string, number>();
    for (const criterion of criteria) {
      criteriaCountByRound.set(
        criterion.judging_round_id,
        (criteriaCountByRound.get(criterion.judging_round_id) ?? 0) + 1
      );
    }

    const evalCountByRoundCompany = new Map<string, number>();
    const judgeSetByRoundCompany = new Map<string, Set<string>>();
    const feedbackCountByRoundCompany = new Map<string, number>();

    for (const evaluation of evaluations) {
      const key = `${evaluation.judging_round_id}:${evaluation.company_id}`;
      evalCountByRoundCompany.set(key, (evalCountByRoundCompany.get(key) ?? 0) + 1);

      if (evaluation.user_id) {
        const judgeSet = judgeSetByRoundCompany.get(key) ?? new Set<string>();
        judgeSet.add(evaluation.user_id);
        judgeSetByRoundCompany.set(key, judgeSet);
      }

      if (evaluation.feedback && evaluation.feedback.trim().length > 0) {
        feedbackCountByRoundCompany.set(key, (feedbackCountByRoundCompany.get(key) ?? 0) + 1);
      }
    }

    const programRows: ProgramDashboardRow[] = rounds
      .map((round) => {
        const roundCompanies = companiesByRound.get(round.id) ?? [];
        const assignedJudges = usersByRound.get(round.id)?.size ?? 0;
        const criteriaCount = criteriaCountByRound.get(round.id) ?? 0;
        const expectedEvaluationCountPerCompany = assignedJudges * criteriaCount;

        let completedCompanies = 0;
        let feedbackMissingCount = 0;

        for (const company of roundCompanies) {
          const key = `${round.id}:${company.company_id}`;
          const evaluationCount = evalCountByRoundCompany.get(key) ?? 0;
          const judgeCount = judgeSetByRoundCompany.get(key)?.size ?? 0;
          const feedbackCount = feedbackCountByRoundCompany.get(key) ?? 0;

          const isCompleted =
            expectedEvaluationCountPerCompany > 0
              ? evaluationCount >= expectedEvaluationCountPerCompany
              : judgeCount > 0;

          if (isCompleted) {
            completedCompanies += 1;
          }

          const feedbackExpected = assignedJudges > 0 ? assignedJudges : judgeCount;
          if (judgeCount > 0 && feedbackCount < feedbackExpected) {
            feedbackMissingCount += 1;
          }
        }

        const pendingCompanies = Math.max(roundCompanies.length - completedCompanies, 0);
        const completionRate = roundCompanies.length === 0 ? 0 : Math.round((completedCompanies / roundCompanies.length) * 100);

        return {
          judgingRoundId: round.id,
          programId: round.program?.id ?? 0,
          programName: round.program?.name ?? "이름 없는 프로그램",
          status: round.status,
          totalCompanies: roundCompanies.length,
          completedCompanies,
          pendingCompanies,
          completionRate,
          feedbackMissingCount,
        };
      })
      .sort((a, b) => {
        if (b.pendingCompanies !== a.pendingCompanies) return b.pendingCompanies - a.pendingCompanies;
        return a.programName.localeCompare(b.programName, "ko");
      });

    const pendingCompaniesRows: PendingCompanyRow[] = [];

    for (const round of rounds) {
      const roundCompanies = companiesByRound.get(round.id) ?? [];
      const assignedJudges = usersByRound.get(round.id)?.size ?? 0;
      const criteriaCount = criteriaCountByRound.get(round.id) ?? 0;
      const expectedEvaluationCountPerCompany = assignedJudges * criteriaCount;

      for (const company of roundCompanies) {
        const key = `${round.id}:${company.company_id}`;
        const evaluationCount = evalCountByRoundCompany.get(key) ?? 0;
        const completedJudges = judgeSetByRoundCompany.get(key)?.size ?? 0;
        const feedbackCount = feedbackCountByRoundCompany.get(key) ?? 0;
        const feedbackExpected = assignedJudges > 0 ? assignedJudges : completedJudges;
        const isComplete =
          expectedEvaluationCountPerCompany > 0
            ? evaluationCount >= expectedEvaluationCountPerCompany
            : completedJudges > 0;
        const feedbackMissing = completedJudges > 0 && feedbackCount < feedbackExpected;

        if (!isComplete || feedbackMissing) {
          const completionRate = assignedJudges === 0 ? 0 : Math.round((completedJudges / assignedJudges) * 100);
          pendingCompaniesRows.push({
            judgingRoundId: round.id,
            programName: round.program?.name ?? "이름 없는 프로그램",
            companyId: company.company_id,
            companyName: company.company?.name ?? "이름 없는 기업",
            assignedJudges,
            completedJudges,
            completionRate,
            feedbackMissing,
            statusLabel: !isComplete
              ? completedJudges === 0
                ? "미평가"
                : "진행 중"
              : "피드백 누락",
          });
        }
      }
    }

    pendingCompaniesRows.sort((a, b) => {
      if (a.feedbackMissing !== b.feedbackMissing) return Number(b.feedbackMissing) - Number(a.feedbackMissing);
      if (a.completionRate !== b.completionRate) return a.completionRate - b.completionRate;
      return a.programName.localeCompare(b.programName, "ko");
    });

    const overview: DashboardOverview = {
      inProgressPrograms: programRows.filter((row) => row.status === "IN_PROGRESS").length,
      totalCompanies: programRows.reduce((sum, row) => sum + row.totalCompanies, 0),
      completedCompanies: programRows.reduce((sum, row) => sum + row.completedCompanies, 0),
      pendingCompanies: programRows.reduce((sum, row) => sum + row.pendingCompanies, 0),
      feedbackMissingCount: programRows.reduce((sum, row) => sum + row.feedbackMissingCount, 0),
    };

    return { overview, programRows, pendingCompaniesRows };
  });
}

export async function getDashboardOverview() {
  return (await buildAggregates()).overview;
}

export async function getProgramDashboardRows() {
  return (await buildAggregates()).programRows;
}

export async function getPendingCompanyRows() {
  return (await buildAggregates()).pendingCompaniesRows;
}

export { statusLabel };
