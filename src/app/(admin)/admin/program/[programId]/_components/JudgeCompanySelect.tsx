"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { programQueries, judgingRoundQueries } from "@/queries";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ChevronLeft } from "lucide-react";

import type { SimpleCompany } from "./JudgeEditForm";

interface CompanySelectProps {
  judgingRoundId: string;
  programId: number;
  targetList: SimpleCompany[];
  onTargetListChange: (newList: SimpleCompany[]) => void;
}

export default function JudgeCompanySelect({
  judgingRoundId,
  programId,
  targetList,
  onTargetListChange,
}: CompanySelectProps) {
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  const { data: allCompanies } = useQuery(programQueries.companies(programId));
  const { data: judgingRoundCompanies } = useQuery(
    judgingRoundQueries.companies.byRound(judgingRoundId)
  );

  useEffect(() => {
    if (judgingRoundCompanies && judgingRoundCompanies.length > 0) {
      const mapped = judgingRoundCompanies.map((item) => ({
        id: item.company_id,
        name: item.company?.name || "",
        pdf_path: item.pdf_path ?? undefined,
        group_name: item.group_name ?? undefined,
        judge_num: item.judge_num ?? undefined,
        original_filename: item.original_filename ?? undefined,
        submitted_at: item.submitted_at ?? undefined,
      }));
      onTargetListChange(mapped);
    } else if (judgingRoundCompanies && judgingRoundCompanies.length === 0) {
      onTargetListChange([]);
    }
  }, [judgingRoundCompanies, onTargetListChange]);

  const sourceList =
    allCompanies?.map((c) => ({
      id: c.company_id,
      name: c.company?.name ?? "",
    })) ?? [];

  const areAllSelected =
    sourceList.length > 0 &&
    sourceList.every((company) => selectedSourceIds.includes(company.id));

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

  const toggleSelectAllSource = () => {
    if (sourceList.length === 0) return;
    if (areAllSelected) {
      setSelectedSourceIds([]);
    } else {
      setSelectedSourceIds(sourceList.map((company) => company.id));
    }
  };

  return (
    <div className="flex w-full items-stretch gap-2">
      {/* Source - 프로그램 참여 기업 */}
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            프로그램 참여 기업
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
            {selectedSourceIds.length}개 선택
          </span>
        </div>
        <div className="border-b border-neutral-100 px-3 py-1.5">
          <button
            type="button"
            onClick={toggleSelectAllSource}
            className="w-full rounded-md px-2 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            {areAllSelected ? "전체 해제" : "전체 선택"}
          </button>
        </div>
        <div className="h-52 overflow-y-auto">
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
          {sourceList.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              프로그램에 등록된 기업이 없습니다
            </div>
          )}
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

      {/* Target - 심사 참여 기업 */}
      <div className="flex flex-1 flex-col rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-700">
            심사 참여 기업
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-medium text-white">
            {targetList.length}개
          </span>
        </div>
        <div className="h-60 overflow-y-auto">
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
