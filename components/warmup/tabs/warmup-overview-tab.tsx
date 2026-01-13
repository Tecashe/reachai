// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
// import { WaveLoader } from "@/components/loader/wave-loader"
// import { useToast } from "@/hooks/use-toast"
// import {
//   TrendingUp,
//   MoreHorizontal,
//   Eye,
//   Pause,
//   Play,
//   Settings,
//   Trash2,
//   Mail,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   AlertTriangle,
//   Download,
// } from "lucide-react"

// interface EmailAccount {
//   id: string
//   email: string
//   provider: "gmail" | "outlook" | "yahoo" | "custom"
//   status: "active" | "paused" | "warming" | "issues" | "completed"
//   warmupConfig: {
//     startVolume: number
//     targetVolume: number
//     currentVolume: number
//     rampSpeed: "conservative" | "moderate" | "aggressive"
//     daysActive: number
//     scheduleEnabled: boolean
//     weekendSending: boolean
//   }
//   stats: {
//     emailsSentToday: number
//     emailsSentTotal: number
//     inboxRate: number
//     spamRate: number
//     reputationScore: number
//     openRate: number
//     replyRate: number
//     trend: "up" | "down" | "stable"
//   }
//   createdAt: Date
//   lastActivity: Date
// }

// interface NetworkHealth {
//   score: number
//   totalSize: number
//   composition: {
//     googleWorkspace: number
//     office365: number
//     other: number
//   }
//   averageReputation: number
//   lastUpdated: Date
// }

// interface WarmupOverviewTabProps {
//   accounts: EmailAccount[]
//   networkHealth: NetworkHealth | null
//   onRefresh: () => void
// }

// type ChartMetric = "all" | "sent" | "inboxRate"

// interface PerformanceData {
//   date: string
//   sent: number
//   opened: number
//   replied: number
//   inboxRate: number
// }

// interface Activity {
//   id: string
//   type: string
//   message: string
//   email: string
//   accountName: string
//   timestamp: Date
//   subject?: string
// }

// interface WarmupSession {
//   id: string
//   accountEmail: string
//   accountName: string
//   provider: string
//   stage: string
//   progress: number
//   emailsSent: number
//   inboxRate: number
//   openRate: number
//   replyRate: number
//   health: number
//   startedAt: Date
// }

// export function WarmupOverviewTab({ accounts, networkHealth, onRefresh }: WarmupOverviewTabProps) {
//   const [chartMetric, setChartMetric] = useState<ChartMetric>("all")
//   const [chartData, setChartData] = useState<PerformanceData[]>([])
//   const [activities, setActivities] = useState<Activity[]>([])
//   const [sessions, setSessions] = useState<WarmupSession[]>([])
//   const [loadingChart, setLoadingChart] = useState(true)
//   const [loadingActivities, setLoadingActivities] = useState(true)
//   const [loadingSessions, setLoadingSessions] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchPerformanceData()
//   }, [])

//   useEffect(() => {
//     fetchActivities()
//     const interval = setInterval(fetchActivities, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     fetchSessions()
//   }, [accounts])

//   const fetchPerformanceData = async () => {
//     try {
//       setLoadingChart(true)
//       const res = await fetch("/api/warmup/performance?days=30")
//       if (!res.ok) throw new Error("Failed to fetch performance data")
//       const data = await res.json()
//       setChartData(data.data || [])
//     } catch (error) {
//       console.error("[v0] Error fetching performance data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load performance data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingChart(false)
//     }
//   }

//   const fetchActivities = async () => {
//     try {
//       setLoadingActivities(true)
//       const res = await fetch("/api/warmup/activities?limit=8")
//       if (!res.ok) throw new Error("Failed to fetch activities")
//       const data = await res.json()
//       setActivities(data.activities || [])
//     } catch (error) {
//       console.error("[v0] Error fetching activities:", error)
//     } finally {
//       setLoadingActivities(false)
//     }
//   }

//   const fetchSessions = async () => {
//     try {
//       setLoadingSessions(true)
//       const res = await fetch("/api/warmup/sessions")
//       if (!res.ok) throw new Error("Failed to fetch sessions")
//       const data = await res.json()
//       setSessions(data.sessions || [])
//     } catch (error) {
//       console.error("[v0] Error fetching sessions:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load warmup sessions",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingSessions(false)
//     }
//   }

//   const handleMetricChange = (value: string) => {
//     setChartMetric(value as ChartMetric)
//   }

//   const handleDownloadReport = async () => {
//     try {
//       const res = await fetch("/api/warmup/export?format=csv")
//       if (!res.ok) throw new Error("Failed to export data")
//       const blob = await res.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `warmup-report-${new Date().toISOString().split("T")[0]}.csv`
//       document.body.appendChild(a)
//       a.click()
//       window.URL.revokeObjectURL(url)
//       document.body.removeChild(a)
//       toast({
//         title: "Success",
//         description: "Report downloaded successfully",
//       })
//     } catch (error) {
//       console.error("[v0] Error downloading report:", error)
//       toast({
//         title: "Error",
//         description: "Failed to download report",
//         variant: "destructive",
//       })
//     }
//   }

