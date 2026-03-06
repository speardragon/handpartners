"use server";

import { Database } from "types_db";
import { createClient } from "@/lib/supabase/server";
import { generateJudgingRoundId } from "@/lib/utils/judging-round-id";

export type JudgingRoundStatus =
  Database["public"]["Enums"]["judging_round_status"];

export type JudgingRoundRow =
  Database["public"]["Tables"]["judging_round"]["Row"];
export type JudgingRoundRowInsert =
  Database["public"]["Tables"]["judging_round"]["Insert"];
export type JudgingRoundRowUpdate =
  Database["public"]["Tables"]["judging_round"]["Update"];

export type JudgingRoundCompanyRow =
  Database["public"]["Tables"]["judging_round_company"]["Row"];
export type JudgingRoundCompanyInsert =
  Database["public"]["Tables"]["judging_round_company"]["Insert"];
export type JudgingRoundCompanyUpdate =
  Database["public"]["Tables"]["judging_round_company"]["Update"];

export type JudgingRoundUserRow =
  Database["public"]["Tables"]["judging_round_user"]["Row"];
export type JudgingRoundUserInsert =
  Database["public"]["Tables"]["judging_round_user"]["Insert"];
export type JudgingRoundUserUpdate =
  Database["public"]["Tables"]["judging_round_user"]["Update"];

function handleError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  throw new Error(message);
}

