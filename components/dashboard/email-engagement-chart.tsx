"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

interface EmailEngagementChartProps {
  data: Array<{ name: string; value: number }>
  totalSent: number
}

const ENGAGEMENT_COLORS: Record<string, string> = {
  Opened: "hsl(var(--foreground))",
  Clicked: "hsl(var(--chart-2))",
  Replied: "hsl(var(--chart-3))",
  Bounced: "hsl(var(--destructive))",
}

export function EmailEngagementChart({ data, totalSent }: EmailEngagementChartProps) {
  const filteredData = data.filter((item) => item.value > 0)

  if (filteredData.length === 0 || totalSent === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <Mail className="h-4 w-4" />
            Email Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px]">
          <p className="text-muted-foreground text-sm">No engagement data yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Send emails to see engagement</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-foreground">
          <Mail className="h-4 w-4" />
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
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ENGAGEMENT_COLORS[entry.name] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const percentage = totalSent > 0 ? ((data.value / totalSent) * 100).toFixed(1) : 0
                    return (
                      <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-2">
                        <p className="text-sm font-medium text-foreground">
                          {data.name}: {data.value} ({percentage}%)
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
            <span className="text-2xl font-bold text-foreground">{totalSent.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Sent</span>
          </div>
        </div>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {filteredData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ENGAGEMENT_COLORS[item.name] }} />
              <span className="text-xs text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
