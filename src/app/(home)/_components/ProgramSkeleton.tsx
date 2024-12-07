import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramSkeleton() {
  return (
    <main className="w-full h-full">
      <div className="flex flex-col w-full h-full p-4 space-y-4 px-16">
        <div className="text-center text-2xl font-bold">
          현재 진행 중인 심사
        </div>
        <div className="mt-4">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
        </div>
      </div>
    </main>
  );
}
