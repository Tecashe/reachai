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
//   Loader2,
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

// export function SequenceAnalyticsPanel({ sequence, steps, userId }: SequenceAnalyticsPanelProps) {
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

//   // Calculate from steps if no analytics loaded
//   const totalSent = analytics?.totalSent ?? steps.reduce((sum, s) => sum + s.sent, 0)
//   const totalOpened = analytics?.totalOpened ?? steps.reduce((sum, s) => sum + s.opened, 0)
//   const totalClicked = analytics?.totalClicked ?? steps.reduce((sum, s) => sum + s.clicked, 0)
//   const totalReplied = analytics?.totalReplied ?? steps.reduce((sum, s) => sum + s.replied, 0)
//   const totalBounced = analytics?.totalBounced ?? steps.reduce((sum, s) => sum + s.bounced, 0)

//   const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
//   const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
//   const replyRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
//   const bounceRate = totalSent > 0 ? (totalBounced / totalSent) * 100 : 0

//   const funnelData = steps.map((step, index) => ({
//     name: `Step ${index + 1}`,
//     sent: step.sent,
//     opened: step.opened,
//     replied: step.replied,
//     dropOff:
//       index > 0 && steps[index - 1].sent > 0
//         ? Math.round(((steps[index - 1].sent - step.sent) / steps[index - 1].sent) * 100)
//         : 0,
//   }))

//   // Generate daily data from step stats
//   const dailyData = React.useMemo(() => {
//     const days = []
//     const now = new Date()
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date(now)
//       date.setDate(date.getDate() - i)
//       days.push({
//         date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//         sent: Math.round((totalSent / 7) * (0.8 + Math.random() * 0.4)),
//         opened: Math.round((totalOpened / 7) * (0.8 + Math.random() * 0.4)),
//         clicked: Math.round((totalClicked / 7) * (0.8 + Math.random() * 0.4)),
//         replied: Math.round((totalReplied / 7) * (0.8 + Math.random() * 0.4)),
//       })
//     }
//     return days
//   }, [totalSent, totalOpened, totalClicked, totalReplied])

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
//                 <TrendingUp className="h-3 w-3 text-green-500" />
//                 <span className="text-green-500">+5.2%</span>
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
//                 <TrendingUp className="h-3 w-3 text-green-500" />
//                 <span className="text-green-500">+2.1%</span>
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
//                 <TrendingDown className="h-3 w-3 text-red-500" />
//                 <span className="text-red-500">-1.3%</span>
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
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={dailyData}>
//                     <defs>
//                       <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
//                       </linearGradient>
//                       <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                     <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                     <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "var(--popover)",
//                         border: "1px solid var(--border)",
//                         borderRadius: "8px",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="sent"
//                       stroke="var(--primary)"
//                       fillOpacity={1}
//                       fill="url(#colorSent)"
//                     />
//                     <Area type="monotone" dataKey="opened" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOpened)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
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
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={funnelData} layout="horizontal">
//                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
//                     <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                     <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "var(--popover)",
//                         border: "1px solid var(--border)",
//                         borderRadius: "8px",
//                       }}
//                     />
//                     <Bar dataKey="sent" fill="var(--primary)" radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="opened" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//                     <Bar dataKey="replied" fill="#22c55e" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
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
//                 steps.map((step, index) => {
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

// export function SequenceAnalyticsPanel({ sequence, steps, userId }: SequenceAnalyticsPanelProps) {
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

//   const totalSent = analytics?.totalSent ?? 0
//   const totalOpened = analytics?.totalOpened ?? 0
//   const totalClicked = analytics?.totalClicked ?? 0
//   const totalReplied = analytics?.totalReplied ?? 0
//   const totalBounced = analytics?.totalBounced ?? 0

//   const openRate = analytics?.openRate ?? 0
//   const clickRate = analytics?.clickRate ?? 0
//   const replyRate = analytics?.replyRate ?? 0
//   const bounceRate = analytics?.bounceRate ?? 0

//   const funnelData = steps.map((step, index) => ({
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
//                 {funnelData.length > 0 && funnelData.some((d) => d.sent > 0) ? (
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
//                 steps.map((step, index) => {
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
  Mail,
  MousePointerClick,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Sequence, SequenceStep } from "@/lib/types/sequence"
import { getSequenceAnalytics } from "@/lib/actions/sequence-actions"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { WaveLoader } from "@/components/loader/wave-loader"

interface SequenceAnalyticsPanelProps {
  sequence: Sequence
  steps: SequenceStep[]
  userId: string
}

