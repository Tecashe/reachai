"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react"

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
  // Lower bounce/spam = better, higher open/reply = better
  const score = Math.max(
    0,
    Math.min(100, Math.round(100 - bounceRate * 2 - spamRate * 5 + openRate * 0.3 + replyRate * 0.5)),
  )

  const getScoreColor = (s: number) => {
    if (s >= 80) return { text: "text-emerald-500", bg: "stroke-emerald-500", label: "Excellent" }
    if (s >= 60) return { text: "text-chart-4", bg: "stroke-chart-4", label: "Good" }
    if (s >= 40) return { text: "text-amber-500", bg: "stroke-amber-500", label: "Fair" }
    return { text: "text-destructive", bg: "stroke-destructive", label: "Poor" }
  }

  const { text, bg, label } = getScoreColor(score)

  // SVG arc calculations for gauge
  const radius = 80
  const strokeWidth = 12
  const circumference = Math.PI * radius // Semi-circle
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Calculate needle rotation (-90 to 90 degrees)
  const needleRotation = -90 + (score / 100) * 180

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-1/2 h-24 bg-gradient-to-b from-foreground/[0.03] to-transparent blur-2xl pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-foreground/5">
            <Shield className="h-4 w-4 text-foreground/70" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Deliverability Score</h3>
        </div>

        <div className="flex flex-col items-center">
          {/* Gauge SVG */}
          <div className="relative w-[200px] h-[120px]">
            <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
              {/* Background arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-foreground/[0.05]"
                strokeLinecap="round"
              />

              {/* Score arc with gradient */}
              {mounted && (
                <motion.path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className={bg}
                  initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                  style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
                />
              )}

              {/* Tick marks */}
              {[0, 25, 50, 75, 100].map((tick) => {
                const angle = (-90 + (tick / 100) * 180) * (Math.PI / 180)
                const innerR = radius - strokeWidth / 2 - 8
                const outerR = radius - strokeWidth / 2 - 4
                const x1 = 100 + innerR * Math.cos(angle)
                const y1 = 100 + innerR * Math.sin(angle)
                const x2 = 100 + outerR * Math.cos(angle)
                const y2 = 100 + outerR * Math.sin(angle)
                return (
                  <line
                    key={tick}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth={2}
                    className="text-foreground/20"
                  />
                )
              })}

              {/* Needle */}
              {mounted && (
                <motion.g
                  initial={{ rotate: -90 }}
                  animate={{ rotate: needleRotation }}
                  transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                  style={{ transformOrigin: "100px 100px" }}
                >
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="35"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="text-foreground"
                  />
                  <circle cx="100" cy="100" r="6" fill="currentColor" className="text-foreground" />
                  <circle cx="100" cy="100" r="3" fill="currentColor" className="text-card" />
                </motion.g>
              )}
            </svg>

            {/* Score display */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`text-4xl font-bold ${text}`}
              >
                {score}
              </motion.div>
              <div className={`text-sm font-medium ${text}`}>{label}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-border/30">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-foreground/[0.02]">
              {bounceRate < 2 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Bounce Rate</p>
                <p className="text-sm font-semibold">{bounceRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-foreground/[0.02]">
              {spamRate < 0.1 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Spam Rate</p>
                <p className="text-sm font-semibold">{spamRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
