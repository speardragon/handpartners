"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type ProgramCompanyRow =
  Database["public"]["Tables"]["program_company"]["Row"];
type ProgramRowUpdate = Database["public"]["Tables"]["program"]["Update"];

function handleError(error: any) {
  console.error(error);
  throw new Error(error.message);
}

/**
 * 특정 program_id에 해당하는 program_company 레코드를 모두 조회
 */
export async function getProgramCompanies(
  programId: number
): Promise<ProgramCompanyRow[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("program_company")
    .select(
      `
      *,
      company:company_id(name)
      `
    )
    .eq("program_id", programId);

  if (error) {
    handleError(error);
  }

  // data가 null인 경우 빈 배열 반환
  return data ?? [];
}

/**
 * 1) program 테이블 업데이트
 * 2) program_company 테이블에서 해당 program_id 기존 레코드 삭제
 * 3) 새로 받은 companyIds로 program_company 레코드 삽입
 */
export async function updateProgramAndCompanies(
  programId: number,
  programData: ProgramRowUpdate,
  companyIds: number[]
) {
  const supabase = await createServerSupabaseClient();

  // 1) program 업데이트
  const { error: programError } = await supabase
    .from("program")
    .update(programData)
    .eq("id", programId);

  if (programError) {
    handleError(programError);
  }

  // 2) program_company 기존 레코드 삭제
  const { error: deleteError } = await supabase
    .from("program_company")
    .delete()
    .eq("program_id", programId);

  if (deleteError) {
    handleError(deleteError);
  }

  // 3) program_company 재삽입
  if (companyIds.length > 0) {
    const inserts = companyIds.map((cid) => ({
      program_id: programId,
      company_id: cid,
      created_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("program_company")
      .insert(inserts);

    if (insertError) {
      handleError(insertError);
    }
  }

  return { success: true };
}
