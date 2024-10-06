"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type ProjectRow = Database["public"]["Tables"]["project"]["Row"];
export type ProjectRowInsert =
  Database["public"]["Tables"]["project"]["Insert"];
export type ProjectRowUpdate =
  Database["public"]["Tables"]["project"]["Update"];

function handleError(error: any) {
  console.error(error);
  throw new Error(error.message);
}

export async function getProjects(): Promise<ProjectRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("project").select("*");

  if (error) {
    handleError(error);
  }
  return data;
}

export async function createProject(project: ProjectRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("project").insert({
    ...project,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function updateProject(project: ProjectRowUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("project")
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
