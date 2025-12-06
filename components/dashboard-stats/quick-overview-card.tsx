"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, AlertTriangle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface QuickOverviewCardProps {
  rates: {
    openRate: string
    clickRate: string
    replyRate: string
    bounceRate: string
  }
  overview: {
    activeCampaigns: number
    totalCampaigns: number
  }
}

export function QuickOverviewCard({ rates, overview }: QuickOverviewCardProps) {
  const metrics = [
    {
      label: "Reply Rate",
      value: `${rates.replyRate}%`,
      sublabel: Number.parseFloat(rates.replyRate) > 5 ? "Above average" : "Room to grow",
      status: Number.parseFloat(rates.replyRate) > 5 ? "good" : "neutral",
      icon: Number.parseFloat(rates.replyRate) > 5 ? TrendingUp : Zap,
    },
    {
      label: "Bounce Rate",
      value: `${rates.bounceRate}%`,
      sublabel: Number.parseFloat(rates.bounceRate) < 2 ? "Excellent" : "Monitor this",
      status:
        Number.parseFloat(rates.bounceRate) < 2
          ? "good"
          : Number.parseFloat(rates.bounceRate) < 5
            ? "neutral"
            : "warning",
      icon: Number.parseFloat(rates.bounceRate) < 2 ? CheckCircle2 : AlertTriangle,
    },
    {
      label: "Click Rate",
      value: `${rates.clickRate}%`,
      sublabel: Number.parseFloat(rates.clickRate) > 3 ? "Good engagement" : "Add more CTAs",
      status: Number.parseFloat(rates.clickRate) > 3 ? "good" : "neutral",
      icon: Number.parseFloat(rates.clickRate) > 3 ? TrendingUp : Zap,
    },
    {
      label: "Active Campaigns",
      value: overview.activeCampaigns.toString(),
      sublabel: `of ${overview.totalCampaigns} total`,
      status: overview.activeCampaigns > 0 ? "good" : "neutral",
      icon: Zap,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            Quick Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className={cn(
                  "relative p-4 rounded-xl border border-border/50 bg-foreground/[0.02]",
                  "hover:bg-foreground/[0.04] hover:border-foreground/10 transition-all duration-300",
                  "group cursor-default",
                )}
              >
                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute top-3 right-3 w-2 h-2 rounded-full",
                    item.status === "good" && "bg-chart-2",
                    item.status === "warning" && "bg-destructive",
                    item.status === "neutral" && "bg-muted-foreground/30",
                  )}
                />

                <div className="flex items-center gap-2 mb-2">
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      item.status === "good" && "text-chart-2",
                      item.status === "warning" && "text-destructive",
                      item.status === "neutral" && "text-muted-foreground",
                    )}
                  />
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{item.value}</p>
                <p className="text-sm font-medium text-foreground/80 mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
