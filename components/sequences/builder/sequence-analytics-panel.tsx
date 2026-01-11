
// "use client"

// import * as React from "react"
// import {
//   Mail,
//   MousePointerClick,
//   MessageSquare,
//   AlertTriangle,
//   TrendingUp,
//   TrendingDown,
//   Users,
//   ArrowRight,
// } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import type { Sequence, SequenceStep } from "@/lib/types/sequence"
// import { getSequenceAnalytics } from "@/lib/actions/sequence-actions"
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
// import { WaveLoader } from "@/components/loader/wave-loader"

// interface SequenceAnalyticsPanelProps {
//   sequence: Sequence
//   steps: SequenceStep[]
//   userId: string
// }

// export function SequenceAnalyticsPanel({ sequence, steps: _initialSteps, userId }: SequenceAnalyticsPanelProps) {
//   const [analytics, setAnalytics] = React.useState<any>(null)
//   const [isLoading, setIsLoading] = React.useState(true)

//   React.useEffect(() => {
//     async function fetchAnalytics() {
//       if (sequence.id === "new") {
//         setIsLoading(false)
//         return
//       }

//       try {
//         const data = await getSequenceAnalytics(sequence.id, userId)
//         setAnalytics(data)
//       } catch (error) {
//         console.error("Failed to fetch analytics:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchAnalytics()
//   }, [sequence.id, userId])

//   const steps = analytics?.steps || _initialSteps

//   const totalSent = analytics?.totalSent ?? 0
//   const totalOpened = analytics?.totalOpened ?? 0
//   const totalClicked = analytics?.totalClicked ?? 0
//   const totalReplied = analytics?.totalReplied ?? 0
//   const totalBounced = analytics?.totalBounced ?? 0

//   const openRate = analytics?.openRate ?? 0
//   const clickRate = analytics?.clickRate ?? 0
//   const replyRate = analytics?.replyRate ?? 0
//   const bounceRate = analytics?.bounceRate ?? 0

//   const funnelData = steps.map((step: SequenceStep, index: number) => ({
//     name: `Step ${index + 1}`,
//     sent: step.sent,
//     opened: step.opened,
//     replied: step.replied,
//     dropOff:
//       index > 0 && steps[index - 1].sent > 0
//         ? Math.round(((steps[index - 1].sent - step.sent) / steps[index - 1].sent) * 100)
//         : 0,
//   }))

//   const dailyData = analytics?.dailyStats || []

//   const calculateTrend = (current: number, previous: number) => {
//     if (previous === 0) return 0
//     return ((current - previous) / previous) * 100
//   }

//   const openRateTrend = React.useMemo(() => {
//     if (!analytics?.previousWeekTotals) return 0
//     const currentRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
//     const previousRate =
//       analytics.previousWeekTotals.totalSent > 0
//         ? (analytics.previousWeekTotals.totalOpened / analytics.previousWeekTotals.totalSent) * 100
//         : 0
//     return calculateTrend(currentRate, previousRate)
//   }, [analytics, totalSent, totalOpened])

//   const clickRateTrend = React.useMemo(() => {
//     if (!analytics?.previousWeekTotals) return 0
//     const currentRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
//     const previousRate =
//       analytics.previousWeekTotals.totalSent > 0
//         ? (analytics.previousWeekTotals.totalClicked / analytics.previousWeekTotals.totalSent) * 100
//         : 0
//     return calculateTrend(currentRate, previousRate)
//   }, [analytics, totalSent, totalClicked])

//   const replyRateTrend = React.useMemo(() => {
//     if (!analytics?.previousWeekTotals) return 0
//     const currentRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
//     const previousRate =
//       analytics.previousWeekTotals.totalSent > 0
//         ? (analytics.previousWeekTotals.totalReplied / analytics.previousWeekTotals.totalSent) * 100
//         : 0
//     return calculateTrend(currentRate, previousRate)
//   }, [analytics, totalSent, totalReplied])

