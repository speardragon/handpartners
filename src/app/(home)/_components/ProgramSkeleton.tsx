import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramSkeleton() {
  return (
    <main className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-240 flex-col space-y-4 p-4">
        <Skeleton className="mx-auto h-8 w-40" />

        {/* 탭 스켈레톤 */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>

        {/* 통계 스켈레톤 */}
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>

        {/* 검색바 스켈레톤 */}
        <Skeleton className="h-10 w-full" />

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
