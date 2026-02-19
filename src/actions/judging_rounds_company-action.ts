"use server";

import { v4 as uuidv4 } from "uuid";
import { Database } from "types_db";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  createPresignedUploadUrl,
  createPresignedDownloadUrl,
  uploadPdfToS3,
} from "@/lib/storage/s3";

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

function handleError(error: any) {
  console.error(error);
  throw new Error(error.message);
}

export async function getJudgingRoundCompaniesById(
  judgingRoundId: string
): Promise<any> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("judging_round_company")
    .select(
      `*,
        company:company_id (
          name
        )
        `
    )
    .eq("judging_round_id", judgingRoundId)
    .order("judge_num", { ascending: true, nullsFirst: false });

  if (error) {
    handleError(error);
  }

  return data;
}

interface CompanyPayload {
  company_id: number;
  group_name?: string;
}

function sanitizeFileName(originalName: string) {
  return originalName.replace(/[^a-zA-Z0-9.\-_]/g, "");
}

export async function createJudgeCompanyPdfUploadUrl(args: {
  fileName: string;
  contentType?: string;
}) {
  const safeName = sanitizeFileName(args.fileName || "company.pdf");
  const uniqueId = uuidv4();
  const objectKey = `judging-round-pdfs/${Date.now()}-${uniqueId}-${safeName}`;

  return createPresignedUploadUrl({
    objectKey,
    contentType: args.contentType || "application/pdf",
  });
}

/**
 * FormData로 넘어온 기업 정보 + 파일(pdf_file) 처리
 * 1) 기존 judge_round_company 테이블에서 roundId에 해당하는 레코드들 조회
 * 2) 새로 들어온 companies 배열과 비교하여
 *    - 이미 존재하는 기업 -> 업데이트
 *    - 새로 추가된 기업 -> 삽입
 *    - 삭제된 기업 -> 제거
 * 3) pdf_file 있으면 S3에 업로드 후 pdf_path 업데이트
 */