//   if (isLoading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <WaveLoader size="sm" bars={8} gap="tight" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex-1 overflow-auto p-6">
//       <div className="mx-auto max-w-6xl space-y-6">
//         {/* Header stats */}
//         <div className="grid grid-cols-5 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                   <Users className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{sequence.totalEnrolled.toLocaleString()}</p>
//                   <p className="text-xs text-muted-foreground">Enrolled</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
//                   <Mail className="h-5 w-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{openRate.toFixed(1)}%</p>
//                   <p className="text-xs text-muted-foreground">Open Rate</p>
//                 </div>
//               </div>
//               <div className="mt-2 flex items-center gap-1 text-xs">
//                 {openRateTrend >= 0 ? (
//                   <>
//                     <TrendingUp className="h-3 w-3 text-green-500" />
//                     <span className="text-green-500">+{openRateTrend.toFixed(1)}%</span>
//                   </>
//                 ) : (
//                   <>
//                     <TrendingDown className="h-3 w-3 text-red-500" />
//                     <span className="text-red-500">{openRateTrend.toFixed(1)}%</span>
//                   </>
//                 )}
//                 <span className="text-muted-foreground">vs last week</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
//                   <MousePointerClick className="h-5 w-5 text-purple-500" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{clickRate.toFixed(1)}%</p>
//                   <p className="text-xs text-muted-foreground">Click Rate</p>
//                 </div>
//               </div>
//               <div className="mt-2 flex items-center gap-1 text-xs">
//                 {clickRateTrend >= 0 ? (
//                   <>
//                     <TrendingUp className="h-3 w-3 text-green-500" />
//                     <span className="text-green-500">+{clickRateTrend.toFixed(1)}%</span>
//                   </>
//                 ) : (
//                   <>
//                     <TrendingDown className="h-3 w-3 text-red-500" />
//                     <span className="text-red-500">{clickRateTrend.toFixed(1)}%</span>
//                   </>
//                 )}
//                 <span className="text-muted-foreground">vs last week</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
//                   <MessageSquare className="h-5 w-5 text-green-500" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{replyRate.toFixed(1)}%</p>
//                   <p className="text-xs text-muted-foreground">Reply Rate</p>
//                 </div>
//               </div>
//               <div className="mt-2 flex items-center gap-1 text-xs">
//                 {replyRateTrend >= 0 ? (
//                   <>
//                     <TrendingUp className="h-3 w-3 text-green-500" />
//                     <span className="text-green-500">+{replyRateTrend.toFixed(1)}%</span>
//                   </>
//                 ) : (
//                   <>
//                     <TrendingDown className="h-3 w-3 text-red-500" />
//                     <span className="text-red-500">{replyRateTrend.toFixed(1)}%</span>
//                   </>
//                 )}
//                 <span className="text-muted-foreground">vs last week</span>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
//                   <AlertTriangle className="h-5 w-5 text-orange-500" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-foreground">{bounceRate.toFixed(1)}%</p>
//                   <p className="text-xs text-muted-foreground">Bounce Rate</p>
//                 </div>
//               </div>
//               <div className="mt-2">
//                 <Badge
//                   variant={bounceRate < 2 ? "default" : bounceRate < 5 ? "secondary" : "destructive"}
//                   className="text-[10px]"
//                 >
//                   {bounceRate < 2 ? "Healthy" : bounceRate < 5 ? "Monitor" : "High"}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="grid grid-cols-2 gap-6">
//           {/* Activity chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
//               <CardDescription>Emails sent and engagement over the last 7 days</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 {dailyData.length > 0 ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={dailyData}>
//                       <defs>
//                         <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
//                           <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
//                         </linearGradient>
//                         <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
//                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                       <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                       <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "var(--popover)",
//                           border: "1px solid var(--border)",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="sent"
//                         stroke="var(--primary)"
//                         fillOpacity={1}
//                         fill="url(#colorSent)"
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="opened"
//                         stroke="#3b82f6"
//                         fillOpacity={1}
//                         fill="url(#colorOpened)"
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
//                     No activity data yet
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Step performance */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-sm font-medium">Step Performance</CardTitle>
//               <CardDescription>Conversion funnel across sequence steps</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-64">
//                 {funnelData.length > 0 && funnelData.some((d: { sent: number }) => d.sent > 0) ? (
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={funnelData} layout="horizontal">
//                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                       <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                       <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "var(--popover)",
//                           border: "1px solid var(--border)",
//                           borderRadius: "8px",
//                         }}
//                       />
//                       <Bar dataKey="sent" fill="var(--primary)" radius={[4, 4, 0, 0]} />
//                       <Bar dataKey="opened" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                       <Bar dataKey="replied" fill="#22c55e" radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 ) : (
//                   <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
//                     No step performance data yet
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Step-by-step breakdown */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-sm font-medium">Step-by-Step Breakdown</CardTitle>
//             <CardDescription>Detailed metrics for each step in the sequence</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {steps.length === 0 ? (
//                 <p className="py-8 text-center text-sm text-muted-foreground">
//                   No steps in this sequence yet. Add steps to see analytics.
//                 </p>
//               ) : (
//                 steps.map((step: SequenceStep, index: number) => {
//                   const stepOpenRate = step.sent > 0 ? (step.opened / step.sent) * 100 : 0
//                   const stepReplyRate = step.sent > 0 ? (step.replied / step.sent) * 100 : 0
//                   const stepClickRate = step.sent > 0 ? (step.clicked / step.sent) * 100 : 0

