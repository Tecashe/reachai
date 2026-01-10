// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { WaveLoader } from "@/components/loader/wave-loader"
// import { WarmupOverviewTab } from "./tabs/warmup-overview-tab"
// import { WarmupAccountsTab } from "./tabs/warmup-accounts-tab"
// import { WarmupNetworkTab } from "./tabs/warmup-network-tab"
// import { WarmupSettingsTab } from "./tabs/warmup-settings-tab"
// import { AddAccountModal } from "./modals/add-account-modal"
// import { Mail, TrendingUp, Activity, Shield, Plus, AlertTriangle, X } from "lucide-react"

// // Type definitions
// export interface EmailAccount {
//   id: string
//   email: string
//   provider: "gmail" | "outlook" | "yahoo" | "custom"
//   status: "active" | "paused" | "warming" | "issues" | "completed"
//   smtpConfig: {
//     host: string
//     port: number
//     username: string
//   }
//   imapConfig: {
//     host: string
//     port: number
//   }
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

// export interface NetworkHealth {
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

// interface AlertBanner {
//   id: string
//   type: "warning" | "error" | "info"
//   message: string
//   link?: string
// }

// export function ComprehensiveWarmupDashboard() {
//   const [accounts, setAccounts] = useState<EmailAccount[]>([])
//   const [networkHealth, setNetworkHealth] = useState<NetworkHealth | null>(null)
//   const [userTier, setUserTier] = useState<"FREE" | "STARTER" | "PRO" | "AGENCY">("FREE")
//   const [loading, setLoading] = useState(true)
//   const [addAccountOpen, setAddAccountOpen] = useState(false)
//   const [alerts, setAlerts] = useState<AlertBanner[]>([])

//   // Stats - Add default values to avoid undefined errors
//   const [stats, setStats] = useState({
//     activeAccounts: 0,
//     activeAccountsTrendValue: 0,
//     emailsSentToday: 0,
//     targetToday: 0,
//     avgInboxRate: 0,
//     networkHealthScore: 0,
//   })

//   const fetchAccounts = useCallback(async () => {
//     try {
//       const response = await fetch("/api/warmup/accounts")
//       if (!response.ok) throw new Error("Failed to fetch accounts")
//       const data = await response.json()

//       // Transform API data to EmailAccount format
//       const transformedAccounts: EmailAccount[] = (data.accounts || []).map((acc: any) => ({
//         id: acc.id,
//         email: acc.email,
//         provider: acc.provider || "custom",
//         status: acc.warmupEnabled ? (acc.warmupStage === "ESTABLISHED" ? "completed" : "warming") : "paused",
//         smtpConfig: {
//           host: acc.smtpHost || "",
//           port: acc.smtpPort || 587,
//           username: acc.smtpUsername || "",
//         },
//         imapConfig: {
//           host: acc.imapHost || "",
//           port: acc.imapPort || 993,
//         },
//         warmupConfig: {
//           startVolume: 5,
//           targetVolume: acc.warmupDailyLimit || 50,
//           currentVolume: acc.emailsSentToday || 0,
//           rampSpeed: "moderate" as const,
//           daysActive: acc.warmupStartDate
//             ? Math.floor((Date.now() - new Date(acc.warmupStartDate).getTime()) / (1000 * 60 * 60 * 24))
//             : 0,
//           scheduleEnabled: true,
//           weekendSending: false,
//         },
//         stats: {
//           emailsSentToday: acc.emailsSentToday || 0,
//           emailsSentTotal: acc.emailsSentTotal || 0,
//           inboxRate: acc.inboxPlacementRate || 95,
//           spamRate: acc.spamComplaintRate || 2,
//           reputationScore: acc.healthScore || 85,
//           openRate: acc.openRate || 65,
//           replyRate: acc.replyRate || 40,
//           trend: "stable" as const,
//         },
//         createdAt: new Date(acc.createdAt),
//         lastActivity: new Date(acc.updatedAt || acc.createdAt),
//       }))

//       setAccounts(transformedAccounts)

//       // Calculate stats
//       const activeAccounts = transformedAccounts.filter((a) => a.status !== "paused").length
//       const emailsSentToday = transformedAccounts.reduce((sum, a) => sum + a.stats.emailsSentToday, 0)
//       const targetToday = transformedAccounts.reduce((sum, a) => sum + a.warmupConfig.targetVolume, 0)
//       const avgInboxRate =
//         transformedAccounts.length > 0
//           ? Math.round(transformedAccounts.reduce((sum, a) => sum + a.stats.inboxRate, 0) / transformedAccounts.length)
//           : 0

