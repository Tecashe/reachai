"use client"

import { cn } from "@/lib/utils"

export function TemplateLibrarySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded-lg animate-pulse mt-2" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-9 w-64 bg-muted rounded-lg animate-pulse" />
          <div className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 flex-1 max-w-md bg-muted rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-muted rounded-lg animate-pulse" />
          <div className="h-9 w-40 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn("rounded-2xl overflow-hidden", "bg-card/50 border border-border/50")}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="h-36 bg-muted/30 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-muted rounded-lg animate-pulse" />
              <div className="flex gap-4 pt-3 border-t border-border/50">
                <div className="h-3 w-16 bg-muted rounded-lg animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
