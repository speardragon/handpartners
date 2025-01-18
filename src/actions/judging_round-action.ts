"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

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
interface JudgingRound extends JudgingRoundRow {
  program: { name: string };
}
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

  // 만약 데이터가 없으면 바로 반환
  if (!data || data.length === 0) {
    return {
      result: [],
      total,
      currentPage: page,
      totalPages,
      size,
    };
  }

  // 2) judge_round_company에서 라운드별 기업 수 집계
  const roundIds = data.map((d) => d.id); // 현재 페이지에 있는 round들의 id만 추출

  // 3) judge_round_company: 라운드별 회사 레코드들 가져오기
  const { data: companyRows, error: companyRowsError } = await supabase
    .from("judging_round_company")
    .select("*") // group() 없이 전부 조회
    .in("judging_round_id", roundIds);

  if (companyRowsError) {
    handleError(companyRowsError);
  }

  // 라운드별 기업 수 집계 (딕셔너리 형태)
  // { [roundId]: numberOfCompanies }
  const companyCountsMap: Record<number, number> = {};
  companyRows?.forEach((row) => {
    if (!companyCountsMap[row.judging_round_id]) {
      companyCountsMap[row.judging_round_id] = 0;
    }
    companyCountsMap[row.judging_round_id]++;
  });

  // 4) judge_round_user: 라운드별 유저 레코드들 가져오기
  const { data: userRows, error: userRowsError } = await supabase
    .from("judging_round_user")
    .select("*")
    .in("judging_round_id", roundIds);

  if (userRowsError) {
    handleError(userRowsError);
  }

  // 라운드별 사용자 수 집계
  // { [roundId]: numberOfUsers }
  const userCountsMap: Record<number, number> = {};
  userRows?.forEach((row) => {
    if (!userCountsMap[row.judging_round_id]) {
      userCountsMap[row.judging_round_id] = 0;
    }
    userCountsMap[row.judging_round_id]++;
  });

  // 5) data와 매핑
  const dataWithCounts = data.map((round) => {
    return {
      ...round,
      number_of_companies: companyCountsMap[round.id] ?? 0,
      number_of_users: userCountsMap[round.id] ?? 0,
    };
  });

  // 6) 최종 반환
  return {
    result: dataWithCounts,
    total,
    currentPage: page,
    totalPages,
    size,
  };
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

// 폼에서 받게 될 전체 데이터 타입
// (심사의 기본 정보 + 참여 기업 + 참여 심사위원)
export interface JudgeCreateData {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  companies?: {
    company_id?: number;
    file?: File; // ★ 파일 객체(프런트에서 넘어옴)
    group_name?: string;
  }[];
  users?: {
    user_id?: string;
    group_name?: string;
  }[];
}

export async function updateJudge(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  try {
    // 1) 문자열 필드 꺼내기
    const judgingRoundIdString = formData.get("judgingRoundId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;

    if (!judgingRoundIdString) {
      throw new Error("judgingRoundId가 없습니다.");
    }
    const judgingRoundId = parseInt(judgingRoundIdString, 10);

    // 2) companies (JSON 문자열) -> 파싱
    const companiesJson = formData.get("companies") as string;
    let companies: {
      company_id: number;
      group_name?: string;
    }[] = [];

    if (companiesJson) {
      companies = JSON.parse(companiesJson);
    }

    // 3) DB: judging_round 업데이트
    const { data: updatedRoundData, error: updateRoundError } = await supabase
      .from("judging_round")
      .update({
        name,
        description,
        start_date: start_date || null,
        end_date: end_date || null,
      })
      .eq("id", judgingRoundId)
      .select("id")
      .single();

    if (updateRoundError) {
      console.error("judge_round update error", updateRoundError);
      throw new Error(updateRoundError.message);
    }
    if (!updatedRoundData) {
      throw new Error("심사 라운드 업데이트에 실패했습니다.");
    }

    // 4) 기존 judge_round_company, judge_round_user 삭제
    const { error: deleteCompanyError } = await supabase
      .from("judging_round_company")
      .delete()
      .eq("judging_round_id", judgingRoundId);
    if (deleteCompanyError) {
      throw new Error(deleteCompanyError.message);
    }

    const { error: deleteUserError } = await supabase
      .from("judging_round_user")
      .delete()
      .eq("judging_round_id", judgingRoundId);
    if (deleteUserError) {
      throw new Error(deleteUserError.message);
    }

    // 5) 새로 insert할 judge_round_company 데이터 구성
    const companyInserts: {
      judging_round_id: number;
      company_id: number;
      pdf_path?: string | null;
      group_name?: string;
    }[] = [];

    // (파일 업로드용) formData에 files[i] 형태로 올라온 파일 목록
    // companies와 files의 index가 일치한다는 전제
    for (let i = 0; i < companies.length; i++) {
      const c = companies[i];
      const fileKey = `files[${i}]`;
      const file = formData.get(fileKey) as File | null; // 없으면 null

      let pdfPath: string | null = null;

      // (1) 파일이 있다면 Supabase Storage 업로드
      if (file) {
        const uniqueId = uuidv4();
        const fileName = `${Date.now()}-${uniqueId}`;
        const filePath = `judging-round-pdfs/${fileName}`;

        // Supabase Storage에 업로드
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("handpartners") // 실제 버킷명
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });

        if (storageError) {
          console.error("Storage upload error", storageError);
          throw new Error(storageError.message);
        }

        // public URL 생성
        const { data: publicUrlData } = supabase.storage
          .from("handpartners")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          pdfPath = publicUrlData.publicUrl;
        }
      }

      // (2) insert 레코드 생성
      companyInserts.push({
        judging_round_id: judgingRoundId,
        company_id: c.company_id,
        pdf_path: pdfPath,
        group_name: c.group_name ?? "A",
      });
    }

    // 실제 DB insert
    if (companyInserts.length > 0) {
      const { error: companyInsertError } = await supabase
        .from("judging_round_company")
        .insert(companyInserts);

      if (companyInsertError) {
        console.error("judge_round_company insert error", companyInsertError);
        throw new Error(companyInsertError.message);
      }
    }

    // (추가로) judge_round_user 로직 필요 시 여기서 insert
    // 예시:
    // const usersPayload = ... ;
    // await supabase.from("judging_round_user").insert(usersPayload);

    return { success: true };
  } catch (error: any) {
    console.error("updateJudge error:", error);
    return { success: false, message: error.message };
  }
}

