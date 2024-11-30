"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type ProgramRow = Database["public"]["Tables"]["program"]["Row"];
export type ProgramRowInsert =
  Database["public"]["Tables"]["program"]["Insert"];
export type ProgramRowUpdate =
  Database["public"]["Tables"]["program"]["Update"];
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

export async function createProgram(program: ProgramRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("program").insert({
    ...program,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }
  return data;
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
