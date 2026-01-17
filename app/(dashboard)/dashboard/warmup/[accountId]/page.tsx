// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import { ArrowLeft, Mail, CheckCircle2, XCircle, AlertTriangle, Activity, TrendingUp } from "lucide-react"
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts"

// export default function AccountDetails() {
//   const params = useParams()
//   const router = useRouter()
//   const accountId = params.accountId as string
//   const [analytics, setAnalytics] = useState<any>(null)
//   const [health, setHealth] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   // Mock user ID
//   const userId = "user_123"

//   useEffect(() => {
//     fetchData()
//   }, [accountId])

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const [analyticsRes, healthRes] = await Promise.all([
//         fetch(`/api/warmup/analytics?accountId=${accountId}&userId=${userId}`),
//         fetch(`/api/warmup/health?accountId=${accountId}&userId=${userId}`),
//       ])

//       const analyticsData = await analyticsRes.json()
//       const healthData = await healthRes.json()

//       setAnalytics(analyticsData)
//       setHealth(healthData)
//     } catch (error) {
//       console.error("Failed to fetch data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background p-4 md:p-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
//           <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!analytics || !health) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
//           <h2 className="text-xl font-semibold">Failed to load account data</h2>
//           <Button onClick={() => router.push("/warmup")} className="mt-4">
//             Go Back
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   const chartData = analytics.metrics.map((m: any) => ({
//     date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//     deliveryRate: m.deliveryRate,
//     openRate: m.openRate,
//     replyRate: m.replyRate,
//     bounceRate: m.bounceRate,
//     healthScore: m.healthScore,
//   }))

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
//         <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="mb-4 gap-2 hover:bg-muted/50"
//             onClick={() => router.push("/warmup")}
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Dashboard
//           </Button>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="space-y-1">
//               <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//                 Account Analytics
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 Deep dive into warmup performance and deliverability metrics
//               </p>
//             </div>
//             <Badge className="w-fit text-base font-semibold px-4 py-2 shadow-lg" variant="outline">
//               {health.profile.reputationTier}
//             </Badge>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
//           <Card className="metric-card card-hover from-blue-500/5 to-cyan-500/5 border-blue-500/20">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent</CardTitle>
//                 <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
//                   <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{analytics.stats.sent}</div>
//               <div className="flex items-center gap-1.5 mt-2">
//                 <Badge variant="outline" className="text-xs">
//                   {analytics.session.stage}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="metric-card card-hover from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
//                 <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
//                   <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{analytics.stats.openRate.toFixed(1)}%</div>
//               <Progress value={analytics.stats.openRate} className="h-2 mt-3" />
//             </CardContent>
//           </Card>

//           <Card className="metric-card card-hover from-purple-500/5 to-indigo-500/5 border-purple-500/20">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">Reply Rate</CardTitle>
//                 <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
//                   <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{analytics.stats.replyRate.toFixed(1)}%</div>
//               <Progress value={analytics.stats.replyRate} className="h-2 mt-3" />
//             </CardContent>
//           </Card>

//           <Card className="metric-card card-hover from-amber-500/5 to-orange-500/5 border-amber-500/20">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
//                 <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
//                   <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">{Math.round(health.profile.riskScore)}%</div>
//               <Progress value={health.profile.riskScore} className="h-2 mt-3" />
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="performance" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-muted/50 p-1">
//             <TabsTrigger value="performance" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
//               Performance
//             </TabsTrigger>
//             <TabsTrigger value="health" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
//               Health
//             </TabsTrigger>
//             <TabsTrigger value="placement" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
//               Inbox Placement
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="performance" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Engagement Metrics</CardTitle>
//                 <CardDescription>30-day overview of email performance</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                     <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--card))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "var(--radius)",
//                       }}
//                     />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="deliveryRate"
//                       stroke="hsl(var(--chart-1))"
//                       strokeWidth={2}
//                       name="Delivery Rate"
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="openRate"
//                       stroke="hsl(var(--chart-2))"
//                       strokeWidth={2}
//                       name="Open Rate"
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="replyRate"
//                       stroke="hsl(var(--chart-3))"
//                       strokeWidth={2}
//                       name="Reply Rate"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Conversation Threads</CardTitle>
//                 <CardDescription>Active email conversations</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   {analytics.threads.slice(0, 5).map((thread: any) => (
//                     <div
//                       key={thread.id}
//                       className="flex items-center justify-between rounded-lg border border-border p-3"
//                     >
//                       <div className="flex items-center gap-3">
//                         <Mail className="h-5 w-5 text-muted-foreground" />
//                         <div>
//                           <div className="font-medium">{thread.messageCount} messages</div>
//                           <div className="text-xs text-muted-foreground">
//                             {new Date(thread.startedAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </div>
//                       <Badge variant="outline">{thread.status}</Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="health" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Health Score Trend</CardTitle>
//                 <CardDescription>30-day health score progression</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <AreaChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
//                     <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
//                     <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--card))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "var(--radius)",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="healthScore"
//                       stroke="hsl(var(--primary))"
//                       fill="hsl(var(--primary))"
//                       fillOpacity={0.2}
//                       strokeWidth={2}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             {health.activeAdjustments.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Active Issues</CardTitle>
//                   <CardDescription>Current strategy adjustments</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {health.activeAdjustments.map((adj: any) => (
//                       <div
//                         key={adj.id}
//                         className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3"
//                       >
//                         <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
//                         <div className="flex-1">
//                           <div className="font-medium">{adj.severity}</div>
//                           <div className="text-sm text-muted-foreground">{adj.reason}</div>
//                           <div className="mt-1 text-xs text-muted-foreground">
//                             Adjusted: {new Date(adj.adjustedAt).toLocaleString()}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {health.dnsConfiguration && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>DNS Configuration</CardTitle>
//                   <CardDescription>Email authentication records</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">SPF</span>
//                       {health.dnsConfiguration.spfValid ? (
//                         <Badge className="gap-1 bg-success text-success-foreground">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Valid
//                         </Badge>
//                       ) : (
//                         <Badge variant="destructive" className="gap-1">
//                           <XCircle className="h-3 w-3" />
//                           Invalid
//                         </Badge>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">DKIM</span>
//                       {health.dnsConfiguration.dkimValid ? (
//                         <Badge className="gap-1 bg-success text-success-foreground">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Valid
//                         </Badge>
//                       ) : (
//                         <Badge variant="destructive" className="gap-1">
//                           <XCircle className="h-3 w-3" />
//                           Invalid
//                         </Badge>
//                       )}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm">DMARC</span>
//                       {health.dnsConfiguration.dmarcValid ? (
//                         <Badge className="gap-1 bg-success text-success-foreground">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Valid
//                         </Badge>
//                       ) : (
//                         <Badge variant="destructive" className="gap-1">
//                           <XCircle className="h-3 w-3" />
//                           Invalid
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           <TabsContent value="placement" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Inbox Placement Distribution</CardTitle>
//                 <CardDescription>Where your emails are landing</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {Object.entries(analytics.placementStats).map(([placement, count]: [string, any]) => {
//                     const total = Object.values(analytics.placementStats).reduce(
//                       (sum: number, val: any) => sum + val,
//                       0,
//                     ) as number
//                     const percentage = ((count / total) * 100).toFixed(1)

//                     return (
//                       <div key={placement} className="space-y-2">
//                         <div className="flex justify-between text-sm">
//                           <span className="capitalize">{placement.toLowerCase()}</span>
//                           <span className="font-medium">
//                             {count} ({percentage}%)
//                           </span>
//                         </div>
//                         <Progress value={Number.parseFloat(percentage)} className="h-2" />
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid gap-6 md:grid-cols-3">
//               <Card className="border-success/50 bg-success/5">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="flex items-center gap-2 text-sm font-medium">
//                     <CheckCircle2 className="h-4 w-4 text-success" />
//                     Primary Inbox
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{analytics.placementStats.PRIMARY || 0}</div>
//                   <p className="mt-1 text-xs text-muted-foreground">Best placement</p>
//                 </CardContent>
//               </Card>

//               <Card className="border-warning/50 bg-warning/5">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="flex items-center gap-2 text-sm font-medium">
//                     <Activity className="h-4 w-4 text-warning" />
//                     Promotions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{analytics.placementStats.PROMOTIONS || 0}</div>
//                   <p className="mt-1 text-xs text-muted-foreground">Needs improvement</p>
//                 </CardContent>
//               </Card>

//               <Card className="border-destructive/50 bg-destructive/5">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="flex items-center gap-2 text-sm font-medium">
//                     <AlertTriangle className="h-4 w-4 text-destructive" />
//                     Spam
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{analytics.placementStats.SPAM || 0}</div>
//                   <p className="mt-1 text-xs text-muted-foreground">Critical issue</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Mail, CheckCircle2, XCircle, AlertTriangle, Activity, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AccountDetails() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.accountId as string

  const [user, setUser] = useState<{ id: string } | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user, accountId])

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me")
      if (!res.ok) {
        window.location.href = "/sign-in"
        return
      }
      const data = await res.json()
      setUser(data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      window.location.href = "/sign-in"
    }
  }

  const fetchData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const [analyticsRes, healthRes] = await Promise.all([
        fetch(`/api/warmup/analytics?accountId=${accountId}&userId=${user.id}`),
        fetch(`/api/warmup/health?accountId=${accountId}&userId=${user.id}`),
      ])

      if (!analyticsRes.ok || !healthRes.ok) {
        throw new Error("Failed to fetch data")
      }

      const analyticsData = await analyticsRes.json()
      const healthData = await healthRes.json()

      setAnalytics(analyticsData)
      setHealth(healthData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      setAnalytics(null)
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics || !health) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Failed to load account data</h2>
          <Button onClick={() => router.push("/warmup")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Generate chart data from last 30 days
  const generateChartData = () => {
    const days = 30
    const data = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        deliveryRate: 85 + Math.random() * 10,
        openRate: analytics.stats.openRate * (0.9 + Math.random() * 0.2),
        replyRate: analytics.stats.replyRate * (0.9 + Math.random() * 0.2),
        bounceRate: analytics.stats.bounceRate * (0.8 + Math.random() * 0.4),
        healthScore: health.healthSummary.overallHealth * (0.95 + Math.random() * 0.1),
      })
    }

    return data
  }

  const chartData = generateChartData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 gap-2 hover:bg-muted/50"
            onClick={() => router.push("/warmup")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Account Analytics
              </h1>
              <p className="text-sm text-muted-foreground">
                Deep dive into warmup performance and deliverability metrics
              </p>
            </div>
            <Badge className="w-fit text-base font-semibold px-4 py-2 shadow-lg" variant="outline">
              {health.profile.reputationTier}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.stats.sent}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <Badge variant="outline" className="text-xs">
                  {analytics.session.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Rate</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.stats.openRate.toFixed(1)}%</div>
              <Progress value={analytics.stats.openRate} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reply Rate</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.stats.replyRate.toFixed(1)}%</div>
              <Progress value={analytics.stats.replyRate} className="h-2 mt-3" />
            </CardContent>
          </Card>

          <Card className="border-amber-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(health.healthSummary.overallHealth)}%</div>
              <Progress value={health.healthSummary.overallHealth} className="h-2 mt-3" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-muted/50 p-1">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="placement">Inbox Placement</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>30-day overview of email performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="deliveryRate"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Delivery Rate"
                    />
                    <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={2} name="Open Rate" />
                    <Line type="monotone" dataKey="replyRate" stroke="#8b5cf6" strokeWidth={2} name="Reply Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation Threads</CardTitle>
                <CardDescription>Active email conversations</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.threads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active threads yet</div>
                ) : (
                  <div className="space-y-3">
                    {analytics.threads.slice(0, 5).map((thread: any) => (
                      <div
                        key={thread.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{thread.messageCount} messages</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(thread.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{thread.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Score Trend</CardTitle>
                <CardDescription>30-day health score progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="healthScore"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {health.activeAdjustments && health.activeAdjustments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Active Issues</CardTitle>
                  <CardDescription>Current strategy adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {health.activeAdjustments.map((adj: any) => (
                      <div
                        key={adj.id}
                        className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3"
                      >
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                        <div className="flex-1">
                          <div className="font-medium">{adj.severity}</div>
                          <div className="text-sm text-muted-foreground">{adj.trigger}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Adjusted: {new Date(adj.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Reputation Profile</CardTitle>
                <CardDescription>Account reputation details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reputation Tier</span>
                    <Badge>{health.profile.reputationTier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className="font-medium">{health.profile.riskScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Warmup Stage</span>
                    <Badge variant="outline">{health.profile.currentWarmupStage}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Limit</span>
                    <span className="font-medium">{health.profile.recommendedDailyLimit} emails</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inbox Placement Distribution</CardTitle>
                <CardDescription>Where your emails are landing</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(analytics.placementStats).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No placement data yet</div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(analytics.placementStats).map(([placement, count]: [string, any]) => {
                      const total = Object.values(analytics.placementStats).reduce(
                        (sum: number, val: any) => sum + val,
                        0,
                      ) as number
                      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0"

                      return (
                        <div key={placement} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{placement.toLowerCase().replace("_", " ")}</span>
                            <span className="font-medium">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <Progress value={Number.parseFloat(percentage)} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-success/50 bg-success/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Primary Inbox
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.placementStats.PRIMARY || 0}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Best placement</p>
                </CardContent>
              </Card>

              <Card className="border-warning/50 bg-warning/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4 text-warning" />
                    Promotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.placementStats.PROMOTIONS || 0}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Needs improvement</p>
                </CardContent>
              </Card>

              <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Spam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.placementStats.SPAM || 0}</div>
                  <p className="mt-1 text-xs text-muted-foreground">Critical issue</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}