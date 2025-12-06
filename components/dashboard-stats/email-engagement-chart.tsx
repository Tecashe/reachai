"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useMemo } from "react"

interface EmailEngagementChartProps {
  data: Array<{ name: string; value: number }>
  totalSent: number
}

const ENGAGEMENT_COLORS_LIGHT: Record<string, string> = {
  Opened: "#18181b",
  Clicked: "#22c55e",
  Replied: "#3b82f6",
  Bounced: "#ef4444",
}

const ENGAGEMENT_COLORS_DARK: Record<string, string> = {
  Opened: "#fafafa",
  Clicked: "#4ade80",
  Replied: "#60a5fa",
  Bounced: "#f87171",
}

export function EmailEngagementChart({ data, totalSent }: EmailEngagementChartProps) {
  const { resolvedTheme } = useTheme()

  const filteredData = useMemo(() => data.filter((item) => item.value > 0), [data])
  const colors = useMemo(
    () => (resolvedTheme === "dark" ? ENGAGEMENT_COLORS_DARK : ENGAGEMENT_COLORS_LIGHT),
    [resolvedTheme],
  )

  if (filteredData.length === 0 || totalSent === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Mail className="h-4 w-4" />
            </div>
            Email Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[240px]">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Mail className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">No engagement data yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Send emails to see engagement</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            Email Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={400}
                  animationDuration={800}
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[entry.name] || "#a1a1aa"}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const chartData = payload[0].payload
                      const percentage = totalSent > 0 ? ((chartData.value / totalSent) * 100).toFixed(1) : 0
                      return (
                        <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-3">
                          <p className="text-sm font-medium text-foreground">{chartData.name}</p>
                          <p className="text-lg font-bold text-foreground">
                            {chartData.value.toLocaleString()}{" "}
                            <span className="text-sm font-normal text-muted-foreground">({percentage}%)</span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <span className="text-3xl font-bold text-foreground">{totalSent.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground font-medium">Sent</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/30">
            {filteredData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: colors[item.name] }} />
                <span className="text-xs text-muted-foreground">
                  {item.name} ({item.value.toLocaleString()})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