//   const handlePauseResume = async (sessionId: string, currentStatus: string) => {
//     try {
//       const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED"
//       const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       })
//       if (!res.ok) throw new Error("Failed to update session")
//       toast({
//         title: "Success",
//         description: `Warmup ${newStatus === "PAUSED" ? "paused" : "resumed"}`,
//       })
//       fetchSessions()
//     } catch (error) {
//       console.error("[v0] Error updating session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update session status",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleRemoveSession = async (sessionId: string) => {
//     if (!confirm("Are you sure you want to remove this warmup session?")) return
//     try {
//       const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
//         method: "DELETE",
//       })
//       if (!res.ok) throw new Error("Failed to delete session")
//       toast({
//         title: "Success",
//         description: "Warmup session removed",
//       })
//       fetchSessions()
//     } catch (error) {
//       console.error("[v0] Error deleting session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove session",
//         variant: "destructive",
//       })
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
//       case "warming":
//         return <Badge className="bg-primary/10 text-primary border-primary/20">Warming Up</Badge>
//       case "paused":
//         return <Badge className="bg-muted text-muted-foreground border-border">Paused</Badge>
//       case "issues":
//         return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Issues</Badge>
//       case "completed":
//         return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const getActivityIcon = (type: string) => {
//     if (type === "sent") return <Mail className="h-4 w-4 text-primary" />
//     if (type === "reply") return <CheckCircle2 className="h-4 w-4 text-success" />
//     if (type === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />
//     return <AlertCircle className="h-4 w-4 text-destructive" />
//   }

//   const getActivityStatus = (type: string) => {
//     if (type === "sent" || type === "reply" || type === "received") return "success"
//     if (type === "warning") return "warning"
//     return "error"
//   }