//       setStats({
//         activeAccounts,
//         activeAccountsTrendValue: 0,
//         emailsSentToday,
//         targetToday,
//         avgInboxRate,
//         networkHealthScore: networkHealth?.score || 95,
//       })

//       // Check for alerts
//       const newAlerts: AlertBanner[] = []
//       transformedAccounts.forEach((acc) => {
//         if (acc.stats.inboxRate < 90) {
//           newAlerts.push({
//             id: `low-inbox-${acc.id}`,
//             type: "warning",
//             message: `${acc.email} has inbox rate below 90%`,
//             link: `/dashboard/warmup?account=${acc.id}`,
//           })
//         }
//         if (acc.status === "issues") {
//           newAlerts.push({
//             id: `issues-${acc.id}`,
//             type: "error",
//             message: `${acc.email} has authentication issues`,
//             link: `/dashboard/warmup?account=${acc.id}`,
//           })
//         }
//       })
//       setAlerts(newAlerts)
//     } catch (error) {
//       console.error("Error fetching accounts:", error)
//       toast.error("Failed to load warmup accounts")
//     }
//   }, [networkHealth?.score])

//   const fetchNetworkHealth = useCallback(async () => {
//     try {
//       const response = await fetch("/api/warmup/network")
//       if (!response.ok) throw new Error("Failed to fetch network health")
//       const data = await response.json()
//       setNetworkHealth({
//         score: data.score,
//         totalSize: data.totalSize,
//         composition: data.composition,
//         averageReputation: data.averageReputation,
//         lastUpdated: new Date(data.lastUpdated),
//       })
//       setStats((prev) => ({ ...prev, networkHealthScore: data.score }))
//     } catch (error) {
//       console.error("Error fetching network health:", error)
//     }
//   }, [])

//   const fetchUserTier = useCallback(async () => {
//     try {
//       const response = await fetch("/api/user/subscription")
//       if (response.ok) {
//         const data = await response.json()
//         setUserTier(data.tier || "FREE")
//       }
//     } catch (error) {
//       console.error("Error fetching user tier:", error)
//     }
//   }, [])

//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true)
//       await Promise.all([fetchAccounts(), fetchNetworkHealth(), fetchUserTier()])
//       setLoading(false)
//     }

//     loadData()

//     // Refresh data every 30 seconds
//     const interval = setInterval(() => {
//       fetchAccounts()
//       fetchNetworkHealth()
//     }, 30000)

//     return () => clearInterval(interval)
//   }, [fetchAccounts, fetchNetworkHealth, fetchUserTier])

//   const handleAccountUpdate = () => {
//     fetchAccounts()
//   }

//   const handleAddAccountSuccess = () => {
//     setAddAccountOpen(false)
//     fetchAccounts()
//     toast.success("Email account added successfully!")
//   }

//   const dismissAlert = (id: string) => {
//     setAlerts((prev) => prev.filter((a) => a.id !== id))
//   }

//   const getInboxRateColor = (rate: number) => {
//     if (rate >= 95) return "text-success"
//     if (rate >= 90) return "text-warning"
//     return "text-destructive"
//   }

//   const getHealthScoreGrade = (score: number) => {
//     if (score >= 95) return { grade: "A+", color: "text-success" }
//     if (score >= 90) return { grade: "A", color: "text-success" }
//     if (score >= 85) return { grade: "B+", color: "text-warning" }
//     if (score >= 80) return { grade: "B", color: "text-warning" }
//     return { grade: "C", color: "text-destructive" }
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 gap-4">
//         <WaveLoader color="bg-foreground" size="lg" speed="normal" />
//         <p className="text-muted-foreground text-sm">Loading warmup dashboard...</p>
//       </div>
//     )
//   }

//   const healthGrade = getHealthScoreGrade(stats.networkHealthScore)