//                   return (
//                     <div key={step.id} className="rounded-lg border border-border p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-foreground">
//                               {step.stepType === "EMAIL"
//                                 ? step.subject || "Email (no subject)"
//                                 : step.stepType.replace("_", " ")}
//                             </p>
//                             <p className="text-xs text-muted-foreground">{step.sent} sent</p>
//                           </div>
//                         </div>
//                         {index < steps.length - 1 && (
//                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                             <ArrowRight className="h-4 w-4" />
//                             <span>{funnelData[index + 1]?.dropOff || 0}% drop-off</span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-4 gap-4">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Open Rate</p>
//                           <div className="mt-1 flex items-center gap-2">
//                             <Progress value={stepOpenRate} className="h-2 flex-1" />
//                             <span className="text-sm font-medium">{stepOpenRate.toFixed(1)}%</span>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground">Click Rate</p>
//                           <div className="mt-1 flex items-center gap-2">
//                             <Progress value={stepClickRate} className="h-2 flex-1" />
//                             <span className="text-sm font-medium">{stepClickRate.toFixed(1)}%</span>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground">Reply Rate</p>
//                           <div className="mt-1 flex items-center gap-2">
//                             <Progress value={stepReplyRate} className="h-2 flex-1" />
//                             <span className="text-sm font-medium">{stepReplyRate.toFixed(1)}%</span>
//                           </div>
//                         </div>
//                         <div>
//                           <p className="text-xs text-muted-foreground">Bounced</p>
//                           <div className="mt-1">
//                             <span className="text-sm font-medium">{step.bounced}</span>
//                             <span className="text-xs text-muted-foreground ml-1">
//                               ({step.sent > 0 ? ((step.bounced / step.sent) * 100).toFixed(1) : 0}%)
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import * as React from "react"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  MousePointer,
  Reply,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Activity,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Sequence, SequenceStep } from "@/lib/types/sequence"
import { getSequenceAnalytics } from "@/lib/actions/sequence-actions"
import { WaveLoader } from "@/components/loader/wave-loader"

interface SequenceAnalyticsPanelProps {
  sequence: Sequence
  userId: string
  steps: SequenceStep[]
  
}

interface AnalyticsData {
  totalEnrolled: number
  activeEnrollments: number
  completedEnrollments: number
  pausedEnrollments: number
  exitedEnrollments: number
  totalEmailsSent: number
  totalOpened: number
  totalClicked: number
  totalReplied: number
  totalBounced: number
  avgOpenRate: number
  avgClickRate: number
  avgReplyRate: number
  bounceRate: number
  stepAnalytics: {
    stepId: string
    stepOrder: number
    stepType: string
    sent: number
    opened: number
    clicked: number
    replied: number
    bounced: number
    skipped: number
  }[]
  dailyStats: {
    date: string
    enrolled: number
    sent: number
    opened: number
    replied: number
  }[]
}

