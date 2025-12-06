"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActivityHeatmapProps {
  data: Array<{ date: string; sent: number }>
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { cells, maxValue, weeks } = useMemo(() => {
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Create a map of date -> count
    const dataMap = new Map<string, number>()
    data.forEach((d) => {
      dataMap.set(d.date, d.sent)
    })

    // Generate all dates for 90 days
    const cells: Array<{ date: string; value: number; dayOfWeek: number; weekIndex: number }> = []
    let maxVal = 0
    const currentDate = new Date(ninetyDaysAgo)

    // Start from the beginning of the week
    const startDay = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - startDay)

    let weekIndex = 0
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const value = dataMap.get(dateStr) || 0
      if (value > maxVal) maxVal = value

      cells.push({
        date: dateStr,
        value,
        dayOfWeek: currentDate.getDay(),
        weekIndex,
      })

      if (currentDate.getDay() === 6) weekIndex++
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return { cells, maxValue: maxVal, weeks: weekIndex + 1 }
  }, [data])

  const getIntensity = (value: number): string => {
    if (value === 0) return "bg-foreground/[0.03]"
    const ratio = value / Math.max(maxValue, 1)
    if (ratio < 0.25) return "bg-chart-2/20"
    if (ratio < 0.5) return "bg-chart-2/40"
    if (ratio < 0.75) return "bg-chart-2/60"
    return "bg-chart-2/80"
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = []
    let lastMonth = -1

    cells.forEach((cell) => {
      const date = new Date(cell.date)
      const month = date.getMonth()
      if (month !== lastMonth && cell.dayOfWeek === 0) {
        labels.push({ month: months[month], weekIndex: cell.weekIndex })
        lastMonth = month
      }
    })

    return labels
  }, [cells])

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Activity Heatmap</h3>
            <p className="text-sm text-muted-foreground mt-1">Last 90 days of email activity</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${
                    intensity === 0
                      ? "bg-foreground/[0.03]"
                      : intensity < 0.5
                        ? "bg-chart-2/30"
                        : intensity < 0.75
                          ? "bg-chart-2/50"
                          : "bg-chart-2/80"
                  } border border-foreground/5`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Month labels */}
            <div className="flex mb-2 ml-8">
              {monthLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground"
                  style={{
                    marginLeft:
                      i === 0 ? label.weekIndex * 14 : (label.weekIndex - monthLabels[i - 1].weekIndex) * 14 - 20,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Day labels */}
              <div className="flex flex-col gap-[2px] text-xs text-muted-foreground">
                {days.map((day, i) => (
                  <div
                    key={day}
                    className="h-3 flex items-center"
                    style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <TooltipProvider delayDuration={100}>
                <div className="flex gap-[2px]">
                  {Array.from({ length: weeks }).map((_, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[2px]">
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const cell = cells.find((c) => c.weekIndex === weekIdx && c.dayOfWeek === dayIdx)
                        if (!cell) return <div key={dayIdx} className="w-3 h-3" />

                        const date = new Date(cell.date)
                        const isToday = cell.date === new Date().toISOString().split("T")[0]

                        return (
                          <Tooltip key={dayIdx}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: (weekIdx * 7 + dayIdx) * 0.002, duration: 0.2 }}
                                className={`w-3 h-3 rounded-sm ${getIntensity(cell.value)} border ${
                                  isToday ? "border-foreground/30 ring-1 ring-foreground/20" : "border-foreground/5"
                                } cursor-pointer hover:border-foreground/30 transition-colors`}
                              />
                            </TooltipTrigger>
                            <TooltipContent className="bg-card/95 backdrop-blur-xl border-border/50">
                              <p className="font-medium">{cell.value} emails</p>
                              <p className="text-xs text-muted-foreground">
                                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
