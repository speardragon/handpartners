"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type UserRow = Database["public"]["Tables"]["user"]["Row"];
export type UserRowInsert = Database["public"]["Tables"]["user"]["Insert"];
export type UserRowUpdate = Database["public"]["Tables"]["user"]["Update"];
interface Result {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
  result: UserRow[];
}

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getUsers(
  page: number,
  size: number
  // username?: string
): Promise<Result> {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("user").select("*", { count: "exact" });

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
    result: data as UserRow[],
  };
}

export async function createUser(user: UserRowInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("user").insert({
    ...user,
    created_at: new Date().toISOString(),
  });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function updateUser(user: UserRowUpdate) {
  console.log(user);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("user")
    .update({
      ...user,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    handleError(error);
  }
  return data;
}

export async function deleteUser(userId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("user").delete().eq("id", userId);

  if (error) {
    handleError(error);
  }

  return data;
}

type UserProfile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string | null;
  email: string | null;
  role: string;
  affiliation: string | null;
  position: string | null;
  phone_number: string | null;
};
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createServerSupabaseClient();

  // 현재 세션 정보 가져오기
  const session = await supabase.auth.getSession();
  const userId = session.data?.session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // user 테이블에서 프로필 정보 가져오기
  const { data: userProfile, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single(); // 단일 결과를 가져오기

  if (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return userProfile;
}
