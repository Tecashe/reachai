"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WaveLoader } from "@/components/loader/wave-loader"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Mail,
  Inbox,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Users,
  Zap,
} from "lucide-react"

interface DashboardStats {
  activeAccounts: number
  emailsSentToday: number
  inboxRate: number
  healthScore: number
  trends: {
    activeAccounts: number
    emailsSent: number
    inboxRate: number
    healthScore: number
  }
}

interface ChartDataPoint {
  date: string
  sent: number
  inboxRate: number
  openRate: number
  replyRate: number
}

export function DetailedWarmupDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [chartPeriod, setChartPeriod] = useState<"7" | "30" | "90">("30")

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchChartData()
  }, [chartPeriod])

  const fetchData = async () => {
    try {
      const res = await fetch("/api/warmup/dashboard-stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching warmup stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const res = await fetch(`/api/warmup/performance-chart?days=${chartPeriod}`)
      if (res.ok) {
        const { data } = await res.json()
        setChartData(data || [])
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
    }
  }

  const getHealthGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-foreground" }
    if (score >= 80) return { grade: "A", color: "text-foreground" }
    if (score >= 70) return { grade: "B", color: "text-muted-foreground" }
    if (score >= 60) return { grade: "C", color: "text-muted-foreground" }
    return { grade: "D", color: "text-destructive" }
  }

  const formatTrend = (value: number) => {
    if (value === 0) return null
    const isPositive = value > 0
    return (
      <span className={`flex items-center gap-1 text-xs ${isPositive ? "text-foreground" : "text-destructive"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(value)}%
      </span>
    )
  }

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = parseInt(chartPeriod)
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WaveLoader color="bg-foreground" size="lg" speed="normal" />
        <p className="text-muted-foreground text-sm">Loading warmup analytics...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load warmup data</p>
          <Button onClick={fetchData}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  const healthGrade = getHealthGrade(stats.healthScore)

  return (
    <div className="space-y-6 w-full">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Accounts */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Warmup</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.activeAccounts}</div>
              {formatTrend(stats.trends.activeAccounts)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Accounts warming up</p>
          </CardContent>
        </Card>

        {/* Emails Sent Today */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sent Today</CardTitle>
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.emailsSentToday}</div>
              {formatTrend(stats.trends.emailsSent)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Warmup emails sent</p>
          </CardContent>
        </Card>

        {/* Inbox Rate */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inbox Rate</CardTitle>
              <Inbox className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.inboxRate}%</div>
              {formatTrend(stats.trends.inboxRate)}
            </div>
            <div className="mt-2">
              <Badge variant={stats.inboxRate >= 90 ? "default" : stats.inboxRate >= 70 ? "secondary" : "destructive"} className="text-xs">
                {stats.inboxRate >= 90 ? "Excellent" : stats.inboxRate >= 70 ? "Good" : "Poor"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">{stats.healthScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              {formatTrend(stats.trends.healthScore)}
            </div>
            <div className="mt-2">
              <Badge className={`${healthGrade.color} text-xs`}>Grade: {healthGrade.grade}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="w-5 h-5" />
                Warmup Performance
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Email delivery metrics over time
              </CardDescription>
            </div>
            <Select value={chartPeriod} onValueChange={(v) => setChartPeriod(v as typeof chartPeriod)}>
              <SelectTrigger className="w-full sm:w-[140px]" aria-label="Select time range">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7" className="rounded-lg">Last 7 days</SelectItem>
                <SelectItem value="30" className="rounded-lg">Last 30 days</SelectItem>
                <SelectItem value="90" className="rounded-lg">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Clock className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No warmup activity yet</p>
              <p className="text-xs text-muted-foreground">Data will appear once warmup emails are sent</p>
            </div>
          ) : (
            <div className="w-full h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillInbox" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
                          <p className="text-sm font-semibold text-popover-foreground mb-2">
                            {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-muted-foreground">{entry.name}:</span>
                              <span className="font-semibold text-popover-foreground">
                                {entry.name === "Emails Sent" ? entry.value : `${entry.value}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Area
                    type="natural"
                    dataKey="sent"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#fillSent)"
                    strokeWidth={2}
                    name="Emails Sent"
                  />
                  <Area
                    type="natural"
                    dataKey="inboxRate"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#fillInbox)"
                    strokeWidth={2}
                    name="Inbox Rate %"
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    content={({ payload }) => (
                      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        {payload?.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="w-4 h-4" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Active Sessions</span>
              <span className="font-semibold">{stats.activeAccounts}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Emails Sent (Period)</span>
              <span className="font-semibold">{filteredData.reduce((sum, d) => sum + d.sent, 0)}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Avg Open Rate</span>
              <span className="font-semibold">
                {filteredData.length > 0
                  ? Math.round(filteredData.reduce((sum, d) => sum + d.openRate, 0) / filteredData.length)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Reply Rate</span>
              <span className="font-semibold">
                {filteredData.length > 0
                  ? Math.round(filteredData.reduce((sum, d) => sum + d.replyRate, 0) / filteredData.length)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CheckCircle2 className="w-4 h-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Warmup Engine</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <span className="w-2 h-2 bg-primary-foreground rounded-full mr-1 animate-pulse" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email Delivery</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                <span className="w-2 h-2 bg-primary-foreground rounded-full mr-1 animate-pulse" />
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network Health</span>
              <Badge variant={stats.healthScore >= 80 ? "default" : "secondary"}>
                {healthGrade.grade}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inbox Placement</span>
              <Badge variant={stats.inboxRate >= 90 ? "default" : stats.inboxRate >= 70 ? "secondary" : "destructive"}>
                {stats.inboxRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}