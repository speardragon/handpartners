"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { programQueries } from "@/queries";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface MentoringSelectableCompany {
  id: number;
  name: string;
  representative_name?: string | null;
}

interface Props {
  programId: number;
  targetList: MentoringSelectableCompany[];
  onTargetListChange: (list: MentoringSelectableCompany[]) => void;
}

export default function MentoringCompanySelect({
  programId,
  targetList,
  onTargetListChange,
}: Props) {
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  const { data: allCompanies, isLoading } = useQuery(
    programQueries.companies(programId)
  );

  const sourceList =
    allCompanies?.map((item) => ({
      id: item.company_id,
      name: item.company?.name ?? "",
      representative_name: item.company?.representative_name ?? null,
    })) ?? [];

  const handleSelectSource = (id: number) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleSelectTarget = (id: number) => {
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
            프로그램 참여 기업
          </span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {selectedSourceIds.length}개 선택
          </span>
        </div>
        <div className="h-56 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          ) : (
            sourceList.map((company) => {
              const isSelected = selectedSourceIds.includes(company.id);
              const isAdded = targetList.some(
                (target) => target.id === company.id
              );
              return (
                <label
                  key={company.id}
                  className={`flex items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm ${
                    isAdded
                      ? "cursor-default bg-neutral-50 text-neutral-400"
                      : "cursor-pointer hover:bg-neutral-50"
                  } ${isSelected ? "bg-neutral-100" : ""}`}
                >
                  <Checkbox
                    checked={isSelected || isAdded}
                    disabled={isAdded}
                    onCheckedChange={() => handleSelectSource(company.id)}
                  />
                  <div className="flex flex-col">
                    <span>{company.name}</span>
                    {company.representative_name && (
                      <span className="text-xs text-neutral-400">
                        대표자 {company.representative_name}
                      </span>
                    )}
                  </div>
                </label>
              );
            })
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
            멘토링 대상 기업
          </span>
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
            {targetList.length}개
          </span>
        </div>
        <div className="h-56 overflow-y-auto">
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
                  className={`flex cursor-pointer items-center gap-2.5 border-b border-neutral-50 px-3 py-2 text-sm ${
                    isSelected ? "bg-neutral-100" : "hover:bg-neutral-50"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleSelectTarget(company.id)}
                  />
                  <div className="flex flex-col">
                    <span>{company.name}</span>
                    {company.representative_name && (
                      <span className="text-xs text-neutral-400">
                        대표자 {company.representative_name}
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