export interface JudgingProgramSummary {
  id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface JudgingRoundDisplayFields {
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface JudgingRoundWithCounts
  extends JudgingRoundRow, JudgingRoundDisplayFields {
  program: JudgingProgramSummary;
  number_of_companies: number;
  number_of_users: number;
}

function normalizeProgram(
  program: Partial<JudgingProgramSummary> | null | undefined
): JudgingProgramSummary {
  return {
    id: program?.id ?? 0,
    name: program?.name ?? "",
    description: program?.description ?? null,
    start_date: program?.start_date ?? null,
    end_date: program?.end_date ?? null,
  };
}

function withProgramDisplayFields<T extends { program: JudgingProgramSummary }>(
  round: T
): T & JudgingRoundDisplayFields {
  return {
    ...round,
    name: round.program.name,
    description: round.program.description,
    start_date: round.program.start_date,
    end_date: round.program.end_date,
  };
}

export async function ensureJudgingRoundForProgram(
  programId: number
): Promise<JudgingRoundRow> {
  const supabase = await createClient();

  const { data: existingRound, error: existingRoundError } = await supabase
    .from("judging_round")
    .select("*")
    .eq("program_id", programId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingRoundError) {
    handleError(existingRoundError);
  }

  if (existingRound) {
    return existingRound;
  }

  const { error: programError } = await supabase
    .from("program")
    .select("id")
    .eq("id", programId)
    .single();

  if (programError) {
    handleError(programError);
  }

  const { data: createdRound, error: createError } = await supabase
    .from("judging_round")
    .insert({
      id: generateJudgingRoundId(),
      program_id: programId,
      created_at: new Date().toISOString(),
      status: "PENDING",
    })
    .select("*")
    .single();

  if (createError) {
    handleError(createError);
  }

  return createdRound;
}

export async function getJudgingRoundByProgramId(
  programId: number
): Promise<JudgingRoundWithCounts> {
  const supabase = await createClient();

  const judgingRound = await ensureJudgingRoundForProgram(programId);

  const [{ data, error }, companyCountResult, userCountResult] =
    await Promise.all([
      supabase
        .from("judging_round")
        .select(
          `
          *,
          program:program_id (
            id,
            name,
            description,
            start_date,
            end_date
          )
        `
        )
        .eq("id", judgingRound.id)
        .single(),
      supabase
        .from("judging_round_company")
        .select("id", { count: "exact", head: true })
        .eq("judging_round_id", judgingRound.id),
      supabase
        .from("judging_round_user")
        .select("id", { count: "exact", head: true })
        .eq("judging_round_id", judgingRound.id),
    ]);

  if (error) {
    handleError(error);
  }

  if (companyCountResult.error) {
    handleError(companyCountResult.error);
  }

  if (userCountResult.error) {
    handleError(userCountResult.error);
  }

  return withProgramDisplayFields({
    ...data,
    program: normalizeProgram(
      data.program as unknown as JudgingProgramSummary | null
    ),
    number_of_companies: companyCountResult.count ?? 0,
    number_of_users: userCountResult.count ?? 0,
  });
}

export async function createJudgingRound(judgingRound: JudgingRoundRowInsert) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("judging_round").insert({
    ...judgingRound,
    id: generateJudgingRoundId(),
    created_at: new Date().toISOString(),
    status: judgingRound.status ?? "PENDING",
  });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function updateJudgingRound(judgingRound: JudgingRoundRowUpdate) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("judging_round")
    .update({
      ...judgingRound,
    })
    .eq("id", judgingRound.id!);

  if (error) {
    handleError(error);
  }

  return data;
}

export async function deleteJudgingRound(judgingRoundId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("judging_round")
    .delete()
    .eq("id", judgingRoundId);

  if (error) {
    handleError(error);
  }

  return data;
}

export async function updateJudgingRoundStatus(
  judgingRoundId: string,
  status: JudgingRoundStatus
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("judging_round")
    .update({ status })
    .eq("id", judgingRoundId);

  if (error) {
    handleError(error);
  }

  return data;
}

/** 심사 틀 가져오기 */
export interface JudgingRoundWithCriterias
  extends JudgingRoundRow, JudgingRoundDisplayFields {
  program: JudgingProgramSummary;
  criterias: {
    id: number;
    judging_round_id: string;
    item_name: string;
    points: number;
    description: string | null;
  }[];
}
export async function getJudgeById(
  judgeRoundId: string
): Promise<JudgingRoundWithCriterias | null> {
  const supabase = await createClient();

  const { data: judgingRoundData, error: judgingRoundError } = await supabase
    .from("judging_round")
    .select(
      `*,
      program: program_id (
        id,
        name,
        description,
        start_date,
        end_date
      )
      `
    )
    .eq("id", judgeRoundId)
    .single();

  if (judgingRoundError) {
    handleError(judgingRoundError);
  }

  if (!judgingRoundData) {
    return null;
  }

  // `evaluation_criteria` 정보를 가져옵니다.
  const { data: criteriasData, error: criteriasError } = await supabase
    .from("evaluation_criteria")
    .select("id, judging_round_id, item_name, points, description")
    .eq("judging_round_id", judgeRoundId);

  if (criteriasError) {
    handleError(criteriasError);
  }

  return withProgramDisplayFields({
    ...judgingRoundData,
    program: normalizeProgram(
      judgingRoundData.program as unknown as JudgingProgramSummary | null
    ),
    criterias: criteriasData || [],
  });
}

export type JudgingRoundDetail = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  program_name: string;
  program_description: string | null;
  criteriaList: {
    id: number;
    item_name: string;
    points: number;
  }[];
  companies: {
    company_id: number;
    company_name: string;
    description: string | null;
    // 한 기업에 대한 "모든 유저"의 평가
    evaluations: {
      user_id: string;
      username: string; // JOIN 결과
      feedback: string | null; // 해당 유저가 남긴 피드백(여러 criteria가 동일한 피드백이면 1번만 저장)
      criteriaScores: {
        evaluation_criterion_id: number;
        grade: number;
      }[];
    }[];
    totalScore: number; // 모든 유저, 모든 criteria grade 합
  }[];
};

