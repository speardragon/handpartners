"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

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

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

/**
 * programId로 심사 라운드(judging_round) 조회
 */
export interface JudgingRoundPaginationResult {
  result: JudgingRoundRow[];
  total: number;
  currentPage: number;
  totalPages: number;
  size: number;
}
export async function getJudgingRoundsByProgramId(
  programId: number,
  page: number,
  size: number
): Promise<JudgingRoundPaginationResult> {
  const supabase = await createServerSupabaseClient();

  const start = (page - 1) * size;
  const end = start + (size - 1);

  const { data, error, count } = await supabase
    .from("judging_round")
    .select(
      `
      *,
      program:program_id (
        name
      )
      `,
      { count: "exact" }
    )
    .eq("program_id", programId)
    .range(start, end)
    .order("id", { ascending: false });

  if (error) {
    handleError(error);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / size);

  return {
    result: data ?? [],
    total,
    currentPage: page,
    totalPages,
    size,
  };
}

/**
 *
 * @param programId
 * @param companyId
 * @returns 심사 정보 가져오기(evaluation)
 */
export async function getJudgingRoundsByIds(
  programId: number,
  companyId: number
): Promise<JudgingRoundRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("judging_round")
    .select(
      `*,
      program: programId (
        name
      )
      `
    )
    .eq("program_id", programId)
    .eq("company_id", companyId);

  if (error) {
    handleError(error);
  }

  return data;
}

export async function createJudgingRound(judgingRound: JudgingRoundRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("judging_round").insert({
    ...judgingRound,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function updateJudgingRound(judgingRound: JudgingRoundRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("judging_round")
    .update({
      ...judgingRound,
    })
    .eq("id", judgingRound.id);

  if (error) {
    handleError(error);
  }

  return data;
}

export async function deleteJudgingRound(judgingRoundId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("judging_round")
    .delete()
    .eq("id", judgingRoundId);

  if (error) {
    handleError(error);
  }

  return data;
}

/** 심사 틀 가져오기 */
export interface JudgingRoundWithCriterias extends JudgingRoundRow {
  program: {
    name: string;
  };
  criterias: {
    id: number;
    judging_round_id: number;
    item_name: string;
    points: number;
    description: string;
  }[];
}
export async function getJudgeById(judgeRoundId: number): Promise<any> {
  const supabase = await createServerSupabaseClient();

  const { data: judgingRoundData, error: judgingRoundError } = await supabase
    .from("judging_round")
    .select(
      `*,
      program: program_id (
        name
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

  return {
    ...judgingRoundData,
    criterias: criteriasData || [],
  };
}

export interface JudgeCreateData {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}
export async function createJudge(programId, judgeData: JudgeCreateData) {
  const supabase = await createServerSupabaseClient();

  // 1) judge_round 생성
  const { data: judgeRoundData, error: judgeRoundError } = await supabase
    .from("judging_round")
    .insert({
      program_id: programId,
      name: judgeData.name,
      description: judgeData.description,
      start_date: judgeData.start_date || null,
      end_date: judgeData.end_date || null,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (judgeRoundError) {
    console.error("judge_round insert error", judgeRoundError);
    throw new Error(judgeRoundError.message);
  }

  return judgeRoundData;
}

// 폼에서 받게 될 전체 데이터 타입
// (심사의 기본 정보 + 참여 기업 + 참여 심사위원)
// export interface JudgeCreateData {
//   name?: string;
//   description?: string;
//   start_date?: string;
//   end_date?: string;
//   companies?: {
//     company_id?: number;
//     pdf_path?: string; // 필요한 경우
//     group_name?: string;
//   }[];
//   users?: {
//     user_id?: string;
//     group_name?: string;
//   }[];
// }
// /**
//  * judge_round를 생성하고, 이어서 judge_round_company, judge_round_user 테이블에 데이터 삽입
//  */
// export async function createJudge(
//   programId: number,
//   judgeData: JudgeCreateData
// ) {
//   const supabase = await createServerSupabaseClient();

//   // 1) judge_round 생성
//   const { data: judgeRoundData, error: judgeRoundError } = await supabase
//     .from("judging_round")
//     .insert({
//       program_id: programId,
//       name: judgeData.name,
//       description: judgeData.description,
//       start_date: judgeData.start_date || null,
//       end_date: judgeData.end_date || null,
//       created_at: new Date().toISOString(),
//     })
//     .select("id") // 생성된 judge_round의 id 반환
//     .single();

//   if (judgeRoundError) {
//     console.error("judge_round insert error", judgeRoundError);
//     throw new Error(judgeRoundError.message);
//   }

//   const judgingRoundId = judgeRoundData?.id;
//   if (!judgingRoundId) {
//     throw new Error("심사 라운드 생성에 실패했습니다.");
//   }

//   // 2) judge_round_company 생성
//   // group_name이 없으면 'A'로 처리
//   if (judgeData.companies && judgeData.companies.length > 0) {
//     const companiesPayload: JudgingRoundCompanyInsert[] =
//       judgeData.companies.map((c) => ({
//         company_id: c.company_id,
//         pdf_path: c.pdf_path || null,
//         group_name: c.group_name || "A",
//         judging_round_id: judgingRoundId,
//       }));

//     const { error: companyError } = await supabase
//       .from("judging_round_company")
//       .insert(companiesPayload);

//     if (companyError) {
//       console.error("judge_round_company insert error", companyError);
//       throw new Error(companyError.message);
//     }
//   }

//   // 3) judge_round_user 생성
//   // group_name이 없으면 'A'로 처리
//   if (judgeData.users && judgeData.users.length > 0) {
//     const usersPayload: JudgingRoundUserInsert[] = judgeData.users.map((u) => ({
//       user_id: u.user_id,
//       group_name: u.group_name || "A",
//       judging_round_id: judgingRoundId,
//     }));

//     const { error: userError } = await supabase
//       .from("judging_round_user")
//       .insert(usersPayload);

//     if (userError) {
//       console.error("judge_round_user insert error", userError);
//       throw new Error(userError.message);
//     }
//   }

//   return judgeRoundData;
// }
