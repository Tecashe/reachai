"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Flame, TrendingUp } from "lucide-react"

interface ActivityHeatmapProps {
  data: Array<{ date: string; sent: number }>
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  const { cells, maxValue, weeks, totalEmails, streakDays, avgPerDay } = useMemo(() => {
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Create a map of date -> count
    const dataMap = new Map<string, number>()
    data.forEach((d) => {
      dataMap.set(d.date, d.sent)
    })

    // Generate all dates
    const cells: Array<{ date: string; value: number; dayOfWeek: number; weekIndex: number }> = []
    let maxVal = 0
    let total = 0
    let streak = 0
    let currentStreak = 0
    const currentDate = new Date(ninetyDaysAgo)

    // Start from the beginning of the week
    const startDay = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - startDay)

    let weekIndex = 0
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const value = dataMap.get(dateStr) || 0
      if (value > maxVal) maxVal = value
      total += value

      // Calculate streak
      if (value > 0) {
        currentStreak++
        if (currentStreak > streak) streak = currentStreak
      } else {
        currentStreak = 0
      }

      cells.push({
        date: dateStr,
        value,
        dayOfWeek: currentDate.getDay(),
        weekIndex,
      })

      if (currentDate.getDay() === 6) weekIndex++
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
      cells,
      maxValue: maxVal,
      weeks: weekIndex + 1,
      totalEmails: total,
      streakDays: streak,
      avgPerDay: Math.round(total / 90),
    }
  }, [data])

  const getIntensity = (value: number): { bg: string; border: string; glow: boolean } => {
    if (value === 0) return { bg: "bg-foreground/[0.03]", border: "border-foreground/[0.05]", glow: false }
    const ratio = value / Math.max(maxValue, 1)
    if (ratio < 0.25) return { bg: "bg-chart-2/25", border: "border-chart-2/20", glow: false }
    if (ratio < 0.5) return { bg: "bg-chart-2/45", border: "border-chart-2/30", glow: false }
    if (ratio < 0.75) return { bg: "bg-chart-2/65", border: "border-chart-2/40", glow: true }
    return { bg: "bg-chart-2/90", border: "border-chart-2/50", glow: true }
  }

  const days = ["", "Mon", "", "Wed", "", "Fri", ""]
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
    <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl shadow-foreground/[0.02] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-chart-2/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-foreground/[0.03] to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.04] shadow-inner">
              <Calendar className="h-5 w-5 text-foreground/80" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Activity Heatmap</h3>
              <p className="text-xs text-muted-foreground">90 days of email sending activity</p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-foreground/[0.06] to-foreground/[0.03] border border-foreground/[0.08]">
              <TrendingUp className="h-3.5 w-3.5 text-chart-2" />
              <span className="text-xs font-medium text-foreground">{totalEmails.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">total</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-foreground/[0.06] to-foreground/[0.03] border border-foreground/[0.08]">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-medium text-foreground">{streakDays}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[650px]">
            {/* Month labels */}
            <div className="flex mb-3 ml-10">
              {monthLabels.map((label, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-xs font-medium text-muted-foreground"
                  style={{
                    marginLeft:
                      i === 0 ? label.weekIndex * 13 : (label.weekIndex - monthLabels[i - 1].weekIndex) * 13 - 24,
                  }}
                >
                  {label.month}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground font-medium pt-0.5">
                {days.map((day, i) => (
                  <div key={i} className="h-[11px] flex items-center justify-end pr-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <TooltipProvider delayDuration={50}>
                <div className="flex gap-[3px]">
                  {Array.from({ length: weeks }).map((_, weekIdx) => (
                    <div
                      key={weekIdx}
                      className="flex flex-col gap-[3px]"
                      onMouseEnter={() => setHoveredWeek(weekIdx)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    >
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const cell = cells.find((c) => c.weekIndex === weekIdx && c.dayOfWeek === dayIdx)
                        if (!cell) return <div key={dayIdx} className="w-[11px] h-[11px]" />

                        const date = new Date(cell.date)
                        const isToday = cell.date === new Date().toISOString().split("T")[0]
                        const intensity = getIntensity(cell.value)
                        const isHoveredWeek = hoveredWeek === weekIdx

                        return (
                          <Tooltip key={dayIdx}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale: 1,
                                  opacity: 1,
                                }}
                                whileHover={{ scale: 1.3, zIndex: 10 }}
                                transition={{
                                  delay: (weekIdx * 7 + dayIdx) * 0.003,
                                  duration: 0.2,
                                  scale: { duration: 0.15 },
                                }}
                                className={`
                                  relative w-[11px] h-[11px] rounded-[3px] cursor-pointer
                                  ${intensity.bg} border ${intensity.border}
                                  ${isToday ? "ring-2 ring-foreground/30 ring-offset-1 ring-offset-card" : ""}
                                  ${isHoveredWeek ? "opacity-100" : hoveredWeek !== null ? "opacity-40" : "opacity-100"}
                                  transition-all duration-200
                                `}
                              >
                                {/* Glow effect for high-activity cells */}
                                {intensity.glow && (
                                  <div className="absolute inset-0 rounded-[3px] bg-chart-2/30 blur-[2px] -z-10" />
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-card/95 backdrop-blur-xl border-border/50 shadow-xl px-3 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-sm ${intensity.bg}`} />
                                <span className="font-semibold text-foreground">{cell.value} emails</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
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

            <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/20">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => {
                  const style = getIntensity(intensity * maxValue)
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className={`w-[11px] h-[11px] rounded-[3px] ${style.bg} border ${style.border}`}
                    />
                  )
                })}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
