"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";
import { ProfileCreateFormSchema } from "@/app/(admin)/admin/user/_lib/ProfileFormSchema";
import { z } from "zod";

export type UserRow = Database["public"]["Tables"]["user"]["Row"];
export type UserRowInsert = Database["public"]["Tables"]["user"]["Insert"];
export type UserRowUpdate = Database["public"]["Tables"]["user"]["Update"];
export interface UserResult {
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
): Promise<UserResult> {
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

export async function deleteUser(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("user").delete().eq("id", userId);
  await supabase.auth.admin.deleteUser(userId);

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

/**
 * 회원가입( Supabase Auth signUp ) + user 테이블 레코드 등록을 동시에 처리하는 함수
 */
export async function registerUser(
  userData: z.infer<typeof ProfileCreateFormSchema>
) {
  const supabase = await createServerSupabaseClient();

  // 먼저 Supabase Auth에 사용자 생성
  const { data: signUpData, error: signUpError } =
    await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
    });

  if (signUpError) {
    handleError(signUpError);
  }

  // Auth를 통해 생성된 user id 가져오기
  const newUserId = signUpData?.user?.id;
  if (!newUserId) {
    throw new Error("Sign up succeeded but user id not found.");
  }

  // user 테이블에 레코드 생성 (Auth에 만들어진 UID(newUserId)를 id 필드로 사용)
  const { data: userInsertData, error: userInsertError } = await supabase
    .from("user")
    .insert({
      id: newUserId,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      affiliation: userData.affiliation,
      position: userData.position,
      phone_number: userData.phone_number,
      created_at: new Date().toISOString(),
    })
    .select()
    .single(); // 단일 레코드 반환

  if (userInsertError) {
    handleError(userInsertError);
  }

  return userInsertData;
}
