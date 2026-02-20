"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { screeningQueries, userQueries } from "@/queries";
import { ScreeningWithStatus } from "@/actions/program-action";
import ProgramSkeleton from "./_components/ProgramSkeleton";
import { ScreeningCard } from "./_components/screening-card";
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
  const { data: profile } = useQuery(userQueries.profile());

  const isAdmin = profile ? profile.role === "관리자" : undefined;

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [judgingRoundId, setJudgingRoundId] = useState<string | undefined>(
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
          setJudgingRoundId(undefined);
          setPage(1);
        } else {
          setJudgingRoundId(value);
          setPage(1);
        }
      }, 500);

      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const { data, isLoading } = useQuery({
    ...screeningQueries.list(page, PAGE_SIZE, isAdmin ?? false, judgingRoundId),
    enabled: isAdmin !== undefined,
  });

  const handleRowClick = useCallback(
    (screening: ScreeningWithStatus) => {
      router.push(`/screening/${screening.id}`);
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

  if (data.result.length === 0 && !judgingRoundId) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <CalendarX2 size={48} />
        <div className="text-lg font-semibold text-gray-700">
          {isAdmin ? "등록된 심사가 없습니다." : "참여 중인 심사가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4">
        <div className="w-full text-center text-2xl font-bold">
          {isAdmin ? "전체 심사 목록" : "나의 심사 목록"}
        </div>

        {/* 요약 통계 */}
        {stats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <ListChecks size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">전체</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <Play size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">진행 중</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <CheckCircle2 size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">종료</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-white p-3">
              <Clock size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">진행 전</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 심사 번호 검색 */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="심사 번호로 검색"
            value={searchInput}
            onChange={(e) => {
              handleSearchChange(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        {data.result.length === 0 && judgingRoundId && (
          <div className="flex w-full flex-col items-center justify-center gap-2 py-12 text-gray-500">
            <Search size={36} />
            <div className="text-sm">
              심사 번호 {judgingRoundId}에 해당하는 심사를 찾을 수 없습니다.
            </div>
          </div>
        )}

        {/* 카드 그리드 */}
        {data.result.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.result.map((screening) => (
              <ScreeningCard
                key={screening.id}
                screening={screening}
                onClick={handleRowClick}
              />
            ))}
          </div>
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
