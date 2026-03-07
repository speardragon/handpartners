"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { mentoringQueries } from "@/queries";
import ProgramSkeleton from "../_components/ProgramSkeleton";
import WorkspaceTabs from "../_components/WorkspaceTabs";
import { MentoringCard } from "../_components/mentoring-card";
import type { MentoringListItem } from "@/actions/mentoring-action";
import { CalendarX2, CheckCircle2, Clock, ListChecks, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MentoringPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string | undefined>(
    undefined
  );
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const { data, isLoading } = useQuery(
    mentoringQueries.list(searchKeyword)
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        setSearchKeyword(value.trim() ? value.trim() : undefined);
      }, 400);

      setDebounceTimer(timer);
    },
    [debounceTimer]
  );

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      total: data.items.length,
      active: data.items.filter((item) => item.status === "IN_PROGRESS").length,
      completed: data.items.filter((item) => item.status === "COMPLETED").length,
      pending: data.items.filter((item) => item.status === "PENDING").length,
    };
  }, [data]);

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
      <div className="flex w-full max-w-[960px] flex-col space-y-4 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-full text-center text-2xl font-bold">
            {data.isAdminView ? "전체 멘토링 목록" : "나의 멘토링 목록"}
          </div>
          <WorkspaceTabs current="mentoring" />
        </div>

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
                <p className="text-lg font-bold text-gray-900">{stats.active}</p>
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
                <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="멘토링 번호로 검색"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {data.items.length === 0 && searchKeyword && (
          <div className="flex w-full flex-col items-center justify-center gap-2 py-12 text-gray-500">
            <Search size={36} />
            <div className="text-sm">
              멘토링 번호 {searchKeyword}에 해당하는 멘토링을 찾을 수 없습니다.
            </div>
          </div>
        )}

        {data.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.items.map((item) => (
              <MentoringCard
                key={item.id}
                mentoring={item}
                isAdminView={data.isAdminView}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {data.items.length === 0 && !searchKeyword && (
          <div className="flex w-full flex-col items-center justify-center gap-2 py-16 text-gray-500">
            <CalendarX2 size={48} />
            <div className="text-lg font-semibold text-gray-700">
              {data.isAdminView
                ? "등록된 멘토링이 없습니다."
                : "참여 중인 멘토링이 없습니다."}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
