"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, Users, Mail, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

interface SequenceMonitoringDashboardProps {
  campaign: any
  scheduleStats: any[]
  prospectsByStep: any[]
}

export function SequenceMonitoringDashboard({
  campaign,
  scheduleStats,
  prospectsByStep,
}: SequenceMonitoringDashboardProps) {
  const totalScheduled = scheduleStats.reduce((sum, stat) => sum + stat._count, 0)
  const pendingCount = scheduleStats.find((s) => s.status === "PENDING")?._count || 0
  const sentCount = scheduleStats.find((s) => s.status === "SENT")?._count || 0
  const failedCount = scheduleStats.find((s) => s.status === "FAILED")?._count || 0

  const completionRate = totalScheduled > 0 ? (sentCount / totalScheduled) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <p className="text-muted-foreground">Monitor your sequence performance and prospect progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total in Sequence</p>
              <p className="text-2xl font-bold">{totalScheduled}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold">{sentCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{failedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Sequence Completion</h3>
            <span className="text-sm text-muted-foreground">{completionRate.toFixed(1)}%</span>
          </div>
          <Progress value={completionRate} />
        </div>
      </Card>

      {/* Sequence Steps */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Sequence Steps</h3>
        <div className="space-y-4">
          {campaign.emailSequences.map((seq: any, index: number) => {
            const prospectsAtStep = prospectsByStep.filter((p) => {
              // Calculate which step this prospect is at based on delay
              return true // Simplified for now
            })

            return (
              <div key={seq.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{seq.template.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {seq.delayDays === 0 ? "Immediate" : `${seq.delayDays} days after previous`}
                  </p>
                </div>
                <Badge variant="secondary">{prospectsAtStep.length} prospects</Badge>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Prospects List */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Prospects in Sequence</h3>
        <div className="space-y-2">
          {prospectsByStep.slice(0, 10).map((schedule: any) => (
            <div key={schedule.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">
                  {schedule.prospect.firstName} {schedule.prospect.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{schedule.prospect.email}</p>
              </div>
              <div className="text-right">
                <Badge variant={schedule.status === "SENT" ? "default" : "secondary"}>
                  {schedule.status}
                </Badge>
                <p className="mt-1 text-xs text-muted-foreground">
                  {schedule.status === "PENDING"
                    ? `Sending ${formatDistanceToNow(new Date(schedule.scheduledFor), { addSuffix: true })}`
                    : `Sent ${formatDistanceToNow(new Date(schedule.scheduledFor), { addSuffix: true })}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
