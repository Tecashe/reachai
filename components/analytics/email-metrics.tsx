import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const metrics = [
  { label: "Delivery Rate", value: 98.2, count: "12,298 / 12,543", color: "bg-green-500" },
  { label: "Open Rate", value: 42.3, count: "5,295 / 12,543", color: "bg-blue-500" },
  { label: "Click Rate", value: 15.8, count: "1,982 / 12,543", color: "bg-purple-500" },
  { label: "Reply Rate", value: 24.8, count: "3,110 / 12,543", color: "bg-cyan-500" },
  { label: "Bounce Rate", value: 1.8, count: "226 / 12,543", color: "bg-red-500" },
  { label: "Unsubscribe Rate", value: 0.3, count: "38 / 12,543", color: "bg-orange-500" },
]

const bestPerformingTimes = [
  { day: "Tuesday", time: "10:00 AM", openRate: 48.2 },
  { day: "Wednesday", time: "2:00 PM", openRate: 45.7 },
  { day: "Thursday", time: "9:00 AM", openRate: 44.1 },
]

export function EmailMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Email Metrics Overview</CardTitle>
          <CardDescription>Performance across all campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">{metric.count}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={metric.value} className="flex-1" />
                <span className="text-sm font-semibold w-12 text-right">{metric.value}%</span>
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
            <div className="space-y-4">
              {bestPerformingTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{time.day}</p>
                    <p className="text-sm text-muted-foreground">{time.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{time.openRate}%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                </div>
              ))}
            </div>
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
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.92)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">92</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Excellent sender reputation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
