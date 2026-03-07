"use client";

import { memo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userQueries } from "@/queries";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";

export interface MentoringSelectableUser {
  id: string;
  name: string;
  affiliation: string | null;
}

interface Props {
  targetList: MentoringSelectableUser[];
  onTargetListChange: (list: MentoringSelectableUser[]) => void;
}

function MentoringUserSelect({ targetList, onTargetListChange }: Props) {
  const [search, setSearch] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  const {
    data: allUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(userQueries.infinite(search));

  const sentinelRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const sourceList =
    allUsers?.pages.flatMap((page) =>
      page.result.map((user) => ({
        id: user.id,
        name: user.username,
        affiliation: user.affiliation,
      }))
    ) ?? [];

  const handleSelectSource = (id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleSelectTarget = (id: string) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const moveSourceToTarget = () => {
    const selectedItems = sourceList.filter((item) =>
      selectedSourceIds.includes(item.id)
    );
    const deduped = selectedItems.filter(
      (item) => !targetList.some((target) => target.id === item.id)
    );
    onTargetListChange([...targetList, ...deduped]);
    setSelectedSourceIds([]);
  };

  const moveTargetToSource = () => {
    onTargetListChange(
      targetList.filter((item) => !selectedTargetIds.includes(item.id))
    );
    setSelectedTargetIds([]);
  };

  return (
    <div className="flex w-full items-stretch gap-2">
      <div className="flex flex-1 flex-col rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            전체 사용자
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {selectedSourceIds.length}명 선택
          </span>
        </div>
        <div className="border-b border-neutral-100 px-3 py-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 소속 검색"
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="h-56 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          ) : (
            <>
              {sourceList.map((user) => {
                const isSelected = selectedSourceIds.includes(user.id);
                const isAdded = targetList.some(
                  (target) => target.id === user.id
                );
                return (
                  <label
                    key={user.id}
                    className={`flex items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm ${
                      isAdded
                        ? "cursor-default bg-neutral-50 text-neutral-400"
                        : "cursor-pointer hover:bg-neutral-50"
                    } ${isSelected ? "bg-neutral-100" : ""}`}
                  >
                    <Checkbox
                      checked={isSelected || isAdded}
                      disabled={isAdded}
                      onCheckedChange={() => handleSelectSource(user.id)}
                    />
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      {user.affiliation && (
                        <span className="text-xs text-neutral-400">
                          {user.affiliation}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
              {isFetchingNextPage && (
                <div className="flex justify-center py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                </div>
              )}
              <div ref={sentinelRef} />
            </>
          )}
        </div>
      </div>

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

      <div className="flex flex-1 flex-col rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            멘토링 참여 멘토
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
            {targetList.length}명
          </span>
        </div>
        <div className="h-56 overflow-y-auto">
          {targetList.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              멘토를 선택해주세요
            </div>
          ) : (
            targetList.map((user) => {
              const isSelected = selectedTargetIds.includes(user.id);
              return (
                <label
                  key={user.id}
                  className={`flex cursor-pointer items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm ${
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectTarget(user.id)}
                  />
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    {user.affiliation && (
                      <span className="text-xs text-neutral-400">
                        {user.affiliation}
                      </span>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MentoringUserSelect);