export async function getJudgingRoundDetails(
  judgingRoundId: string
): Promise<JudgingRoundDetail> {
  const supabase = await createClient();

  // 1) 심사 라운드 기본 정보
  const { data: roundData, error: roundError } = await supabase
    .from("judging_round")
    .select(
      `
        id,
        program:program_id (
          name,
          description,
          start_date,
          end_date
        )
      `
    )
    .eq("id", judgingRoundId)
    .single();

  if (roundError || !roundData) {
    throw new Error(roundError?.message ?? "라운드 정보를 가져올 수 없습니다.");
  }

  // 2) 평가 기준 가져오기
  const { data: criteriaData, error: criteriaError } = await supabase
    .from("evaluation_criteria")
    .select("id, item_name, points")
    .eq("judging_round_id", judgingRoundId);

  if (criteriaError) {
    throw new Error(criteriaError.message);
  }

  // 3) 참여 기업 목록(judging_round_company)
  const { data: companyData, error: companyError } = await supabase
    .from("judging_round_company")
    .select(
      `
        company_id,
        company:company_id (
          name,
          description
        )
      `
    )
    .eq("judging_round_id", judgingRoundId);

  if (companyError) {
    throw new Error(companyError.message);
  }

  const companyList = (companyData ?? []).map((c) => {
    const company = c.company as unknown as {
      name: string;
      description: string | null;
    };
    return {
      company_id: c.company_id,
      company_name: company.name,
      description: company.description,
    };
  });

  // 4) evaluation(평가) JOIN user
  //    -> user:user_id (username)를 함께 가져온다.
  const { data: evaluations, error: evaluationError } = await supabase
    .from("evaluation")
    .select(
      `
        company_id,
        user_id,
        evaluation_criterion_id,
        grade,
        feedback,
        user:user_id (
          username
        )
      `
    )
    .eq("judging_round_id", judgingRoundId);

  if (evaluationError) {
    throw new Error(evaluationError.message);
  }

  // 5) 회사별로 evaluation 그룹핑 -> 유저 단위로 재그룹
  type UserEval = {
    user_id: string;
    username: string;
    feedback: string | null;
    criteriaScores: { evaluation_criterion_id: number; grade: number }[];
  };
  type CompanyEntry = {
    company_id: number;
    company_name: string;
    description: string | null;
    evaluations: UserEval[];
    totalScore: number;
  };
  const companyMap = new Map<number, CompanyEntry>();
  for (const comp of companyList) {
    companyMap.set(comp.company_id, {
      company_id: comp.company_id,
      company_name: comp.company_name,
      description: comp.description,
      evaluations: [],
      totalScore: 0,
    });
  }

  evaluations.forEach((evalItem) => {
    const companyEntry = companyMap.get(evalItem.company_id);
    if (!companyEntry) return;

    // 유저별로 그룹핑이 이미 되어 있는지 확인
    let userEval = companyEntry.evaluations.find(
      (u) => u.user_id === evalItem.user_id
    );
    if (!userEval) {
      // 없다면 새로 삽입
      userEval = {
        user_id: evalItem.user_id,
        username:
          (evalItem.user as unknown as { username: string })?.username ??
          "(이름 없음)",
        feedback: evalItem.feedback, // 동일한 피드백이 들어오므로 일단 첫 레코드 feedback만 저장
        criteriaScores: [],
      };
      companyEntry.evaluations.push(userEval);
    }

    // criteriaScores 추가
    userEval.criteriaScores.push({
      evaluation_criterion_id: evalItem.evaluation_criterion_id,
      grade: evalItem.grade,
    });

    // 총점 추가
    companyEntry.totalScore += evalItem.grade;
  });

  // 회사별 totalScore 내림차순 정렬
  const finalCompanies = Array.from(companyMap.values()).sort(
    (a, b) => b.totalScore - a.totalScore
  );

  const program = normalizeProgram(
    roundData.program as unknown as JudgingProgramSummary | null
  );

  return {
    id: roundData.id,
    name: program.name,
    start_date: program.start_date,
    end_date: program.end_date,
    program_name: program.name,
    program_description: program.description,
    criteriaList: criteriaData || [],
    companies: finalCompanies,
  };
}

/**
 * 주어진 judging_round_id를 기반으로
 * 회사별(Company.name) 모든 feedback을 배열 형태로 모아서 반환
 */
export async function getCompanyFeedbacksByRoundId(judging_round_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("evaluation")
    .select(
      `
      feedback,
      company:company_id (name)
    `
    )
    .eq("judging_round_id", judging_round_id);

  if (error) {
    console.error("getCompanyFeedbacksByRoundId error:", error);
    throw new Error(error.message);
  }

  // 회사별 피드백을 모으기 (중복 제거)
  const feedbackMap = new Map<string, Set<string>>();

  data?.forEach((row) => {
    const companyName = (row.company as unknown as { name: string })?.name;
    const feedback = row.feedback;

    if (!companyName || !feedback) return;

    if (!feedbackMap.has(companyName)) {
      feedbackMap.set(companyName, new Set<string>());
    }

    // 중복 제거를 위해 Set 사용
    feedbackMap.get(companyName)!.add(feedback);
  });

  // 최종 반환 구조
  // 회사마다 feedbacks: Set -> Array 로 변환
  return {
    companies: Array.from(feedbackMap.entries()).map(([name, feedbackSet]) => ({
      name,
      feedbacks: Array.from(feedbackSet),
    })),
  };
}

