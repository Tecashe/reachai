"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity } from "lucide-react"

interface DeliverabilityGaugeProps {
  bounceRate: number
  spamRate: number
  openRate: number
  replyRate: number
  hasData?: boolean
}

export function DeliverabilityGauge({
  bounceRate,
  spamRate,
  openRate,
  replyRate,
  hasData = true,
}: DeliverabilityGaugeProps) {
  const [mounted, setMounted] = useState(false)
  const [needleOffset, setNeedleOffset] = useState(0)

  useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      setNeedleOffset(Math.sin(Date.now() / 800) * 1.5)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const rawScore = hasData
    ? Math.max(0, Math.min(100, Math.round(100 - bounceRate * 2 - spamRate * 5 + openRate * 0.3 + replyRate * 0.5)))
    : 0

  const score = rawScore

  const getScoreConfig = (s: number) => {
    if (!hasData) return { color: "neutral", label: "No Data", textColor: "text-muted-foreground" }
    if (s >= 80) return { color: "emerald", label: "Excellent", textColor: "text-emerald-500" }
    if (s >= 60) return { color: "blue", label: "Good", textColor: "text-blue-500" }
    if (s >= 40) return { color: "amber", label: "Fair", textColor: "text-amber-500" }
    return { color: "red", label: "Poor", textColor: "text-red-500" }
  }

  const config = getScoreConfig(score)

  // SVG calculations for the gauge
  const size = 280
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2 - 20
  const centerX = size / 2
  const centerY = size / 2 + 20
  const circumference = Math.PI * radius
  const progress = (score / 100) * circumference

  // Needle angle calculation (180 = left, 0 = right)
  const needleAngle = 180 - (score / 100) * 180 + needleOffset

  // Metric items
  const metrics = [
    { label: "Bounce Rate", value: bounceRate, threshold: 2, unit: "%", inverse: true, icon: AlertTriangle },
    { label: "Spam Rate", value: spamRate, threshold: 0.1, unit: "%", inverse: true, icon: Shield },
    { label: "Open Rate", value: openRate, threshold: 20, unit: "%", inverse: false, icon: Activity },
    { label: "Reply Rate", value: replyRate, threshold: 5, unit: "%", inverse: false, icon: CheckCircle },
  ]

  return (
    <div className="relative rounded-3xl border border-border/40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/80 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-foreground/[0.04] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-foreground/[0.03] via-transparent to-transparent" />

      {/* Liquid glass shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/[0.07] to-transparent rotate-12 transform-gpu" />
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-white/[0.05] to-transparent rounded-full blur-2xl" />
      </div>

      {/* Glass reflection strips */}
      <div className="absolute top-4 left-8 right-8 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute bottom-4 left-12 right-12 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

      <div className="relative p-8 backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Left side - Header and info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* Glass icon container */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-2xl blur-xl" />
                <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.03] border border-foreground/10 shadow-lg shadow-foreground/5">
                  <Shield className="h-6 w-6 text-foreground/80" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Deliverability Score</h3>
                <p className="text-sm text-muted-foreground">Real-time email health monitoring</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.06]">
              <motion.div
                className={`w-3 h-3 rounded-full ${config.color === "emerald" ? "bg-emerald-500" : config.color === "blue" ? "bg-blue-500" : config.color === "amber" ? "bg-amber-500" : config.color === "red" ? "bg-red-500" : "bg-muted-foreground"}`}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {hasData ? `Your deliverability is ${config.label.toLowerCase()}` : "Start sending to see your score"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hasData ? "Based on your recent campaign performance" : "No email data available yet"}
                </p>
              </div>
            </div>

            {/* Quick stats for mobile */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {metrics.slice(0, 2).map((metric) => {
                const isGood = metric.inverse ? metric.value < metric.threshold : metric.value > metric.threshold
                return (
                  <div
                    key={metric.label}
                    className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]"
                  >
                    <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-lg font-bold text-foreground">
                      {metric.value.toFixed(1)}
                      {metric.unit}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Center - 3D Gauge */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${config.color === "emerald" ? "rgba(16,185,129,0.15)" : config.color === "blue" ? "rgba(59,130,246,0.15)" : config.color === "amber" ? "rgba(245,158,11,0.15)" : config.color === "red" ? "rgba(239,68,68,0.15)" : "rgba(128,128,128,0.1)"} 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <svg
                width={size}
                height={size / 2 + 60}
                viewBox={`0 0 ${size} ${size / 2 + 60}`}
                className="overflow-visible"
              >
                <defs>
                  {/* 3D gradient for track */}
                  <linearGradient id="trackGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
                  </linearGradient>

                  {/* Score gradient */}
                  <linearGradient id="scoreGradient3D" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset="0%"
                      stopColor={
                        config.color === "emerald"
                          ? "#10b981"
                          : config.color === "blue"
                            ? "#3b82f6"
                            : config.color === "amber"
                              ? "#f59e0b"
                              : config.color === "red"
                                ? "#ef4444"
                                : "#6b7280"
                      }
                    />
                    <stop
                      offset="50%"
                      stopColor={
                        config.color === "emerald"
                          ? "#34d399"
                          : config.color === "blue"
                            ? "#60a5fa"
                            : config.color === "amber"
                              ? "#fbbf24"
                              : config.color === "red"
                                ? "#f87171"
                                : "#9ca3af"
                      }
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        config.color === "emerald"
                          ? "#10b981"
                          : config.color === "blue"
                            ? "#3b82f6"
                            : config.color === "amber"
                              ? "#f59e0b"
                              : config.color === "red"
                                ? "#ef4444"
                                : "#6b7280"
                      }
                    />
                  </linearGradient>

                  {/* Glass reflection gradient */}
                  <linearGradient id="glassShine" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="glow3D" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Shadow filter for 3D effect */}
                  <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feOffset dx="0" dy="2" />
                    <feGaussianBlur stdDeviation="3" />
                    <feComposite operator="out" in="SourceGraphic" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                    <feBlend mode="normal" in2="SourceGraphic" />
                  </filter>
                </defs>

                {/* Tick marks */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
                  const angle = Math.PI - (tick / 100) * Math.PI
                  const innerRadius = radius - 35
                  const outerRadius = radius - (tick % 20 === 0 ? 25 : 30)
                  const x1 = centerX + innerRadius * Math.cos(angle)
                  const y1 = centerY + innerRadius * Math.sin(angle)
                  const x2 = centerX + outerRadius * Math.cos(angle)
                  const y2 = centerY + outerRadius * Math.sin(angle)

                  return (
                    <line
                      key={tick}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={tick % 20 === 0 ? 2 : 1}
                      className="text-foreground/20"
                    />
                  )
                })}

                {/* Tick labels */}
                {[0, 20, 40, 60, 80, 100].map((tick) => {
                  const angle = Math.PI - (tick / 100) * Math.PI
                  const labelRadius = radius - 50
                  const x = centerX + labelRadius * Math.cos(angle)
                  const y = centerY + labelRadius * Math.sin(angle)

                  return (
                    <text
                      key={tick}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-muted-foreground text-xs font-medium"
                    >
                      {tick}
                    </text>
                  )
                })}

                {/* Background track - 3D effect */}
                <path
                  d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                  fill="none"
                  stroke="url(#trackGradient)"
                  strokeWidth={strokeWidth + 8}
                  strokeLinecap="round"
                  className="text-foreground"
                />

                {/* Main track */}
                <path
                  d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="text-foreground/[0.08]"
                />

                {/* Glass shine on track */}
                <path
                  d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                  fill="none"
                  stroke="url(#glassShine)"
                  strokeWidth={strokeWidth - 4}
                  strokeLinecap="round"
                />

                {/* Progress arc with glow */}
                {mounted && hasData && (
                  <>
                    {/* Glow layer */}
                    <motion.path
                      d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                      fill="none"
                      stroke="url(#scoreGradient3D)"
                      strokeWidth={strokeWidth + 12}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - progress }}
                      transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ filter: "blur(12px)", opacity: 0.4 }}
                    />

                    {/* Main progress arc */}
                    <motion.path
                      d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
                      fill="none"
                      stroke="url(#scoreGradient3D)"
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - progress }}
                      transition={{ duration: 2, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </>
                )}

                {mounted && (
                  <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}>
                    {/* Needle shadow */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + radius - 45}
                      y2={centerY + 3}
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="text-foreground/10"
                    />
                    {/* Needle body */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + radius - 45}
                      y2={centerY}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-foreground/80"
                    />
                    {/* Needle tip */}
                    <polygon
                      points={`${centerX + radius - 50},${centerY - 6} ${centerX + radius - 35},${centerY} ${centerX + radius - 50},${centerY + 6}`}
                      className="fill-foreground/80"
                    />
                    {/* Center pivot - 3D effect */}
                    <circle cx={centerX} cy={centerY} r="14" className="fill-foreground/10" />
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r="10"
                      className="fill-card stroke-foreground/20"
                      strokeWidth="2"
                    />
                    <circle cx={centerX} cy={centerY} r="5" className="fill-foreground/60" />
                  </g>
                )}

                {/* Score display */}
                <foreignObject x={centerX - 60} y={centerY + 15} width="120" height="80">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className={`text-5xl font-bold ${config.textColor}`}>{mounted ? score : 0}</div>
                    </div>
                    <div className={`text-sm font-semibold uppercase tracking-wider ${config.textColor} mt-1`}>
                      {config.label}
                    </div>
                  </motion.div>
                </foreignObject>
              </svg>
            </div>
          </div>

          {/* Right side - Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, i) => {
              const isGood = metric.inverse ? metric.value < metric.threshold : metric.value > metric.threshold
              const Icon = metric.icon

              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="relative p-4 rounded-2xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] border border-foreground/[0.08] group hover:border-foreground/15 hover:shadow-lg hover:shadow-foreground/[0.03] transition-all duration-300"
                >
                  {/* Glass shine */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-foreground/[0.05]">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      {isGood ? (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-500">
                          <TrendingDown className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                    <div className="text-2xl font-bold text-foreground">
                      {metric.value.toFixed(metric.label === "Spam Rate" ? 2 : 1)}
                      <span className="text-sm text-muted-foreground ml-0.5">{metric.unit}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, metric.inverse ? (metric.threshold / Math.max(metric.value, 0.01)) * 50 : (metric.value / (metric.threshold * 2)) * 100)}%`,
                        }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${isGood ? "bg-emerald-500/60" : "bg-amber-500/60"}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
