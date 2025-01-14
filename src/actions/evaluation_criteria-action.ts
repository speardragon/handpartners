"use server";

// -----------------------------------
// /actions/judging_round_criteria-action.ts
// -----------------------------------
import { createServerSupabaseClient } from "../utils/supabase/server";

/**
 * 특정 judgingRoundId에 대한 evaluation_criteria 목록 조회
 */
export async function getJudgingCriteriaByRound(judgingRoundId: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("evaluation_criteria")
    .select("*")
    .eq("judging_round_id", judgingRoundId);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export interface CriteriaItemPayload {
  id?: number; // 새로 추가 시에는 undefined 가능
  item_name: string;
  points: number;
  description?: string | null;
}

export interface UpdateJudgeCriteriaData {
  judgingRoundId: number;
  criteriaList: CriteriaItemPayload[];
}

/**
 * 심사 기준(evaluation_criteria) 업데이트
 *   - 기존 레코드 조회
 *   - 새 목록과 비교 → 삽입/삭제/업데이트
 */
export async function updateJudgeCriteria(data: UpdateJudgeCriteriaData) {
  const supabase = await createServerSupabaseClient();
  const { judgingRoundId, criteriaList } = data;

  try {
    // 1) 기존 레코드 조회
    const { data: oldCriteria, error: oldCriteriaError } = await supabase
      .from("evaluation_criteria")
      .select("*")
      .eq("judging_round_id", judgingRoundId);

    if (oldCriteriaError) {
      console.error("oldCriteriaError:", oldCriteriaError);
      throw new Error(oldCriteriaError.message);
    }

    // 2) 새 목록을 Map으로(key: id - 단, 새 항목은 id가 없을 수 있음)
    //    여기서는 id가 없는 항목 → 새로 추가
    const oldMap = new Map<number, (typeof oldCriteria)[0]>();
    oldCriteria?.forEach((oc) => {
      oldMap.set(oc.id, oc);
    });

    // 3) 삭제 대상: 기존 레코드 중, 새 목록에 없는 것
    //    (즉, oldCriteria 중에서 id가 새 criteriaList 내에 존재하지 않는 항목)
    const newIds = criteriaList.map((c) => c.id).filter(Boolean) as number[];
    const toDelete = oldCriteria?.filter((oc) => !newIds.includes(oc.id)) || [];

    // 4) 추가/업데이트 대상: criteriaList 반복
    const toInsert: Omit<CriteriaItemPayload, "id">[] = [];
    const toUpdate: Array<{ rowId: number; payload: CriteriaItemPayload }> = [];

    for (const newItem of criteriaList) {
      if (typeof newItem.id === "number") {
        // 이미 존재하는 레코드(업데이트)
        const oldItem = oldMap.get(newItem.id);
        if (!oldItem) {
          // 혹시라도 DB에 없는 id인데 id만 들어온 경우 → insert 처리해도 무방
          toInsert.push({
            item_name: newItem.item_name,
            points: newItem.points,
            description: newItem.description ?? null,
          });
        } else {
          // 정상적으로 DB에 있는 항목 → update
          toUpdate.push({
            rowId: oldItem.id,
            payload: newItem,
          });
        }
      } else {
        // id가 없다면 새로 추가되는 항목
        toInsert.push({
          item_name: newItem.item_name,
          points: newItem.points,
          description: newItem.description ?? null,
        });
      }
    }

    // 5) 삭제
    if (toDelete.length > 0) {
      const deleteIds = toDelete.map((c) => c.id);
      const { error: deleteError } = await supabase
        .from("evaluation_criteria")
        .delete()
        .in("id", deleteIds);
      if (deleteError) {
        console.error("deleteError:", deleteError);
        throw new Error(deleteError.message);
      }
    }

    // 6) 추가
    if (toInsert.length > 0) {
      // judging_round_id 세팅
      const insertPayload = toInsert.map((c) => ({
        judging_round_id: judgingRoundId,
        item_name: c.item_name,
        points: c.points,
        description: c.description ?? null,
      }));

      const { error: insertError } = await supabase
        .from("evaluation_criteria")
        .insert(insertPayload);

      if (insertError) {
        console.error("insertError:", insertError);
        throw new Error(insertError.message);
      }
    }

    // 7) 업데이트
    for (const updateObj of toUpdate) {
      const { rowId, payload } = updateObj;
      const { item_name, points, description } = payload;

      const { error: updateError } = await supabase
        .from("evaluation_criteria")
        .update({
          item_name,
          points,
          description: description ?? null,
        })
        .eq("id", rowId);

      if (updateError) {
        console.error("updateError:", updateError);
        throw new Error(updateError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error("updateJudgeCriteria error:", error);
    return { success: false, message: error.message };
  }
}