//   return (
//     <div className="space-y-6">
//       {/* Alert Banners */}
//       {alerts.length > 0 && (
//         <div className="space-y-2">
//           {alerts.slice(0, 3).map((alert) => (
//             <div
//               key={alert.id}
//               className={`flex items-center justify-between p-3 rounded-lg border ${
//                 alert.type === "error"
//                   ? "bg-destructive/10 border-destructive/20 text-destructive"
//                   : alert.type === "warning"
//                     ? "bg-warning/10 border-warning/20 text-warning"
//                     : "bg-primary/10 border-primary/20 text-primary"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <AlertTriangle className="h-4 w-4" />
//                 <span className="text-sm font-medium">{alert.message}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 {alert.link && (
//                   <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
//                     <a href={alert.link}>View Details</a>
//                   </Button>
//                 )}
//                 <button onClick={() => dismissAlert(alert.id)} className="p-1 hover:bg-background/50 rounded">
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Top Stats Row */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="border-border">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Active Warmup Accounts</CardTitle>
//             <Mail className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-bold text-foreground">{stats.activeAccounts}</span>
//               <span className="text-sm text-muted-foreground">/ {accounts.length}</span>
//             </div>
//             <p className="text-xs text-muted-foreground mt-1">accounts warming up</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails Sent Today</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-bold text-foreground">{stats.emailsSentToday}</span>
//               <span className="text-sm text-muted-foreground">/ {stats.targetToday}</span>
//             </div>
//             <Progress
//               value={stats.targetToday > 0 ? (stats.emailsSentToday / stats.targetToday) * 100 : 0}
//               className="h-1.5 mt-2"
//             />
//           </CardContent>
//         </Card>

//         <Card className="border-border">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Average Inbox Rate</CardTitle>
//             <Activity className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <span className={`text-3xl font-bold ${getInboxRateColor(stats.avgInboxRate)}`}>
//                 {stats.avgInboxRate}%
//               </span>
//             </div>
//             <Badge
//               variant="outline"
//               className={`mt-2 ${stats.avgInboxRate >= 95 ? "border-success/30 text-success" : stats.avgInboxRate >= 90 ? "border-warning/30 text-warning" : "border-destructive/30 text-destructive"}`}
//             >
//               {stats.avgInboxRate >= 95 ? "Excellent" : stats.avgInboxRate >= 90 ? "Good" : "Needs Attention"}
//             </Badge>
//           </CardContent>
//         </Card>

//         <Card className="border-border">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Network Health Score</CardTitle>
//             <Shield className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-bold text-foreground">{stats.networkHealthScore}</span>
//               <span className="text-sm text-muted-foreground">/ 100</span>
//             </div>
//             <Badge variant="outline" className={`mt-2 ${healthGrade.color}`}>
//               Grade: {healthGrade.grade}
//             </Badge>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Tabs */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <div className="flex items-center justify-between">
//           <TabsList className="bg-muted/50">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
//             <TabsTrigger value="network">Network Insights</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>

//           <Button onClick={() => setAddAccountOpen(true)} className="gap-2">
//             <Plus className="h-4 w-4" />
//             Add Email Account
//           </Button>
//         </div>

//         <TabsContent value="overview">
//           <WarmupOverviewTab accounts={accounts} networkHealth={networkHealth} onRefresh={handleAccountUpdate} />
//         </TabsContent>

//         <TabsContent value="accounts">
//           <WarmupAccountsTab
//             accounts={accounts}
//             userTier={userTier}
//             onAccountUpdate={handleAccountUpdate}
//             onAddAccount={() => setAddAccountOpen(true)}
//           />
//         </TabsContent>

//         <TabsContent value="network">
//           <WarmupNetworkTab networkHealth={networkHealth} userTier={userTier} accounts={accounts} />
//         </TabsContent>

//         <TabsContent value="settings">
//           <WarmupSettingsTab userTier={userTier} onSettingsUpdate={handleAccountUpdate} />
//         </TabsContent>
//       </Tabs>

//       {/* Add Account Modal */}
//       <AddAccountModal
//         open={addAccountOpen}
//         onClose={() => setAddAccountOpen(false)}
//         onSuccess={handleAddAccountSuccess}
//         userTier={userTier}
//       />
//     </div>
//   )
// }

"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"
import { WarmupOverviewTab } from "./tabs/warmup-overview-tab"
import { WarmupAccountsTab } from "./tabs/warmup-accounts-tab"
import { WarmupNetworkTab } from "./tabs/warmup-network-tab"
import { WarmupSettingsTab } from "./tabs/warmup-settings-tab"
import { AddAccountModal } from "./modals/add-account-modal"
import { Mail, TrendingUp, Activity, Shield, Plus, AlertTriangle, X } from "lucide-react"

