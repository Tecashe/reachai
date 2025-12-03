"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

interface SequenceMonitoringStatsProps {
  scheduleStats: Array<{ status: string; _count: number }>
  prospectsByStep: Array<{
    id: string
    status: string
    scheduledFor: Date
    prospect: {
      id: string
      firstName: string | null
      lastName: string | null
      email: string
      company: string | null
      status: string
    }
  }>
}

export function SequenceMonitoringStats({
  scheduleStats,
  prospectsByStep,
}: SequenceMonitoringStatsProps) {
  const totalScheduled = scheduleStats.reduce((sum, stat) => sum + stat._count, 0)
  const pendingCount = scheduleStats.find((s) => s.status === "PENDING")?._count || 0
  const sentCount = scheduleStats.find((s) => s.status === "SENT")?._count || 0
  const failedCount = scheduleStats.find((s) => s.status === "FAILED")?._count || 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total in Sequence</p>
              <p className="text-2xl font-bold">{totalScheduled}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold">{sentCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{failedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {prospectsByStep.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 font-semibold text-sm">Recent Activity</h3>
          <div className="space-y-2">
            {prospectsByStep.slice(0, 5).map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">
                    {schedule.prospect.firstName} {schedule.prospect.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{schedule.prospect.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={schedule.status === "SENT" ? "default" : "secondary"} className="text-xs">
                    {schedule.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {schedule.status === "PENDING"
                      ? formatDistanceToNow(new Date(schedule.scheduledFor), { addSuffix: true })
                      : "Sent"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
