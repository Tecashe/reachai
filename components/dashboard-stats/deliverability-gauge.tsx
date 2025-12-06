"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, TrendingDown } from "lucide-react"

interface DeliverabilityGaugeProps {
  bounceRate: number
  spamRate: number
  openRate: number
  replyRate: number
}

export function DeliverabilityGauge({ bounceRate, spamRate, openRate, replyRate }: DeliverabilityGaugeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate deliverability score (0-100)
  const score = Math.max(
    0,
    Math.min(100, Math.round(100 - bounceRate * 2 - spamRate * 5 + openRate * 0.3 + replyRate * 0.5)),
  )

  const getScoreConfig = (s: number) => {
    if (s >= 80) return { color: "emerald", label: "Excellent", gradient: "from-emerald-500 to-emerald-400" }
    if (s >= 60) return { color: "blue", label: "Good", gradient: "from-blue-500 to-blue-400" }
    if (s >= 40) return { color: "amber", label: "Fair", gradient: "from-amber-500 to-amber-400" }
    return { color: "red", label: "Poor", gradient: "from-red-500 to-red-400" }
  }

  const config = getScoreConfig(score)

  // SVG calculations
  const size = 180
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius
  const progress = (score / 100) * circumference

  // Metric items
  const metrics = [
    { label: "Bounce", value: bounceRate, threshold: 2, unit: "%", inverse: true },
    { label: "Spam", value: spamRate, threshold: 0.1, unit: "%", inverse: true },
    { label: "Opens", value: openRate, threshold: 20, unit: "%", inverse: false },
    { label: "Replies", value: replyRate, threshold: 5, unit: "%", inverse: false },
  ]

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl shadow-foreground/[0.02] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.02] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-foreground/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-foreground/[0.03] to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.04] shadow-inner">
            <Shield className="h-5 w-5 text-foreground/80" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Deliverability Score</h3>
            <p className="text-xs text-muted-foreground">Overall email health rating</p>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer decorative ring */}
            <svg
              width={size + 20}
              height={(size + 20) / 2 + 20}
              viewBox={`0 0 ${size + 20} ${(size + 20) / 2 + 20}`}
              className="overflow-visible"
            >
              {/* Segment markers */}
              {[0, 20, 40, 60, 80, 100].map((tick, i) => {
                const angle = Math.PI - (tick / 100) * Math.PI
                const x = (size + 20) / 2 + (radius + 16) * Math.cos(angle)
                const y = (size + 20) / 2 + 10 + (radius + 16) * Math.sin(angle)
                return (
                  <text
                    key={tick}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[9px] font-medium"
                  >
                    {tick}
                  </text>
                )
              })}
            </svg>

            {/* Main gauge */}
            <svg
              width={size}
              height={size / 2 + 20}
              viewBox={`0 0 ${size} ${size / 2 + 20}`}
              className="overflow-visible absolute top-2.5 left-2.5"
            >
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop
                    offset="0%"
                    stopColor={
                      config.color === "emerald"
                        ? "#10b981"
                        : config.color === "blue"
                          ? "#3b82f6"
                          : config.color === "amber"
                            ? "#f59e0b"
                            : "#ef4444"
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      config.color === "emerald"
                        ? "#34d399"
                        : config.color === "blue"
                          ? "#60a5fa"
                          : config.color === "amber"
                            ? "#fbbf24"
                            : "#f87171"
                    }
                  />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background track with subtle segments */}
              <path
                d={`M ${strokeWidth / 2 + 4} ${size / 2 + 10} A ${radius - 4} ${radius - 4} 0 0 1 ${size - strokeWidth / 2 - 4} ${size / 2 + 10}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth + 8}
                strokeLinecap="round"
                className="text-foreground/[0.04]"
              />

              {/* Track inner shadow */}
              <path
                d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className="text-foreground/[0.06]"
              />

              {/* Colored progress arc with glow */}
              {mounted && (
                <>
                  {/* Glow layer */}
                  <motion.path
                    d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth={strokeWidth + 6}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                    style={{ filter: "blur(8px)", opacity: 0.5 }}
                  />
                  {/* Main arc */}
                  <motion.path
                    d={`M ${strokeWidth / 2} ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2 + 10}`}
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                  />
                </>
              )}
            </svg>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="relative"
              >
                {/* Pulsing ring behind score */}
                <motion.div
                  className={`absolute inset-0 -m-3 rounded-full bg-gradient-to-r ${config.gradient} opacity-20 blur-sm`}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
                <div className="relative px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/30 shadow-lg">
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {mounted ? score : 0}
                  </div>
                  <div
                    className={`text-xs font-semibold tracking-wide uppercase bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}
                  >
                    {config.label}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {metrics.map((metric, i) => {
            const isGood = metric.inverse ? metric.value < metric.threshold : metric.value > metric.threshold

            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="relative p-3 rounded-xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.02] border border-foreground/[0.06] group hover:border-foreground/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    {metric.label}
                  </span>
                  {isGood ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-amber-500" />
                  )}
                </div>
                <div className="text-lg font-bold text-foreground">
                  {metric.value.toFixed(metric.label === "Spam" ? 2 : 1)}
                  <span className="text-xs text-muted-foreground ml-0.5">{metric.unit}</span>
                </div>
                {/* Subtle indicator bar */}
                <div className="mt-2 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, metric.inverse ? (metric.threshold / Math.max(metric.value, 0.01)) * 50 : (metric.value / (metric.threshold * 2)) * 100)}%`,
                    }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full ${isGood ? "bg-emerald-500/60" : "bg-amber-500/60"}`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
