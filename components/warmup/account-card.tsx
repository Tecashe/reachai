// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Activity,
//   Mail,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle2,
//   Pause,
//   Play,
//   Eye,
//   ArrowRight,
//   Zap,
//   Shield,
// } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"

// interface AccountCardProps {
//   account: any
//   onPauseResume: (accountId: string, isActive: boolean) => Promise<void>
//   actionLoading: string | null
// }

// export function AccountCard({ account, onPauseResume, actionLoading }: AccountCardProps) {
//   const getTierColor = (tier: string) => {
//     const colors = {
//       PRISTINE: "from-emerald-500 to-teal-600",
//       EXCELLENT: "from-blue-500 to-cyan-600",
//       GOOD: "from-indigo-500 to-purple-600",
//       FAIR: "from-amber-500 to-orange-600",
//       CRITICAL: "from-red-500 to-rose-600",
//     }
//     return colors[tier as keyof typeof colors] || "from-gray-500 to-slate-600"
//   }

//   const getTierBadgeColor = (tier: string) => {
//     switch (tier) {
//       case "PRISTINE":
//         return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
//       case "EXCELLENT":
//         return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
//       case "GOOD":
//         return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
//       case "FAIR":
//         return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
//       case "CRITICAL":
//         return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
//       default:
//         return "bg-muted text-muted-foreground"
//     }
//   }

//   const getStageIcon = (stage: string) => {
//     switch (stage) {
//       case "INITIAL":
//         return <Zap className="h-4 w-4" />
//       case "BUILDING":
//         return <TrendingUp className="h-4 w-4" />
//       case "ESTABLISHED":
//         return <Shield className="h-4 w-4" />
//       case "MATURE":
//         return <CheckCircle2 className="h-4 w-4" />
//       default:
//         return <Activity className="h-4 w-4" />
//     }
//   }

//   return (
//     <Card className="group relative overflow-hidden card-hover border-border/50">
//       {/* Gradient accent bar */}
//       <div
//         className={cn(
//           "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
//           getTierColor(account.profile.reputationTier),
//         )}
//       />

//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex-1 min-w-0 space-y-2">
//             <CardTitle className="text-lg font-semibold leading-tight truncate">{account.email}</CardTitle>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs font-medium">
//                 {account.provider}
//               </Badge>
//               {account.warmupEnabled && (
//                 <div className="flex items-center gap-1.5">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-xs text-muted-foreground">Active</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <Badge className={cn("shrink-0 font-semibold", getTierBadgeColor(account.profile.reputationTier))}>
//             {account.profile.reputationTier}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {account.currentSession ? (
//           <>
//             {/* Stage and Daily Limit */}
//             <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
//               <div className="flex items-center gap-2 text-sm font-medium">
//                 {getStageIcon(account.currentSession.stage)}
//                 <span>{account.currentSession.stage}</span>
//               </div>
//               <div className="text-sm">
//                 <span className="font-bold text-foreground">{account.dailyLimit}</span>
//                 <span className="text-muted-foreground"> /day</span>
//               </div>
//             </div>

//             {/* Health Score Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground font-medium">Health Score</span>
//                 <span className="font-bold">{Math.round(account.profile.riskScore)}%</span>
//               </div>
//               <Progress value={account.profile.riskScore} className="h-2.5" />
//             </div>

//             {/* Email Stats Grid */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 border border-blue-500/20">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
//                   <span className="text-xs text-muted-foreground font-medium">Sent</span>
//                 </div>
//                 <div className="text-2xl font-bold">{account.currentSession.emailsSent}</div>
//               </div>
//               <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border border-emerald-500/20">
//                 <div className="flex items-center gap-2 mb-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
//                   <span className="text-xs text-muted-foreground font-medium">Received</span>
//                 </div>
//                 <div className="text-2xl font-bold">{account.currentSession.emailsReceived}</div>
//               </div>
//             </div>

