"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

interface StatCardProps {
  stat: {
    title: string
    value: string
    icon: LucideIcon
    description: string
    trend?: string
    trendUp?: boolean
    highlight?: boolean
  }
  index: number
}

export function StatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl",
          "shadow-lg shadow-foreground/[0.03] hover:shadow-xl hover:shadow-foreground/[0.06]",
          "transition-all duration-300 hover:-translate-y-1",
          stat.highlight && "ring-1 ring-foreground/10",
        )}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Glow effect for highlighted cards */}
        {stat.highlight && (
          <div className="absolute -inset-px bg-gradient-to-r from-foreground/5 via-foreground/10 to-foreground/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
        )}

        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
          <div className="p-2.5 rounded-xl bg-foreground/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] group-hover:bg-foreground/10 transition-colors duration-300">
            <stat.icon className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
            {stat.trend && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium mb-1 px-1.5 py-0.5 rounded-md",
                  stat.trendUp ? "text-chart-2 bg-chart-2/10" : "text-muted-foreground bg-muted",
                )}
              >
                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.trend}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
