"use client"

import { Card } from "@/components/ui/card"
import { Alert as UIAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, X, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Alert {
  id: string
  severity: "CRITICAL" | "WARNING" | "INFO"
  title: string
  message: string
  domainId?: string
  sendingAccountId?: string
  actionUrl?: string
  timestamp: Date
}

interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
}

export function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
            <Info className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold">All Clear</h3>
          <p className="text-sm text-muted-foreground">No deliverability issues detected</p>
        </div>
      </Card>
    )
  }

  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL")
  const warningAlerts = alerts.filter((a) => a.severity === "WARNING")
  const infoAlerts = alerts.filter((a) => a.severity === "INFO")

  return (
    <div className="space-y-4">
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Critical
            </Badge>
            <span className="text-sm text-muted-foreground">{criticalAlerts.length} issues</span>
          </div>
          {criticalAlerts.map((alert) => (
            <UIAlert key={alert.id} variant="destructive" className="relative">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="pr-8">{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
              {alert.actionUrl && (
                <Button asChild variant="outline" size="sm" className="mt-3 bg-transparent">
                  <Link href={alert.actionUrl}>
                    View Details
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => onDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </UIAlert>
          ))}
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 border-yellow-600 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400"
            >
              <AlertTriangle className="h-3 w-3" />
              Warning
            </Badge>
            <span className="text-sm text-muted-foreground">{warningAlerts.length} issues</span>
          </div>
          {warningAlerts.map((alert) => (
            <UIAlert key={alert.id} className="border-yellow-200 dark:border-yellow-900">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="pr-8">{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
              {alert.actionUrl && (
                <Button asChild variant="outline" size="sm" className="mt-3 bg-transparent">
                  <Link href={alert.actionUrl}>
                    View Details
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => onDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </UIAlert>
          ))}
        </div>
      )}

      {infoAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Info className="h-3 w-3" />
              Info
            </Badge>
            <span className="text-sm text-muted-foreground">{infoAlerts.length} notifications</span>
          </div>
          {infoAlerts.map((alert) => (
            <UIAlert key={alert.id}>
              <Info className="h-4 w-4" />
              <AlertTitle className="pr-8">{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
              {alert.actionUrl && (
                <Button asChild variant="outline" size="sm" className="mt-3 bg-transparent">
                  <Link href={alert.actionUrl}>
                    View Details
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              )}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => onDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </UIAlert>
          ))}
        </div>
      )}
    </div>
  )
}
