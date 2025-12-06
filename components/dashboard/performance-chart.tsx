"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface PerformanceChartProps {
  data: Array<{
    date: string
    sent: number
    opened: number
    clicked: number
    replied: number
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Format date for display
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  // Show placeholder if no data
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No performance data yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Start sending emails to see your stats</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="repliedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl p-3">
                    <p className="text-sm font-medium text-foreground mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 text-sm">
                        <span className="text-muted-foreground capitalize">{entry.name}</span>
                        <span className="font-medium text-foreground">{entry.value?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="sent"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            fill="url(#sentGradient)"
            name="Sent"
          />
          <Area
            type="monotone"
            dataKey="opened"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            fill="url(#openedGradient)"
            name="Opened"
          />
          <Area
            type="monotone"
            dataKey="replied"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            fill="url(#repliedGradient)"
            name="Replied"
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-foreground" />
          <span className="text-sm text-muted-foreground">Sent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground" />
          <span className="text-sm text-muted-foreground">Opened</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-2" />
          <span className="text-sm text-muted-foreground">Replied</span>
        </div>
      </div>
    </div>
  )
}
