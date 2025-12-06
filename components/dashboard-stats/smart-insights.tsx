"use client"

import { motion } from "framer-motion"
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, Sparkles, Clock, Users, Zap } from "lucide-react"
import { useMemo } from "react"

interface SmartInsightsProps {
  data: {
    emailsSentChange: number | null
    openRateChange: number | null
    replyRateChange: number | null
    topCampaign?: { name: string; replyRate: number }
    avgReplyRate: number
    lowHealthAccounts: number
    bestDay?: string
  }
}

interface Insight {
  icon: typeof TrendingUp
  text: string
  type: "positive" | "negative" | "neutral" | "warning"
}

export function SmartInsights({ data }: SmartInsightsProps) {
  const insights = useMemo<Insight[]>(() => {
    const results: Insight[] = []

    // Reply rate change insight
    if (data.replyRateChange !== null) {
      if (data.replyRateChange > 10) {
        results.push({
          icon: TrendingUp,
          text: `Reply rate up ${data.replyRateChange.toFixed(1)}% vs last month`,
          type: "positive",
        })
      } else if (data.replyRateChange < -10) {
        results.push({
          icon: TrendingDown,
          text: `Reply rate down ${Math.abs(data.replyRateChange).toFixed(1)}% vs last month`,
          type: "negative",
        })
      }
    }

    // Open rate insight
    if (data.openRateChange !== null && data.openRateChange > 15) {
      results.push({
        icon: Sparkles,
        text: `Open rate improved by ${data.openRateChange.toFixed(1)}%`,
        type: "positive",
      })
    }

    // Top campaign insight
    if (data.topCampaign && data.topCampaign.replyRate > data.avgReplyRate * 1.5) {
      results.push({
        icon: Zap,
        text: `"${data.topCampaign.name}" outperforming average by ${((data.topCampaign.replyRate / Math.max(data.avgReplyRate, 0.1) - 1) * 100).toFixed(0)}%`,
        type: "positive",
      })
    }

    // Low health accounts warning
    if (data.lowHealthAccounts > 0) {
      results.push({
        icon: AlertCircle,
        text: `${data.lowHealthAccounts} account${data.lowHealthAccounts > 1 ? "s" : ""} need${data.lowHealthAccounts === 1 ? "s" : ""} attention`,
        type: "warning",
      })
    }

    // Best performing day
    if (data.bestDay) {
      results.push({
        icon: Clock,
        text: `Best performing day: ${data.bestDay}`,
        type: "neutral",
      })
    }

    // Email volume insight
    if (data.emailsSentChange !== null && data.emailsSentChange > 20) {
      results.push({
        icon: Users,
        text: `Outreach volume up ${data.emailsSentChange.toFixed(0)}% this month`,
        type: "positive",
      })
    }

    // If no insights, add a default
    if (results.length === 0) {
      results.push({
        icon: Lightbulb,
        text: "Send more emails to unlock insights",
        type: "neutral",
      })
    }

    return results.slice(0, 4) // Max 4 insights
  }, [data])

  const getTypeStyles = (type: Insight["type"]) => {
    switch (type) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "negative":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      default:
        return "bg-foreground/5 text-muted-foreground border-foreground/10"
    }
  }

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-chart-4/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-5/20">
            <Lightbulb className="h-4 w-4 text-foreground/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Smart Insights</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-foreground/5 px-2 py-0.5 rounded-full">
            AI-powered
          </span>
        </div>

        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex items-start gap-3 p-3 rounded-xl border ${getTypeStyles(insight.type)} backdrop-blur-sm`}
              >
                <div className="p-1.5 rounded-lg bg-current/10 shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-relaxed">{insight.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
