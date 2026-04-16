"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { mentoringQueries } from "@/queries";
import ProgramSkeleton from "../_components/ProgramSkeleton";
import WorkspaceTabs from "../_components/WorkspaceTabs";
import { MentoringCard } from "../_components/mentoring-card";
import WorkspaceEmptyState from "../_components/workspace-empty-state";
import type { MentoringListItem } from "@/actions/mentoring-action";
import { useInfiniteScroll } from "@/app/_hooks/useInfiniteScroll";
import {
  CalendarX2,
  CheckCircle2,
  Clock,
  ListChecks,
  Play,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 12;

export default function MentoringPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      setSearchKeyword(trimmed ? trimmed : undefined);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      ...mentoringQueries.infinite(searchKeyword, PAGE_SIZE),
      placeholderData: keepPreviousData,
    });

  const sentinelRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  const stats = useMemo(() => {
    const summary = data?.pages[0];
    if (!summary) return null;
    return {
      total: summary.totalElements,
      active: summary.totalActive,
      completed: summary.totalCompleted,
      pending: summary.totalPending,
    };
  }, [data]);

  const isAdminView = data?.pages[0]?.isAdminView ?? false;

  const handleCardClick = useCallback(
    (mentoring: MentoringListItem) => {
      router.push(`/mentoring/${mentoring.id}`);
    },
    [router]
  );

  if (isLoading || !data) {
    return <ProgramSkeleton />;
  }

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-240 flex-col space-y-4 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full text-center text-2xl font-bold">
            {isAdminView ? "전체 멘토링 목록" : "나의 멘토링 목록"}
          </div>
          <WorkspaceTabs current="mentoring" />
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <ListChecks size={18} className="text-gray-400" />
              <div>
                <p className="text-muted-foreground text-xs">전체</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <Play size={18} className="text-blue-500" />
              <div>
                <p className="text-muted-foreground text-xs">진행 중</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <CheckCircle2 size={18} className="text-green-500" />
              <div>
                <p className="text-muted-foreground text-xs">종료</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-muted-foreground text-xs">진행 전</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="멘토링 번호 또는 프로그램명으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {items.length === 0 && searchKeyword && (
          <WorkspaceEmptyState
            icon={Search}
            eyebrow="검색 결과 없음"
            title="검색 결과가 없습니다"
            description={`"${searchKeyword}"와 일치하는 멘토링이나 프로그램을 찾지 못했습니다. 번호를 다시 확인하거나 프로그램명으로 검색해 보세요.`}
            actionLabel="검색 초기화"
            onAction={() => setSearch("")}
          />
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {items.map((item) => (
              <MentoringCard
                key={item.id}
                mentoring={item}
                isAdminView={isAdminView}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {items.length === 0 && !searchKeyword && (
          <WorkspaceEmptyState
            icon={CalendarX2}
            eyebrow={isAdminView ? "멘토링 워크스페이스" : "내 멘토링"}
            title={
              isAdminView
                ? "아직 등록된 멘토링이 없습니다"
                : "참여 중인 멘토링이 없습니다"
            }
            description={
              isAdminView
                ? "프로그램에 멘토링이 연결되면 이 화면에서 배정과 진행 현황을 함께 확인할 수 있습니다."
                : "배정된 멘토링이 생기면 여기서 기업 선택과 세션 기록을 바로 진행할 수 있습니다."
            }
          />
        )}

        {items.length > 0 && (
          <div className="flex flex-col items-center gap-4 py-2">
            {isFetchingNextPage && (
              <div className="text-sm text-neutral-500">
                멘토링 목록을 더 불러오는 중입니다.
              </div>
            )}
            {hasNextPage ? (
              <div ref={sentinelRef} className="h-4 w-full" />
            ) : (
              <div className="text-sm text-neutral-400">
                모든 멘토링을 확인했습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
