"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "../utils/supabase/server";

export type JudgingRoundRow =
  Database["public"]["Tables"]["judging_round"]["Row"];
export type JudgingRoundRowInsert =
  Database["public"]["Tables"]["judging_round"]["Insert"];
export type JudgingRoundRowUpdate =
  Database["public"]["Tables"]["judging_round"]["Update"];

export type JudgingRoundUserRow =
  Database["public"]["Tables"]["judging_round_user"]["Row"];
export type JudgingRoundUserInsert =
  Database["public"]["Tables"]["judging_round_user"]["Insert"];
export type JudgingRoundUserUpdate =
  Database["public"]["Tables"]["judging_round_user"]["Update"];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getJudgingRoundUsersById(
  judgingRoundId: number
): Promise<any> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("judging_round_user")
    .select(
      `*,
        user:user_id (
          username,
          affiliation
        )
        `
    )
    .eq("judging_round_id", judgingRoundId);

  if (error) {
    handleError(error);
  }

  return data;
}

export interface UserPayload {
  user_id: string;
  group_name?: string;
}

interface UpdateJudgeUserData {
  judgingRoundId: number;
  users: UserPayload[];
}

/**
 * 사용자(심사자) 정보만 업데이트
 * 기존 judge_round_user 테이블 레코드를 조회한 뒤,
 * 새로 들어온 users 배열과 비교하여
 *   - 사라진 user -> delete
 *   - 새로 추가된 user -> insert
 *   - 기존 + 새 모두 존재 -> update
 */
export async function updateJudgeUser(data: UpdateJudgeUserData) {
  const supabase = await createServerSupabaseClient();
  const { judgingRoundId, users } = data;

  try {
    // 1) 현재 DB에 있는 목록 조회
    const { data: oldUsers, error: oldUsersError } = await supabase
      .from("judging_round_user")
      .select("*")
      .eq("judging_round_id", judgingRoundId);

    if (oldUsersError) {
      console.error("조회 실패:", oldUsersError);
      throw new Error(oldUsersError.message);
    }

    // 2) 새 목록을 Map으로(key: user_id)
    const newMap = new Map<string, { group_name: string }>();
    users.forEach((u) => {
      newMap.set(u.user_id, {
        group_name: u.group_name.length === 0 ? "A" : u.group_name,
      });
    });

    // 3) 기존 레코드 중 사라진 user 탐색
    const toDelete = oldUsers.filter((ou) => !newMap.has(ou.user_id));

    // 4) 기존에 없었던 user -> insert
    const oldMap = new Map<string, (typeof oldUsers)[0]>();
    oldUsers.forEach((ou) => {
      oldMap.set(ou.user_id, ou);
    });
    const toInsert = users.filter((u) => !oldMap.has(u.user_id));

    // 5) 둘 다 있는 user -> update
    const toUpdate = users.filter((u) => oldMap.has(u.user_id));

    // (A) 삭제
    if (toDelete.length > 0) {
      const ids = toDelete.map((x) => x.id); // PK id
      const { error: deleteError } = await supabase
        .from("judging_round_user")
        .delete()
        .in("id", ids);

      if (deleteError) {
        console.error("delete error:", deleteError);
        throw new Error(deleteError.message);
      }
    }

    // (B) 삽입
    if (toInsert.length > 0) {
      const insertPayload = toInsert.map((u) => ({
        judging_round_id: judgingRoundId,
        user_id: u.user_id,
        group_name: u.group_name.length === 0 ? "A" : u.group_name,
      }));
      const { error: insertError } = await supabase
        .from("judging_round_user")
        .insert(insertPayload);

      if (insertError) {
        console.error("insert error:", insertError);
        throw new Error(insertError.message);
      }
    }

    // (C) 업데이트
    for (const u of toUpdate) {
      const existing = oldMap.get(u.user_id);
      if (!existing) continue;

      const rowId = existing.id;
      const { error: updateError } = await supabase
        .from("judging_round_user")
        .update({ group_name: u.group_name.length === 0 ? "A" : u.group_name })
        .eq("id", rowId);

      if (updateError) {
        console.error("update error:", updateError);
        throw new Error(updateError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeUser error:", error);
    return { success: false, message: error.message };
  }
}