//   return (
//     <div className="space-y-6">
//       {/* Warmup Performance Chart */}
//       <Card className="border-border">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>Warmup Performance</CardTitle>
//             <CardDescription>Email delivery metrics over the last 30 days</CardDescription>
//           </div>
//           <Select value={chartMetric} onValueChange={handleMetricChange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select metric" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Metrics</SelectItem>
//               <SelectItem value="sent">Emails Sent</SelectItem>
//               <SelectItem value="inboxRate">Inbox Rate</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           {loadingChart ? (
//             <div className="h-[300px] flex items-center justify-center">
//               <WaveLoader size="md" />
//             </div>
//           ) : chartData.length === 0 ? (
//             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//               No performance data available yet
//             </div>
//           ) : (
//             <div className="h-[350px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="hsl(var(--border))"
//                     vertical={false}
//                     strokeOpacity={0.5}
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke="hsl(var(--muted-foreground))"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     dy={10}
//                   />
//                   <YAxis
//                     stroke="hsl(var(--muted-foreground))"
//                     fontSize={12}
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     dx={-10}
//                   />
//                   <Tooltip
//                     content={({ active, payload }) => {
//                       if (!active || !payload?.length) return null
//                       return (
//                         <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
//                           <div className="flex flex-col gap-2">
//                             <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
//                             {payload.map((entry, index) => (
//                               <div key={index} className="flex items-center gap-2">
//                                 <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
//                                 <span className="text-sm text-muted-foreground">{entry.name}:</span>
//                                 <span className="text-sm font-semibold text-foreground">
//                                   {entry.name === "Inbox Rate %" ? `${entry.value}%` : entry.value}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )
//                     }}
//                   />
//                   {(chartMetric === "all" || chartMetric === "sent") && (
//                     <Line
//                       type="monotone"
//                       dataKey="sent"
//                       name="Emails Sent"
//                       stroke="hsl(var(--chart-1))"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{
//                         r: 5,
//                         fill: "hsl(var(--chart-1))",
//                         stroke: "hsl(var(--background))",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   )}
//                   {(chartMetric === "all" || chartMetric === "inboxRate") && (
//                     <Line
//                       type="monotone"
//                       dataKey="inboxRate"
//                       name="Inbox Rate %"
//                       stroke="hsl(var(--chart-2))"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{
//                         r: 5,
//                         fill: "hsl(var(--chart-2))",
//                         stroke: "hsl(var(--background))",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   )}
//                   {chartMetric === "all" && (
//                     <Legend
//                       wrapperStyle={{
//                         paddingTop: "20px",
//                         fontSize: "14px",
//                       }}
//                       iconType="circle"
//                       iconSize={10}
//                     />
//                   )}
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Active Warmup Sessions Table */}
//         <Card className="border-border lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Active Warmup Sessions</CardTitle>
//             <CardDescription>Monitor your email accounts warming up</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {loadingSessions ? (
//               <div className="flex items-center justify-center py-8">
//                 <WaveLoader size="md" />
//               </div>
//             ) : sessions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
//                 <p className="text-muted-foreground">No accounts warming up yet</p>
//                 <p className="text-sm text-muted-foreground">Add an email account to get started</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Email Address</TableHead>
//                       <TableHead>Provider</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Emails Sent</TableHead>
//                       <TableHead>Inbox Rate</TableHead>
//                       <TableHead>Started</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {sessions.slice(0, 5).map((session) => (
//                       <TableRow key={session.id}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-4 w-4" />
//                             <span className="truncate max-w-[200px]">{session.accountEmail}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className="capitalize">
//                             {session.provider}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{getStatusBadge(session.stage)}</TableCell>
//                         <TableCell>{session.emailsSent}</TableCell>
//                         <TableCell>
//                           <span
//                             className={
//                               session.inboxRate >= 95
//                                 ? "text-success"
//                                 : session.inboxRate >= 90
//                                   ? "text-warning"
//                                   : "text-destructive"
//                             }
//                           >
//                             {session.inboxRate.toFixed(1)}%
//                           </span>
//                         </TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {new Date(session.startedAt).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem className="gap-2">
//                                 <Eye className="h-4 w-4" /> View Details
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 className="gap-2"
//                                 onClick={() => handlePauseResume(session.id, session.stage)}
//                               >
//                                 {session.stage === "PAUSED" ? (
//                                   <>
//                                     <Play className="h-4 w-4" /> Resume
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Pause className="h-4 w-4" /> Pause
//                                   </>
//                                 )}
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="gap-2">
//                                 <Settings className="h-4 w-4" /> Settings
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 className="gap-2 text-destructive"
//                                 onClick={() => handleRemoveSession(session.id)}
//                               >
//                                 <Trash2 className="h-4 w-4" /> Remove
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Recent Activity Feed */}
//         <Card className="border-border">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Latest warmup actions</CardDescription>
//               </div>
//               <Badge variant="outline" className="gap-1">
//                 <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
//                 Live
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loadingActivities ? (
//               <div className="flex items-center justify-center py-8">
//                 <WaveLoader size="sm" />
//               </div>
//             ) : activities.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
//                 <Clock className="h-8 w-8 mb-2 opacity-50" />
//                 <p className="text-sm">No recent activity</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
//                 {activities.map((activity) => (
//                   <div key={activity.id} className="flex gap-3">
//                     <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
//                       <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
//                       <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                         <Clock className="h-3 w-3" />
//                         {new Date(activity.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions Panel */}
//       <Card className="border-border">
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//           <CardDescription>Common warmup management tasks</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-3">
//             <Button className="gap-2">
//               <Mail className="h-4 w-4" />
//               Add New Email Account
//             </Button>
//             <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownloadReport}>
//               <Download className="h-4 w-4" />
//               Download Report
//             </Button>
//             <Button variant="outline" className="gap-2 bg-transparent" onClick={onRefresh}>
//               <TrendingUp className="h-4 w-4" />
//               Refresh Data
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
// import { WaveLoader } from "@/components/loader/wave-loader"
// import { useToast } from "@/hooks/use-toast"
// import {
//   TrendingUp,
//   MoreHorizontal,
//   Eye,
//   Pause,
//   Play,
//   Settings,
//   Trash2,
//   Mail,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   AlertTriangle,
//   Download,
// } from "lucide-react"

// interface EmailAccount {
//   id: string
//   email: string
//   provider: "gmail" | "outlook" | "yahoo" | "custom"
//   status: "active" | "paused" | "warming" | "issues" | "completed"
//   warmupConfig: {
//     startVolume: number
//     targetVolume: number
//     currentVolume: number
//     rampSpeed: "conservative" | "moderate" | "aggressive"
//     daysActive: number
//     scheduleEnabled: boolean
//     weekendSending: boolean
//   }
//   stats: {
//     emailsSentToday: number
//     emailsSentTotal: number
//     inboxRate: number
//     spamRate: number
//     reputationScore: number
//     openRate: number
//     replyRate: number
//     trend: "up" | "down" | "stable"
//   }
//   createdAt: Date
//   lastActivity: Date
// }

// interface NetworkHealth {
//   score: number
//   totalSize: number
//   composition: {
//     googleWorkspace: number
//     office365: number
//     other: number
//   }
//   averageReputation: number
//   lastUpdated: Date
// }

// interface WarmupOverviewTabProps {
//   accounts: EmailAccount[]
//   networkHealth: NetworkHealth | null
//   onRefresh: () => void
// }

// type ChartMetric = "all" | "sent" | "inboxRate"

// interface PerformanceData {
//   date: string
//   sent: number
//   opened: number
//   replied: number
//   inboxRate: number
// }

// interface Activity {
//   id: string
//   type: string
//   message: string
//   email: string
//   accountName: string
//   timestamp: Date
//   subject?: string
// }

// interface WarmupSession {
//   id: string
//   accountEmail: string
//   accountName: string
//   provider: string
//   stage: string
//   progress: number
//   emailsSent: number
//   inboxRate: number
//   openRate: number
//   replyRate: number
//   health: number
//   startedAt: Date
// }

// export function WarmupOverviewTab({ accounts, networkHealth, onRefresh }: WarmupOverviewTabProps) {
//   const [chartMetric, setChartMetric] = useState<ChartMetric>("all")
//   const [chartData, setChartData] = useState<PerformanceData[]>([])
//   const [activities, setActivities] = useState<Activity[]>([])
//   const [sessions, setSessions] = useState<WarmupSession[]>([])
//   const [loadingChart, setLoadingChart] = useState(true)
//   const [loadingActivities, setLoadingActivities] = useState(true)
//   const [loadingSessions, setLoadingSessions] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchPerformanceData()
//   }, [])

//   useEffect(() => {
//     fetchActivities()
//     const interval = setInterval(fetchActivities, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     fetchSessions()
//   }, [accounts])

//   const fetchPerformanceData = async () => {
//     try {
//       setLoadingChart(true)
//       const res = await fetch("/api/warmup/performance?days=30")
//       if (!res.ok) throw new Error("Failed to fetch performance data")
//       const data = await res.json()
//       setChartData(data.data || [])
//     } catch (error) {
//       console.error("[v0] Error fetching performance data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load performance data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingChart(false)
//     }
//   }

//   const fetchActivities = async () => {
//     try {
//       setLoadingActivities(true)
//       const res = await fetch("/api/warmup/activities?limit=8")
//       if (!res.ok) throw new Error("Failed to fetch activities")
//       const data = await res.json()
//       setActivities(data.activities || [])
//     } catch (error) {
//       console.error("[v0] Error fetching activities:", error)
//     } finally {
//       setLoadingActivities(false)
//     }
//   }

//   const fetchSessions = async () => {
//     try {
//       setLoadingSessions(true)
//       const res = await fetch("/api/warmup/sessions")
//       if (!res.ok) throw new Error("Failed to fetch sessions")
//       const data = await res.json()
//       setSessions(data.sessions || [])
//     } catch (error) {
//       console.error("[v0] Error fetching sessions:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load warmup sessions",
//         variant: "destructive",
//       })
//     } finally {
//       setLoadingSessions(false)
//     }
//   }

//   const handleMetricChange = (value: string) => {
//     setChartMetric(value as ChartMetric)
//   }

//   const handleDownloadReport = async () => {
//     try {
//       const res = await fetch("/api/warmup/export?format=csv")
//       if (!res.ok) throw new Error("Failed to export data")
//       const blob = await res.blob()
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `warmup-report-${new Date().toISOString().split("T")[0]}.csv`
//       document.body.appendChild(a)
//       a.click()
//       window.URL.revokeObjectURL(url)
//       document.body.removeChild(a)
//       toast({
//         title: "Success",
//         description: "Report downloaded successfully",
//       })
//     } catch (error) {
//       console.error("[v0] Error downloading report:", error)
//       toast({
//         title: "Error",
//         description: "Failed to download report",
//         variant: "destructive",
//       })
//     }
//   }

//   const handlePauseResume = async (sessionId: string, currentStatus: string) => {
//     try {
//       const newStatus = currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED"
//       const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       })
//       if (!res.ok) throw new Error("Failed to update session")
//       toast({
//         title: "Success",
//         description: `Warmup ${newStatus === "PAUSED" ? "paused" : "resumed"}`,
//       })
//       fetchSessions()
//     } catch (error) {
//       console.error("[v0] Error updating session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update session status",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleRemoveSession = async (sessionId: string) => {
//     if (!confirm("Are you sure you want to remove this warmup session?")) return
//     try {
//       const res = await fetch(`/api/warmup/sessions/${sessionId}`, {
//         method: "DELETE",
//       })
//       if (!res.ok) throw new Error("Failed to delete session")
//       toast({
//         title: "Success",
//         description: "Warmup session removed",
//       })
//       fetchSessions()
//     } catch (error) {
//       console.error("[v0] Error deleting session:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove session",
//         variant: "destructive",
//       })
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
//       case "warming":
//         return <Badge className="bg-primary/10 text-primary border-primary/20">Warming Up</Badge>
//       case "paused":
//         return <Badge className="bg-muted text-muted-foreground border-border">Paused</Badge>
//       case "issues":
//         return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Issues</Badge>
//       case "completed":
//         return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
//       default:
//         return <Badge variant="outline">{status}</Badge>
//     }
//   }

//   const getActivityIcon = (type: string) => {
//     if (type === "sent") return <Mail className="h-4 w-4 text-primary" />
//     if (type === "reply") return <CheckCircle2 className="h-4 w-4 text-success" />
//     if (type === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />
//     return <AlertCircle className="h-4 w-4 text-destructive" />
//   }

//   const getActivityStatus = (type: string) => {
//     if (type === "sent" || type === "reply" || type === "received") return "success"
//     if (type === "warning") return "warning"
//     return "error"
//   }

//   return (
//     <div className="space-y-6">
//       {/* Warmup Performance Chart */}
//       <Card className="border-border">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>Warmup Performance</CardTitle>
//             <CardDescription>Email delivery metrics over the last 30 days</CardDescription>
//           </div>
//           <Select value={chartMetric} onValueChange={handleMetricChange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select metric" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Metrics</SelectItem>
//               <SelectItem value="sent">Emails Sent</SelectItem>
//               <SelectItem value="inboxRate">Inbox Rate</SelectItem>
//             </SelectContent>
//           </Select>
//         </CardHeader>
//         <CardContent>
//           {loadingChart ? (
//             <div className="h-[300px] flex items-center justify-center">
//               <WaveLoader size="md" />
//             </div>
//           ) : chartData.length === 0 ? (
//             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//               No performance data available yet
//             </div>
//           ) : (
//             <div className="h-[350px] w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="hsl(var(--border))"
//                     vertical={false}
//                     strokeOpacity={0.5}
//                   />
//                   <XAxis
//                     dataKey="date"
//                     stroke="hsl(var(--muted-foreground))"
//                     fontSize={12}
//                     fontWeight={500}
//                     tickLine={false}
//                     axisLine={{ stroke: "hsl(var(--border))" }}
//                     tickMargin={10}
//                     dy={8}
//                   />
//                   <YAxis
//                     stroke="hsl(var(--muted-foreground))"
//                     fontSize={12}
//                     fontWeight={500}
//                     tickLine={false}
//                     axisLine={{ stroke: "hsl(var(--border))" }}
//                     tickMargin={10}
//                     dx={-8}
//                   />
//                   <Tooltip
//                     content={({ active, payload }) => {
//                       if (!active || !payload?.length) return null
//                       return (
//                         <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
//                           <div className="flex flex-col gap-2">
//                             <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
//                             {payload.map((entry, index) => (
//                               <div key={index} className="flex items-center gap-2">
//                                 <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
//                                 <span className="text-sm text-muted-foreground">{entry.name}:</span>
//                                 <span className="text-sm font-semibold text-foreground">
//                                   {entry.name === "Inbox Rate %" ? `${entry.value}%` : entry.value}
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )
//                     }}
//                   />
//                   {(chartMetric === "all" || chartMetric === "sent") && (
//                     <Line
//                       type="monotone"
//                       dataKey="sent"
//                       name="Emails Sent"
//                       stroke="hsl(var(--chart-1))"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{
//                         r: 5,
//                         fill: "hsl(var(--chart-1))",
//                         stroke: "hsl(var(--background))",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   )}
//                   {(chartMetric === "all" || chartMetric === "inboxRate") && (
//                     <Line
//                       type="monotone"
//                       dataKey="inboxRate"
//                       name="Inbox Rate %"
//                       stroke="hsl(var(--chart-2))"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{
//                         r: 5,
//                         fill: "hsl(var(--chart-2))",
//                         stroke: "hsl(var(--background))",
//                         strokeWidth: 2,
//                       }}
//                     />
//                   )}
//                   {chartMetric === "all" && (
//                     <Legend
//                       wrapperStyle={{
//                         paddingTop: "20px",
//                         fontSize: "14px",
//                       }}
//                       iconType="circle"
//                       iconSize={10}
//                     />
//                   )}
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Active Warmup Sessions Table */}
//         <Card className="border-border lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Active Warmup Sessions</CardTitle>
//             <CardDescription>Monitor your email accounts warming up</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {loadingSessions ? (
//               <div className="flex items-center justify-center py-8">
//                 <WaveLoader size="md" />
//               </div>
//             ) : sessions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center">
//                 <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
//                 <p className="text-muted-foreground">
//                   {accounts.length > 0
//                     ? "Enable warmup on your connected accounts to start"
//                     : "Add an email account to get started"}
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Email Address</TableHead>
//                       <TableHead>Provider</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Emails Sent</TableHead>
//                       <TableHead>Inbox Rate</TableHead>
//                       <TableHead>Started</TableHead>
//                       <TableHead className="text-right">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {sessions.slice(0, 5).map((session) => (
//                       <TableRow key={session.id}>
//                         <TableCell className="font-medium">
//                           <div className="flex items-center gap-2">
//                             <Mail className="h-4 w-4" />
//                             <span className="truncate max-w-[200px]">{session.accountEmail}</span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className="capitalize">
//                             {session.provider}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>{getStatusBadge(session.stage)}</TableCell>
//                         <TableCell>{session.emailsSent}</TableCell>
//                         <TableCell>
//                           <span
//                             className={
//                               session.inboxRate >= 95
//                                 ? "text-success"
//                                 : session.inboxRate >= 90
//                                   ? "text-warning"
//                                   : "text-destructive"
//                             }
//                           >
//                             {session.inboxRate.toFixed(1)}%
//                           </span>
//                         </TableCell>
//                         <TableCell className="text-sm text-muted-foreground">
//                           {new Date(session.startedAt).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon" className="h-8 w-8">
//                                 <MoreHorizontal className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem
//                                 className="gap-2"
//                                 onClick={() => {
//                                   // TODO: Open detail modal with session data
//                                   toast({
//                                     title: "Coming Soon",
//                                     description: "Account details modal will open here",
//                                   })
//                                 }}
//                               >
//                                 <Eye className="h-4 w-4" /> View Details
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 className="gap-2"
//                                 onClick={() => handlePauseResume(session.id, session.stage)}
//                               >
//                                 {session.stage === "PAUSED" ? (
//                                   <>
//                                     <Play className="h-4 w-4" /> Resume
//                                   </>
//                                 ) : (
//                                   <>
//                                     <Pause className="h-4 w-4" /> Pause
//                                   </>
//                                 )}
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 className="gap-2"
//                                 onClick={() => {
//                                   // TODO: Open settings for this account
//                                   toast({
//                                     title: "Coming Soon",
//                                     description: "Account-specific settings will open here",
//                                   })
//                                 }}
//                               >
//                                 <Settings className="h-4 w-4" /> Settings
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 className="gap-2 text-destructive"
//                                 onClick={() => handleRemoveSession(session.id)}
//                               >
//                                 <Trash2 className="h-4 w-4" /> Remove
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Recent Activity Feed */}
//         <Card className="border-border">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Recent Activity</CardTitle>
//                 <CardDescription>Latest warmup actions</CardDescription>
//               </div>
//               <Badge variant="outline" className="gap-1">
//                 <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
//                 Live
//               </Badge>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {loadingActivities ? (
//               <div className="flex items-center justify-center py-8">
//                 <WaveLoader size="sm" />
//               </div>
//             ) : activities.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
//                 <Clock className="h-8 w-8 mb-2 opacity-50" />
//                 <p className="text-sm">No recent activity</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
//                 {activities.map((activity) => (
//                   <div key={activity.id} className="flex gap-3">
//                     <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
//                       <p className="text-xs text-muted-foreground truncate">{activity.email}</p>
//                       <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                         <Clock className="h-3 w-3" />
//                         {new Date(activity.timestamp).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions Panel */}
//       <Card className="border-border">
//         <CardHeader>
//           <CardTitle>Quick Actions</CardTitle>
//           <CardDescription>Common warmup management tasks</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-3">
//             <Button className="gap-2">
//               <Mail className="h-4 w-4" />
//               Add New Email Account
//             </Button>
//             <Button variant="outline" className="gap-2 bg-transparent" onClick={handleDownloadReport}>
//               <Download className="h-4 w-4" />
//               Download Report
//             </Button>
//             <Button variant="outline" className="gap-2 bg-transparent" onClick={onRefresh}>
//               <TrendingUp className="h-4 w-4" />
//               Refresh Data
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { WaveLoader } from "@/components/loader/wave-loader"
import { useToast } from "@/hooks/use-toast"
import {
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Settings,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  X,
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
  const [activities, setActivities] = useState<any[]>([])
  const [sessions, setSessions] = useState<WarmupSession[]>([])
  const [loadingChart, setLoadingChart] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [activeChartLines, setActiveChartLines] = useState<Set<string>>(new Set(["sent", "inboxRate"]))
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)

  const [selectedSession, setSelectedSession] = useState<WarmupSession | null>(null)
  const [settingsSessionId, setSettingsSessionId] = useState<string | null>(null)

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

  const handleLegendClick = (data: any) => {
    const newActiveLines = new Set(activeChartLines)
    if (newActiveLines.has(data.dataKey)) {
      newActiveLines.delete(data.dataKey)
    } else {
      newActiveLines.add(data.dataKey)
    }
    setActiveChartLines(newActiveLines)
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

  const handleUpdateSettings = async (settings: any) => {
    try {
      const res = await fetch(`/api/warmup/sessions/${settingsSessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error("Failed to update settings")
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
      setSettingsSessionId(null)
      fetchSessions()
    } catch (error) {
      console.error("[v0] Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20 font-medium">Active</Badge>
      case "warming":
        return <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">Warming Up</Badge>
      case "paused":
        return <Badge className="bg-muted text-muted-foreground border-border font-medium">Paused</Badge>
      case "issues":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Issues</Badge>
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20 font-medium">Completed</Badge>
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

  const avgStats = useMemo(() => {
    if (chartData.length === 0) return { sent: 0, inboxRate: 0 }
    const avgSent = Math.round(chartData.reduce((sum, d) => sum + d.sent, 0) / chartData.length)
    const avgInbox = Math.round((chartData.reduce((sum, d) => sum + d.inboxRate, 0) / chartData.length) * 10) / 10
    return { sent: avgSent, inboxRate: avgInbox }
  }, [chartData])

  const networkCompositionData = networkHealth
    ? [
        { name: "Google Workspace", value: networkHealth.composition.googleWorkspace },
        { name: "Office 365", value: networkHealth.composition.office365 },
        { name: "Other", value: networkHealth.composition.other },
      ]
    : []

  const COMPOSITION_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  return (
    <div className="space-y-6">
      {/* Warmup Performance Chart - World Class */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xl font-semibold">Warmup Performance</CardTitle>
            <CardDescription className="text-sm">Email delivery metrics over the last 30 days</CardDescription>
          </div>
          <Select value={chartMetric} onValueChange={(value) => setChartMetric(value as ChartMetric)}>
            <SelectTrigger className="w-[160px] text-sm">
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
            <div className="h-[280px] sm:h-[360px] flex items-center justify-center">
              <WaveLoader size="md" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[280px] sm:h-[360px] flex items-center justify-center text-muted-foreground text-sm">
              No performance data available yet
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-[280px] sm:h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 16, right: 20, left: -20, bottom: 4 }}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="hsl(var(--border))"
                      vertical={false}
                      strokeOpacity={0.4}
                      horizontalPoints={[]}
                    />

                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      fontWeight={500}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      dy={6}
                      tick={{ fill: "hsl(var(--foreground))", opacity: 0.8 }}
                    />

                    <YAxis
                      stroke="hsl(var(--foreground))"
                      fontSize={12}
                      fontWeight={500}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      dx={-4}
                      tick={{ fill: "hsl(var(--foreground))", opacity: 0.8 }}
                      width={45}
                    />

                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="animate-in fade-in zoom-in-95 duration-200">
                            <div className="rounded-xl border border-border/40 bg-card/95 backdrop-blur-md p-4 shadow-xl">
                              <p className="text-sm font-semibold text-foreground mb-3">{payload[0].payload.date}</p>
                              <div className="space-y-2">
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center gap-3 group/tooltip">
                                    <div
                                      className="h-2.5 w-2.5 rounded-full shadow-sm group-hover/tooltip:scale-125 transition-transform duration-200"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs text-muted-foreground font-medium min-w-[90px]">
                                      {entry.name}:
                                    </span>
                                    <span className="text-sm font-bold text-foreground">
                                      {entry.name === "Inbox Rate %" ? `${entry.value}%` : entry.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      }}
                      cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 4" }}
                      wrapperStyle={{ outline: "none" }}
                    />

                    {(chartMetric === "all" || chartMetric === "sent") && activeChartLines.has("sent") && (
                      <ReferenceLine
                        y={avgStats.sent}
                        stroke="hsl(var(--chart-1))"
                        strokeDasharray="5 5"
                        strokeOpacity={0.3}
                        label={{
                          value: `Avg: ${avgStats.sent}`,
                          position: "insideTopRight",
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 11,
                          fontWeight: 500,
                          offset: 10,
                          opacity: 0.6,
                        }}
                      />
                    )}

                    {(chartMetric === "all" || chartMetric === "inboxRate") && activeChartLines.has("inboxRate") && (
                      <ReferenceLine
                        y={avgStats.inboxRate}
                        stroke="hsl(var(--chart-2))"
                        strokeDasharray="5 5"
                        strokeOpacity={0.3}
                        label={{
                          value: `Avg: ${avgStats.inboxRate}%`,
                          position: "insideBottomRight",
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 11,
                          fontWeight: 500,
                          offset: 10,
                          opacity: 0.6,
                        }}
                      />
                    )}

                    {(chartMetric === "all" || chartMetric === "sent") && activeChartLines.has("sent") && (
                      <Line
                        type="natural"
                        dataKey="sent"
                        name="Emails Sent"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={hoveredLine === "sent" ? 3 : 2.5}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                        activeDot={{
                          r: 6,
                          fill: "hsl(var(--chart-1))",
                          stroke: "hsl(var(--background))",
                          strokeWidth: 2,
                          filter: "drop-shadow(0 0 4px hsl(var(--chart-1) / 0.4))",
                        }}
                        onMouseEnter={() => setHoveredLine("sent")}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                    )}

                    {(chartMetric === "all" || chartMetric === "inboxRate") && activeChartLines.has("inboxRate") && (
                      <Line
                        type="natural"
                        dataKey="inboxRate"
                        name="Inbox Rate %"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={hoveredLine === "inboxRate" ? 3 : 2.5}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                        animationEasing="ease-out"
                        activeDot={{
                          r: 6,
                          fill: "hsl(var(--chart-2))",
                          stroke: "hsl(var(--background))",
                          strokeWidth: 2,
                          filter: "drop-shadow(0 0 4px hsl(var(--chart-2) / 0.4))",
                        }}
                        onMouseEnter={() => setHoveredLine("inboxRate")}
                        onMouseLeave={() => setHoveredLine(null)}
                      />
                    )}

                    {chartMetric === "all" && (
                      <Legend
                        wrapperStyle={{
                          paddingTop: "24px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "24px",
                          cursor: "pointer",
                        }}
                        iconType="circle"
                        iconSize={8}
                        onClick={(e) => handleLegendClick(e.payload)}
                        // contentStyle={{
                        //   fontSize: "13px",
                        //   fontWeight: 500,
                        //   color: "hsl(var(--muted-foreground))",
                        // }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {chartMetric === "all" && (
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => handleLegendClick({ dataKey: "sent" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeChartLines.has("sent")
                        ? "bg-chart-1/10 text-chart-1 border border-chart-1/20"
                        : "bg-muted text-muted-foreground border border-border/50"
                    }`}
                  >
                    Emails Sent
                  </button>
                  <button
                    onClick={() => handleLegendClick({ dataKey: "inboxRate" })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeChartLines.has("inboxRate")
                        ? "bg-chart-2/10 text-chart-2 border border-chart-2/20"
                        : "bg-muted text-muted-foreground border border-border/50"
                    }`}
                  >
                    Inbox Rate
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Warmup Sessions Table */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Active Warmup Sessions</CardTitle>
            <CardDescription className="text-sm">Monitor your email accounts warming up</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSessions ? (
              <div className="flex items-center justify-center py-12">
                <WaveLoader size="md" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">
                  {accounts.length > 0
                    ? "Enable warmup on your connected accounts to start"
                    : "Add an email account to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Email Address</TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Provider</TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Emails Sent</TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Inbox Rate</TableHead>
                      <TableHead className="font-semibold text-xs uppercase tracking-wide">Started</TableHead>
                      <TableHead className="text-right font-semibold text-xs uppercase tracking-wide">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.slice(0, 5).map((session, idx) => (
                      <TableRow
                        key={session.id}
                        className="border-border/50 hover:bg-muted/40 transition-colors duration-200 group/row"
                      >
                        <TableCell className="font-medium text-sm py-4">
                          <div className="flex items-center gap-2.5">
                            <Mail className="h-4 w-4 text-muted-foreground/60" />
                            <span className="truncate max-w-[180px]">{session.accountEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="capitalize text-xs font-medium border-border/50 bg-muted/30"
                          >
                            {session.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(session.stage)}</TableCell>
                        <TableCell className="text-sm font-medium">{session.emailsSent}</TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-semibold ${
                              session.inboxRate >= 95
                                ? "text-success"
                                : session.inboxRate >= 90
                                  ? "text-warning"
                                  : "text-destructive"
                            }`}
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[160px]">
                              <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
                                onClick={() => setSelectedSession(session)}
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
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
                              <DropdownMenuItem
                                className="gap-2 text-sm cursor-pointer"
                                onClick={() => setSettingsSessionId(session.id)}
                              >
                                <Settings className="h-4 w-4" /> Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-destructive text-sm cursor-pointer"
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

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Network Health</CardTitle>
            <CardDescription className="text-sm">Recipient list composition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkHealth ? (
              <>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-foreground">{networkHealth.score}</span>
                    <p className="text-xs text-muted-foreground mt-1">Health Score</p>
                  </div>
                </div>

                {networkCompositionData.length > 0 && (
                  <div className="h-[180px] flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={networkCompositionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {networkCompositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COMPOSITION_COLORS[index % COMPOSITION_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  {networkCompositionData.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COMPOSITION_COLORS[idx % COMPOSITION_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/50 mt-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(networkHealth.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                Network data unavailable
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="border-border/50 max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Session Details</CardTitle>
                <CardDescription className="text-sm">{selectedSession.accountEmail}</CardDescription>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-1 hover:bg-muted rounded transition-colors">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Provider</p>
                  <Badge variant="outline" className="capitalize bg-muted/30 border-border/50">
                    {selectedSession.provider}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Status</p>
                  {getStatusBadge(selectedSession.stage)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Emails Sent</p>
                  <p className="text-2xl font-bold">{selectedSession.emailsSent}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Health</p>
                  <p className="text-2xl font-bold text-success">{selectedSession.health}%</p>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inbox Rate</span>
                  <span className="font-semibold text-foreground">{selectedSession.inboxRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Rate</span>
                  <span className="font-semibold text-foreground">{selectedSession.openRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reply Rate</span>
                  <span className="font-semibold text-foreground">{selectedSession.replyRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSelectedSession(null)}>
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handlePauseResume(selectedSession.id, selectedSession.stage)
                    setSelectedSession(null)
                  }}
                >
                  {selectedSession.stage === "PAUSED" ? "Resume" : "Pause"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {settingsSessionId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="border-border/50 max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Account Settings</CardTitle>
              <button
                onClick={() => setSettingsSessionId(null)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Ramp Speed</label>
                  <Select defaultValue="moderate">
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Daily Sending Limit</label>
                  <input
                    type="number"
                    defaultValue={50}
                    min={1}
                    max={500}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="schedule" defaultChecked={true} className="rounded border border-border" />
                  <label htmlFor="schedule" className="text-sm cursor-pointer">
                    Enable Schedule
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="weekend" defaultChecked={false} className="rounded border border-border" />
                  <label htmlFor="weekend" className="text-sm cursor-pointer">
                    Weekend Sending
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setSettingsSessionId(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleUpdateSettings({
                      rampSpeed: "moderate",
                      dailyLimit: 50,
                      scheduleEnabled: true,
                      weekendSending: false,
                    })
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
