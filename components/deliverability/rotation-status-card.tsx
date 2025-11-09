"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, TrendingUp, Mail, Clock } from "lucide-react"
import { useState } from "react"

interface RotationMetrics {
  totalAccounts: number
  activeAccounts: number
  rotationsToday: number
  avgEmailsPerAccount: number
  nextRotationIn: number
  rotationStrategy: string
}

interface RotationStatusCardProps {
  metrics: RotationMetrics
  onManualRotate?: () => void
}

export function RotationStatusCard({ metrics, onManualRotate }: RotationStatusCardProps) {
  const [rotating, setRotating] = useState(false)

  const handleRotate = async () => {
    setRotating(true)
    await onManualRotate?.()
    setTimeout(() => setRotating(false), 2000)
  }

  const rotationProgress = (metrics.rotationsToday / (metrics.activeAccounts * 3)) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Account Rotation
            </CardTitle>
            <CardDescription>Automatic load balancing across sending accounts</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            {metrics.rotationStrategy}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Accounts</span>
              <span className="font-medium">
                {metrics.activeAccounts}/{metrics.totalAccounts}
              </span>
            </div>
            <Progress value={(metrics.activeAccounts / metrics.totalAccounts) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rotations Today</span>
              <span className="font-medium">{metrics.rotationsToday}</span>
            </div>
            <Progress value={rotationProgress} className="h-2" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Emails/Account</p>
              <p className="text-lg font-semibold">{metrics.avgEmailsPerAccount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Rotation</p>
              <p className="text-lg font-semibold">{metrics.nextRotationIn}m</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-lg font-semibold">94%</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            onClick={handleRotate}
            disabled={rotating}
            size="sm"
            variant="outline"
            className="gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${rotating ? "animate-spin" : ""}`} />
            {rotating ? "Rotating..." : "Rotate Now"}
          </Button>
          <p className="text-xs text-muted-foreground">Manually trigger account rotation</p>
        </div>
      </CardContent>
    </Card>
  )
}
