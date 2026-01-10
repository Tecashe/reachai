"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { WaveLoader } from "@/components/loader/wave-loader"
import { useToast } from "@/hooks/use-toast"
import {
  TrendingUp,
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
  AlertTriangle,
  Download,
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

type ChartMetric = "all" | "sent" | "inboxRate"

interface PerformanceData {
  date: string
  sent: number
  opened: number
  replied: number
  inboxRate: number
}

interface Activity {
  id: string
  type: string
  message: string
  email: string
  accountName: string
  timestamp: Date
  subject?: string
}

interface WarmupSession {
  id: string
  accountEmail: string
  accountName: string
  provider: string
  stage: string
  progress: number
  emailsSent: number
  inboxRate: number
  openRate: number
  replyRate: number
  health: number
  startedAt: Date
}

export function WarmupOverviewTab({ accounts, networkHealth, onRefresh }: WarmupOverviewTabProps) {
  const [chartMetric, setChartMetric] = useState<ChartMetric>("all")
  const [chartData, setChartData] = useState<PerformanceData[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [sessions, setSessions] = useState<WarmupSession[]>([])
  const [loadingChart, setLoadingChart] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [accounts])

  const fetchPerformanceData = async () => {
    try {
      setLoadingChart(true)
      const res = await fetch("/api/warmup/performance?days=30")
      if (!res.ok) throw new Error("Failed to fetch performance data")
      const data = await res.json()
      setChartData(data.data || [])
    } catch (error) {
      console.error("[v0] Error fetching performance data:", error)
      toast({
        title: "Error",
        description: "Failed to load performance data",
        variant: "destructive",
      })
    } finally {
      setLoadingChart(false)
    }
  }

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true)
      const res = await fetch("/api/warmup/activities?limit=8")
      if (!res.ok) throw new Error("Failed to fetch activities")
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error("[v0] Error fetching activities:", error)
    } finally {
      setLoadingActivities(false)
    }
  }

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true)
      const res = await fetch("/api/warmup/sessions")
      if (!res.ok) throw new Error("Failed to fetch sessions")
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("[v0] Error fetching sessions:", error)
      toast({
        title: "Error",
        description: "Failed to load warmup sessions",
        variant: "destructive",
      })
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleMetricChange = (value: string) => {
    setChartMetric(value as ChartMetric)
  }

  const handleDownloadReport = async () => {
    try {
      const res = await fetch("/api/warmup/export?format=csv")
      if (!res.ok) throw new Error("Failed to export data")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `warmup-report-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      })
    } catch (error) {
      console.error("[v0] Error downloading report:", error)
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      })
    }
  }

  const handlePauseResume = async (sessionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED"
      const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update session")
      toast({
        title: "Success",
        description: `Warmup ${newStatus === "PAUSED" ? "paused" : "resumed"}`,
      })
      fetchSessions()
    } catch (error) {
      console.error("[v0] Error updating session:", error)
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      })
    }
  }

  const handleRemoveSession = async (sessionId: string) => {
    if (!confirm("Are you sure you want to remove this warmup session?")) return
    try {
      const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete session")
      toast({
        title: "Success",
        description: "Warmup session removed",
      })
      fetchSessions()
    } catch (error) {
      console.error("[v0] Error deleting session:", error)
      toast({
        title: "Error",
        description: "Failed to remove session",
        variant: "destructive",
      })
    }
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

  const getActivityIcon = (type: string) => {
    if (type === "sent") return <Mail className="h-4 w-4 text-primary" />
    if (type === "reply") return <CheckCircle2 className="h-4 w-4 text-success" />
    if (type === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />
    return <AlertCircle className="h-4 w-4 text-destructive" />
  }

  const getActivityStatus = (type: string) => {
    if (type === "sent" || type === "reply" || type === "received") return "success"
    if (type === "warning") return "warning"
    return "error"
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
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loadingChart ? (
            <div className="h-[300px] flex items-center justify-center">
              <WaveLoader size="md" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No performance data available yet
            </div>
          ) : (
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
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
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
            {loadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <WaveLoader size="md" />
              </div>
            ) : sessions.length === 0 ? (
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
                      <TableHead>Emails Sent</TableHead>
                      <TableHead>Inbox Rate</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.slice(0, 5).map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate max-w-[200px]">{session.accountEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {session.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(session.stage)}</TableCell>
                        <TableCell>{session.emailsSent}</TableCell>
                        <TableCell>
                          <span
                            className={
                              session.inboxRate >= 95
                                ? "text-success"
                                : session.inboxRate >= 90
                                  ? "text-warning"
                                  : "text-destructive"
                            }
                          >
                            {session.inboxRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(session.startedAt).toLocaleDateString()}
                        </TableCell>
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
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => handlePauseResume(session.id, session.stage)}
                              >
                                {session.stage === "PAUSED" ? (
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
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() => handleRemoveSession(session.id)}
                              >
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
            {loadingActivities ? (
              <div className="flex items-center justify-center py-8">
                <WaveLoader size="sm" />
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Clock className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={onRefresh}>
              <TrendingUp className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
