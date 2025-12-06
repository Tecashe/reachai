"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useMemo } from "react"

interface ProspectStatusChartProps {
  data: Array<{ name: string; value: number }>
  total: number
}

const STATUS_COLORS_LIGHT: Record<string, string> = {
  ACTIVE: "#18181b",
  CONTACTED: "#71717a",
  REPLIED: "#22c55e",
  BOUNCED: "#ef4444",
  UNSUBSCRIBED: "#a1a1aa",
  COMPLETED: "#3b82f6",
}

const STATUS_COLORS_DARK: Record<string, string> = {
  ACTIVE: "#fafafa",
  CONTACTED: "#a1a1aa",
  REPLIED: "#4ade80",
  BOUNCED: "#f87171",
  UNSUBSCRIBED: "#71717a",
  COMPLETED: "#60a5fa",
}

export function ProspectStatusChart({ data, total }: ProspectStatusChartProps) {
  const { resolvedTheme } = useTheme()

  const filteredData = useMemo(() => data.filter((item) => item.value > 0), [data])
  const colors = useMemo(() => (resolvedTheme === "dark" ? STATUS_COLORS_DARK : STATUS_COLORS_LIGHT), [resolvedTheme])

  if (filteredData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Users className="h-4 w-4" />
            </div>
            Prospect Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[240px]">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Users className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">No prospects yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Add prospects to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
              <Users className="h-4 w-4" />
            </div>
            Prospect Status
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
                  animationBegin={300}
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
                          <p className="text-lg font-bold text-foreground">{chartData.value} prospects</p>
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
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <span className="text-3xl font-bold text-foreground">{total.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground font-medium">Total</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/30">
            {filteredData.slice(0, 6).map((item) => (
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
