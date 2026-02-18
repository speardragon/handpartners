"use client";

import { memo, useEffect, useState } from "react";
import { useJudgingRoundUserQuery } from "../_hooks/useJudgingRoundUserQuery";
import InfiniteScroll from "react-infinite-scroller";
import { useUserInfiniteQuery } from "../_hooks/useUserInfiniteQuery";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Loader2, Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  affiliation: string | null;
}

interface JudgeUserSelectProps {
  judgingRoundId: number;
  targetList: User[];
  onTargetListChange: (newList: User[]) => void;
}

function JudgeUserSelect({
  judgingRoundId,
  targetList,
  onTargetListChange,
}: JudgeUserSelectProps) {
  const [search, setSearch] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  const {
    data: allUsers,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useUserInfiniteQuery(search);
  const { data: judgingRoundUsers } = useJudgingRoundUserQuery(judgingRoundId);

  useEffect(() => {
    if (judgingRoundUsers && judgingRoundUsers.length > 0) {
      const mapped = judgingRoundUsers.map((item: any) => ({
        id: item.user_id,
        name: item.user.username || "",
        affiliation: item.user?.affiliation || "",
        group_name: item.group_name,
      }));
      onTargetListChange(mapped);
    } else if (judgingRoundUsers && judgingRoundUsers.length === 0) {
      onTargetListChange([]);
    }
  }, [judgingRoundUsers, onTargetListChange]);

  const sourceFlatList = allUsers?.pages.flatMap((page) => page.result) ?? [];
  const sourceList = sourceFlatList.map((c) => ({
    id: c.id,
    name: c.username,
    affiliation: c.affiliation,
  }));

  const handleSelectSource = (id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectTarget = (id: string) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const moveSourceToTarget = () => {
    if (selectedSourceIds.length === 0) return;
    const selectedItems = sourceList.filter((item) =>
      selectedSourceIds.includes(item.id)
    );
    const newTargetItems = selectedItems.filter(
      (si) => !targetList.some((ti) => ti.id === si.id)
    );
    onTargetListChange([...targetList, ...newTargetItems]);
    setSelectedSourceIds([]);
  };

  const moveTargetToSource = () => {
    if (selectedTargetIds.length === 0) return;
    const newTargetList = targetList.filter(
      (item) => !selectedTargetIds.includes(item.id)
    );
    onTargetListChange(newTargetList);
    setSelectedTargetIds([]);
  };

  const loadMore = () => {
    if (!isLoading && hasNextPage) {
      setTimeout(() => {
        fetchNextPage();
      }, 1000);
    }
  };

  return (
    <div className="flex w-full items-stretch gap-2">
      {/* Source - 전체 심사자 */}
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            전체 심사자
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
            {selectedSourceIds.length}개 선택
          </span>
        </div>
        <div className="border-b border-neutral-100 px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 소속 검색"
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="h-52 overflow-y-auto">
          <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={!!hasNextPage}
            useWindow={false}
            loader={
              <div key="loader" className="flex justify-center py-3">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            }
          >
            {sourceList.map((user) => {
              const isSelected = selectedSourceIds.includes(user.id);
              const isInTarget = targetList.some((t) => t.id === user.id);
              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm transition-colors ${
                    isInTarget
                      ? "cursor-default bg-neutral-50 text-neutral-400"
                      : isSelected
                        ? "cursor-pointer bg-neutral-100"
                        : "cursor-pointer hover:bg-neutral-50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected || isInTarget}
                    disabled={isInTarget}
                    onCheckedChange={() => handleSelectSource(user.id)}
                    className="h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    {user.affiliation && (
                      <span className="text-xs text-neutral-400">
                        {user.affiliation}
                      </span>
                    )}
                  </div>
                  {isInTarget && (
                    <span className="ml-auto text-xs text-neutral-400">
                      추가됨
                    </span>
                  )}
                </label>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>

      {/* Transfer buttons */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={moveSourceToTarget}
          disabled={selectedSourceIds.length === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={moveTargetToSource}
          disabled={selectedTargetIds.length === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Target - 선택된 심사자 */}
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            선택된 심사자
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
            {targetList.length}명
          </span>
        </div>
        <div className="h-52 overflow-y-auto">
          {targetList.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              심사자를 선택해주세요
            </div>
          ) : (
            targetList.map((user) => {
              const isSelected = selectedTargetIds.includes(user.id);
              return (
                <label
                  key={user.id}
                  className={`flex cursor-pointer items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm transition-colors ${
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectTarget(user.id)}
                    className="h-4 w-4"
                  />
                  <span>{user.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(JudgeUserSelect);
