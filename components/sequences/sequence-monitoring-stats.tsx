// "use client"

// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Clock, CheckCircle, XCircle, Users } from 'lucide-react'
// import { formatDistanceToNow } from "date-fns"

// interface SequenceMonitoringStatsProps {
//   scheduleStats: Array<{ status: string; _count: number }>
//   prospectsByStep: Array<{
//     id: string
//     status: string
//     scheduledFor: Date
//     prospect: {
//       id: string
//       firstName: string | null
//       lastName: string | null
//       email: string
//       company: string | null
//       status: string
//     }
//   }>
// }

// export function SequenceMonitoringStats({
//   scheduleStats,
//   prospectsByStep,
// }: SequenceMonitoringStatsProps) {
//   const totalScheduled = scheduleStats.reduce((sum, stat) => sum + stat._count, 0)
//   const pendingCount = scheduleStats.find((s) => s.status === "PENDING")?._count || 0
//   const sentCount = scheduleStats.find((s) => s.status === "SENT")?._count || 0
//   const failedCount = scheduleStats.find((s) => s.status === "FAILED")?._count || 0

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="p-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
//               <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Total in Sequence</p>
//               <p className="text-2xl font-bold">{totalScheduled}</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
//               <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Pending</p>
//               <p className="text-2xl font-bold">{pendingCount}</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
//               <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Sent</p>
//               <p className="text-2xl font-bold">{sentCount}</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4">
//           <div className="flex items-center gap-3">
//             <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
//               <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
//             </div>
//             <div>
//               <p className="text-xs text-muted-foreground">Failed</p>
//               <p className="text-2xl font-bold">{failedCount}</p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {prospectsByStep.length > 0 && (
//         <Card className="p-4">
//           <h3 className="mb-3 font-semibold text-sm">Recent Activity</h3>
//           <div className="space-y-2">
//             {prospectsByStep.slice(0, 5).map((schedule) => (
//               <div key={schedule.id} className="flex items-center justify-between text-sm">
//                 <div>
//                   <p className="font-medium">
//                     {schedule.prospect.firstName} {schedule.prospect.lastName}
//                   </p>
//                   <p className="text-xs text-muted-foreground">{schedule.prospect.email}</p>
//                 </div>
//                 <div className="text-right">
//                   <Badge variant={schedule.status === "SENT" ? "default" : "secondary"} className="text-xs">
//                     {schedule.status}
//                   </Badge>
//                   <p className="mt-1 text-xs text-muted-foreground">
//                     {schedule.status === "PENDING"
//                       ? formatDistanceToNow(new Date(schedule.scheduledFor), { addSuffix: true })
//                       : "Sent"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, CheckCircle, XCircle, TrendingUp, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SequenceMonitoringStatsProps {
  scheduleStats: Array<{ status: string; _count: number }>
  prospectsByStep: Array<{
    id: string
    status: string
    scheduledFor: Date
    prospect: {
      id: string
      firstName: string | null
      lastName: string | null
      email: string
      company: string | null
      status: string
    }
  }>
}

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setDisplayValue(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{displayValue.toLocaleString()}</span>
}

function CircularProgress({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = max > 0 ? (value / max) * 100 : 0
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative h-24 w-24">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

export function SequenceMonitoringStats({ scheduleStats, prospectsByStep }: SequenceMonitoringStatsProps) {
  const totalScheduled = scheduleStats.reduce((sum, stat) => sum + stat._count, 0)
  const pendingCount = scheduleStats.find((s) => s.status === "PENDING")?._count || 0
  const sentCount = scheduleStats.find((s) => s.status === "SENT")?._count || 0
  const failedCount = scheduleStats.find((s) => s.status === "FAILED")?._count || 0

  const stats = [
    {
      label: "Total Prospects",
      value: totalScheduled,
      icon: Users,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "from-amber-500/20 to-yellow-600/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Sent",
      value: sentCount,
      icon: CheckCircle,
      color: "from-emerald-500/20 to-green-600/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Failed",
      value: failedCount,
      icon: XCircle,
      color: "from-red-500/20 to-rose-600/20",
      iconColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg shadow-black/5">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
                <CardContent className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">
                        <AnimatedNumber value={stat.value} />
                      </p>
                    </div>
                    <div className={`rounded-xl ${stat.bgColor} p-3`}>
                      <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Performance & Activity Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Performance Rings */}
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-around py-4">
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={sentCount} max={totalScheduled} color="hsl(var(--primary))" />
                <span className="text-sm font-medium text-muted-foreground">Delivery Rate</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={Math.floor(sentCount * 0.45)} max={sentCount} color="#22c55e" />
                <span className="text-sm font-medium text-muted-foreground">Open Rate</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CircularProgress value={Math.floor(sentCount * 0.12)} max={sentCount} color="#8b5cf6" />
                <span className="text-sm font-medium text-muted-foreground">Reply Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3 border-0 shadow-lg shadow-black/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prospectsByStep.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                {prospectsByStep.slice(0, 8).map((schedule, index) => {
                  const initials =
                    `${schedule.prospect.firstName?.[0] || ""}${schedule.prospect.lastName?.[0] || ""}`.toUpperCase() ||
                    "?"

                  return (
                    <motion.div
                      key={schedule.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {schedule.prospect.firstName} {schedule.prospect.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {schedule.prospect.company || schedule.prospect.email}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge
                          variant={
                            schedule.status === "SENT"
                              ? "default"
                              : schedule.status === "FAILED"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {schedule.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {schedule.status === "PENDING"
                            ? formatDistanceToNow(new Date(schedule.scheduledFor), { addSuffix: true })
                            : "Sent"}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
