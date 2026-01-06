"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Mail, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import type { WarmupAccount } from "./warmup-dashboard"

interface WarmupAccountDetailModalProps {
  account: WarmupAccount | null
  open: boolean
  onClose: () => void
}

export function WarmupAccountDetailModal({ account, open, onClose }: WarmupAccountDetailModalProps) {
  if (!account) return null

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-gray-500",
      WARMING: "bg-yellow-500",
      WARM: "bg-orange-500",
      ACTIVE: "bg-blue-500",
      ESTABLISHED: "bg-green-500",
    }
    return colors[stage] || "bg-gray-500"
  }

  const getHealthZone = (score: number) => {
    if (score >= 90) return { label: "Ready", color: "text-green-600", bg: "bg-green-50" }
    if (score >= 70) return { label: "Warning", color: "text-amber-600", bg: "bg-amber-50" }
    return { label: "Critical", color: "text-red-600", bg: "bg-red-50" }
  }

  const healthZone = getHealthZone(account.healthScore)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Mail className="h-5 w-5" />
            {account.email}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Health Score</p>
                  <p className="text-3xl font-bold">{account.healthScore}/100</p>
                </div>
                <Badge className={`${healthZone.bg} ${healthZone.color} border-0 text-sm px-4 py-2`}>
                  {healthZone.label}
                </Badge>
              </div>
              <Progress value={account.healthScore} className="h-2" />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Inbox Placement</p>
                  <p className="text-xl font-semibold">{account.inboxPlacementRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-xl font-semibold">{account.openRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reply Rate</p>
                  <p className="text-xl font-semibold">{account.replyRate}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Spam Rate</p>
                  <p className="text-xl font-semibold text-red-600">{account.spamRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warmup Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Warmup Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStageColor(account.warmupStage)}>{account.warmupStage}</Badge>
                <span className="text-sm text-muted-foreground">
                  Day {account.daysInStage} of stage
                  {account.daysUntilNext > 0 && ` • ${account.daysUntilNext} days until next`}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Daily Progress</span>
                  <span className="font-medium">
                    {account.emailsSentToday}/{account.dailyLimit} emails
                  </span>
                </div>
                <Progress value={(account.emailsSentToday / account.dailyLimit) * 100} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Total Warmup Emails Sent</p>
                <p className="text-2xl font-bold">{account.warmupProgress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Warmup Active</p>
                    <p className="text-xs text-muted-foreground">
                      Started {new Date(account.warmupStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {account.healthScore < 70 && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Health Score Below Optimal</p>
                      <p className="text-xs text-muted-foreground">Monitor deliverability metrics</p>
                    </div>
                  </div>
                )}

                {account.healthScore >= 90 && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Ready for Campaign Sending</p>
                      <p className="text-xs text-muted-foreground">Health score meets minimum threshold</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
