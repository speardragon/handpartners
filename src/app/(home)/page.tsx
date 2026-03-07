"use client";

import { useState, useMemo, useCallback } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { judgingQueries } from "@/queries";
import { useAuthStore } from "@/store/useAuthStore";
import { USER_ROLES } from "@/constants/auth";
import { JudgingWorkspaceWithStatus } from "@/actions/program-action";
import ProgramSkeleton from "./_components/ProgramSkeleton";
import { JudgingCard } from "./_components/judging-card";
import WorkspaceTabs from "./_components/WorkspaceTabs";
import WorkspaceEmptyState from "./_components/workspace-empty-state";
import { useRouter } from "next/navigation";
import {
  CalendarX2,
  Search,
  ListChecks,
  Play,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();

  const isAdmin = user ? user.role === USER_ROLES.ADMIN : undefined;

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(
    undefined
  );

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        if (value === "") {
          setSearchKeyword(undefined);
          setPage(1);
        } else {
          setSearchKeyword(value.trim());
          setPage(1);
        }
      }, 500);

      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const { data, isLoading } = useQuery({
    ...judgingQueries.list(page, PAGE_SIZE, isAdmin ?? false, searchKeyword),
    enabled: isAdmin !== undefined,
    placeholderData: keepPreviousData,
  });

  const handleRowClick = useCallback(
    (judging: JudgingWorkspaceWithStatus) => {
      router.push(`/judging/${judging.id}`);
    },
    [router]
  );

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      total: data.totalElements,
      active: data.totalActive,
      completed: data.totalCompleted,
      upcoming: data.totalPending,
    };
  }, [data]);

  const pageNumbers = useMemo(() => {
    if (!data) return [];
    const total = data.totalPages;
    const current = data.currentPage;
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [data]);

  if (isLoading || !data) {
    return <ProgramSkeleton />;
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full text-2xl font-bold text-center">
            {isAdmin ? "전체 심사 목록" : "나의 심사 목록"}
          </div>
          <WorkspaceTabs current="judging" />
        </div>

        {/* 요약 통계 */}
        {stats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-3 bg-white border rounded-lg">
              <ListChecks size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">전체</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border rounded-lg">
              <Play size={18} className="text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">진행 중</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border rounded-lg">
              <CheckCircle2 size={18} className="text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">종료</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white border rounded-lg">
              <Clock size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-muted-foreground">진행 전</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 심사 검색 */}
        <div className="relative">
          <Search
            className="absolute text-gray-400 -translate-y-1/2 top-1/2 left-3"
            size={16}
          />
          <Input
            type="text"
            placeholder="심사 번호 또는 프로그램명으로 검색"
            value={searchInput}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        {data.result.length === 0 && searchKeyword && (
          <WorkspaceEmptyState
            icon={Search}
            eyebrow="No Matches"
            title="검색 결과가 없습니다"
            description={`"${searchKeyword}"와 일치하는 심사나 프로그램을 찾지 못했습니다. 번호를 다시 확인하거나 프로그램명으로 검색해 보세요.`}
            actionLabel="검색 초기화"
            onAction={() => {
              setSearchInput("");
              setSearchKeyword(undefined);
              setPage(1);
            }}
          />
        )}

        {/* 카드 그리드 */}
        {data.result.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.result.map((judging) => (
              <JudgingCard
                key={judging.id}
                judging={judging}
                onClick={handleRowClick}
              />
            ))}
          </div>
        )}

        {data.result.length === 0 && !searchKeyword && (
          <WorkspaceEmptyState
            icon={CalendarX2}
            eyebrow={isAdmin ? "Judging Workspace" : "My Judging"}
            title={
              isAdmin ? "아직 등록된 심사가 없습니다" : "참여 중인 심사가 없습니다"
            }
            description={
              isAdmin
                ? "프로그램에 심사가 연결되면 이 화면에서 전체 진행 현황을 바로 확인할 수 있습니다."
                : "배정된 심사가 생기면 이 화면에서 바로 확인하고 진행할 수 있습니다."
            }
          />
        )}

        {/* 페이지네이션 */}
        {data.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageNumbers[0] > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {pageNumbers[0] > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {pageNumbers.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageNumbers[pageNumbers.length - 1] < data.totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] <
                    data.totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(data.totalPages)}
                      className="cursor-pointer"
                    >
                      {data.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages, p + 1))
                  }
                  className={
                    page >= data.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </main>
  );
}
