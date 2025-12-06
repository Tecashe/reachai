"use client"

import { cn } from "@/lib/utils"

interface LivePulseProps {
  className?: string
  label?: string
}

export function LivePulse({ className, label = "Live" }: LivePulseProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-2 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-chart-2" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
