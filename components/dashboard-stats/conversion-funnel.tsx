"use client"

import { motion } from "framer-motion"
import { Mail, Eye, MousePointerClick, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react"

interface FunnelData {
  sent: number
  opened: number
  clicked: number
  replied: number
  bounced: number
}

interface ConversionFunnelProps {
  data: FunnelData
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const stages = [
    { key: "sent", label: "Sent", value: data.sent, icon: Mail, color: "from-chart-1/20 to-chart-1/5" },
    { key: "opened", label: "Opened", value: data.opened, icon: Eye, color: "from-chart-2/20 to-chart-2/5" },
    {
      key: "clicked",
      label: "Clicked",
      value: data.clicked,
      icon: MousePointerClick,
      color: "from-chart-3/20 to-chart-3/5",
    },
    {
      key: "replied",
      label: "Replied",
      value: data.replied,
      icon: MessageSquare,
      color: "from-chart-4/20 to-chart-4/5",
    },
  ]

  const getConversionRate = (current: number, previous: number): string => {
    if (previous === 0) return "0%"
    return `${((current / previous) * 100).toFixed(1)}%`
  }

  const maxValue = Math.max(data.sent, 1)

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-foreground/[0.03] to-transparent blur-2xl pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Conversion Funnel</h3>
            <p className="text-sm text-muted-foreground mt-1">Email engagement pipeline</p>
          </div>
          {data.bounced > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{data.bounced} bounced</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {stages.map((stage, index) => {
            const width = maxValue > 0 ? (stage.value / maxValue) * 100 : 0
            const Icon = stage.icon
            const prevValue = index === 0 ? stage.value : stages[index - 1].value
            const conversionRate = getConversionRate(stage.value, prevValue)

            return (
              <div key={stage.key}>
                <div className="flex items-center gap-4">
                  {/* Icon badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    className={`relative p-2.5 rounded-xl bg-gradient-to-br ${stage.color} backdrop-blur-sm border border-foreground/5 shadow-lg shadow-foreground/[0.02]`}
                  >
                    <Icon className="h-4 w-4 text-foreground/70" />
                    {/* Liquid glass effect on icon */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-foreground/[0.03] to-foreground/[0.05] pointer-events-none" />
                  </motion.div>

                  {/* Bar container */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground">{stage.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{stage.value.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-md bg-foreground/5">
                            {conversionRate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar with liquid glass */}
                    <div className="relative h-8 rounded-xl bg-foreground/[0.03] overflow-hidden border border-foreground/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                        className={`absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r ${stage.color} backdrop-blur-sm`}
                      >
                        {/* Inner liquid shine */}
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.08] via-transparent to-foreground/[0.02]" />
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-foreground/[0.05] to-transparent rounded-t-xl" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Conversion arrow between stages */}
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center py-1 ml-[52px]">
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
