"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type EvaluationRow = Database["public"]["Tables"]["evaluation"]["Row"];
export type EvaluationRowInsert =
  Database["public"]["Tables"]["evaluation"]["Insert"];
export type EvaluationRowUpdate =
  Database["public"]["Tables"]["evaluation"]["Update"];

function handleError(error: any) {
  console.error("Database error:", error.message);
  throw new Error(error.message);
}

/**
 * 평가 데이터를 저장하는 함수
 * @param data - 평가 데이터 배열 (evaluation 테이블 구조)
 * @returns 저장된 평가 데이터
 */
type EvaluationUpsert = {
  evaluation_criterion_id: number;
  grade: number;
  status: string;
  feedback: string;
  created_at: string;
};
export async function createEvaluation(
  judgeRoundId: number,
  companyId: number,
  data: EvaluationUpsert[]
) {
  const supabase = await createServerSupabaseClient();

  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;

  // Upsert 데이터에 user_id, judgeRoundId, companyId 추가
  const dataWithKeys = data.map((item) => ({
    ...item,
    judging_round_id: judgeRoundId,
    company_id: companyId,
    user_id: userId,
  }));

  const { error: evaluationError, data: result } = await supabase
    .from("evaluation")
    .upsert(dataWithKeys, {
      onConflict:
        "judging_round_id, company_id, user_id, evaluation_criterion_id",
    })
    .select();

  if (evaluationError) {
    throw new Error(`Failed to save evaluations: ${evaluationError.message}`);
  }

  return result;
}

type EvaluationRecord = {
  id: number;
  judging_round_id: number;
  company_id: number;
  evaluation_criterion_id: number;
  grade: number;
  user_id: string;
  created_at: string;
  feedback: string;
};
export async function getEvaluationByUser(
  judgeRoundId: number,
  companyId: number
): Promise<{ evaluations: EvaluationRecord[]; pdfPath: string | null }> {
  const supabase = await createServerSupabaseClient();

  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;

  // 평가 데이터 가져오기
  const { data: evaluations, error: evaluationError } = await supabase
    .from("evaluation")
    .select("*")
    .eq("judging_round_id", judgeRoundId)
    .eq("company_id", companyId)
    .eq("user_id", userId);

  if (evaluationError) {
    throw new Error(`Failed to fetch evaluations: ${evaluationError.message}`);
  }

  // judging_round_company의 pdf_path 가져오기
  const { data: judgingRoundCompany, error: companyError } = await supabase
    .from("judging_round_company")
    .select("pdf_path")
    .eq("judging_round_id", judgeRoundId)
    .eq("company_id", companyId)
    .single(); // 단일 결과 반환

  if (companyError) {
    throw new Error(
      `Failed to fetch judging_round_company data: ${companyError.message}`
    );
  }

  // pdf_path 추출
  const pdfPath = judgingRoundCompany?.pdf_path || null;

  return { evaluations: evaluations || [], pdfPath };
}
