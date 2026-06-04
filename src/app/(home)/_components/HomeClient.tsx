"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Delay } from "@suspensive/react";
import { judgingQueries } from "@/queries";
import { JudgingWorkspaceWithStatus } from "@/actions/program-action";
import ProgramSkeleton from "./ProgramSkeleton";
import { JudgingCard } from "./judging-card";
import WorkspaceTabs from "./WorkspaceTabs";
import WorkspaceEmptyState from "./workspace-empty-state";
import { useRouter } from "nextjs-toploader/app";
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

export const PAGE_SIZE = 10;

interface HomeClientProps {
  isAdmin: boolean;
}

export default function HomeClient({ isAdmin }: HomeClientProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(
    undefined
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value === "") {
        setSearchKeyword(undefined);
        setPage(1);
      } else {
        setSearchKeyword(value.trim());
        setPage(1);
      }
    }, 500);
  }, []);

  // isAdmin이 SSR prop으로 첫 렌더부터 확정돼 있어 쿼리가 마운트 즉시 활성화된다.
  // (기존에는 클라이언트 프로필 페치로 isAdmin이 채워질 때까지 enabled로 막혀 워터폴이 발생했다.)
  const { data, isLoading, isFetching } = useQuery({
    ...judgingQueries.list(
      page,
      PAGE_SIZE,
      isAdmin,
      searchKeyword,
      statusFilter
    ),
    placeholderData: keepPreviousData,
  });

  const handleRowClick = useCallback(
    (judging: JudgingWorkspaceWithStatus) => {
      router.push(`/judging/${judging.id}`);
    },
    [router]
  );

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter((prev) => {
      const next = prev === status ? undefined : status;
      setPage(1);
      return next;
    });
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      total: data.totalActive + data.totalCompleted + data.totalPending,
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
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-240 flex-col gap-4 p-4 pb-10">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-center text-2xl font-bold text-neutral-900">
            {isAdmin ? "전체 심사 목록" : "나의 심사 목록"}
          </h1>
          <WorkspaceTabs current="judging" />
        </div>

        {/* 요약 통계 — 클릭으로 필터링 */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setStatusFilter(undefined)}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                !statusFilter
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <ListChecks
                size={18}
                className={!statusFilter ? "text-neutral-400" : "text-neutral-400"}
              />
              <div>
                <p className={`text-xs ${!statusFilter ? "text-neutral-400" : "text-neutral-500"}`}>
                  전체
                </p>
                <p className={`text-lg font-bold ${!statusFilter ? "text-white" : "text-neutral-900"}`}>
                  {stats.total}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("IN_PROGRESS")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                statusFilter === "IN_PROGRESS"
                  ? "border-sky-600 bg-sky-50"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <Play size={18} className="text-sky-500" />
              <div>
                <p className={`text-xs ${statusFilter === "IN_PROGRESS" ? "text-sky-700" : "text-neutral-500"}`}>
                  진행 중
                </p>
                <p className="text-lg font-bold text-neutral-900">
                  {stats.active}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("COMPLETED")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                statusFilter === "COMPLETED"
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <CheckCircle2 size={18} className="text-emerald-500" />
              <div>
                <p className={`text-xs ${statusFilter === "COMPLETED" ? "text-emerald-700" : "text-neutral-500"}`}>
                  종료
                </p>
                <p className="text-lg font-bold text-neutral-900">
                  {stats.completed}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleStatusFilter("PENDING")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-left transition-colors ${
                statusFilter === "PENDING"
                  ? "border-neutral-600 bg-neutral-100"
                  : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <Clock size={18} className="text-neutral-500" />
              <div>
                <p className={`text-xs ${statusFilter === "PENDING" ? "text-neutral-700" : "text-neutral-500"}`}>
                  진행 전
                </p>
                <p className="text-lg font-bold text-neutral-900">
                  {stats.upcoming}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* 심사 검색 */}
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
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
            eyebrow="검색 결과 없음"
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
          <div className="relative">
            {isFetching && !isLoading && (
              <Delay ms={200}>
                <div className="absolute inset-0 z-10 rounded-xl bg-white/60" />
              </Delay>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.result.map((judging) => (
                <JudgingCard
                  key={judging.id}
                  judging={judging}
                  onClick={handleRowClick}
                />
              ))}
            </div>
          </div>
        )}

        {data.result.length === 0 && !searchKeyword && (
          <WorkspaceEmptyState
            icon={CalendarX2}
            eyebrow={isAdmin ? "심사 워크스페이스" : "내 심사"}
            title={
              isAdmin
                ? "아직 등록된 심사가 없습니다"
                : "참여 중인 심사가 없습니다"
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
