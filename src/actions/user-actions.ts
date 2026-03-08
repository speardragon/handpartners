"use server";

import { Database } from "types_db";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { raiseActionError, withActionResult } from "@/lib/action";
import { ProfileCreateFormSchema } from "@/app/(admin)/admin/user/_lib/ProfileFormSchema";
import { z } from "zod";
import {
  createS3PresignedUploadUrl,
  createPresignedDownloadUrl,
} from "@/lib/storage/s3";

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

export async function getUsers(
  page: number,
  size: number,
  search?: string
): Promise<UserResult> {
  const supabase = await createClient();
  let query = supabase.from("user").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `username.ilike.%${search}%,affiliation.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query
    .order("username", { ascending: true })
    .range((page - 1) * size, page * size - 1);

  if (error) {
    raiseActionError(error);
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
  return withActionResult(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("user").insert({
      ...user,
      created_at: new Date().toISOString(),
    });

    if (error) {
      raiseActionError(error);
    }
    return data;
  });
}

export async function updateUser(user: UserRowUpdate) {
  return withActionResult(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user")
      .update({
        ...user,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id!);

    if (error) {
      raiseActionError(error);
    }
    return data;
  });
}

export async function deleteUser(userId: string) {
  return withActionResult(async () => {
    const supabase = await createClient();
    const adminClient = await createAdminClient();

    const { data, error } = await supabase
      .from("user")
      .delete()
      .eq("id", userId);

    if (error) {
      raiseActionError(error);
    }

    await adminClient.auth.admin.deleteUser(userId);

    return data;
  });
}

export type UserProfile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string | null;
  email: string | null;
  role: string;
  affiliation: string | null;
  position: string | null;
  phone_number: string | null;
  signature_url: string | null;
};
export async function getUserProfile() {
  return withActionResult(async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data: userProfile, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      raiseActionError(`Failed to fetch user profile: ${error.message}`);
    }

    return userProfile;
  });
}

/**
 * 회원가입( Supabase Auth signUp ) + user 테이블 레코드 등록을 동시에 처리하는 함수
 */
export async function registerUser(
  userData: z.infer<typeof ProfileCreateFormSchema>
) {
  return withActionResult(async () => {
    const supabase = await createAdminClient();

    const { data: signUpData, error: signUpError } =
      await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
      });

    if (signUpError) {
      raiseActionError(signUpError);
    }

    const newUserId = signUpData?.user?.id;
    if (!newUserId) {
      throw new Error("Sign up succeeded but user id not found.");
    }

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
      .single();

    if (userInsertError) {
      raiseActionError(userInsertError);
    }

    return userInsertData;
  });
}

export async function createSignatureUploadUrl(args: {
  fileName: string;
  contentType?: string;
}) {
  return withActionResult(async () => {
    return createS3PresignedUploadUrl({
      fileName: args.fileName || "signature.png",
      keyPrefix: "images/signature",
      contentType: args.contentType,
      defaultContentType: "image/png",
    });
  });
}

export async function getSignatureDownloadUrl(signatureUrl: string) {
  return withActionResult(async () => {
    const { downloadUrl } = await createPresignedDownloadUrl({
      objectPathOrUrl: signatureUrl,
    });
    return { downloadUrl };
  });
}
