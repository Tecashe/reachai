"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Settings,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Inbox,
  AlertTriangle,
} from "lucide-react"

interface EmailAccount {
  id: string
  email: string
  provider: "gmail" | "outlook" | "yahoo" | "custom"
  status: "active" | "paused" | "warming" | "issues" | "completed"
  warmupConfig: {
    startVolume: number
    targetVolume: number
    currentVolume: number
    rampSpeed: "conservative" | "moderate" | "aggressive"
    daysActive: number
    scheduleEnabled: boolean
    weekendSending: boolean
  }
  stats: {
    emailsSentToday: number
    emailsSentTotal: number
    inboxRate: number
    spamRate: number
    reputationScore: number
    openRate: number
    replyRate: number
    trend: "up" | "down" | "stable"
  }
  createdAt: Date
  lastActivity: Date
}

interface NetworkHealth {
  score: number
  totalSize: number
  composition: {
    googleWorkspace: number
    office365: number
    other: number
  }
  averageReputation: number
  lastUpdated: Date
}

interface WarmupOverviewTabProps {
  accounts: EmailAccount[]
  networkHealth: NetworkHealth | null
  onRefresh: () => void
}

// Generate mock chart data for last 30 days
const generateChartData = () => {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sent: Math.floor(Math.random() * 50) + 30,
      inboxRate: Math.floor(Math.random() * 8) + 92,
      spamRate: Math.floor(Math.random() * 5) + 1,
    })
  }
  return data
}

const recentActivities = [
  { id: 1, timestamp: "2 min ago", email: "john@company.com", action: "Sent warmup email", status: "success" },
  { id: 2, timestamp: "5 min ago", email: "sarah@business.io", action: "Moved from spam to inbox", status: "success" },
  { id: 3, timestamp: "12 min ago", email: "mike@startup.co", action: "Positive reply received", status: "success" },
  { id: 4, timestamp: "18 min ago", email: "john@company.com", action: "Marked as important", status: "success" },
  { id: 5, timestamp: "25 min ago", email: "sarah@business.io", action: "Sent warmup email", status: "success" },
  { id: 6, timestamp: "32 min ago", email: "alex@enterprise.com", action: "Authentication warning", status: "warning" },
  { id: 7, timestamp: "45 min ago", email: "mike@startup.co", action: "Sent warmup email", status: "success" },
  { id: 8, timestamp: "1 hour ago", email: "john@company.com", action: "Warmup stage upgraded", status: "success" },
]

type ChartMetric = "all" | "sent" | "inboxRate" | "spamRate"

export function WarmupOverviewTab({ accounts, networkHealth, onRefresh }: WarmupOverviewTabProps) {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("all")
  const chartData = generateChartData()

  const handleMetricChange = (value: string) => {
    setChartMetric(value as ChartMetric)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      case "warming":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Warming Up</Badge>
      case "paused":
        return <Badge className="bg-muted text-muted-foreground border-border">Paused</Badge>
      case "issues":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Issues</Badge>
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProviderIcon = (provider: string) => {
    return <Mail className="h-4 w-4" />
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />
    return null
  }

  const getActivityIcon = (status: string) => {
    if (status === "success") return <CheckCircle2 className="h-4 w-4 text-success" />
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />
    return <AlertCircle className="h-4 w-4 text-destructive" />
  }

  return (
    <div className="space-y-6">
      {/* Warmup Performance Chart */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Warmup Performance</CardTitle>
            <CardDescription>Email delivery metrics over the last 30 days</CardDescription>
          </div>
          <Select value={chartMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="sent">Emails Sent</SelectItem>
              <SelectItem value="inboxRate">Inbox Rate</SelectItem>
              <SelectItem value="spamRate">Spam Rate</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                {(chartMetric === "all" || chartMetric === "sent") && (
                  <Line
                    type="monotone"
                    dataKey="sent"
                    name="Emails Sent"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {(chartMetric === "all" || chartMetric === "inboxRate") && (
                  <Line
                    type="monotone"
                    dataKey="inboxRate"
                    name="Inbox Rate %"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {(chartMetric === "all" || chartMetric === "spamRate") && (
                  <Line
                    type="monotone"
                    dataKey="spamRate"
                    name="Spam Rate %"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Warmup Sessions Table */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Warmup Sessions</CardTitle>
            <CardDescription>Monitor your email accounts warming up</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No accounts warming up yet</p>
                <p className="text-sm text-muted-foreground">Add an email account to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email Address</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Daily Volume</TableHead>
                      <TableHead>Inbox Rate</TableHead>
                      <TableHead>Days Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.slice(0, 5).map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getProviderIcon(account.provider)}
                            <span className="truncate max-w-[200px]">{account.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {account.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>
                              {account.stats.emailsSentToday}/{account.warmupConfig.targetVolume}
                            </span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${(account.stats.emailsSentToday / account.warmupConfig.targetVolume) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span
                              className={
                                account.stats.inboxRate >= 95
                                  ? "text-success"
                                  : account.stats.inboxRate >= 90
                                    ? "text-warning"
                                    : "text-destructive"
                              }
                            >
                              {account.stats.inboxRate}%
                            </span>
                            {getTrendIcon(account.stats.trend)}
                          </div>
                        </TableCell>
                        <TableCell>{account.warmupConfig.daysActive}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                {account.status === "paused" ? (
                                  <>
                                    <Play className="h-4 w-4" /> Resume
                                  </>
                                ) : (
                                  <>
                                    <Pause className="h-4 w-4" /> Pause
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Settings className="h-4 w-4" /> Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash2 className="h-4 w-4" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest warmup actions</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-0.5">{getActivityIcon(activity.status)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common warmup management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              Add New Email Account
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Inbox className="h-4 w-4" />
              Bulk Import Accounts
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <TrendingUp className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Configure Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
