"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { companyQueries } from "@/queries";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import { CompanyRow } from "@/actions/company-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft, Search, Loader2 } from "lucide-react";

interface CompanySelectProps {
  targetList: CompanyRow[];
  onTargetListChange: (newList: CompanyRow[]) => void;
}

export default function CompanySelect({
  targetList,
  onTargetListChange,
}: CompanySelectProps) {
  const [search, setSearch] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(companyQueries.infinite(search));

  const sentinelRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const sourceList = data?.pages.flatMap((page) => page.result) ?? [];

  const handleSelectSource = (id: number) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectTarget = (id: number) => {
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

  return (
    <div className="flex w-full items-stretch gap-2">
      {/* Source — 전체 기업 */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            전체 기업
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
            {selectedSourceIds.length}개 선택
          </span>
        </div>
        <div className="shrink-0 border-b border-neutral-100 px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="기업명 검색"
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="h-60 shrink-0 overflow-y-auto">
          {sourceList.map((company) => {
            const isSelected = selectedSourceIds.includes(company.id);
            const isInTarget = targetList.some((t) => t.id === company.id);
            return (
              <label
                key={company.id}
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
                  onCheckedChange={() => handleSelectSource(company.id)}
                  className="h-4 w-4"
                />
                <span>{company.name}</span>
                {isInTarget && (
                  <span className="ml-auto text-xs text-neutral-400">
                    추가됨
                  </span>
                )}
              </label>
            );
          })}
          {isFetchingNextPage && (
            <div className="flex justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          )}
          <div ref={sentinelRef} />
        </div>
      </div>

      {/* Transfer buttons */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-2">
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

      {/* Target — 선택된 기업 */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            선택된 기업
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
            {targetList.length}개
          </span>
        </div>
        <div className="h-60 shrink-0 overflow-y-auto">
          {targetList.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              기업을 선택해주세요
            </div>
          ) : (
            targetList.map((company) => {
              const isSelected = selectedTargetIds.includes(company.id);
              return (
                <label
                  key={company.id}
                  className={`flex cursor-pointer items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm transition-colors ${
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectTarget(company.id)}
                    className="h-4 w-4"
                  />
                  <span>{company.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
