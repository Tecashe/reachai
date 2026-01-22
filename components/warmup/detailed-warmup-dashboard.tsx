"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaveLoader } from "@/components/loader/wave-loader"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    const interval = setInterval(fetchData, 60000) // Refresh every minute
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
      console.error("[v0] Error fetching warmup stats:", error)
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
      console.error("[v0] Error fetching chart data:", error)
    }
  }

  const getHealthGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-success" }
    if (score >= 80) return { grade: "A", color: "text-success" }
    if (score >= 70) return { grade: "B", color: "text-chart-2" }
    if (score >= 60) return { grade: "C", color: "text-warning" }
    return { grade: "D", color: "text-destructive" }
  }

  const formatTrend = (value: number) => {
    if (value === 0) return null
    const isPositive = value > 0
    return (
      <span className={`flex items-center gap-1 text-xs ${isPositive ? "text-success" : "text-destructive"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(value)}%
      </span>
    )
  }

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
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Accounts */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Warmup Accounts</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.activeAccounts}</div>
              {formatTrend(stats.trends.activeAccounts)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Accounts currently warming up</p>
          </CardContent>
        </Card>

        {/* Emails Sent Today */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent Today</CardTitle>
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.emailsSentToday}</div>
              {formatTrend(stats.trends.emailsSent)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Warmup emails dispatched</p>
          </CardContent>
        </Card>

        {/* Inbox Rate */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Inbox Rate</CardTitle>
              <Inbox className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-foreground">{stats.inboxRate}%</div>
              {formatTrend(stats.trends.inboxRate)}
            </div>
            <div className="mt-2">
              <Badge variant={stats.inboxRate >= 90 ? "default" : stats.inboxRate >= 70 ? "secondary" : "destructive"}>
                {stats.inboxRate >= 90 ? "Excellent" : stats.inboxRate >= 70 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Network Health Score</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stats.healthScore}</span>
                <span className="text-lg text-muted-foreground">/ 100</span>
              </div>
              {formatTrend(stats.trends.healthScore)}
            </div>
            <div className="mt-2">
              <Badge className={healthGrade.color}>Grade: {healthGrade.grade}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Warmup Performance
              </CardTitle>
              <CardDescription>Email delivery metrics over time</CardDescription>
            </div>
            <Tabs value={chartPeriod} onValueChange={(v) => setChartPeriod(v as typeof chartPeriod)}>
              <TabsList>
                <TabsTrigger value="7">7 Days</TabsTrigger>
                <TabsTrigger value="30">30 Days</TabsTrigger>
                <TabsTrigger value="90">90 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Clock className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No warmup activity yet</p>
              <p className="text-xs text-muted-foreground">Data will appear once warmup emails are sent</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInbox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#colorSent)"
                  strokeWidth={2}
                  name="Emails Sent"
                />
                <Area
                  type="monotone"
                  dataKey="inboxRate"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#colorInbox)"
                  strokeWidth={2}
                  name="Inbox Rate %"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Active Warmup Sessions</span>
                  <span className="font-semibold">{stats.activeAccounts}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Emails Sent (30d)</span>
                  <span className="font-semibold">{chartData.reduce((sum, d) => sum + d.sent, 0)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Average Open Rate</span>
                  <span className="font-semibold">
                    {chartData.length > 0
                      ? Math.round(chartData.reduce((sum, d) => sum + d.openRate, 0) / chartData.length)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Reply Rate</span>
                  <span className="font-semibold">
                    {chartData.length > 0
                      ? Math.round(chartData.reduce((sum, d) => sum + d.replyRate, 0) / chartData.length)
                      : 0}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Warmup Engine</span>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    <span className="w-2 h-2 bg-success-foreground rounded-full mr-1 animate-pulse" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Delivery</span>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    <span className="w-2 h-2 bg-success-foreground rounded-full mr-1 animate-pulse" />
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
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardContent className="py-20 text-center text-muted-foreground">
              <p>Account management view - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="py-20 text-center text-muted-foreground">
              <p>Advanced analytics - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="py-20 text-center text-muted-foreground">
              <p>Warmup settings - Coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
