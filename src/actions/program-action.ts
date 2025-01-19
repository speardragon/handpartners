"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type ProgramRow = Database["public"]["Tables"]["program"]["Row"];
export type ProgramRowInsert =
  Database["public"]["Tables"]["program"]["Insert"];
export type ProgramRowUpdate =
  Database["public"]["Tables"]["program"]["Update"];
// 인터페이스 정의
export interface Screening {
  id: number; // 심사 ID(judging_round)
  name: string; // 심사 이름(judging_round)
  start_date: string;
  end_date: string;
  program: Program; // 프로그램 정보
  companies: Company[]; // 심사 대상 팀 목록
}
export interface Program {
  id: number;
  name: string; // 프로그램 이름(Program)
  description: string; // 프로그램 설명(Program)
}
export interface Company {
  score: number; // 심사 대상 기업 총 점수(evaluation)
  companyName: string; // 기업 이름 (Company)
  description: string; // 사업 아이템 이름 (Company)
  category: string; // 지원 분야
  status: string; // 심사 상태 (Evalutaion)
  companyId: number; // 기업 ID
}

interface Result {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  result: ProgramRow[];
}

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getProgramById(programId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("program")
    .select("*")
    .eq("id", programId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPrograms(page: number, size: number): Promise<Result> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("program").select("*", { count: "exact" });

  const { data, error, count } = await query.range(
    (page - 1) * size,
    page * size - 1
  );

  if (error) {
    handleError(error);
  }

  const totalElements = count || 0;
  const totalPages = Math.ceil(totalElements / size);

  return {
    currentPage: page,
    totalPages,
    totalElements,
    size,
    result: data as ProgramRow[],
  };
}

/**
 * program 테이블과 program_company 테이블에 데이터를 저장
 * @param program 프로그램 기본 정보
 * @param companyIds 함께 추가할 기업 ID 배열
 */
export async function createProgram(
  program: ProgramRowInsert,
  companyIds: number[]
) {
  const supabase = await createServerSupabaseClient();

  // 1) program 테이블에 레코드 추가
  //    insert 후 생성된 program_id를 받아야 하므로 select, single() 사용
  const { data: insertedData, error: programError } = await supabase
    .from("program")
    .insert({
      ...program,
      created_at: new Date().toISOString(),
    })
    .select("id") // 새로 추가된 행의 id를 반환
    .single();

  if (programError) {
    handleError(programError);
  }

  const newProgramId = insertedData.id;

  // 2) program_company 테이블에 (program_id, company_id) 쌍으로 레코드 생성
  if (newProgramId && companyIds.length > 0) {
    const inserts = companyIds.map((companyId) => ({
      program_id: newProgramId,
      company_id: companyId,
      created_at: new Date().toISOString(),
    }));

    const { error: programCompanyError } = await supabase
      .from("program_company")
      .insert(inserts);

    if (programCompanyError) {
      handleError(programCompanyError);
    }
  }

  return insertedData; // 방금 생성된 program 정보(또는 null)
}

export async function updateProgram(program: ProgramRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("program")
    .update({
      ...program,
    })
    .eq("id", program.id);

  if (error) {
    handleError(error);
  }
  return data;
}

export async function deleteProgram(programId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("program")
    .delete()
    .eq("id", programId);

  if (error) {
    handleError(error);
  }

  return data;
}

export async function getScreenings(): Promise<any> {
  const supabase = await createServerSupabaseClient();

  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;

  const nowUtc = new Date();
  const nowKst = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000);
  const nowKstIsoString = nowKst.toISOString();

  // Step 1: screening에 필요한 데이터
  const { data: screenings, error } = await supabase
    .from("judging_round")
    .select(
      `
      id,
      name,
      start_date,
      end_date,
      program:program_id (
        id,
        name,
        description
      ),
      companies:judging_round_company (
        judge_num,
        group_name,
        category,
        company:company_id (
          id,
          name,
          description
        )
      ),
      judging_round_user!inner(
        user_id,
        group_name
      )
    `
    )
    .eq("judging_round_user.user_id", userId)
    .lte("start_date", nowKstIsoString)
    .gte("end_date", nowKstIsoString);

  if (error) {
    console.error("Error fetching screenings:", error);
    throw new Error(error.message);
  }

  // 해당 심사자의 group_name에 할당된 company만 필터링
  screenings.forEach((screening) => {
    const userGroupName = screening.judging_round_user?.[0]?.group_name;
    screening.companies = screening.companies.filter(
      (company) => company.group_name === userGroupName
    );
  });

  // Step 2: (judging_round_id, company_id) 쌍을 만든다.
  const judgingCompanyPairs = [];
  screenings.forEach((screening) => {
    screening.companies.forEach((companyEntry) => {
      judgingCompanyPairs.push({
        judging_round_id: screening.id,
        company_id: companyEntry.company.id,
      });
    });
  });

  // Step 3: 각 쌍에 대해 evaluation status와 score를 가져온다.
  const { data: evaluations, error: evalError } = await supabase
    .from("evaluation")
    .select("judging_round_id, company_id, status, grade")
    .in(
      "judging_round_id",
      judgingCompanyPairs.map((pair) => pair.judging_round_id)
    )
    .in(
      "company_id",
      judgingCompanyPairs.map((pair) => pair.company_id)
    )
    .eq("user_id", userId);

  if (evalError) {
    console.error("Error fetching evaluations:", evalError);
    throw new Error(error.message);
  }

  // Step 4: Group evaluations by judging_round_id and company_id, calculate total score
  const evaluationMap = {};
  evaluations.forEach((evaluation) => {
    const key = `${evaluation.judging_round_id}_${evaluation.company_id}`;
    if (!evaluationMap[key]) {
      evaluationMap[key] = {
        status: evaluation.status,
        totalScore: 0,
      };
    }
    evaluationMap[key].totalScore += evaluation.grade;
  });

  // Step 5: Map screenings data with evaluation status and scores
  const result = screenings.map((screening) => ({
    id: screening.id,
    name: screening.name,
    start_date: screening.start_date,
    end_date: screening.end_date,
    program: {
      id: screening.program.id,
      name: screening.program.name,
      description: screening.program.description,
    },
    companies: screening.companies
      .sort((a, b) => a.judge_num - b.judge_num)
      .map((company) => {
        const key = `${screening.id}_${company.company.id}`;
        const evaluation = evaluationMap[key] || {
          status: "PENDING",
          totalScore: 0,
        };
        return {
          // judge_num: company.judge_num.toString(),
          companyName: company.company.name,
          description: company.company.description,
          category: company.category,
          status:
            evaluation.status === "PENDING"
              ? "심사 예정"
              : evaluation.status === "ONGOING"
              ? "심사 중"
              : "심사 완료",
          score: evaluation.totalScore, // Add total score here
          companyId: company.company.id,
        };
      }),
    // .sort((a, b) => a.companyName.localeCompare(b.companyName)),
  }));

  return result;
}
