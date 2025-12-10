import { Skeleton } from "@/components/ui/skeleton"

export function SequenceBuilderSkeleton() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Top Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="h-5 w-px bg-border" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      {/* Secondary nav */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1">
        {/* Canvas */}
        <div className="flex-1 p-12">
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="mt-2 h-4 w-24" />
            <div className="mt-8 h-8 w-px bg-border" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="my-3 h-8 w-32 rounded-full" />
                <Skeleton className="h-32 w-80 rounded-xl" />
                <div className="mt-3 flex flex-col items-center">
                  <div className="h-4 w-px bg-border" />
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <div className="h-4 w-px bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-96 shrink-0 border-l border-border bg-background">
          <div className="p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
