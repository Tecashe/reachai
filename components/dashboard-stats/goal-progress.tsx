"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Target, TrendingUp, Calendar } from "lucide-react"

interface GoalProgressProps {
  emailsSent: number
  emailsGoal: number
  repliesReceived: number
  repliesGoal: number
  daysRemaining: number
}

export function GoalProgress({
  emailsSent,
  emailsGoal,
  repliesReceived,
  repliesGoal,
  daysRemaining,
}: GoalProgressProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const emailProgress = Math.min(100, (emailsSent / Math.max(emailsGoal, 1)) * 100)
  const replyProgress = Math.min(100, (repliesReceived / Math.max(repliesGoal, 1)) * 100)

  // Calculate projected completion
  const daysPassed = 30 - daysRemaining
  const emailVelocity = daysPassed > 0 ? emailsSent / daysPassed : 0
  const projectedEmails = emailVelocity * 30
  const onTrackEmails = projectedEmails >= emailsGoal

  const replyVelocity = daysPassed > 0 ? repliesReceived / daysPassed : 0
  const projectedReplies = replyVelocity * 30
  const onTrackReplies = projectedReplies >= repliesGoal

  const CircularProgress = ({
    progress,
    size = 100,
    strokeWidth = 8,
    children,
  }: { progress: number; size?: number; strokeWidth?: number; children: React.ReactNode }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-foreground/[0.05]"
          />
          {/* Progress circle */}
          {mounted && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={progress >= 100 ? "text-emerald-500" : "text-chart-2"}
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
              style={{ filter: progress >= 75 ? "drop-shadow(0 0 6px currentColor)" : "none" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-chart-2/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Target className="h-4 w-4 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Monthly Goals</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-foreground/5 px-2.5 py-1 rounded-full">
            <Calendar className="h-3 w-3" />
            <span>{daysRemaining} days left</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Emails Goal */}
          <div className="flex flex-col items-center">
            <CircularProgress progress={emailProgress} size={120} strokeWidth={10}>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{Math.round(emailProgress)}%</p>
              </div>
            </CircularProgress>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-foreground">Emails Sent</p>
              <p className="text-xs text-muted-foreground mt-1">
                {emailsSent.toLocaleString()} / {emailsGoal.toLocaleString()}
              </p>
              <div
                className={`flex items-center justify-center gap-1 mt-2 text-xs ${onTrackEmails ? "text-emerald-500" : "text-amber-500"}`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>{onTrackEmails ? "On track" : "Behind pace"}</span>
              </div>
            </div>
          </div>

          {/* Replies Goal */}
          <div className="flex flex-col items-center">
            <CircularProgress progress={replyProgress} size={120} strokeWidth={10}>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{Math.round(replyProgress)}%</p>
              </div>
            </CircularProgress>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-foreground">Replies</p>
              <p className="text-xs text-muted-foreground mt-1">
                {repliesReceived.toLocaleString()} / {repliesGoal.toLocaleString()}
              </p>
              <div
                className={`flex items-center justify-center gap-1 mt-2 text-xs ${onTrackReplies ? "text-emerald-500" : "text-amber-500"}`}
              >
                <TrendingUp className="h-3 w-3" />
                <span>{onTrackReplies ? "On track" : "Behind pace"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
