import { Skeleton } from "@/components/ui/skeleton"

export function SequencesPageSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header skeleton */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="mt-4 flex items-center gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-12" />
                <Skeleton className="mt-1 h-4 w-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-8 w-96" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="text-center">
                    <Skeleton className="mx-auto h-4 w-8" />
                    <Skeleton className="mx-auto mt-1 h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
