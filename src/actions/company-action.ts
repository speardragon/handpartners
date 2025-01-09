"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type CompanyRow = Database["public"]["Tables"]["company"]["Row"];
export type CompanyRowInsert =
  Database["public"]["Tables"]["company"]["Insert"];
export type CompanyRowUpdate =
  Database["public"]["Tables"]["company"]["Update"];

export interface CompanyResult {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  result: CompanyRow[];
}

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getCompanies(
  page: number,
  size: number,
  search?: string
): Promise<CompanyResult> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("company").select("*", { count: "exact" });

  // 검색
  if (search && search.trim() !== "") {
    query = query.ilike("name", `%${search}%`);
  }

  // 페이지네이션
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
    result: data as CompanyRow[],
  };
}

export async function createCompany(company: CompanyRowInsert) {
  console.log(company);
  const supabase = await createServerSupabaseClient();

  // 1) 현재 DB에 동일한 name이 있는지 미리 체크
  const { data: existingData, error: existingError } = await supabase
    .from("company")
    .select("*")
    .eq("name", company.name);

  if (existingError) {
    handleError(existingError);
  }

  // 이미 해당 name이 존재한다면 에러를 던짐
  if (existingData && existingData.length > 0) {
    throw new Error("이미 존재하는 회사 이름입니다.");
  }

  // 2) 중복이 없으면 insert 진행
  const { data, error } = await supabase.from("company").insert({
    ...company,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function updateCompany(company: CompanyRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("company")
    .update({
      ...company,
    })
    .eq("id", company.id);

  if (error) {
    handleError(error);
  }
  return data;
}

export async function deleteCompany(companyId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("company")
    .delete()
    .eq("id", companyId);

  if (error) {
    handleError(error);
  }

  return data;
}
