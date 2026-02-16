"use client";

import { useState, useMemo, useCallback } from "react";
import { screeningColumns } from "./_components/screening-columns";
import { ScreeningDataTable } from "./_components/screening-data-table";
import { useAllScreeningsQuery } from "./_hooks/useAllScreeningsQuery";
import { ScreeningWithStatus } from "@/actions/program-action";
import ProgramSkeleton from "./_components/ProgramSkeleton";
import { useRouter } from "next/navigation";
import { useUserProfileQuery } from "../_hooks/useUserQuery";
import { CalendarX2, Search } from "lucide-react";
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
  const { data: profile } = useUserProfileQuery();

  const isAdmin = profile?.role === "관리자";

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [judgingRoundId, setJudgingRoundId] = useState<number | undefined>(
    undefined,
  );

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        const numValue = parseInt(value, 10);
        if (value === "") {
          setJudgingRoundId(undefined);
          setPage(1);
        } else if (!isNaN(numValue) && numValue > 0) {
          setJudgingRoundId(numValue);
          setPage(1);
        }
      }, 500);

      setDebounceTimer(timer);
    },
    [debounceTimer],
  );

  const { data, isLoading } = useAllScreeningsQuery(
    page,
    PAGE_SIZE,
    isAdmin,
    judgingRoundId,
  );

  const handleRowClick = useCallback(
    (screening: ScreeningWithStatus) => {
      router.push(`/screening/${screening.id}`);
    },
    [router],
  );

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
      <div className="flex flex-col w-full h-full justify-center items-center gap-2">
        <CalendarX2 size={48} />
        <div className="text-lg font-semibold text-gray-700">
          {isAdmin ? "등록된 심사가 없습니다." : "참여 중인 심사가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex flex-col space-y-4 w-full max-w-[960px] p-4">
        <div className="w-full text-2xl font-bold text-center">
          {isAdmin ? "전체 심사 목록" : "나의 심사 목록"}
        </div>

        {/* 심사 번호 검색 */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="심사 번호로 검색"
            value={searchInput}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleSearchChange(value);
            }}
            className="pl-9"
          />
        </div>

        {data.result.length === 0 && judgingRoundId && (
          <div className="flex flex-col w-full py-12 justify-center items-center gap-2 text-gray-500">
            <Search size={36} />
            <div className="text-sm">
              심사 번호 {judgingRoundId}에 해당하는 심사를 찾을 수 없습니다.
            </div>
          </div>
        )}

        {data.result.length > 0 && (
          <ScreeningDataTable
            columns={screeningColumns}
            data={data.result}
            onRowClick={handleRowClick}
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
