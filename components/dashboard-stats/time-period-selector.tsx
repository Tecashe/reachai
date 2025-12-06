"use client"

import { cn } from "@/lib/utils"

interface TimePeriodSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const periods = [
  { value: "7d", label: "7D" },
  { value: "14d", label: "14D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
]

export function TimePeriodSelector({ value, onChange, className }: TimePeriodSelectorProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1 p-1 rounded-lg bg-foreground/5 border border-border/50", className)}
    >
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
            value === period.value
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