//             {/* Recent Metrics */}
//             {account.recentMetrics.length > 0 && (
//               <div className="space-y-2 rounded-lg border border-border bg-card/50 p-3">
//                 <div className="text-xs font-semibold text-muted-foreground mb-2">Latest Metrics</div>
//                 <div className="grid grid-cols-3 gap-3 text-xs">
//                   <div>
//                     <div className="text-muted-foreground mb-0.5">Open Rate</div>
//                     <div className="font-bold text-sm">{account.recentMetrics[0].openRate.toFixed(1)}%</div>
//                   </div>
//                   <div>
//                     <div className="text-muted-foreground mb-0.5">Reply Rate</div>
//                     <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
//                       {account.recentMetrics[0].replyRate.toFixed(1)}%
//                     </div>
//                   </div>
//                   <div>
//                     <div className="text-muted-foreground mb-0.5">Bounce Rate</div>
//                     <div className="font-bold text-sm text-red-600 dark:text-red-400">
//                       {account.recentMetrics[0].bounceRate.toFixed(1)}%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1 gap-2 bg-transparent"
//                 onClick={() => onPauseResume(account.id, account.warmupEnabled)}
//                 disabled={actionLoading === account.id}
//               >
//                 {account.warmupEnabled ? (
//                   <>
//                     <Pause className="h-3.5 w-3.5" />
//                     Pause
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-3.5 w-3.5" />
//                     Resume
//                   </>
//                 )}
//               </Button>
//               <Button size="sm" className="flex-1 gap-2 group" asChild>
//                 <Link href={`/warmup/${account.id}`}>
//                   <Eye className="h-3.5 w-3.5" />
//                   View Details
//                   <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
//                 </Link>
//               </Button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 p-4 bg-muted/20">
//               <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
//               <p className="text-sm text-muted-foreground">Not enrolled in warmup</p>
//             </div>
//             <Button className="w-full gap-2" asChild>
//               <Link href={`/warmup/enroll?accountId=${account.id}`}>
//                 <Play className="h-4 w-4" />
//                 Start Warmup
//               </Link>
//             </Button>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Activity,
//   Mail,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle2,
//   Pause,
//   Play,
//   Eye,
//   ArrowRight,
//   Zap,
//   Shield,
// } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"

// interface AccountCardProps {
//   account: {
//     id: string
//     email: string
//     provider: string
//     isActive: boolean
//     dailyLimit: number
//     warmupEnabled: boolean
//     warmupStage: string
//     profile: {
//       reputationTier: string
//       riskScore: number
//     }
//     currentSession: {
//       id: string
//       emailsSent: number
//       emailsReceived: number
//     } | null
//   }
//   onPauseResume: (accountId: string, isActive: boolean) => Promise<void>
//   actionLoading: string | null
// }

// export function AccountCard({ account, onPauseResume, actionLoading }: AccountCardProps) {
//   const getTierColor = (tier: string) => {
//     const colors = {
//       PRISTINE: "from-emerald-500 to-teal-600",
//       HIGH: "from-blue-500 to-cyan-600",
//       MEDIUM: "from-indigo-500 to-purple-600",
//       LOW: "from-amber-500 to-orange-600",
//       CRITICAL: "from-red-500 to-rose-600",
//     }
//     return colors[tier as keyof typeof colors] || "from-gray-500 to-slate-600"
//   }

//   const getTierBadgeColor = (tier: string) => {
//     switch (tier) {
//       case "PRISTINE":
//         return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
//       case "HIGH":
//         return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
//       case "MEDIUM":
//         return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
//       case "LOW":
//         return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
//       case "CRITICAL":
//         return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
//       default:
//         return "bg-muted text-muted-foreground"
//     }
//   }

//   const getStageIcon = (stage: string) => {
//     switch (stage) {
//       case "NEW":
//         return <Zap className="h-4 w-4" />
//       case "WARMING":
//       case "WARM":
//         return <TrendingUp className="h-4 w-4" />
//       case "ACTIVE":
//         return <Activity className="h-4 w-4" />
//       case "ESTABLISHED":
//         return <Shield className="h-4 w-4" />
//       default:
//         return <Activity className="h-4 w-4" />
//     }
//   }

//   const healthScore = Math.round(100 - account.profile.riskScore)

//   return (
//     <Card className="group relative overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
//       {/* Gradient accent bar */}
//       <div
//         className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", getTierColor(account.profile.reputationTier))}
//       />

//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex-1 min-w-0 space-y-2">
//             <CardTitle className="text-lg font-semibold leading-tight truncate">{account.email}</CardTitle>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-xs font-medium">
//                 {account.provider}
//               </Badge>
//               {account.warmupEnabled && (
//                 <div className="flex items-center gap-1.5">
//                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                   <span className="text-xs text-muted-foreground">Active</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <Badge className={cn("shrink-0 font-semibold", getTierBadgeColor(account.profile.reputationTier))}>
//             {account.profile.reputationTier}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {account.currentSession ? (
//           <>
//             {/* Stage and Daily Limit */}
//             <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
//               <div className="flex items-center gap-2 text-sm font-medium">
//                 {getStageIcon(account.warmupStage)}
//                 <span>{account.warmupStage}</span>
//               </div>
//               <div className="text-sm">
//                 <span className="font-bold text-foreground">{account.dailyLimit}</span>
//                 <span className="text-muted-foreground"> /day</span>
//               </div>
//             </div>

//             {/* Health Score Progress */}
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span className="text-muted-foreground font-medium">Health Score</span>
//                 <span className="font-bold">{healthScore}%</span>
//               </div>
//               <Progress value={healthScore} className="h-2.5" />
//             </div>

