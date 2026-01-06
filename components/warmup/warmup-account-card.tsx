"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mail, TrendingUp, TrendingDown, Pause, Play, Settings, Eye } from "lucide-react"
import { useState } from "react"

interface WarmupAccount {
  id: string
  email: string
  healthScore: number
  warmupStage: "NEW" | "WARMING" | "WARM" | "ACTIVE" | "ESTABLISHED"
  warmupProgress: number
  openRate: number
  replyRate: number
  spamRate: number
  bounceRate: number
  inboxPlacementRate: number
  dailyLimit: number
  emailsSentToday: number
  warmupEnabled: boolean
  daysInStage: number
  daysUntilNext: number
}

interface WarmupAccountCardProps {
  account: WarmupAccount
  onTogglePause: (id: string, paused: boolean) => void
  onViewDetails: (id: string) => void
}

export function WarmupAccountCard({ account, onTogglePause, onViewDetails }: WarmupAccountCardProps) {
  const [isToggling, setIsToggling] = useState(false)

  const getHealthZone = (score: number) => {
    if (score >= 90)
      return {
        label: "READY",
        color: "bg-green-500",
        textColor: "text-green-600",
        badgeClass: "bg-green-100 text-green-800",
      }
    if (score >= 70)
      return {
        label: "WARNING",
        color: "bg-amber-500",
        textColor: "text-amber-600",
        badgeClass: "bg-amber-100 text-amber-800",
      }
    return { label: "CRITICAL", color: "bg-red-500", textColor: "text-red-600", badgeClass: "bg-red-100 text-red-800" }
  }

  const getStageInfo = (stage: string) => {
    const stages = {
      NEW: { label: "New", color: "bg-blue-500 text-white", progress: 20 },
      WARMING: { label: "Warming Up", color: "bg-yellow-500 text-white", progress: 40 },
      WARM: { label: "Warm", color: "bg-orange-500 text-white", progress: 60 },
      ACTIVE: { label: "Active", color: "bg-green-500 text-white", progress: 80 },
      ESTABLISHED: { label: "Established", color: "bg-emerald-600 text-white", progress: 100 },
    }
    return stages[stage as keyof typeof stages]
  }

  const healthZone = getHealthZone(account.healthScore)
  const stageInfo = getStageInfo(account.warmupStage)

  const handleTogglePause = async () => {
    setIsToggling(true)
    try {
      await onTogglePause(account.id, !account.warmupEnabled)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
      {/* Health status bar on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${healthZone.color}`} />

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-base">{account.email}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={stageInfo.color}>{stageInfo.label}</Badge>
                <Badge className={healthZone.badgeClass}>{healthZone.label}</Badge>
                {!account.warmupEnabled && (
                  <Badge variant="outline" className="border-gray-500 text-gray-700">
                    Paused
                  </Badge>
                )}
              </div>
            </div>

            {/* Health Score Circle */}
            <div className="relative flex items-center justify-center">
              <svg className="h-20 w-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - account.healthScore / 100)}`}
                  className={healthZone.textColor}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${healthZone.textColor}`}>{account.healthScore}</span>
                <span className="text-xs text-muted-foreground">Health</span>
              </div>
            </div>
          </div>

          {/* Daily Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className="font-semibold">
                {account.emailsSentToday} / {account.dailyLimit} emails
              </span>
            </div>
            <Progress value={(account.emailsSentToday / account.dailyLimit) * 100} className="h-2" />
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-3 pt-3 border-t">
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">{account.inboxPlacementRate}%</p>
              <p className="text-xs text-muted-foreground">Inbox</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{account.openRate}%</p>
              <p className="text-xs text-muted-foreground">Opens</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{account.replyRate}%</p>
              <p className="text-xs text-muted-foreground">Replies</p>
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${account.spamRate > 2 ? "text-red-600" : "text-green-600"}`}>
                {account.spamRate.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Spam</p>
            </div>
          </div>

          {/* Stage Progress */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stage Progress</span>
              {stageInfo.progress < 100 && (
                <span className="text-xs">
                  {account.daysInStage} days in • {account.daysUntilNext} days to next
                </span>
              )}
            </div>
            <Progress value={stageInfo.progress} className="h-2" />
          </div>

          {/* Ready Status */}
          {account.healthScore >= 90 && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 dark:text-green-100">Ready to Send Cold Emails!</p>
                <p className="text-green-700 dark:text-green-300 text-xs">
                  Health score {account.healthScore}/100 - Safe to start campaigns
                </p>
              </div>
            </div>
          )}

          {/* Warning Status */}
          {account.healthScore < 70 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div className="text-sm">
                <p className="font-semibold text-red-900 dark:text-red-100">Action Required</p>
                <p className="text-red-700 dark:text-red-300 text-xs">
                  Low health score - Continue warming for {7 - account.daysInStage} more days
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(account.id)} className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePause}
              disabled={isToggling}
              className={account.warmupEnabled ? "border-amber-500 text-amber-700" : "border-green-500 text-green-700"}
            >
              {account.warmupEnabled ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