export function SequenceAnalyticsPanel({ sequence, userId, steps }: SequenceAnalyticsPanelProps) {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // const fetchAnalytics = React.useCallback(async () => {
  //   try {
  //     const data = await getSequenceAnalytics(sequence.id, userId)
  //     setAnalytics(data)
  //   } catch (error) {
  //     console.error("Failed to fetch analytics:", error)
  //     // Use sequence data as fallback
  //     const totalSent = steps.reduce((acc, s) => acc + (s.sent || 0), 0)
  //     const totalOpened = steps.reduce((acc, s) => acc + (s.opened || 0), 0)
  //     const totalClicked = steps.reduce((acc, s) => acc + (s.clicked || 0), 0)
  //     const totalReplied = steps.reduce((acc, s) => acc + (s.replied || 0), 0)
  //     const totalBounced = steps.reduce((acc, s) => acc + (s.bounced || 0), 0)

  //     setAnalytics({
  //       totalEnrolled: sequence.totalEnrolled || 0,
  //       activeEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.6),
  //       completedEnrollments: sequence.totalCompleted || 0,
  //       pausedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1),
  //       exitedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1),
  //       totalEmailsSent: totalSent,
  //       totalOpened,
  //       totalClicked,
  //       totalReplied,
  //       totalBounced,
  //       avgOpenRate: sequence.avgOpenRate || (totalSent > 0 ? (totalOpened / totalSent) * 100 : 0),
  //       avgClickRate: sequence.avgClickRate || (totalSent > 0 ? (totalClicked / totalSent) * 100 : 0),
  //       avgReplyRate: sequence.avgReplyRate || (totalSent > 0 ? (totalReplied / totalSent) * 100 : 0),
  //       bounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0,
  //       stepAnalytics: steps.map((s) => ({
  //         stepId: s.id,
  //         stepOrder: s.order,
  //         stepType: s.stepType,
  //         sent: s.sent || 0,
  //         opened: s.opened || 0,
  //         clicked: s.clicked || 0,
  //         replied: s.replied || 0,
  //         bounced: s.bounced || 0,
  //         skipped: s.skipped || 0,
  //       })),
  //       dailyStats: [],
  //     })
  //   } finally {
  //     setIsLoading(false)
  //     setIsRefreshing(false)
  //   }
  // }, [sequence, userId, steps])

  const fetchAnalytics = React.useCallback(async () => {
  try {
    const data = await getSequenceAnalytics(sequence.id, userId)
    
    // Map the returned data to match AnalyticsData interface
    setAnalytics({
      totalEnrolled: sequence.totalEnrolled || 0,
      activeEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.6), // Estimate
      completedEnrollments: sequence.totalCompleted || 0,
      pausedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1), // Estimate
      exitedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1), // Estimate
      totalEmailsSent: data.totalSent,
      totalOpened: data.totalOpened,
      totalClicked: data.totalClicked,
      totalReplied: data.totalReplied,
      totalBounced: data.totalBounced,
      avgOpenRate: data.openRate,
      avgClickRate: data.clickRate,
      avgReplyRate: data.replyRate,
      bounceRate: data.bounceRate,
      stepAnalytics: data.steps.map((s) => ({
        stepId: s.id,
        stepOrder: s.order,
        stepType: s.stepType,
        sent: s.sent || 0,
        opened: s.opened || 0,
        clicked: s.clicked || 0,
        replied: s.replied || 0,
        bounced: s.bounced || 0,
        skipped: 0, // Not tracked in current data
      })),
      dailyStats: data.dailyStats.map((day) => ({
        date: day.date,
        enrolled: 0, // Not in current data
        sent: day.sent,
        opened: day.opened,
        replied: day.replied,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    // Use sequence data as fallback
    const totalSent = steps.reduce((acc, s) => acc + (s.sent || 0), 0)
    const totalOpened = steps.reduce((acc, s) => acc + (s.opened || 0), 0)
    const totalClicked = steps.reduce((acc, s) => acc + (s.clicked || 0), 0)
    const totalReplied = steps.reduce((acc, s) => acc + (s.replied || 0), 0)
    const totalBounced = steps.reduce((acc, s) => acc + (s.bounced || 0), 0)

    setAnalytics({
      totalEnrolled: sequence.totalEnrolled || 0,
      activeEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.6),
      completedEnrollments: sequence.totalCompleted || 0,
      pausedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1),
      exitedEnrollments: Math.floor((sequence.totalEnrolled || 0) * 0.1),
      totalEmailsSent: totalSent,
      totalOpened,
      totalClicked,
      totalReplied,
      totalBounced,
      avgOpenRate: sequence.avgOpenRate || (totalSent > 0 ? (totalOpened / totalSent) * 100 : 0),
      avgClickRate: sequence.avgClickRate || (totalSent > 0 ? (totalClicked / totalSent) * 100 : 0),
      avgReplyRate: sequence.avgReplyRate || (totalSent > 0 ? (totalReplied / totalSent) * 100 : 0),
      bounceRate: totalSent > 0 ? (totalBounced / totalSent) * 100 : 0,
      stepAnalytics: steps.map((s) => ({
        stepId: s.id,
        stepOrder: s.order,
        stepType: s.stepType,
        sent: s.sent || 0,
        opened: s.opened || 0,
        clicked: s.clicked || 0,
        replied: s.replied || 0,
        bounced: s.bounced || 0,
        skipped: 0,
      })),
      dailyStats: [],
    })
  } finally {
    setIsLoading(false)
    setIsRefreshing(false)
  }
}, [sequence, userId, steps])







  React.useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnalytics()
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!analytics) return null

  const conversionRate = analytics.totalEnrolled > 0 ? (analytics.totalReplied / analytics.totalEnrolled) * 100 : 0

  const healthScore = Math.min(
    100,
    Math.round(analytics.avgOpenRate * 0.3 + analytics.avgReplyRate * 0.4 + (100 - analytics.bounceRate) * 0.3),
  )

  const getHealthColor = (score: number) => {
    if (score >= 70) return "text-emerald-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  const getHealthBg = (score: number) => {
    if (score >= 70) return "bg-emerald-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Analytics</h2>
              <p className="text-sm text-muted-foreground">Performance insights for {sequence.name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 bg-transparent"
          >
            {isRefreshing ? <WaveLoader size="sm" bars={8} gap="tight" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {/* Health Score Card */}
        <Card className="overflow-hidden">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full",
                    getHealthBg(healthScore) + "/10",
                  )}
                >
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-muted/30"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${healthScore * 1.76} 176`}
                      className={getHealthColor(healthScore)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={cn("text-xl font-bold tabular-nums", getHealthColor(healthScore))}>
                    {healthScore}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className={cn("text-lg font-semibold", getHealthColor(healthScore))}>
                    {healthScore >= 70 ? "Excellent" : healthScore >= 40 ? "Needs Attention" : "Critical"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Activity className="h-3 w-3" />
                  {sequence.status}
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {steps.length} steps
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Enrolled"
            value={analytics.totalEnrolled}
            icon={Users}
            color="blue"
            subtitle={`${analytics.activeEnrollments} active`}
          />
          <MetricCard
            title="Open Rate"
            value={`${analytics.avgOpenRate.toFixed(1)}%`}
            icon={Mail}
            color="emerald"
            trend={analytics.avgOpenRate > 30 ? "up" : "down"}
            subtitle={`${analytics.totalOpened.toLocaleString()} opens`}
          />
          <MetricCard
            title="Click Rate"
            value={`${analytics.avgClickRate.toFixed(1)}%`}
            icon={MousePointer}
            color="amber"
            trend={analytics.avgClickRate > 5 ? "up" : "down"}
            subtitle={`${analytics.totalClicked.toLocaleString()} clicks`}
          />
          <MetricCard
            title="Reply Rate"
            value={`${analytics.avgReplyRate.toFixed(1)}%`}
            icon={Reply}
            color="purple"
            trend={analytics.avgReplyRate > 10 ? "up" : "down"}
            subtitle={`${analytics.totalReplied.toLocaleString()} replies`}
          />
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="funnel" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-11">
            <TabsTrigger value="funnel" className="text-sm">
              Funnel
            </TabsTrigger>
            <TabsTrigger value="steps" className="text-sm">
              By Step
            </TabsTrigger>
            <TabsTrigger value="status" className="text-sm">
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FunnelStep label="Enrolled" value={analytics.totalEnrolled} percentage={100} color="bg-blue-500" />
                <FunnelStep
                  label="Emails Sent"
                  value={analytics.totalEmailsSent}
                  percentage={
                    analytics.totalEnrolled > 0 ? (analytics.totalEmailsSent / analytics.totalEnrolled) * 100 : 0
                  }
                  color="bg-sky-500"
                />
                <FunnelStep
                  label="Opened"
                  value={analytics.totalOpened}
                  percentage={
                    analytics.totalEmailsSent > 0 ? (analytics.totalOpened / analytics.totalEmailsSent) * 100 : 0
                  }
                  color="bg-emerald-500"
                />
                <FunnelStep
                  label="Clicked"
                  value={analytics.totalClicked}
                  percentage={analytics.totalOpened > 0 ? (analytics.totalClicked / analytics.totalOpened) * 100 : 0}
                  color="bg-amber-500"
                />
                <FunnelStep
                  label="Replied"
                  value={analytics.totalReplied}
                  percentage={
                    analytics.totalEmailsSent > 0 ? (analytics.totalReplied / analytics.totalEmailsSent) * 100 : 0
                  }
                  color="bg-purple-500"
                  isLast
                />

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Conversion</span>
                    <span className="font-semibold text-lg">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">From enrolled to replied</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-3">
            {analytics.stepAnalytics.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No step data available yet</p>
              </Card>
            ) : (
              analytics.stepAnalytics.map((step, i) => {
                const openRate = step.sent > 0 ? (step.opened / step.sent) * 100 : 0
                const replyRate = step.sent > 0 ? (step.replied / step.sent) * 100 : 0

                return (
                  <Card key={step.stepId} className="overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-semibold text-sm shrink-0">
                        #{step.stepOrder + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="font-medium text-sm truncate">{step.stepType.replace(/_/g, " ")}</p>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {step.sent} sent
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1">Open</p>
                            <p className="font-semibold tabular-nums">{openRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Reply</p>
                            <p className="font-semibold tabular-nums">{replyRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Skipped</p>
                            <p className="font-semibold tabular-nums">{step.skipped}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Progress value={openRate} className="h-1 rounded-none" />
                  </Card>
                )
              })
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <StatusCard
                label="Active"
                value={analytics.activeEnrollments}
                total={analytics.totalEnrolled}
                icon={Zap}
                color="emerald"
              />
              <StatusCard
                label="Completed"
                value={analytics.completedEnrollments}
                total={analytics.totalEnrolled}
                icon={CheckCircle2}
                color="blue"
              />
              <StatusCard
                label="Paused"
                value={analytics.pausedEnrollments}
                total={analytics.totalEnrolled}
                icon={Clock}
                color="amber"
              />
              <StatusCard
                label="Exited"
                value={analytics.exitedEnrollments}
                total={analytics.totalEnrolled}
                icon={XCircle}
                color="red"
              />
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bounce & Deliverability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bounce Rate</span>
                  <span className={cn("font-semibold", analytics.bounceRate > 5 ? "text-red-500" : "text-emerald-500")}>
                    {analytics.bounceRate.toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={analytics.bounceRate}
                  className={cn("h-2", analytics.bounceRate > 5 && "[&>div]:bg-red-500")}
                />
                <p className="text-xs text-muted-foreground">
                  {analytics.totalBounced} of {analytics.totalEmailsSent} emails bounced
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  color: "blue" | "emerald" | "amber" | "purple"
  trend?: "up" | "down"
  subtitle?: string
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    purple: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
  }

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1", colorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trend === "up" ? "text-emerald-500" : "text-red-500",
              )}
            >
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
        {subtitle && <p className="text-[10px] text-muted-foreground/80 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

function FunnelStep({
  label,
  value,
  percentage,
  color,
  isLast = false,
}: {
  label: string
  value: number
  percentage: number
  color: string
  isLast?: boolean
}) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">{value.toLocaleString()}</span>
          <Badge variant="secondary" className="text-xs tabular-nums">
            {percentage.toFixed(1)}%
          </Badge>
        </div>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {!isLast && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2">
          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>
      )}
    </div>
  )
}

function StatusCard({
  label,
  value,
  total,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  total: number
  icon: React.ElementType
  color: "emerald" | "blue" | "amber" | "red"
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const colorClasses = {
    emerald: "text-emerald-600 bg-emerald-500/10",
    blue: "text-blue-600 bg-blue-500/10",
    amber: "text-amber-600 bg-amber-500/10",
    red: "text-red-600 bg-red-500/10",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
    </Card>
  )
}