// Type definitions
export interface EmailAccount {
  id: string
  email: string
  provider: "gmail" | "outlook" | "yahoo" | "custom"
  status: "active" | "paused" | "warming" | "issues" | "completed"
  smtpConfig: {
    host: string
    port: number
    username: string
  }
  imapConfig: {
    host: string
    port: number
  }
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

export interface NetworkHealth {
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

interface AlertBanner {
  id: string
  type: "warning" | "error" | "info"
  message: string
  link?: string
}

export function ComprehensiveWarmupDashboard() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([])
  const [networkHealth, setNetworkHealth] = useState<NetworkHealth | null>(null)
  const [userTier, setUserTier] = useState<"FREE" | "STARTER" | "PRO" | "AGENCY">("FREE")
  const [loading, setLoading] = useState(true)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [alerts, setAlerts] = useState<AlertBanner[]>([])

  // Stats - Add default values to avoid undefined errors
  const [stats, setStats] = useState({
    activeAccounts: 0,
    activeAccountsTrendValue: 0,
    emailsSentToday: 0,
    targetToday: 0,
    avgInboxRate: 0,
    networkHealthScore: 0,
  })

  const fetchAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/warmup/accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")
      const data = await response.json()

      // Transform API data to EmailAccount format
      const transformedAccounts: EmailAccount[] = (data.accounts || []).map((acc: any) => ({
        id: acc.id,
        email: acc.email,
        provider: acc.provider || "custom",
        status: acc.warmupEnabled ? (acc.warmupStage === "ESTABLISHED" ? "completed" : "warming") : "paused",
        smtpConfig: {
          host: acc.smtpHost || "",
          port: acc.smtpPort || 587,
          username: acc.smtpUsername || "",
        },
        imapConfig: {
          host: acc.imapHost || "",
          port: acc.imapPort || 993,
        },
        warmupConfig: {
          startVolume: 5,
          targetVolume: acc.warmupDailyLimit || 50,
          currentVolume: acc.emailsSentToday || 0,
          rampSpeed: "moderate" as const,
          daysActive: acc.warmupStartDate
            ? Math.floor((Date.now() - new Date(acc.warmupStartDate).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
          scheduleEnabled: true,
          weekendSending: false,
        },
        stats: {
          emailsSentToday: acc.emailsSentToday || 0,
          emailsSentTotal: acc.emailsSentTotal || 0,
          inboxRate: acc.inboxPlacementRate || 95,
          spamRate: acc.spamComplaintRate || 2,
          reputationScore: acc.healthScore || 85,
          openRate: acc.openRate || 65,
          replyRate: acc.replyRate || 40,
          trend: "stable" as const,
        },
        createdAt: new Date(acc.createdAt),
        lastActivity: new Date(acc.updatedAt || acc.createdAt),
      }))

      setAccounts(transformedAccounts)

      // Calculate stats
      const activeAccounts = transformedAccounts.filter((a) => a.status !== "paused").length
      const emailsSentToday = transformedAccounts.reduce((sum, a) => sum + a.stats.emailsSentToday, 0)
      const targetToday = transformedAccounts.reduce((sum, a) => sum + a.warmupConfig.targetVolume, 0)
      const avgInboxRate =
        transformedAccounts.length > 0
          ? Math.round(transformedAccounts.reduce((sum, a) => sum + a.stats.inboxRate, 0) / transformedAccounts.length)
          : 0

      setStats({
        activeAccounts,
        activeAccountsTrendValue: 0,
        emailsSentToday,
        targetToday,
        avgInboxRate,
        networkHealthScore: networkHealth?.score || 0,
      })

      // Check for alerts
      const newAlerts: AlertBanner[] = []
      transformedAccounts.forEach((acc) => {
        if (acc.stats.inboxRate < 90) {
          newAlerts.push({
            id: `low-inbox-${acc.id}`,
            type: "warning",
            message: `${acc.email} has inbox rate below 90%`,
            link: `/dashboard/warmup?account=${acc.id}`,
          })
        }
        if (acc.status === "issues") {
          newAlerts.push({
            id: `issues-${acc.id}`,
            type: "error",
            message: `${acc.email} has authentication issues`,
            link: `/dashboard/warmup?account=${acc.id}`,
          })
        }
      })
      setAlerts(newAlerts)
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast.error("Failed to load warmup accounts")
    }
  }, [networkHealth?.score])