export interface JudgingRow {
  judgingUserName: string; // 심사자 이름
  score: number;
}

export interface CompanyScoreResult {
  name: string; // 회사명
  judgings: JudgingRow[]; // [{judgingUserName, score}, ...]
  totalScore: number;
  avgScore: number;
  ranking: number; // totalScore 내림차순 순위
}
/**
 * 주어진 judging_round_id에 대해
 * 회사별 (심사자별 점수 합, totalScore, 평균, 순위)를 구해 반환
 */
export async function getCompanyScoresByRoundId(
  judging_round_id: string
): Promise<{ companies: CompanyScoreResult[] }> {
  const supabase = await createClient();

  // 1) evaluation + company + user 조인
  // - grade: 심사 기준별 점수
  // - company:company_id ( name )
  // - user:user_id ( username )
  //
  // DB 스키마상 user 테이블에는 username 필드가 존재하므로,
  // select("..., user:user_id(username)") 형태로 조인
  const { data: evaluationRows, error } = await supabase
    .from("evaluation")
    .select(
      `
        grade,
        company:company_id ( name ),
        user:user_id ( username )
      `
    )
    .eq("judging_round_id", judging_round_id);

  if (error) {
    console.error("getCompanyScoresByRoundId error:", error);
    throw new Error(error.message);
  }

  /**
   * evaluationRows 예시:
   * [
   *   {
   *     grade: 10,
   *     company: { name: "A기업" },
   *     user: { username: "judge1" }
   *   },
   *   {
   *     grade: 15,
   *     company: { name: "A기업" },
   *     user: { username: "judge1" }
   *   },
   *   {
   *     grade: 12,
   *     company: { name: "A기업" },
   *     user: { username: "judge2" }
   *   },
   *   {
   *     grade: 20,
   *     company: { name: "B기업" },
   *     user: { username: "judge1" }
   *   },
   *   ...
   * ]
   *
   * => 같은 (company, user)에 대해서 여러 행 존재 (심사 기준별)
   * => (company, user)별로 grade 합산 필요
   */

  // 2) (companyName) -> (userName -> grade 합산) 구조로 일단 그룹화
  const companyMap = new Map<
    string, // company name
    Map<string, number> // userName -> sumOfGrades
  >();

  evaluationRows?.forEach((row) => {
    const companyName = (row.company as unknown as { name: string })?.name;
    const userName = (row.user as unknown as { username: string })?.username;
    const grade = row.grade;

    // 유효성 체크
    if (!companyName || !userName || grade == null) {
      return; // 누락 데이터는 무시
    }

    // 회사명이 없으면 생성
    if (!companyMap.has(companyName)) {
      companyMap.set(companyName, new Map<string, number>());
    }

    const userScoreMap = companyMap.get(companyName)!;
    // userName이 없으면 0으로 초기화
    if (!userScoreMap.has(userName)) {
      userScoreMap.set(userName, 0);
    }

    // grade 누적
    userScoreMap.set(userName, userScoreMap.get(userName)! + grade);
  });

  // 3) 이제 companyMap을 순회하며 최종 CompanyScoreResult 계산
  let companiesArray: CompanyScoreResult[] = [];

  companyMap.forEach((userScoreMap, companyName) => {
    let totalScore = 0;
    const judgings: JudgingRow[] = [];

    // (userName -> score) 순회
    userScoreMap.forEach((score, userName) => {
      judgings.push({
        judgingUserName: userName,
        score,
      });
      totalScore += score;
    });

    // 평균(= totalScore / 심사자 수)
    const nonZeroCount = judgings.filter((j) => j.score !== 0).length;
    const avgScore = nonZeroCount > 0 ? totalScore / nonZeroCount : 0;

    companiesArray.push({
      name: companyName,
      judgings,
      totalScore,
      avgScore,
      ranking: 0, // 일단 0으로 초기화, 뒤에서 부여
    });
  });

  // 4) totalScore 내림차순 정렬 & 동순위 처리
  companiesArray.sort((a, b) => b.totalScore - a.totalScore);

  companiesArray.forEach((company, index) => {
    if (index === 0) {
      company.ranking = 1;
    } else {
      company.ranking =
        company.totalScore === companiesArray[index - 1].totalScore
          ? companiesArray[index - 1].ranking
          : index + 1;
    }
  });

  // 5) 반환
  return { companies: companiesArray };
}
