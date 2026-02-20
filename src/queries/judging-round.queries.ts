import { queryOptions } from "@tanstack/react-query";
import {
  getJudgingRoundsByProgramId,
  getJudgingRoundDetails,
  getJudgeById,
  getCompanyScoresByRoundId,
  getCompanyFeedbacksByRoundId,
} from "@/actions/judging_round-action";
import {
  getJudgingRoundCompaniesById,
  getJudgingRoundCompaniesPublic,
} from "@/actions/judging_rounds_company-action";
import { getJudgingRoundUsersById } from "@/actions/judging_round_user-action";
import { getJudgingCriteriaByRound } from "@/actions/evaluation_criteria-action";

export const judgingRoundQueries = {
  all: () => ["judging_rounds"] as const,

  byProgram: (
    programId: number,
    pagination: { pageIndex: number; pageSize: number }
  ) =>
    queryOptions({
      queryKey: [...judgingRoundQueries.all(), programId, pagination] as const,
      queryFn: () =>
        getJudgingRoundsByProgramId(
          programId,
          pagination.pageIndex + 1,
          pagination.pageSize
        ),
    }),
  detail: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [
        ...judgingRoundQueries.all(),
        judgingRoundId,
        "detail",
      ] as const,
      queryFn: () => getJudgingRoundDetails(judgingRoundId),
    }),
  judge: (judgeRoundId: string) =>
    queryOptions({
      queryKey: [...judgingRoundQueries.all(), judgeRoundId, "judge"] as const,
      queryFn: () => getJudgeById(judgeRoundId),
    }),
  scores: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [
        ...judgingRoundQueries.all(),
        judgingRoundId,
        "scores",
      ] as const,
      queryFn: () => getCompanyScoresByRoundId(judgingRoundId),
    }),
  feedbacks: (judgingRoundId: string) =>
    queryOptions({
      queryKey: [
        ...judgingRoundQueries.all(),
        judgingRoundId,
        "feedbacks",
      ] as const,
      queryFn: () => getCompanyFeedbacksByRoundId(judgingRoundId),
    }),

  companies: {
    all: () => ["judging_round_companies"] as const,
    byRound: (judgingRoundId: string) =>
      queryOptions({
        queryKey: [
          ...judgingRoundQueries.companies.all(),
          judgingRoundId,
        ] as const,
        queryFn: () => getJudgingRoundCompaniesById(judgingRoundId),
      }),
    public: (judgingRoundId: string) =>
      queryOptions({
        queryKey: [
          ...judgingRoundQueries.companies.all(),
          "public",
          judgingRoundId,
        ] as const,
        queryFn: () => getJudgingRoundCompaniesPublic(judgingRoundId),
      }),
  },
  users: {
    all: () => ["judging_round_users"] as const,
    byRound: (judgingRoundId: string) =>
      queryOptions({
        queryKey: [...judgingRoundQueries.users.all(), judgingRoundId] as const,
        queryFn: () => getJudgingRoundUsersById(judgingRoundId),
      }),
  },
  criteria: {
    all: () => ["judging_round_criteria"] as const,
    byRound: (judgingRoundId: string) =>
      queryOptions({
        queryKey: [
          ...judgingRoundQueries.criteria.all(),
          judgingRoundId,
        ] as const,
        queryFn: () => getJudgingCriteriaByRound(judgingRoundId),
      }),
  },
};
