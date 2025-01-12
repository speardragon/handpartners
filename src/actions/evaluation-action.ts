"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";
import {
  CompanyInfo,
  EvaluationItem,
  FinalResult,
  UserProfile,
} from "@/types/evaluation-type";

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
    handleError(evaluationError);
    // throw new Error(`Failed to fetch evaluations: ${evaluationError.message}`);
  }

  // judging_round_company의 pdf_path 가져오기
  const { data: judgingRoundCompany, error: companyError } = await supabase
    .from("judging_round_company")
    .select("pdf_path")
    .eq("judging_round_id", judgeRoundId)
    .eq("company_id", companyId)
    .single(); // 단일 결과 반환

  if (companyError) {
    handleError(companyError);
    // throw new Error(
    //   `Failed to fetch judging_round_company data: ${companyError.message}`
    // );
  }

  // pdf_path 추출
  const pdfPath = judgingRoundCompany?.pdf_path || null;

  return { evaluations: evaluations || [], pdfPath };
}

export async function getDetailedEvaluationsByUser(
  judgingRoundId: number
): Promise<FinalResult[]> {
  const supabase = await createServerSupabaseClient();

  // 1. 세션을 통해 현재 사용자 ID 가져오기
  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // 2. 사용자 프로필 정보 가져오기
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("username, affiliation, position")
    .eq("id", userId)
    .single();

  if (userError) {
    handleError(userError);
    throw new Error(`Failed to fetch user profile: ${userError.message}`);
  }

  const userProfile: UserProfile = {
    name: userData.username,
    affiliation: userData.affiliation,
    position: userData.position,
  };

  // 3. 사용자의 group_name 가져오기
  const { data: jru, error: jruError } = await supabase
    .from("judging_round_user")
    .select("group_name")
    .eq("judging_round_id", judgingRoundId)
    .eq("user_id", userId)
    .single();

  if (jruError) {
    handleError(jruError);
    throw new Error(`Failed to fetch judging_round_user: ${jruError.message}`);
  }

  const jruData = jru as any;
  const userGroupName = jruData.group_name;

  // 4. 해당 group_name에 해당하는 company_id 목록 가져오기
  const { data: jrc, error: jrcError } = await supabase
    .from("judging_round_company")
    .select("company_id, group_name")
    .eq("judging_round_id", judgingRoundId)
    .eq("group_name", userGroupName);

  if (jrcError) {
    throw new Error(
      `Failed to fetch judging_round_company: ${jrcError.message}`
    );
  }

  const jrcData = jrc as any;
  const companyIds = jrcData?.map((c) => c.company_id) || [];

  // 회사가 없으면 빈 배열 반환
  if (companyIds.length === 0) {
    return [];
  }

  // 3. 평가 데이터 가져오기 (evaluation + company + evaluation_criteria)
  // 관계 설정이 되어 있다고 가정하고, 다음과 같이 조인하여 데이터 가져옴.
  const { data: evaluations, error: evaluationsError } = await supabase
    .from("evaluation")
    .select(
      `
      grade,
      feedback,
      company:company_id(name, description),
      evaluation_criterion:evaluation_criterion_id(item_name, description, points)
    `
    )
    .eq("judging_round_id", judgingRoundId)
    .eq("user_id", userId)
    .in("company_id", companyIds);

  if (evaluationsError) {
    throw new Error(`Failed to fetch evaluations: ${evaluationsError.message}`);
  }

  // evaluationsData는 다음과 같은 형태의 배열:
  // [
  //   {
  //     grade: number,
  //     feedback: string|null,
  //     company: { name: string, description: string|null },
  //     evaluation_criterion: { item_name: string, description: string|null, points: number }
  //   },
  //   ...
  // ]

  // 4. company_id 별로 그룹화하기
  // 위 select 구조 상 company와 evaluation_criterion을 직접 받았으므로,
  // company를 key로 그룹화해야 한다. company의 name, description으로 그룹화 가능.
  // (참고: 실제로는 id를 함께 가져와 그룹화하는 것이 안정적이나, 위 select에서는 id를 직접 가져오지 않았으므로 name 기반으로 그룹)
  const resultMap = new Map<
    string,
    { company: CompanyInfo; evaluations: EvaluationItem[] }
  >();

  const evaluationsData = evaluations as any;

  for (const evalItem of evaluationsData || []) {
    const companyKey = `${evalItem.company.name}`;

    if (!resultMap.has(companyKey)) {
      resultMap.set(companyKey, {
        company: {
          name: evalItem.company.name,
          description: evalItem.company.description,
        },
        evaluations: [],
      });
    }

    const currentGroup = resultMap.get(companyKey)!;
    currentGroup.evaluations.push({
      evaluation_criterion: {
        item_name: evalItem.evaluation_criterion.item_name,
        description: evalItem.evaluation_criterion.description,
        points: evalItem.evaluation_criterion.points,
      },
      grade: evalItem.grade,
      feedback: evalItem.feedback,
    });
  }

  // 5. 최종 결과 형태 만들기
  // 각 company 그룹에 user_profile 추가
  const finalResult: FinalResult[] = [];
  for (const [, value] of resultMap) {
    finalResult.push({
      company: value.company,
      evaluations: value.evaluations,
      user_profile: userProfile,
    });
  }

  return finalResult;
}
