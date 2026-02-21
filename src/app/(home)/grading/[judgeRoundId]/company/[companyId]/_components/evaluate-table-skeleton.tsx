import { Skeleton } from "@/components/ui/skeleton";

export function EvaluateTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <section className="rounded-lg border bg-white px-4 py-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-2 h-7 w-52" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
      </section>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 text-sm text-white">
              <th className="px-4 py-3 text-left font-medium">평가 항목</th>
              <th className="px-4 py-3 text-left font-medium">세부 내용</th>
              <th className="w-24 px-4 py-3 text-center font-medium">배점</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 4 }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-4/5" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Skeleton className="h-9 w-16 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 bg-gray-50">
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-12" />
              </td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <Skeleton className="h-6 w-20" />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-28 w-full rounded-md" />
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-md" />
      </div>
    </div>
  );
}
