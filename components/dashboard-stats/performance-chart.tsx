"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

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
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4 inline-block">
            <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground font-medium">No performance data yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Start sending emails to see your stats</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="h-[300px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#18181b" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#18181b" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#71717a" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#71717a" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#71717a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="repliedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#22c55e" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="displayDate"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={40}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl p-4 min-w-[140px]">
                    <p className="text-sm font-semibold text-foreground mb-3 pb-2 border-b border-border/50">{label}</p>
                    <div className="space-y-2">
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">{entry.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{entry.value?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="sent"
            stroke="#18181b"
            strokeWidth={2.5}
            fill="url(#sentGradient)"
            name="Sent"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#18181b" }}
          />
          <Area
            type="monotone"
            dataKey="opened"
            stroke="#71717a"
            strokeWidth={2}
            fill="url(#openedGradient)"
            name="Opened"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, fill: "#71717a" }}
          />
          <Area
            type="monotone"
            dataKey="replied"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#repliedGradient)"
            name="Replied"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, fill: "#22c55e" }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-border/30">
        {[
          { name: "Sent", color: "#18181b" },
          { name: "Opened", color: "#71717a" },
          { name: "Replied", color: "#22c55e" },
        ].map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-muted-foreground font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
