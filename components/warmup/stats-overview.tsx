"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsOverviewProps {
  stats: Array<{
    label: string
    value: string | number
    change?: number
    icon: React.ReactNode
    trend?: "up" | "down" | "neutral"
    color: string
  }>
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={cn("metric-card card-hover", stat.color)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
            {stat.change !== undefined && (
              <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                {stat.trend === "up" && (
                  <>
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">+{stat.change}%</span>
                  </>
                )}
                {stat.trend === "down" && (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400">{stat.change}%</span>
                  </>
                )}
                {stat.trend === "neutral" && (
                  <>
                    <Minus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{stat.change}%</span>
                  </>
                )}
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
