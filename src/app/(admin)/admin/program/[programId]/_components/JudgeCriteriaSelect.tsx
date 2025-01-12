"use client";

import { useEffect } from "react";
import { useJudgingCriteriaQuery } from "../_hooks/useJudgingCriteriaQuery";
import { Input } from "@/components/ui/input";

export interface CriteriaItem {
  id?: number;
  item_name: string;
  points: number;
  description?: string | null;
}

type Props = {
  judgingRoundId?: number;
  targetList: CriteriaItem[];
  onTargetListChange: (list: CriteriaItem[]) => void;
};

export default function JudgeCriteriaSelect({
  judgingRoundId,
  targetList,
  onTargetListChange,
}: Props) {
  // (1) 심사 기준 목록 가져오기 (React Query)
  const { data, isLoading, isError, error } = useJudgingCriteriaQuery(
    judgingRoundId || 0
  );

  // (2) 데이터가 로딩 완료되면 targetList 초기화
  useEffect(() => {
    if (!isLoading && data) {
      onTargetListChange(data); // 부모로부터 받은 setter
    }
  }, [data, isLoading, onTargetListChange]);

  // 이하 UI ...
  const handleAdd = () => {
    onTargetListChange([
      ...targetList,
      { id: undefined, item_name: "", points: 0, description: null },
    ]);
  };

  const handleDelete = (index: number) => {
    const newList = [...targetList];
    newList.splice(index, 1);
    onTargetListChange(newList);
  };

  const handleChange = (
    index: number,
    key: "item_name" | "points" | "description",
    value: string | number
  ) => {
    const newList = [...targetList];
    (newList[index] as any)[key] = value;
    onTargetListChange(newList);
  };

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <div>에러 발생: {String(error)}</div>;

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="px-3 py-2 text-sm bg-blue-50 rounded border border-blue-500"
        onClick={handleAdd}
      >
        + 심사 기준 추가
      </button>

      {targetList.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2 border p-2 rounded">
          <Input
            className="border p-1 w-40"
            placeholder="기준명"
            value={item.item_name}
            onChange={(e) => handleChange(idx, "item_name", e.target.value)}
          />
          <Input
            type="number"
            className="border p-1 w-24"
            placeholder="배점"
            value={item.points}
            onChange={(e) =>
              handleChange(idx, "points", Number(e.target.value))
            }
          />
          <Input
            className="border p-1 flex-1"
            placeholder="설명(선택)"
            value={item.description ?? ""}
            onChange={(e) => handleChange(idx, "description", e.target.value)}
          />
          <div
            className="text-sm text-red-500 cursor-pointer hover:underline"
            onClick={() => handleDelete(idx)}
          >
            삭제
          </div>
        </div>
      ))}
    </div>
  );
}