  const fetchNetworkHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/warmup/network")
      if (!response.ok) throw new Error("Failed to fetch network health")
      const data = await response.json()
      setNetworkHealth({
        score: data.score,
        totalSize: data.totalSize,
        composition: data.composition,
        averageReputation: data.averageReputation,
        lastUpdated: new Date(data.lastUpdated),
      })
      setStats((prev) => ({ ...prev, networkHealthScore: data.score }))
    } catch (error) {
      console.error("Error fetching network health:", error)
    }
  }, [])

  const fetchUserTier = useCallback(async () => {
    try {
      const response = await fetch("/api/user/subscription")
      if (response.ok) {
        const data = await response.json()
        setUserTier(data.tier || "FREE")
      }
    } catch (error) {
      console.error("Error fetching user tier:", error)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchAccounts(), fetchNetworkHealth(), fetchUserTier()])
      setLoading(false)
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchAccounts()
      fetchNetworkHealth()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchAccounts, fetchNetworkHealth, fetchUserTier])

  const handleAccountUpdate = () => {
    fetchAccounts()
  }

  const handleAddAccountSuccess = () => {
    setAddAccountOpen(false)
    fetchAccounts()
    toast.success("Email account added successfully!")
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  const getInboxRateColor = (rate: number) => {
    if (rate >= 95) return "text-success"
    if (rate >= 90) return "text-warning"
    return "text-destructive"
  }

  const getHealthScoreGrade = (score: number) => {
    if (score >= 95) return { grade: "A+", color: "text-success" }
    if (score >= 90) return { grade: "A", color: "text-success" }
    if (score >= 85) return { grade: "B+", color: "text-warning" }
    if (score >= 80) return { grade: "B", color: "text-warning" }
    return { grade: "C", color: "text-destructive" }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WaveLoader color="bg-foreground" size="lg" speed="normal" />
        <p className="text-muted-foreground text-sm">Loading warmup dashboard...</p>
      </div>
    )
  }

  const healthGrade = getHealthScoreGrade(stats.networkHealthScore)

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                alert.type === "error"
                  ? "bg-destructive/10 border-destructive/20 text-destructive"
                  : alert.type === "warning"
                    ? "bg-warning/10 border-warning/20 text-warning"
                    : "bg-primary/10 border-primary/20 text-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
              <div className="flex items-center gap-2">
                {alert.link && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                    <a href={alert.link}>View Details</a>
                  </Button>
                )}
                <button onClick={() => dismissAlert(alert.id)} className="p-1 hover:bg-background/50 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Warmup Accounts</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{stats.activeAccounts}</span>
              <span className="text-sm text-muted-foreground">/ {accounts.length}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">accounts warming up</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails Sent Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{stats.emailsSentToday}</span>
              <span className="text-sm text-muted-foreground">/ {stats.targetToday}</span>
            </div>
            <Progress
              value={stats.targetToday > 0 ? (stats.emailsSentToday / stats.targetToday) * 100 : 0}
              className="h-1.5 mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Inbox Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getInboxRateColor(stats.avgInboxRate)}`}>
                {stats.avgInboxRate}%
              </span>
            </div>
            <Badge
              variant="outline"
              className={`mt-2 ${stats.avgInboxRate >= 95 ? "border-success/30 text-success" : stats.avgInboxRate >= 90 ? "border-warning/30 text-warning" : "border-destructive/30 text-destructive"}`}
            >
              {stats.avgInboxRate >= 95 ? "Excellent" : stats.avgInboxRate >= 90 ? "Good" : "Needs Attention"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network Health Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{stats.networkHealthScore}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Badge variant="outline" className={`mt-2 ${healthGrade.color}`}>
              Grade: {healthGrade.grade}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
            <TabsTrigger value="network">Network Insights</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <Button onClick={() => setAddAccountOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Email Account
          </Button>
        </div>

        <TabsContent value="overview">
          <WarmupOverviewTab accounts={accounts} networkHealth={networkHealth} onRefresh={handleAccountUpdate} />
        </TabsContent>

        <TabsContent value="accounts">
          <WarmupAccountsTab
            accounts={accounts}
            userTier={userTier}
            onAccountUpdate={handleAccountUpdate}
            onAddAccount={() => setAddAccountOpen(true)}
          />
        </TabsContent>

        <TabsContent value="network">
          <WarmupNetworkTab networkHealth={networkHealth} userTier={userTier} accounts={accounts} />
        </TabsContent>

        <TabsContent value="settings">
          <WarmupSettingsTab userTier={userTier} onSettingsUpdate={handleAccountUpdate} />
        </TabsContent>
      </Tabs>

      {/* Add Account Modal */}
      <AddAccountModal
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onSuccess={handleAddAccountSuccess}
        userTier={userTier}
      />
    </div>
  )
}
