"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

interface CampaignStatusChartProps {
  data: Array<{ name: string; value: number }>
  total: number
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "hsl(var(--muted-foreground))",
  ACTIVE: "hsl(var(--foreground))",
  PAUSED: "hsl(var(--chart-3))",
  COMPLETED: "hsl(var(--chart-2))",
  ARCHIVED: "hsl(var(--border))",
}

export function CampaignStatusChart({ data, total }: CampaignStatusChartProps) {
  const filteredData = data.filter((item) => item.value > 0)

  if (filteredData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Target className="h-4 w-4" />
            Campaign Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground text-sm">No campaigns yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Create your first campaign</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-foreground">
          <Target className="h-4 w-4" />
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
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-2">
                        <p className="text-sm font-medium text-foreground">
                          {data.name}: {data.value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {filteredData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[item.name] }} />
              <span className="text-xs text-muted-foreground capitalize">
                {item.name.toLowerCase()} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
