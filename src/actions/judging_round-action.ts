"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type JudgingRoundRow =
  Database["public"]["Tables"]["judging_round"]["Row"];
export type JudgingRoundRowInsert =
  Database["public"]["Tables"]["judging_round"]["Insert"];
export type JudgingRoundRowUpdate =
  Database["public"]["Tables"]["judging_round"]["Update"];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
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
