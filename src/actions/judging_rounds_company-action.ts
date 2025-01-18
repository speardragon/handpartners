"use server";

import { v4 as uuidv4 } from "uuid";
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

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getJudgingRoundCompaniesById(
  judgingRoundId: number
): Promise<any> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("judging_round_company")
    .select(
      `*,
        company:company_id (
          name
        )
        `
    )
    .eq("judging_round_id", judgingRoundId);

  if (error) {
    handleError(error);
  }

  return data;
}

interface CompanyPayload {
  company_id: number;
  group_name?: string;
}

/**
 * FormData로 넘어온 기업 정보 + 파일(pdf_file) 처리
 * 1) 기존 judge_round_company 테이블에서 roundId에 해당하는 레코드들 조회
 * 2) 새로 들어온 companies 배열과 비교하여
 *    - 이미 존재하는 기업 -> 업데이트
 *    - 새로 추가된 기업 -> 삽입
 *    - 삭제된 기업 -> 제거
 * 3) pdf_file 있으면 Supabase Storage에 업로드 후 pdf_path 업데이트
 */
export async function updateJudgeCompany(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  try {
    // 1) 기본 데이터 파싱
    const judgingRoundIdString = formData.get("judgingRoundId") as string;
    if (!judgingRoundIdString) {
      throw new Error("judgingRoundId가 없습니다.");
    }
    const judgingRoundId = parseInt(judgingRoundIdString, 10);
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
    companies.forEach((c, index) => {
      newMap.set(c.company_id, {
        group_name: c.group_name.length === 0 ? "A" : c.group_name,
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
      index: number; // 파일 처리 위해 index 함께 추적
    }[] = [];

    companies.forEach((c, index) => {
      if (!oldMap.has(c.company_id)) {
        // 신규 추가
        toInsert.push({
          company_id: c.company_id,
          group_name: c.group_name,
          index,
        });
      }
    });

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
        const fileKey = `files[${insertion.index}]`; // companies와 files의 index가 일치한다고 가정
        const file = formData.get(fileKey) as File | null;
        if (file) {
          const uniqueId = uuidv4();
          const fileName = `${Date.now()}-${uniqueId}`;
          const filePath = `judging-round-pdfs/${fileName}`;

          const { error: storageError } = await supabase.storage
            .from("handpartners")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            });
          if (storageError) {
            console.error("Storage upload error", storageError);
            throw new Error(storageError.message);
          }

          const { data: publicUrlData } = supabase.storage
            .from("handpartners")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            pdfPath = publicUrlData.publicUrl;
          }
        }

        // (B-2) 최종 insert 객체
        insertPayload.push({
          judging_round_id: judgingRoundId,
          company_id: insertion.company_id,
          group_name:
            insertion.group_name.length === 0 ? "A" : insertion.group_name,
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
      const fileKey = `files[${i}]`;
      // 주의! index: i 를 쓸지, company_id와 매핑하는지 로직에 따라 달라질 수 있음
      // toUpdate 배열 vs. companies 배열의 인덱스가 동일하다는 전제가 필요
      // 안전하게는 companies.findIndex(...) 로 i를 찾거나, 별도 맵핑을 구성해야 합니다.

      const file = formData.get(fileKey) as File | null;
      // console.log(file);
      if (file) {
        const uniqueId = uuidv4();
        const fileName = `${Date.now()}-${uniqueId}-${file.name}`;
        const filePath = `judging-round-pdfs/${fileName}`;

        // console.log(filePath);

        const { error: storageError } = await supabase.storage
          .from("handpartners")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (storageError) {
          console.error("Storage upload error", storageError);
          throw new Error(storageError.message);
        }

        // console.log("업로드 성공");

        const { data: publicUrlData } = supabase.storage
          .from("handpartners")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          pdfPath = publicUrlData.publicUrl;
        }
      }

      // (C-2) DB Update
      const { error: updateError } = await supabase
        .from("judging_round_company")
        .update({
          group_name: c.group_name.length === 0 ? "A" : c.group_name,
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
}

/**
 * 클라이언트에서 이미 PDF를 업로드 완료한 후,
 * DB에 최종 pdf_path 등만 반영하는 Server Action
 */
export async function updateJudgeCompany2(args: {
  judgingRoundId: number;
  companies: CompanyPayload2[];
}) {
  const supabase = await createServerSupabaseClient();

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
      const { group_name, pdf_path } = payload;
      const { error: updateError } = await supabase
        .from("judging_round_company")
        .update({
          group_name: group_name?.length === 0 ? "A" : group_name,
          pdf_path: pdf_path ?? null,
        })
        .eq("id", rowId);
      if (updateError) throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeCompany error:", error);
    return { success: false, message: error.message };
  }
}
