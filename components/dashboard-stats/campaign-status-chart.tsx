"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import { motion } from "framer-motion"

interface CampaignStatusChartProps {
  data: Array<{ name: string; value: number }>
  total: number
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#71717a",
  ACTIVE: "#18181b",
  PAUSED: "#a1a1aa",
  COMPLETED: "#22c55e",
  ARCHIVED: "#e4e4e7",
}

const STATUS_COLORS_DARK: Record<string, string> = {
  DRAFT: "#a1a1aa",
  ACTIVE: "#fafafa",
  PAUSED: "#71717a",
  COMPLETED: "#4ade80",
  ARCHIVED: "#3f3f46",
}

export function CampaignStatusChart({ data, total }: CampaignStatusChartProps) {
  const filteredData = data.filter((item) => item.value > 0)

  // Check if we're in dark mode
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  const colors = isDark ? STATUS_COLORS_DARK : STATUS_COLORS

  if (filteredData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Target className="h-4 w-4" />
            </div>
            Campaign Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[240px]">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Target className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">No campaigns yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Create your first campaign</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
              <Target className="h-4 w-4" />
            </div>
            Campaign Status
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
                  animationBegin={200}
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
                      return (
                        <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-3">
                          <p className="text-sm font-medium text-foreground capitalize">
                            {chartData.name.toLowerCase()}
                          </p>
                          <p className="text-lg font-bold text-foreground">{chartData.value} campaigns</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label with animation */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <span className="text-3xl font-bold text-foreground">{total}</span>
              <span className="text-xs text-muted-foreground font-medium">Total</span>
            </motion.div>
          </div>
          {/* Legend with better styling */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/30">
            {filteredData.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: colors[item.name] }} />
                <span className="text-xs text-muted-foreground capitalize">
                  {item.name.toLowerCase()} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
