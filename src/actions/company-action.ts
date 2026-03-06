"use server";

import { Database } from "types_db";
import { createClient } from "@/lib/supabase/server";

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

const DUPLICATE_COMPANY_MESSAGE =
  "동일한 기업명과 대표자 성명이 이미 존재합니다.";

function handleError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  throw new Error(message);
}

export async function getCompanies(
  page: number,
  size: number,
  search?: string
): Promise<CompanyResult> {
  const supabase = await createClient();
  let query = supabase.from("company").select("*", { count: "exact" });

  if (search && search.trim() !== "") {
    query = query.or(
      `name.ilike.%${search}%,representative_name.ilike.%${search}%`
    );
  }

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

export async function getCompanyById(
  companyId: number
): Promise<CompanyRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("company")
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  if (error) {
    handleError(error);
  }

  return data;
}

export async function createCompany(company: CompanyRowInsert) {
  const supabase = await createClient();

  const { data: existingData, error: existingError } = await supabase
    .from("company")
    .select("id")
    .eq("name", company.name)
    .eq("representative_name", company.representative_name)
    .limit(1);

  if (existingError) {
    handleError(existingError);
  }

  if (existingData && existingData.length > 0) {
    throw new Error(DUPLICATE_COMPANY_MESSAGE);
  }

  const { data, error } = await supabase.from("company").insert({
    ...company,
    created_at: new Date().toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(DUPLICATE_COMPANY_MESSAGE);
    }
    handleError(error);
  }

  return data;
}

export async function updateCompany(company: CompanyRowUpdate) {
  const supabase = await createClient();

  const companyId = company.id;
  if (!companyId) {
    throw new Error("회사 ID가 없습니다.");
  }

  const currentCompany = await getCompanyById(companyId);
  if (!currentCompany) {
    throw new Error("회사를 찾을 수 없습니다.");
  }

  const nextName = company.name ?? currentCompany.name;
  const nextRepresentativeName =
    company.representative_name ?? currentCompany.representative_name;

  const { data: duplicateCompany, error: duplicateError } = await supabase
    .from("company")
    .select("id")
    .eq("name", nextName)
    .eq("representative_name", nextRepresentativeName)
    .neq("id", companyId)
    .limit(1);

  if (duplicateError) {
    handleError(duplicateError);
  }

  if (duplicateCompany && duplicateCompany.length > 0) {
    throw new Error(DUPLICATE_COMPANY_MESSAGE);
  }

  const { data, error } = await supabase
    .from("company")
    .update({
      ...company,
    })
    .eq("id", companyId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(DUPLICATE_COMPANY_MESSAGE);
    }
    handleError(error);
  }
  return data;
}

export async function deleteCompany(companyId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("company")
    .delete()
    .eq("id", companyId);

  if (error) {
    handleError(error);
  }

  return data;
}