export interface JudgeBasicData {
  judgingRoundId: number;
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * 심사 라운드의 기본 정보만 업데이트.
 * 기존 updateJudge의 일부(기본 정보)만 따로 분리.
 */
export async function updateJudgeBasic(data: JudgeBasicData) {
  const supabase = await createServerSupabaseClient();
  const { judgingRoundId, name, description, start_date, end_date } = data;

  try {
    const { error: updateRoundError } = await supabase
      .from("judging_round")
      .update({
        name,
        description,
        start_date: start_date || null,
        end_date: end_date || null,
      })
      .eq("id", judgingRoundId);

    if (updateRoundError) {
      console.error("updateJudgeBasic error:", updateRoundError);
      throw new Error(updateRoundError.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeBasic error:", error);
    return { success: false, message: error.message };
  }
}

export type JudgingRoundDetail = {
  id: number;
  name: string;
  start_date: string | null;
  end_date: string | null;
  program_name: string;
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
  judgingRoundId: number
): Promise<JudgingRoundDetail> {
  const supabase = await createServerSupabaseClient();

  // 1) 심사 라운드 기본 정보
  const { data: roundData, error: roundError } = await supabase
    .from("judging_round")
    .select(
      `
        id,
        name,
        start_date,
        end_date,
        program:program_id (
          name
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

  const companyList = companyData?.map((c) => ({
    company_id: c.company_id,
    company_name: c.company.name,
    description: c.company.description,
  }));

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
  const companyMap = new Map<number, any>();
  for (const comp of companyList) {
    companyMap.set(comp.company_id, {
      company_id: comp.company_id,
      company_name: comp.company_name,
      description: comp.description,
      evaluations: [] as any[],
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
        username: evalItem.user?.username ?? "(이름 없음)",
        feedback: evalItem.feedback, // 동일한 피드백이 들어오므로 일단 첫 레코드 feedback만 저장
        criteriaScores: [] as {
          evaluation_criterion_id: number;
          grade: number;
        }[],
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

  return {
    id: roundData.id,
    name: roundData.name,
    start_date: roundData.start_date,
    end_date: roundData.end_date,
    program_name: roundData.program.name,
    criteriaList: criteriaData || [],
    companies: finalCompanies,
  };
}

/**
 * 주어진 judging_round_id를 기반으로
 * 회사별(Company.name) 모든 feedback을 배열 형태로 모아서 반환
 */
export async function getCompanyFeedbacksByRoundId(judging_round_id: number) {
  const supabase = await createServerSupabaseClient();

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
    const companyName = row.company?.name;
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
  judging_round_id: number
): Promise<{ companies: CompanyScoreResult[] }> {
  const supabase = await createServerSupabaseClient();

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
    const companyName = row.company?.name;
    const userName = row.user?.username;
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
    const avgScore = judgings.length > 0 ? totalScore / judgings.length : 0;

    companiesArray.push({
      name: companyName,
      judgings,
      totalScore,
      avgScore,
      ranking: 0, // 일단 0으로 초기화, 뒤에서 부여
    });
  });

  // 4) totalScore 내림차순 정렬 & 단순 순위 매기기
  companiesArray.sort((a, b) => b.totalScore - a.totalScore);

  let rank = 1;
  companiesArray.forEach((company) => {
    company.ranking = rank;
    rank++;
  });

  // 5) 반환
  return { companies: companiesArray };
}
