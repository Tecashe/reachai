

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EmailMetricsProps {
  metrics: {
    totalSent: number
    delivered: number
    opened: number
    clicked: number
    replied: number
    bounced: number
    unsubscribed: number
  }
  bestTimes?: Array<{
    day: string
    time: string
    openRate: number
  }>
}

export function EmailMetrics({ metrics, bestTimes = [] }: EmailMetricsProps) {
  const deliveryRate = metrics.totalSent > 0 ? (metrics.delivered / metrics.totalSent) * 100 : 0
  const openRate = metrics.totalSent > 0 ? (metrics.opened / metrics.totalSent) * 100 : 0
  const clickRate = metrics.totalSent > 0 ? (metrics.clicked / metrics.totalSent) * 100 : 0
  const replyRate = metrics.totalSent > 0 ? (metrics.replied / metrics.totalSent) * 100 : 0
  const bounceRate = metrics.totalSent > 0 ? (metrics.bounced / metrics.totalSent) * 100 : 0
  const unsubscribeRate = metrics.totalSent > 0 ? (metrics.unsubscribed / metrics.totalSent) * 100 : 0

  const emailMetrics = [
    {
      label: "Delivery Rate",
      value: deliveryRate,
      count: `${metrics.delivered.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-green-500",
    },
    {
      label: "Open Rate",
      value: openRate,
      count: `${metrics.opened.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-blue-500",
    },
    {
      label: "Click Rate",
      value: clickRate,
      count: `${metrics.clicked.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-purple-500",
    },
    {
      label: "Reply Rate",
      value: replyRate,
      count: `${metrics.replied.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-cyan-500",
    },
    {
      label: "Bounce Rate",
      value: bounceRate,
      count: `${metrics.bounced.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-red-500",
    },
    {
      label: "Unsubscribe Rate",
      value: unsubscribeRate,
      count: `${metrics.unsubscribed.toLocaleString()} / ${metrics.totalSent.toLocaleString()}`,
      color: "bg-orange-500",
    },
  ]

  const healthScore = Math.round(
    deliveryRate * 0.3 + openRate * 0.25 + clickRate * 0.2 + replyRate * 0.15 - bounceRate * 0.1,
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Email Metrics Overview</CardTitle>
          <CardDescription>Performance across all campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailMetrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">{metric.count}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={metric.value} className="flex-1" />
                <span className="text-sm font-semibold w-12 text-right">{metric.value.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Performing Send Times</CardTitle>
            <CardDescription>Optimal times for email engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {bestTimes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Not enough data yet</p>
            ) : (
              <div className="space-y-4">
                {bestTimes.slice(0, 3).map((time, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{time.day}</p>
                      <p className="text-sm text-muted-foreground">{time.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{time.openRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Health Score</CardTitle>
            <CardDescription>Overall sender reputation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-green-500 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - healthScore / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{healthScore}</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs improvement"} sender reputation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
