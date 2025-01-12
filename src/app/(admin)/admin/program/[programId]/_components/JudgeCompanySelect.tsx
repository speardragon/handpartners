"use client";

import React, { useEffect, useState } from "react";
import { CompanyRow } from "@/actions/company-action";
import { Separator } from "@/components/ui/separator";
import { useProgramCompanyQuery } from "../../../company/_hooks/useProgramCompanyQuery";
import { useJudgingRoundCompanyQuery } from "../_hooks/useJudgingRoundCompanyQuery";

interface Company {
  id: number;
  name: string;
  pdfFile?: File;
  pdfPath?: string;
  groupName?: string;
}

interface CompanySelectProps {
  judgingRoundId: number;
  programId: number;
  targetList: Company[];
  onTargetListChange: (newList: Company[]) => void;
}

export default function JudgeCompanySelect({
  judgingRoundId,
  programId,
  targetList,
  onTargetListChange,
}: CompanySelectProps) {
  // const [search, setSearch] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  // useCompanyQuery 훅 사용 (10개씩, search)
  const { data: allCompanies } = useProgramCompanyQuery(programId);
  const { data: judgingRoundCompanies } =
    useJudgingRoundCompanyQuery(judgingRoundId);

  // 1) 처음 로드 시, judgingRoundCompanies 로 targetList를 초기화
  useEffect(() => {
    if (judgingRoundCompanies && judgingRoundCompanies.length > 0) {
      const mapped = judgingRoundCompanies.map((item) => ({
        id: item.company_id,
        name: item.company?.name || "",
        pdf_path: item.pdf_path,
        group_name: item.group_name,
      }));
      onTargetListChange(mapped);
    }
    // 만약 라운드에 속한 기업이 없으면 빈 배열로 초기화
    else if (judgingRoundCompanies && judgingRoundCompanies.length === 0) {
      onTargetListChange([]);
    }
  }, [judgingRoundCompanies, onTargetListChange]);

  const sourceList =
    allCompanies?.map((c) => ({ id: c.company_id, name: c.company.name })) ??
    [];

  // 모든 Source 아이템이 선택되었는지 여부 (// 변경 부분)
  const areAllSelected =
    sourceList.length > 0 &&
    sourceList.every((company) => selectedSourceIds.includes(company.id));

  // Source 영역에서 아이템 클릭 시 선택/해제 토글
  const handleSelectSource = (id: number) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Target 영역에서 아이템 클릭 시 선택/해제 토글
  const handleSelectTarget = (id: number) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // ">" 버튼: Source에서 선택된 회사들을 Target으로 이동
  const moveSourceToTarget = () => {
    if (selectedSourceIds.length === 0) return;

    // 이동할 아이템들
    const selectedItems = sourceList.filter((item) =>
      selectedSourceIds.includes(item.id)
    );

    // 이미 target에 있는지 확인해서 중복 방지
    const newTargetItems = selectedItems.filter(
      (si) => !targetList.some((ti) => ti.id === si.id)
    );

    // TargetList 업데이트
    onTargetListChange([...targetList, ...newTargetItems]);

    // 선택 해제
    setSelectedSourceIds([]);
  };

  // // "<" 버튼: Target에서 선택된 회사들을 다시 Source로 이동(이 예시에서는 사실상 Source에서 안 빼도 되지만, 요구사항에 맞춰 구현)
  const moveTargetToSource = () => {
    if (selectedTargetIds.length === 0) return;

    // Target에서 선택된 아이템 제외
    const newTargetList = targetList.filter(
      (item) => !selectedTargetIds.includes(item.id)
    );

    onTargetListChange(newTargetList);
    setSelectedTargetIds([]);
  };

  // 전체 선택/해제 핸들러 (// 변경 부분)
  const toggleSelectAllSource = () => {
    // Source 아이템이 하나도 없으면 그냥 반환
    if (sourceList.length === 0) return;

    // 이미 모두 선택된 경우 해제
    if (areAllSelected) {
      setSelectedSourceIds([]);
    } else {
      // 모두 선택되지 않은 경우, 전체 선택
      setSelectedSourceIds(sourceList.map((company) => company.id));
    }
  };

  return (
    <div className="flex w-full gap-1 items-center">
      {/* Source 영역 */}
      <div className="w-1/2 h-80 space-y-2 border border-gray-200 p-2 rounded-md flex flex-col">
        <div className="text-sm font-semibold">
          기업 리스트 ({selectedSourceIds.length}개 선택중)
        </div>
        {/* 검색 인풋 */}
        {/* <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="기업명 검색"
          className="border p-1 w-full rounded-md"
        /> */}
        {/* 전체 선택/해제 버튼 (// 변경 부분) */}
        <div
          onClick={toggleSelectAllSource}
          className="border p-1 text-center rounded-md cursor-pointer text-xs bg-gray-100 hover:bg-gray-200"
        >
          {areAllSelected ? "전체 해제" : "전체 선택"}
        </div>
        {/* 검색된 회사 리스트 (무한 스크롤) */}
        <div className="flex-1 overflow-auto">
          {sourceList.map((company) => {
            const isSelected = selectedSourceIds.includes(company.id);
            return (
              <div
                key={company.id}
                onClick={() => handleSelectSource(company.id)}
                className={`p-2 border-b cursor-pointer ${
                  isSelected ? "bg-blue-100" : "bg-white"
                } hover:bg-blue-50`}
              >
                {company.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col gap-2">
        <div
          className="rounded-md p-1 px-2 bg-green-200 hover:bg-green-400 cursor-pointer"
          onClick={moveSourceToTarget}
        >
          {">"}
        </div>
        <div
          className="rounded-md p-1 px-2 bg-blue-200 hover:bg-blue-400 cursor-pointer"
          onClick={moveTargetToSource}
        >
          {"<"}
        </div>
      </div>

      {/* Target 영역 */}
      <div className="w-1/2 h-80 space-y-2 border border-gray-200 p-2 rounded-md flex flex-col ">
        <div className="text-sm font-semibold">
          선택된 기업 ({targetList.length}개)
        </div>
        <Separator />
        <div className="overflow-y-auto">
          {targetList.map((company) => {
            const isSelected = selectedTargetIds.includes(company.id);
            return (
              <div
                key={company.id}
                onClick={() => handleSelectTarget(company.id)}
                className={`p-2 border-b cursor-pointer ${
                  isSelected ? "bg-green-100" : "bg-white"
                } hover:bg-green-50`}
              >
                {company.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
