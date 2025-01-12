"use client";

import React, { memo, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useJudgingRoundUserQuery } from "../_hooks/useJudgingRoundUserQuery";
import InfiniteScroll from "react-infinite-scroller";
import { useUserInfiniteQuery } from "../_hooks/useUserInfiniteQuery";
import Loading from "@/app/_components/Loading";
import { isEqual } from "lodash";

interface User {
  id: string;
  name: string;
  affiliation: string;
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
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);

  const {
    data: allUsers,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useUserInfiniteQuery();
  const { data: judgingRoundUsers } = useJudgingRoundUserQuery(judgingRoundId);

  // 1) 처음 로드 시, judgingRoundUsers 로 targetList를 초기화
  useEffect(() => {
    if (judgingRoundUsers && judgingRoundUsers.length > 0) {
      const mapped = judgingRoundUsers.map((item) => ({
        id: item.user_id,
        name: item.user.username || "",
        affiliation: item.user?.affiliation || "",
        group_name: item.group_name,
      }));
      onTargetListChange(mapped);
    }
    // 만약 라운드에 속한 기업이 없으면 빈 배열로 초기화
    else if (judgingRoundUsers && judgingRoundUsers.length === 0) {
      onTargetListChange([]);
    }
  }, [judgingRoundUsers, onTargetListChange]);

  const sourceFlatList = allUsers?.pages.flatMap((page) => page.result) ?? [];
  const sourceList =
    sourceFlatList.map((c) => ({
      id: c.id,
      name: c.username,
      affiliation: c.affiliation,
    })) ?? [];

  // Source 영역에서 아이템 클릭 시 선택/해제 토글
  const handleSelectSource = (id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Target 영역에서 아이템 클릭 시 선택/해제 토글
  const handleSelectTarget = (id: string) => {
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
          심사자 리스트 ({selectedSourceIds.length}개 선택중)
        </div>
        {/* 검색 인풋 */}
        {/* <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="이름 검색"
          className="border p-1 w-full rounded-md"
        /> */}
        {/* 검색된 유저 리스트 (무한 스크롤) */}{" "}
        <div className="flex-1 overflow-auto">
          <InfiniteScroll
            pageStart={1}
            loadMore={loadMore}
            hasMore={!!hasNextPage}
            useWindow={false} // 특정 영역에 스크롤바를 사용하기 위해 false
            loader={<Loading key="loader" />}
          >
            {sourceList.map((user) => {
              const isSelected = selectedSourceIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  onClick={() => handleSelectSource(user.id)}
                  className={`p-2 border-b cursor-pointer ${
                    isSelected ? "bg-blue-100" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  {user.name}
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
          선택된 심사자 ({targetList.length}명)
        </div>
        <Separator />
        <div className="overflow-y-auto">
          {targetList.map((user) => {
            const isSelected = selectedTargetIds.includes(user.id);
            return (
              <div
                key={user.id}
                onClick={() => handleSelectTarget(user.id)}
                className={`p-2 border-b cursor-pointer ${
                  isSelected ? "bg-green-100" : "bg-white"
                } hover:bg-green-50`}
              >
                {user.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(JudgeUserSelect);
