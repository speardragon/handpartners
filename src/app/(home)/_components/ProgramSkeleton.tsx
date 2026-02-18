import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramSkeleton() {
  return (
    <main className="flex flex-col items-center w-full">
      <div className="flex flex-col space-y-4 w-full max-w-[960px] p-4">
        <Skeleton className="h-8 w-40 mx-auto" />

        {/* 통계 스켈레톤 */}
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>

        {/* 검색바 스켈레톤 */}
        <Skeleton className="h-10 w-full" />

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </main>
  );
}
