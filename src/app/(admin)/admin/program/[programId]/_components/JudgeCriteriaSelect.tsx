"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { judgingRoundQueries } from "@/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface CriteriaItem {
  id?: number;
  item_name: string;
  points: number;
  description?: string | null;
}

type Props = {
  judgingRoundId?: string;
  targetList: CriteriaItem[];
  onTargetListChange: (list: CriteriaItem[]) => void;
};

export default function JudgeCriteriaSelect({
  judgingRoundId,
  targetList,
  onTargetListChange,
}: Props) {
  const [editingPoints, setEditingPoints] = useState<{
    index: number;
    value: string;
  } | null>(null);

  const { data, isLoading, isError, error } = useQuery(
    judgingRoundQueries.criteria.byRound(judgingRoundId || "0")
  );

  useEffect(() => {
    if (!isLoading && data) {
      onTargetListChange(data);
    }
  }, [data, isLoading, onTargetListChange]);

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
    setEditingPoints((prev) => {
      if (!prev) return null;
      if (prev.index === index) return null;
      if (prev.index > index) {
        return { ...prev, index: prev.index - 1 };
      }
      return prev;
    });
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

  const handlePointsFocus = (index: number, currentPoints: number) => {
    setEditingPoints({
      index,
      value: currentPoints === 0 ? "" : String(currentPoints),
    });
  };

  const handlePointsChange = (index: number, rawValue: string) => {
    setEditingPoints({ index, value: rawValue });
    if (rawValue === "") {
      handleChange(index, "points", 0);
      return;
    }

    const nextPoints = Number(rawValue);
    handleChange(index, "points", Number.isNaN(nextPoints) ? 0 : nextPoints);
  };

  const handlePointsBlur = () => {
    setEditingPoints(null);
  };

  if (isLoading)
    return (
      <div className="py-4 text-center text-sm text-neutral-500">
        불러오는 중...
      </div>
    );
  if (isError)
    return (
      <div className="py-4 text-center text-sm text-red-500">
        에러 발생: {String(error)}
      </div>
    );

  const totalPoints = targetList.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4" />
          기준 추가
        </Button>
        <span className="text-sm text-neutral-500">
          총 배점:{" "}
          <span className="font-semibold text-neutral-900">
            {totalPoints}점
          </span>
        </span>
      </div>

      {targetList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 py-8 text-center text-sm text-neutral-400">
          심사 기준을 추가해주세요
        </div>
      ) : (
        <div className="space-y-2">
          {targetList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3"
            >
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  className="h-9 sm:w-40"
                  placeholder="기준명"
                  value={item.item_name}
                  onChange={(e) =>
                    handleChange(idx, "item_name", e.target.value)
                  }
                />
                <Input
                  type="number"
                  className="h-9 sm:w-24"
                  placeholder="배점"
                  value={
                    editingPoints?.index === idx
                      ? editingPoints.value
                      : String(item.points)
                  }
                  onFocus={() => handlePointsFocus(idx, item.points)}
                  onChange={(e) => handlePointsChange(idx, e.target.value)}
                  onBlur={handlePointsBlur}
                />
                <Input
                  className="h-9 flex-1"
                  placeholder="설명 (선택)"
                  value={item.description ?? ""}
                  onChange={(e) =>
                    handleChange(idx, "description", e.target.value)
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-neutral-400 hover:text-red-500"
                onClick={() => handleDelete(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
