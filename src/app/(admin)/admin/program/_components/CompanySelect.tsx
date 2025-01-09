"use client";

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useCompanyInfiniteQuery } from "../../company/_hooks/useCompanyInfiniteQuery";
import { CompanyRow } from "@/actions/company-action";
import { Separator } from "@/components/ui/separator";

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

  // useCompanyQuery 훅 사용 (10개씩, search)
  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useCompanyInfiniteQuery(search);

  // 무한 스크롤로 로딩할 데이터 (sourceList)
  // => react-query의 infiniteQuery 구조상 pages 배열 형태
  //    [ { result: CompanyRow[] ... }, { result: CompanyRow[] ... }, ... ]
  const sourceList = data?.pages.flatMap((page) => page.result) ?? [];

  /**
   * 검색어 변경 시 첫 페이지부터 다시 불러오도록 refetch
   */
  useEffect(() => {
    // react-query의 경우, queryKey가 변하면 자동으로 refetch 되지만
    // search가 바뀔 때마다 pageParam을 1로 리셋하고 싶으면
    // 아래처럼 수동으로 처리하거나, queryKey에 search를 넣으면 알아서 해주기도 합니다.
    // 여기서는 간단히 refetch만 호출.
    refetch();
  }, [search, refetch]);

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

  // "<" 버튼: Target에서 선택된 회사들을 다시 Source로 이동(이 예시에서는 사실상 Source에서 안 빼도 되지만, 요구사항에 맞춰 구현)
  const moveTargetToSource = () => {
    if (selectedTargetIds.length === 0) return;

    // Target에서 선택된 아이템 제외
    const newTargetList = targetList.filter(
      (item) => !selectedTargetIds.includes(item.id)
    );

    onTargetListChange(newTargetList);
    setSelectedTargetIds([]);
  };

  // Source 무한 스크롤 로드
  const loadMore = () => {
    if (!isLoading && hasNextPage) {
      setTimeout(() => {
        fetchNextPage();
      }, 1000); // 1초 딜레이
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
            loader={<div key="loader">Loading...</div>}
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
