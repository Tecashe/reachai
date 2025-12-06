"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "./animated-counter"

interface DomainHealthRingProps {
  value: number
}

export function DomainHealthRing({ value }: DomainHealthRingProps) {
  const radius = 75
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference
  const offset = circumference - progress

  const getHealthColor = (score: number) => {
    if (score >= 80) return { stroke: "hsl(var(--chart-2))", glow: "hsl(var(--chart-2) / 0.3)" }
    if (score >= 50) return { stroke: "hsl(var(--chart-4))", glow: "hsl(var(--chart-4) / 0.3)" }
    return { stroke: "hsl(var(--destructive))", glow: "hsl(var(--destructive) / 0.3)" }
  }

  const { stroke: healthColor, glow } = getHealthColor(value)
  const healthLabel = value >= 80 ? "Excellent" : value >= 50 ? "Good" : "Needs Attention"

  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: glow }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.svg
        width="200"
        height="200"
        className="-rotate-90"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-foreground/5"
        />
        {/* Secondary track for depth */}
        <circle
          cx="100"
          cy="100"
          r={radius - 4}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-foreground/[0.03]"
        />
        {/* Animated progress ring */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={healthColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 12px ${glow})`,
          }}
        />
        {/* Decorative dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.circle
            key={i}
            cx={100 + (radius + 12) * Math.cos((angle * Math.PI) / 180)}
            cy={100 + (radius + 12) * Math.sin((angle * Math.PI) / 180)}
            r={1.5}
            fill="currentColor"
            className="text-foreground/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
          />
        ))}
      </motion.svg>

      {/* Center content with animated counter */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <span className="text-4xl font-bold text-foreground tracking-tight">
          <AnimatedCounter value={value} duration={1500} />%
        </span>
        <span className="text-sm font-medium mt-1" style={{ color: healthColor }}>
          {healthLabel}
        </span>
      </motion.div>
    </div>
  )
}