export function SequenceAnalyticsPanel({ sequence, steps: _initialSteps, userId }: SequenceAnalyticsPanelProps) {
  const [analytics, setAnalytics] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchAnalytics() {
      if (sequence.id === "new") {
        setIsLoading(false)
        return
      }

      try {
        const data = await getSequenceAnalytics(sequence.id, userId)
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [sequence.id, userId])

  const steps = analytics?.steps || _initialSteps

  const totalSent = analytics?.totalSent ?? 0
  const totalOpened = analytics?.totalOpened ?? 0
  const totalClicked = analytics?.totalClicked ?? 0
  const totalReplied = analytics?.totalReplied ?? 0
  const totalBounced = analytics?.totalBounced ?? 0

  const openRate = analytics?.openRate ?? 0
  const clickRate = analytics?.clickRate ?? 0
  const replyRate = analytics?.replyRate ?? 0
  const bounceRate = analytics?.bounceRate ?? 0

  const funnelData = steps.map((step: SequenceStep, index: number) => ({
    name: `Step ${index + 1}`,
    sent: step.sent,
    opened: step.opened,
    replied: step.replied,
    dropOff:
      index > 0 && steps[index - 1].sent > 0
        ? Math.round(((steps[index - 1].sent - step.sent) / steps[index - 1].sent) * 100)
        : 0,
  }))

  const dailyData = analytics?.dailyStats || []

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const openRateTrend = React.useMemo(() => {
    if (!analytics?.previousWeekTotals) return 0
    const currentRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
    const previousRate =
      analytics.previousWeekTotals.totalSent > 0
        ? (analytics.previousWeekTotals.totalOpened / analytics.previousWeekTotals.totalSent) * 100
        : 0
    return calculateTrend(currentRate, previousRate)
  }, [analytics, totalSent, totalOpened])

  const clickRateTrend = React.useMemo(() => {
    if (!analytics?.previousWeekTotals) return 0
    const currentRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
    const previousRate =
      analytics.previousWeekTotals.totalSent > 0
        ? (analytics.previousWeekTotals.totalClicked / analytics.previousWeekTotals.totalSent) * 100
        : 0
    return calculateTrend(currentRate, previousRate)
  }, [analytics, totalSent, totalClicked])

  const replyRateTrend = React.useMemo(() => {
    if (!analytics?.previousWeekTotals) return 0
    const currentRate = totalSent > 0 ? (totalReplied / totalSent) * 100 : 0
    const previousRate =
      analytics.previousWeekTotals.totalSent > 0
        ? (analytics.previousWeekTotals.totalReplied / analytics.previousWeekTotals.totalSent) * 100
        : 0
    return calculateTrend(currentRate, previousRate)
  }, [analytics, totalSent, totalReplied])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <WaveLoader size="sm" bars={8} gap="tight" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header stats */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sequence.totalEnrolled.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{openRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {openRateTrend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{openRateTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{openRateTrend.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <MousePointerClick className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{clickRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {clickRateTrend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{clickRateTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{clickRateTrend.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{replyRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Reply Rate</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                {replyRateTrend >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{replyRateTrend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{replyRateTrend.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-muted-foreground">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{bounceRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Bounce Rate</p>
                </div>
              </div>
              <div className="mt-2">
                <Badge
                  variant={bounceRate < 2 ? "default" : bounceRate < 5 ? "secondary" : "destructive"}
                  className="text-[10px]"
                >
                  {bounceRate < 2 ? "Healthy" : bounceRate < 5 ? "Monitor" : "High"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Activity chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
              <CardDescription>Emails sent and engagement over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sent"
                        stroke="var(--primary)"
                        fillOpacity={1}
                        fill="url(#colorSent)"
                      />
                      <Area
                        type="monotone"
                        dataKey="opened"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorOpened)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No activity data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Step Performance</CardTitle>
              <CardDescription>Conversion funnel across sequence steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {funnelData.length > 0 && funnelData.some((d: { sent: number }) => d.sent > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="sent" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="opened" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="replied" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No step performance data yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step-by-step breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Step-by-Step Breakdown</CardTitle>
            <CardDescription>Detailed metrics for each step in the sequence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No steps in this sequence yet. Add steps to see analytics.
                </p>
              ) : (
                steps.map((step: SequenceStep, index: number) => {
                  const stepOpenRate = step.sent > 0 ? (step.opened / step.sent) * 100 : 0
                  const stepReplyRate = step.sent > 0 ? (step.replied / step.sent) * 100 : 0
                  const stepClickRate = step.sent > 0 ? (step.clicked / step.sent) * 100 : 0

                  return (
                    <div key={step.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {step.stepType === "EMAIL"
                                ? step.subject || "Email (no subject)"
                                : step.stepType.replace("_", " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">{step.sent} sent</p>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="h-4 w-4" />
                            <span>{funnelData[index + 1]?.dropOff || 0}% drop-off</span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress value={stepOpenRate} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{stepOpenRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress value={stepClickRate} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{stepClickRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Reply Rate</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Progress value={stepReplyRate} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{stepReplyRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Bounced</p>
                          <div className="mt-1">
                            <span className="text-sm font-medium">{step.bounced}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({step.sent > 0 ? ((step.bounced / step.sent) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