//             {/* Email Stats Grid */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 border border-blue-500/20">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
//                   <span className="text-xs text-muted-foreground font-medium">Sent</span>
//                 </div>
//                 <div className="text-2xl font-bold">{account.currentSession.emailsSent}</div>
//               </div>
//               <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border border-emerald-500/20">
//                 <div className="flex items-center gap-2 mb-1">
//                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
//                   <span className="text-xs text-muted-foreground font-medium">Received</span>
//                 </div>
//                 <div className="text-2xl font-bold">{account.currentSession.emailsReceived}</div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1 gap-2"
//                 onClick={() => onPauseResume(account.id, account.warmupEnabled)}
//                 disabled={actionLoading === account.id}
//               >
//                 {actionLoading === account.id ? (
//                   "Loading..."
//                 ) : account.warmupEnabled ? (
//                   <>
//                     <Pause className="h-3.5 w-3.5" />
//                     Pause
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-3.5 w-3.5" />
//                     Resume
//                   </>
//                 )}
//               </Button>
//               <Button size="sm" className="flex-1 gap-2 group" asChild>
//                 <Link href={`/warmup/${account.id}`}>
//                   <Eye className="h-3.5 w-3.5" />
//                   View Details
//                   <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
//                 </Link>
//               </Button>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 p-4 bg-muted/20">
//               <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
//               <p className="text-sm text-muted-foreground">Not enrolled in warmup</p>
//             </div>
//             <Button className="w-full gap-2" asChild>
//               <Link href={`/warmup/enroll?accountId=${account.id}`}>
//                 <Play className="h-4 w-4" />
//                 Start Warmup
//               </Link>
//             </Button>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Mail,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Pause,
  Play,
  Eye,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AccountCardProps {
  account: {
    id: string
    email: string
    provider: string
    isActive: boolean
    dailyLimit: number
    warmupEnabled: boolean
    warmupStage: string
    profile: {
      reputationTier: string
      riskScore: number
    } | null  // Changed to nullable
    currentSession: {
      id: string
      emailsSent: number
      emailsReceived: number
    } | null
  }
  onPauseResume: (accountId: string, isActive: boolean) => Promise<void>
  actionLoading: string | null
}

export function AccountCard({ account, onPauseResume, actionLoading }: AccountCardProps) {
  const getTierColor = (tier: string) => {
    const colors = {
      PRISTINE: "from-emerald-500 to-teal-600",
      HIGH: "from-blue-500 to-cyan-600",
      MEDIUM: "from-indigo-500 to-purple-600",
      LOW: "from-amber-500 to-orange-600",
      CRITICAL: "from-red-500 to-rose-600",
    }
    return colors[tier as keyof typeof colors] || "from-gray-500 to-slate-600"
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "PRISTINE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "HIGH":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "MEDIUM":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "LOW":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "CRITICAL":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "NEW":
        return <Zap className="h-4 w-4" />
      case "WARMING":
      case "WARM":
        return <TrendingUp className="h-4 w-4" />
      case "ACTIVE":
        return <Activity className="h-4 w-4" />
      case "ESTABLISHED":
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  // Handle nullable profile with defaults
  const reputationTier = account.profile?.reputationTier || "UNKNOWN"
  const riskScore = account.profile?.riskScore ?? 50
  const healthScore = Math.round(100 - riskScore)

  return (
    <Card className="group relative overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
      {/* Gradient accent bar */}
      <div
        className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", getTierColor(reputationTier))}
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <CardTitle className="text-lg font-semibold leading-tight truncate">{account.email}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {account.provider}
              </Badge>
              {account.warmupEnabled && (
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              )}
            </div>
          </div>
          <Badge className={cn("shrink-0 font-semibold", getTierBadgeColor(reputationTier))}>
            {reputationTier}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {account.currentSession ? (
          <>
            {/* Stage and Daily Limit */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {getStageIcon(account.warmupStage)}
                <span>{account.warmupStage}</span>
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">{account.dailyLimit}</span>
                <span className="text-muted-foreground"> /day</span>
              </div>
            </div>

            {/* Health Score Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Health Score</span>
                <span className="font-bold">{healthScore}%</span>
              </div>
              <Progress value={healthScore} className="h-2.5" />
            </div>

            {/* Email Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-muted-foreground font-medium">Sent</span>
                </div>
                <div className="text-2xl font-bold">{account.currentSession.emailsSent}</div>
              </div>
              <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs text-muted-foreground font-medium">Received</span>
                </div>
                <div className="text-2xl font-bold">{account.currentSession.emailsReceived}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => onPauseResume(account.id, account.warmupEnabled)}
                disabled={actionLoading === account.id}
              >
                {actionLoading === account.id ? (
                  "Loading..."
                ) : account.warmupEnabled ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Resume
                  </>
                )}
              </Button>
              <Button size="sm" className="flex-1 gap-2 group" asChild>
                <Link href={`dashboard/warmup/${account.id}`}>
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 p-4 bg-muted/20">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">Not enrolled in warmup</p>
            </div>
            <Button className="w-full gap-2" asChild>
              <Link href={`/dashboard/warmup/enroll?accountId=${account.id}`}>
                <Play className="h-4 w-4" />
                Start Warmup
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}