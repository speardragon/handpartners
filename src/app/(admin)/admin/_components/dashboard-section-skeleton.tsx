export function DashboardCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-neutral-200 bg-white p-5"
        >
          <div className="mb-3 h-4 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="h-8 w-16 animate-pulse rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}

export function DashboardTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="mb-4 h-5 w-48 animate-pulse rounded bg-neutral-200" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((__, cellIndex) => (
              <div
                key={cellIndex}
                className="h-10 animate-pulse rounded bg-neutral-100"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
