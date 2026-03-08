"use server";

import { Database } from "types_db";
import { raiseActionError, withActionResult } from "@/lib/action";
import { createClient } from "@/lib/supabase/server";
import { createPresignedDownloadUrl } from "@/lib/storage/s3";
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
  judgeRoundId: string,
  companyId: number,
  data: EvaluationUpsert[]
) {
  return withActionResult(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

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
      raiseActionError(
        new Error(`Failed to save evaluations: ${evaluationError.message}`)
      );
    }

    return result;
  });
}

type EvaluationRecord = {
  id: number;
  judging_round_id: string;
  company_id: number;
  evaluation_criterion_id: number;
  grade: number;
  user_id: string;
  created_at: string;
  feedback: string | null;
  status: string | null;
};
export async function getEvaluationByUser(
  judgeRoundId: string,
  companyId: number
): Promise<{ evaluations: EvaluationRecord[]; pdfPath: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // 평가 데이터 가져오기
  const { data: evaluations, error: evaluationError } = await supabase
    .from("evaluation")
    .select("*")
    .eq("judging_round_id", judgeRoundId)
    .eq("company_id", companyId)
    .eq("user_id", userId);

  if (evaluationError) {
    raiseActionError(evaluationError);
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
    raiseActionError(companyError);
    // throw new Error(
    //   `Failed to fetch judging_round_company data: ${companyError.message}`
    // );
  }

  // pdf_path 추출
  let pdfPath: string | null = null;
  if (judgingRoundCompany?.pdf_path) {
    try {
      const { downloadUrl } = await createPresignedDownloadUrl({
        objectPathOrUrl: judgingRoundCompany.pdf_path,
      });
      pdfPath = downloadUrl;
    } catch (error) {
      console.error("PDF path generation failed:", error);
    }
  }

  return { evaluations: evaluations || [], pdfPath };
}

export async function getDetailedEvaluationsByUser(
  judgingRoundId: string
): Promise<FinalResult[]> {
  const supabase = await createClient();

  // 1. 인증된 사용자 ID 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // 2. 사용자 프로필 정보 가져오기
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("username, affiliation, position, signature_url")
    .eq("id", userId)
    .single();

  if (userError) {
    raiseActionError(userError);
  }

  let signaturePresignedUrl: string | null = null;
  if (userData!.signature_url) {
    try {
      const { downloadUrl } = await createPresignedDownloadUrl({
        objectPathOrUrl: userData!.signature_url,
        expiresInSeconds: 600,
      });
      signaturePresignedUrl = downloadUrl;
    } catch {
      signaturePresignedUrl = null;
    }
  }
  const userProfile: UserProfile = {
    name: userData!.username,
    affiliation: userData!.affiliation,
    position: userData!.position,
    signature_url: signaturePresignedUrl,
  };

  // 3. 사용자의 group_name 가져오기
  const { data: jru, error: jruError } = await supabase
    .from("judging_round_user")
    .select("group_name")
    .eq("judging_round_id", judgingRoundId)
    .eq("user_id", userId)
    .single();

  if (jruError) {
    if (jruError.code === "PGRST116") {
      return [];
    }
    raiseActionError(jruError);
  }

  const userGroupName = jru!.group_name;

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

  const companyIds = jrc?.map((c) => c.company_id) ?? [];

  // 회사가 없으면 빈 배열 반환
  if (companyIds.length === 0) {
    return [];
  }

  type EvalJoinRow = {
    grade: number;
    feedback: string | null;
    company: { name: string; description: string | null } | null;
    evaluation_criterion: {
      item_name: string;
      description: string | null;
      points: number;
    } | null;
  };

  // 3. 평가 데이터 가져오기 (evaluation + company + evaluation_criteria)
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

  // 4. company_id 별로 그룹화하기
  const resultMap = new Map<
    string,
    { company: CompanyInfo; evaluations: EvaluationItem[] }
  >();

  for (const evalItem of (evaluations as unknown as EvalJoinRow[]) || []) {
    if (!evalItem.company || !evalItem.evaluation_criterion) continue;
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

/**
 * 특정 userId의 평가 데이터를 조회하는 함수 (관리자용)
 */
export async function getDetailedEvaluationsByUserId(
  judgingRoundId: string,
  userId: string
): Promise<FinalResult[]> {
  const supabase = await createClient();

  // 사용자 프로필 정보
  const { data: userData, error: userError } = await supabase
    .from("user")
    .select("username, affiliation, position, signature_url")
    .eq("id", userId)
    .single();

  if (userError) {
    raiseActionError(userError);
  }

  let signaturePresignedUrl2: string | null = null;
  if (userData!.signature_url) {
    try {
      const { downloadUrl } = await createPresignedDownloadUrl({
        objectPathOrUrl: userData!.signature_url,
      });
      signaturePresignedUrl2 = downloadUrl;
    } catch {
      signaturePresignedUrl2 = null;
    }
  }
  const userProfile: UserProfile = {
    name: userData!.username,
    affiliation: userData!.affiliation,
    position: userData!.position,
    signature_url: signaturePresignedUrl2,
  };

  // group_name 가져오기
  const { data: jru, error: jruError } = await supabase
    .from("judging_round_user")
    .select("group_name")
    .eq("judging_round_id", judgingRoundId)
    .eq("user_id", userId)
    .single();

  if (jruError) {
    raiseActionError(jruError);
  }

  const userGroupName = jru!.group_name;

  // 해당 group_name의 company_id 목록
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

  const companyIds = jrc?.map((c) => c.company_id) ?? [];

  if (companyIds.length === 0) {
    return [];
  }

  type EvalJoinRow2 = {
    grade: number;
    feedback: string | null;
    company: { name: string; description: string | null } | null;
    evaluation_criterion: {
      item_name: string;
      description: string | null;
      points: number;
    } | null;
  };

  // 평가 데이터 조회
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

  const resultMap = new Map<
    string,
    { company: CompanyInfo; evaluations: EvaluationItem[] }
  >();

  for (const evalItem of (evaluations as unknown as EvalJoinRow2[]) || []) {
    if (!evalItem.company || !evalItem.evaluation_criterion) continue;
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

export type JudgeEvaluationResult = {
  userId: string;
  username: string;
  evaluations: FinalResult[];
};

/**
 * 해당 라운드의 모든 심사자 평가 데이터를 조회하는 함수 (관리자용)
 */
export async function getAllJudgeEvaluations(
  judgingRoundId: string
){
  return withActionResult(async () => {
    const supabase = await createClient();

    const { data: judges, error: judgesError } = await supabase
      .from("judging_round_user")
      .select("user_id, user:user_id(username)")
      .eq("judging_round_id", judgingRoundId);

    if (judgesError) {
      raiseActionError(`Failed to fetch judges: ${judgesError.message}`);
    }

    const results: JudgeEvaluationResult[] = [];

    for (const judge of judges as unknown as {
      user_id: string;
      user: { username: string } | null;
    }[]) {
      const evaluations = await getDetailedEvaluationsByUserId(
        judgingRoundId,
        judge.user_id
      );

      results.push({
        userId: judge.user_id,
        username: judge.user?.username ?? "(이름 없음)",
        evaluations,
      });
    }

    return results;
  });
}
