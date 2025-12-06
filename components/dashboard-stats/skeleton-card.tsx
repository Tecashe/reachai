"use client"

import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  variant?: "stat" | "chart" | "list"
}

export function SkeletonCard({ className, variant = "stat" }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 animate-pulse", className)}>
      {variant === "stat" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 w-24 bg-foreground/10 rounded" />
            <div className="h-8 w-8 bg-foreground/10 rounded-xl" />
          </div>
          <div className="h-8 w-32 bg-foreground/10 rounded mb-2" />
          <div className="h-3 w-20 bg-foreground/10 rounded" />
        </>
      )}
      {variant === "chart" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-5 w-32 bg-foreground/10 rounded mb-2" />
              <div className="h-3 w-24 bg-foreground/10 rounded" />
            </div>
            <div className="h-8 w-20 bg-foreground/10 rounded" />
          </div>
          <div className="h-[200px] bg-foreground/5 rounded-xl" />
        </>
      )}
      {variant === "list" && (
        <>
          <div className="h-5 w-32 bg-foreground/10 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-foreground/10 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-full bg-foreground/10 rounded mb-1" />
                  <div className="h-3 w-2/3 bg-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
