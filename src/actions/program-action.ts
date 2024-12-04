"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";
// import { ProgramResponse } from "@/app/(home)/_hooks/useProjectQuery";

export type ProgramRow = Database["public"]["Tables"]["program"]["Row"];

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
  name: string; // 프로그램 이름(Program)
  description: string; // 프로그램 설명(Program)
}

export interface Company {
  score: string; // 심사 대상 기업 총 점수(evaluation)
  companyName: string; // 기업 이름 (Company)
  description: string; // 사업 아이템 이름 (Company)
  category: string; // 지원 분야
  status: string; // 심사 상태 (Evalutaion)
  companyId: number; // 기업 ID
}

export type ProgramRowInsert =
  Database["public"]["Tables"]["program"]["Insert"];
export type ProgramRowUpdate =
  Database["public"]["Tables"]["program"]["Update"];

function handleError(error: any) {
  console.error(error);
  throw new Error(error.message);
}

export async function getJudgingStatus(id: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("evaluation")
    .select(`judging_round_id,company_id,status`)
    .eq("judging_round_id", `${id}`);

  if (error) {
    handleError(error);
  }
  console.log(data);
  return data;
}

export async function createPrograms(project: ProgramRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("program").insert({
    ...project,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function updatePrograms(project: ProgramRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("program")
    .update({
      ...project,
      updated_at: new Date().toISOString(),
    })
    .eq("id", project.id);

  if (error) {
    handleError(error);
  }
  return data;
}

export async function getScreenings(): Promise<any> {
  const supabase = await createServerSupabaseClient();

  // Step 1: Fetch screenings data
  const { data: screeningsData, error } = await supabase.from("judging_round")
    .select(`
      id,
      name,
      start_date,
      end_date,
      program:program_id (
        name,
        description
      ),
      companies:judging_round_company (
        judge_num,
        category,
        company:company_id (
          id,
          name,
          description
        )
      )
    `);

  if (error) {
    console.error("Error fetching screenings:", error);
    return [];
  }

  // Step 2: Collect all unique (judging_round_id, company_id) pairs
  const judgingCompanyPairs = [];
  screeningsData.forEach((screening) => {
    screening.companies.forEach((companyEntry) => {
      judgingCompanyPairs.push({
        judging_round_id: screening.id,
        company_id: companyEntry.company.id,
      });
    });
  });

  // Step 3: Fetch evaluation statuses and scores for the collected pairs
  const { data: evaluationsData, error: evalError } = await supabase
    .from("evaluation")
    .select("judging_round_id, company_id, status, grade") // Fetch scores and statuses
    .in(
      "judging_round_id",
      judgingCompanyPairs.map((pair) => pair.judging_round_id)
    )
    .in(
      "company_id",
      judgingCompanyPairs.map((pair) => pair.company_id)
    );

  if (evalError) {
    console.error("Error fetching evaluations:", evalError);
    return [];
  }

  // Step 4: Group evaluations by judging_round_id and company_id, calculate total score
  const evaluationMap = {};
  evaluationsData.forEach((ele) => {
    const key = `${ele.judging_round_id}_${ele.company_id}`;
    if (!evaluationMap[key]) {
      evaluationMap[key] = {
        status: ele.status,
        totalScore: 0,
      };
    }
    evaluationMap[key].totalScore += ele.grade; // Sum scores
  });

  // Step 5: Map screenings data with evaluation status and scores
  const screenings = screeningsData.map((screening) => ({
    id: screening.id,
    name: screening.name,
    start_date: screening.start_date,
    end_date: screening.end_date,
    program: {
      name: screening.program.name,
      description: screening.program.description,
    },
    companies: screening.companies.map((companyEntry) => {
      const key = `${screening.id}_${companyEntry.company.id}`;
      const evaluation = evaluationMap[key] || {
        status: "PENDING",
        totalScore: 0,
      };
      return {
        judge_num: companyEntry.judge_num.toString(),
        companyName: companyEntry.company.name,
        description: companyEntry.company.description,
        category: companyEntry.category,
        status:
          evaluation.status === "PENDING"
            ? "심사 예정"
            : evaluation.status === "ONGOING"
            ? "심사 중"
            : "심사 완료",
        score: evaluation.totalScore, // Add total score here
        companyId: companyEntry.company.id,
      };
    }),
  }));

  return screenings;
}
// export async function getScreenings(): Promise<any> {
//   const supabase = await createServerSupabaseClient();

//   const { data: screeningsData, error } = await supabase.from("judging_round")
//     .select(`
//       id,
//       name,
//       start_date,
//       end_date,
//       program:program_id (
//         name,
//         description
//       ),
//       companies:judging_round_company (
//         judge_num,
//         category,
//         company:company_id (
//           id,
//           name,
//           description
//         )
//       )
//     `);

//   // console.log(screeningsData);

//   if (error) {
//     console.error("Error fetching screenings:", error);
//     return [];
//   }

//   // Collect all unique (judging_round_id, company_id) pairs
//   const judgingCompanyPairs = [];
//   screeningsData.forEach((screening) => {
//     screening.companies.forEach((companyEntry) => {
//       console.log({ companyEntry });
//       judgingCompanyPairs.push({
//         judging_round_id: screening.id,
//         company_id: companyEntry.company.id,
//       });
//     });
//   });

//   // Fetch evaluation statuses for the collected pairs
//   const { data: evaluationsData, error: evalError } = await supabase
//     .from("evaluation")
//     .select("company_id, judging_round_id, status")
//     .in(
//       "judging_round_id",
//       judgingCompanyPairs.map((pair) => pair.judging_round_id)
//     )
//     .in(
//       "company_id",
//       judgingCompanyPairs.map((pair) => pair.company_id)
//     );

//   if (evalError) {
//     console.error("Error fetching evaluations:", evalError);
//     return [];
//   }

//   // Create a map for quick lookup of evaluation status
//   const evaluationStatusMap = {};
//   evaluationsData.forEach((evalEntry) => {
//     const key = `${evalEntry.judging_round_id}_${evalEntry.company_id}`;
//     evaluationStatusMap[key] = evalEntry.status;
//   });

//   const screenings = screeningsData.map((screening) => ({
//     id: screening.id,
//     name: screening.name,
//     start_date: screening.start_date,
//     end_date: screening.end_date,
//     program: {
//       name: screening.program.name,
//       description: screening.program.description,
//     },
//     companies: screening.companies.map((companyEntry) => {
//       const key = `${screening.id}_${companyEntry.company.id}`;
//       const status = evaluationStatusMap[key] || "PENDING";
//       return {
//         judge_num: companyEntry.judge_num.toString(),
//         companyName: companyEntry.company.name,
//         description: companyEntry.company.description,
//         category: companyEntry.category,
//         status:
//           status === "PENDING"
//             ? "심사 예정"
//             : status === "ONGOING"
//             ? "심사 중"
//             : "심사 완료",
//         companyId: companyEntry.company.id,
//       };
//     }),
//   }));

//   return screenings;
// }
