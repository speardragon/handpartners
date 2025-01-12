"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useProgramCompanyQuery } from "../../company/_hooks/useProgramCompanyQuery";
import Loading from "@/app/_components/Loading";
import { useCompanyInfiniteQuery } from "../../company/_hooks/useCompanyInfiniteQuery";
import InfiniteScroll from "react-infinite-scroller";

interface Company {
  id: number;
  name: string;
}

interface CompanySelectForModifyProps {
  programId?: number;
  targetList: Company[]; // 이미 선택된(타겟) 기업 목록
  onTargetListChange: (newList: Company[]) => void;
}

export default function CompanySelectForModify({
  programId,
  targetList,
  onTargetListChange,
}: CompanySelectForModifyProps) {
  const [search, setSearch] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<number[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isInfiniteLoading,
    refetch,
  } = useCompanyInfiniteQuery(search);

  const { data: allCompanies, isLoading } = useProgramCompanyQuery(programId);
  const sourceList = data?.pages.flatMap((page) => page.result) ?? [];

  useEffect(() => {
    if (!isLoading && allCompanies && allCompanies.length > 0) {
      if (targetList.length === 0) {
        // allCompanies를 { id, name } 형태로 변환
        const mapped = allCompanies.map((pc) => ({
          id: pc.company_id,
          name: pc.company?.name ?? `Company #${pc.company_id}`,
        }));
        onTargetListChange(mapped);
      }
    }
  }, [isLoading, allCompanies, targetList.length, onTargetListChange]);

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  // Source에서 클릭 시 선택/해제
  const handleSelectSource = (id: number) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Target에서 클릭 시 선택/해제
  const handleSelectTarget = (id: number) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // ">" 버튼: Source -> Target
  const moveSourceToTarget = () => {
    if (selectedSourceIds.length === 0) return;

    const selectedItems = sourceList.filter((item) =>
      selectedSourceIds.includes(item.id)
    );

    // 이미 targetList에 있는 항목 중복 방지
    const newTargetItems = selectedItems.filter(
      (si) => !targetList.some((ti) => ti.id === si.id)
    );

    onTargetListChange([...targetList, ...newTargetItems]);
    setSelectedSourceIds([]);
  };

  // "<" 버튼: Target -> Source (삭제)
  const moveTargetToSource = () => {
    if (selectedTargetIds.length === 0) return;

    const newTargetList = targetList.filter(
      (item) => !selectedTargetIds.includes(item.id)
    );

    onTargetListChange(newTargetList);
    setSelectedTargetIds([]);
  };

  const loadMore = () => {
    if (!isInfiniteLoading && hasNextPage) {
      setTimeout(() => {
        fetchNextPage();
      }, 1000); // 1초 딜레이
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full gap-1 items-center">
      {/* Source 영역 */}
      <div className="w-1/2 h-80 space-y-2 border border-gray-200 p-2 rounded-md flex flex-col">
        <div className="text-sm font-semibold">
          기업 리스트 ({selectedSourceIds.length}개 선택중)
        </div>

        <Separator />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="기업명 검색"
          className="border p-1 w-full rounded-md"
        />
        {/* 검색된 회사 리스트 (무한 스크롤) */}
        <div className="flex-1 overflow-auto">
          <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={!!hasNextPage}
            useWindow={false} // 특정 영역에 스크롤바를 사용하기 위해 false
            loader={<Loading key="loader" />}
          >
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
          </InfiniteScroll>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-col gap-2 pt-16">
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
      <div className="w-1/2 h-80 space-y-2 border border-gray-200 p-2 rounded-md flex flex-col">
        <div className="text-sm font-semibold">
          선택된 기업 ({targetList.length}개)
        </div>
        <Separator />
        <div className="flex-1 overflow-auto">
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