export async function updateJudgeCompany(formData: FormData) {
  const supabase = await createClient();

  try {
    // 1) 기본 데이터 파싱
    const judgingRoundIdString = formData.get("judgingRoundId") as string;
    if (!judgingRoundIdString) {
      throw new Error("judgingRoundId가 없습니다.");
    }
    const judgingRoundId = judgingRoundIdString;
    // console.log({ judgingRoundId });

    // 2) companies JSON 파싱
    const companiesJson = formData.get("companies") as string;
    let companies: CompanyPayload[] = [];
    if (companiesJson) {
      companies = JSON.parse(companiesJson);
    }
    // console.log({ companies });

    // 3) DB에서 기존 기업 레코드 조회
    const { data: oldCompanies, error: oldCompaniesError } = await supabase
      .from("judging_round_company")
      .select("*")
      .eq("judging_round_id", judgingRoundId);

    // console.log({ oldCompanies });

    if (oldCompaniesError) {
      console.error("조회 실패:", oldCompaniesError);
      throw new Error(oldCompaniesError.message);
    }

    // 4) 새 목록(companies)와 기존 목록(oldCompanies) 비교
    //    oldCompanies:  { id, judging_round_id, company_id, pdf_path, group_name, ... }
    //    companies:     { company_id, group_name }[]
    // (1) 새 companies에 있는 company_id들을 Map으로 만들기 (key: company_id, value: group_name)
    const newMap = new Map<number, { group_name: string }>();
    companies.forEach((c) => {
      newMap.set(c.company_id, {
        group_name:
          !c.group_name || c.group_name.length === 0 ? "A" : c.group_name,
      });
    });

    // console.log(newMap);

    // (2) 기존 목록 중 '사라진' 기업 찾기(= 새 목록에는 없는데 old에는 있는 경우)
    const toDelete = oldCompanies.filter((oc) => !newMap.has(oc.company_id));

    // (3) 새 목록 중 '기존에 없던' 기업 찾기(= old에는 없는데 new에는 있는 경우)
    //     혹은 '이미 있는데, PDF를 새로 업로드해야 하는' 경우도 Insert 대신 update를 해줄 수도 있음
    const oldMap = new Map<number, (typeof oldCompanies)[0]>();
    oldCompanies.forEach((oc) => {
      oldMap.set(oc.company_id, oc);
    });
    const toInsert: {
      company_id: number;
      group_name?: string;
    }[] = [];

    companies.forEach((c) => {
      if (!oldMap.has(c.company_id)) {
        // 신규 추가
        toInsert.push({
          company_id: c.company_id,
          group_name: c.group_name,
        });
      }
    });

    const fileIndexByCompanyId = new Map<number, number>();
    companies.forEach((company, index) => {
      fileIndexByCompanyId.set(company.company_id, index);
    });
    const getCompanyFile = (companyId: number): File | null => {
      const idx = fileIndexByCompanyId.get(companyId);
      if (idx === undefined) return null;
      return formData.get(`files[${idx}]`) as File | null;
    };

    // (4) '기존에도 있었고, 새 목록에도 있는' 기업은 UPDATE
    //     group_name이 변경되었을 수도 있으므로 업데이트. pdf_file이 있으면 업로드 후 pdf_path도 갱신
    const toUpdate = companies.filter((c) => oldMap.has(c.company_id));

    // 5) 실제 DB 작업
    // (A) 삭제할 기업
    if (toDelete.length > 0) {
      const ids = toDelete.map((x) => x.id); // PK id
      const { error: deleteError } = await supabase
        .from("judging_round_company")
        .delete()
        .in("id", ids);

      if (deleteError) {
        console.error("delete error:", deleteError);
        throw new Error(deleteError.message);
      }
    }

    // (B) 삽입할 기업 (파일 업로드 포함)
    if (toInsert.length > 0) {
      const insertPayload = [];
      for (const insertion of toInsert) {
        let pdfPath = null;
        // (B-1) pdf 파일이 있다면 업로드
        const file = getCompanyFile(insertion.company_id);
        if (file) {
          const uniqueId = uuidv4();
          const fileName = `${Date.now()}-${uniqueId}`;
          const filePath = `judging-round-pdfs/${fileName}`;

          pdfPath = await uploadPdfToS3(file, filePath);
        }

        // (B-2) 최종 insert 객체
        insertPayload.push({
          judging_round_id: judgingRoundId,
          company_id: insertion.company_id,
          group_name:
            !insertion.group_name || insertion.group_name.length === 0
              ? "A"
              : insertion.group_name,
          pdf_path: pdfPath,
        });
      }

      if (insertPayload.length > 0) {
        const { error: insertError } = await supabase
          .from("judging_round_company")
          .insert(insertPayload);

        if (insertError) {
          console.error("insert error:", insertError);
          throw new Error(insertError.message);
        }
      }
    }

    // (C) 업데이트할 기업
    for (let i = 0; i < toUpdate.length; i++) {
      // console.log(`업데이트`);
      // console.log(toUpdate);
      const c = toUpdate[i];
      const existing = oldMap.get(c.company_id);
      if (!existing) continue;

      // console.log({ existing });

      // 기존에 있던 레코드의 id
      const rowId = existing.id;
      let pdfPath = existing.pdf_path; // 원래 PDF path

      // 만약 이번에 파일을 새로 업로드 했다면 갱신
      // (C-1) pdf 파일 업로드 확인
      const file = getCompanyFile(c.company_id);
      // console.log(file);
      if (file) {
        const uniqueId = uuidv4();
        const fileName = `${Date.now()}-${uniqueId}-${file.name}`;
        const filePath = `judging-round-pdfs/${fileName}`;

        pdfPath = await uploadPdfToS3(file, filePath);
      }

      // (C-2) DB Update
      const { error: updateError } = await supabase
        .from("judging_round_company")
        .update({
          group_name:
            !c.group_name || c.group_name.length === 0 ? "A" : c.group_name,
          pdf_path: pdfPath,
        })
        .eq("id", rowId);

      if (updateError) {
        console.error("update error:", updateError);
        throw new Error(updateError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeCompany error:", error);
    return { success: false, message: error.message };
  }
}

interface CompanyPayload2 {
  company_id: number;
  group_name?: string;
  pdf_path?: string | null;
  judge_num?: number;
}

/**
 * 클라이언트에서 이미 PDF를 업로드 완료한 후,
 * DB에 최종 pdf_path 등만 반영하는 Server Action
 */
export async function updateJudgeCompany2(args: {
  judgingRoundId: string;
  companies: CompanyPayload2[];
}) {
  const supabase = await createClient();

  try {
    const { judgingRoundId, companies } = args;
    if (!judgingRoundId) {
      throw new Error("judgingRoundId가 없습니다.");
    }

    // 1) DB에서 기존 기업 목록 조회
    const { data: oldCompanies, error: oldCompaniesError } = await supabase
      .from("judging_round_company")
      .select("*")
      .eq("judging_round_id", judgingRoundId);

    if (oldCompaniesError) throw oldCompaniesError;
    if (!oldCompanies)
      return { success: false, message: "기존 기업 조회 실패" };

    // 2) 새 목록 vs. 기존 목록 비교
    const newMap = new Map<number, CompanyPayload2>();
    companies.forEach((c) => {
      newMap.set(c.company_id, c);
    });

    const oldMap = new Map<number, JudgingRoundCompanyRow>();
    oldCompanies.forEach((oc) => {
      oldMap.set(oc.company_id, oc);
    });

    // (A) 삭제 목록
    const toDelete = oldCompanies.filter((oc) => !newMap.has(oc.company_id));
    // (B) 삽입 목록
    const toInsert: JudgingRoundCompanyInsert[] = [];
    // (C) 업데이트 목록
    const toUpdate: { rowId: number; payload: CompanyPayload2 }[] = [];

    // 새 목록을 돌면서 구분
    for (const c of companies) {
      const existing = oldMap.get(c.company_id);
      if (!existing) {
        // 기존에 없던 기업 → 삽입
        toInsert.push({
          judging_round_id: judgingRoundId,
          company_id: c.company_id,
          group_name: c.group_name?.length === 0 ? "A" : c.group_name,
          pdf_path: c.pdf_path || null,
          judge_num: c.judge_num ?? null,
        });
      } else {
        // 기존에도 있던 기업 → 업데이트
        toUpdate.push({
          rowId: existing.id,
          payload: c,
        });
      }
    }

    // 3) 삭제 처리
    if (toDelete.length > 0) {
      const ids = toDelete.map((x) => x.id);
      const { error: deleteError } = await supabase
        .from("judging_round_company")
        .delete()
        .in("id", ids);
      if (deleteError) throw deleteError;
    }

    // 4) 삽입 처리
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("judging_round_company")
        .insert(toInsert);
      if (insertError) throw insertError;
    }

    // 5) 업데이트 처리
    for (const item of toUpdate) {
      const { rowId, payload } = item;
      const { group_name, pdf_path, judge_num } = payload;
      const { error: updateError } = await supabase
        .from("judging_round_company")
        .update({
          group_name: group_name?.length === 0 ? "A" : group_name,
          pdf_path: pdf_path ?? null,
          judge_num: judge_num ?? null,
        })
        .eq("id", rowId);
      if (updateError) throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeCompany2 error:", error);
    return { success: false, message: error.message };
  }
}

export async function getJudgingRoundCompaniesPublic(judgingRoundId: string) {
  const supabase = await createAdminClient();

  const { data: round, error: roundError } = await supabase
    .from("judging_round")
    .select("name, status")
    .eq("id", judgingRoundId)
    .single();

  if (roundError || !round) {
    const notFoundError = new Error("심사를 찾을 수 없습니다.");
    (notFoundError as any).statusCode = 404;
    throw notFoundError;
  }

  if (round.status === "COMPLETED") {
    const completedError = new Error("이미 완료된 심사입니다.");
    (completedError as any).statusCode = 403;
    throw completedError;
  }

  const { data: companies, error: companiesError } = await supabase
    .from("judging_round_company")
    .select(
      `id,
        pdf_path,
        original_filename,
        submitted_at,
        company:company_id (
          name
        )`
    )
    .eq("judging_round_id", judgingRoundId)
    .order("id", { ascending: true });

  if (companiesError) {
    throw new Error(companiesError.message);
  }

  return {
    roundName: round.name,
    companies: companies ?? [],
  };
}

export async function updateCompanyPdfPath(args: {
  judgingRoundCompanyId: number;
  pdfPath: string;
  originalFilename: string;
}) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("judging_round_company")
    .update({
      pdf_path: args.pdfPath,
      original_filename: args.originalFilename,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", args.judgingRoundCompanyId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function getCompanyPdfDownloadUrl(pdfPath: string) {
  const { downloadUrl } = await createPresignedDownloadUrl({
    objectPathOrUrl: pdfPath,
  });
  return { downloadUrl };
}
