// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Activity, Mail, TrendingUp, CheckCircle2, Plus, Users } from "lucide-react"
// import { AccountCard } from "@/components/warmup/account-card"
// import { StatsOverview } from "@/components/warmup/stats-overview"

// interface WarmupAccount {
//   id: string
//   email: string
//   provider: string
//   status: string
//   dailyLimit: number
//   warmupEnabled: boolean
//   createdAt: string
//   profile: {
//     reputationTier: string
//     riskScore: number
//     warmupStage: string
//     recommendedDailyLimit: number
//   }
//   currentSession: {
//     id: string
//     stage: string
//     emailsSent: number
//     emailsReceived: number
//     startedAt: string
//     lastActivityAt: string
//   } | null
//   recentMetrics: Array<{
//     date: string
//     deliveryRate: number
//     openRate: number
//     replyRate: number
//     bounceRate: number
//     spamRate: number
//     healthScore: number
//   }>
//   totalEmails: number
// }

// export default function WarmupDashboard() {
//   const [accounts, setAccounts] = useState<WarmupAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [actionLoading, setActionLoading] = useState<string | null>(null)

//   // Mock user ID - replace with actual auth
//   const userId = "user_123"

//   useEffect(() => {
//     fetchAccounts()
//   }, [])

//   const fetchAccounts = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(`/api/warmup/accounts?userId=${userId}`)
//       const data = await response.json()
//       setAccounts(data.accounts)
//     } catch (error) {
//       console.error("Failed to fetch accounts:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePauseResume = async (accountId: string, isActive: boolean) => {
//     try {
//       setActionLoading(accountId)
//       const endpoint = isActive ? "/api/warmup/pause" : "/api/warmup/resume"
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ accountId, userId }),
//       })

//       if (response.ok) {
//         await fetchAccounts()
//       }
//     } catch (error) {
//       console.error("Failed to pause/resume warmup:", error)
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   const getTierColor = (tier: string) => {
//     switch (tier) {
//       case "PRISTINE":
//         return "bg-success text-success-foreground"
//       case "EXCELLENT":
//         return "bg-chart-2 text-white"
//       case "GOOD":
//         return "bg-chart-3 text-white"
//       case "FAIR":
//         return "bg-warning text-warning-foreground"
//       case "CRITICAL":
//         return "bg-destructive text-destructive-foreground"
//       default:
//         return "bg-muted text-muted-foreground"
//     }
//   }

//   const getStageIcon = (stage: string) => {
//     switch (stage) {
//       case "INITIAL":
//         return <Activity className="h-4 w-4" />
//       case "BUILDING":
//         return <TrendingUp className="h-4 w-4" />
//       case "ESTABLISHED":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "MATURE":
//         return <Mail className="h-4 w-4" />
//       default:
//         return <Activity className="h-4 w-4" />
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background p-4 md:p-8">
//         <div className="mx-auto max-w-7xl space-y-8">
//           <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
//         <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div className="space-y-1">
//               <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
//                 Email Warmup
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 Monitor and optimize your email deliverability across all accounts
//               </p>
//             </div>
//             <Button size="lg" className="gap-2 shadow-lg">
//               <Plus className="h-4 w-4" />
//               Add Account
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
//         {accounts.length > 0 && (
//           <StatsOverview
//             stats={[
//               {
//                 label: "Total Accounts",
//                 value: accounts.length,
//                 change: 12,
//                 trend: "up",
//                 icon: <Users className="h-4 w-4 text-primary" />,
//                 color: "from-blue-500/5 to-cyan-500/5",
//               },
//               {
//                 label: "Active Warmups",
//                 value: accounts.filter((a) => a.warmupEnabled).length,
//                 icon: <Activity className="h-4 w-4 text-primary" />,
//                 color: "from-emerald-500/5 to-teal-500/5",
//               },
//               {
//                 label: "Total Emails Sent",
//                 value: accounts.reduce((sum, a) => sum + (a.currentSession?.emailsSent || 0), 0),
//                 change: 8,
//                 trend: "up",
//                 icon: <Mail className="h-4 w-4 text-primary" />,
//                 color: "from-purple-500/5 to-indigo-500/5",
//               },
//               {
//                 label: "Avg Health Score",
//                 value: `${Math.round(accounts.reduce((sum, a) => sum + a.profile.riskScore, 0) / accounts.length)}%`,
//                 change: 5,
//                 trend: "up",
//                 icon: <TrendingUp className="h-4 w-4 text-primary" />,
//                 color: "from-amber-500/5 to-orange-500/5",
//               },
//             ]}
//           />
//         )}

//         {accounts.length === 0 ? (
//           <Card className="border-dashed border-2 glass-effect">
//             <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="rounded-full bg-primary/10 p-4 mb-4">
//                 <Mail className="h-12 w-12 text-primary" />
//               </div>
//               <h3 className="mb-2 text-2xl font-bold">No accounts yet</h3>
//               <p className="mb-6 text-muted-foreground max-w-sm">
//                 Connect your first email account to start building reputation and improving deliverability
//               </p>
//               <Button size="lg" className="gap-2 shadow-lg">
//                 <Plus className="h-4 w-4" />
//                 Add Your First Account
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
//             {accounts.map((account) => (
//               <AccountCard
//                 key={account.id}
//                 account={account}
//                 onPauseResume={handlePauseResume}
//                 actionLoading={actionLoading}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Mail, TrendingUp, Users, Plus } from "lucide-react"
import { AccountCard } from "@/components/warmup/account-card"
import { StatsOverview } from "@/components/warmup/stats-overview"

interface WarmupAccount {
  id: string
  email: string
  provider: string
  isActive: boolean
  dailyLimit: number
  warmupEnabled: boolean
  warmupStage: string
  createdAt: string
  profile: {
    reputationTier: string
    riskScore: number
  }
  currentSession: {
    id: string
    emailsSent: number
    emailsReceived: number
    startedAt: string
  } | null
  totalEmails: number
}

export default function WarmupDashboard() {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [accounts, setAccounts] = useState<WarmupAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetchAccounts()
    }
  }, [user])

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

  const fetchAccounts = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/warmup/accounts?userId=${user.id}`)
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const handlePauseResume = async (accountId: string, isActive: boolean) => {
    if (!user?.id) return

    try {
      setActionLoading(accountId)
      const endpoint = isActive ? "/api/warmup/pause" : "/api/warmup/resume"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, userId: user.id }),
      })

      if (response.ok) {
        await fetchAccounts()
      } else {
        console.error("Failed to pause/resume:", await response.text())
      }
    } catch (error) {
      console.error("Failed to pause/resume warmup:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeAccounts = accounts.filter((a) => a.warmupEnabled)
  const totalEmailsSent = accounts.reduce((sum, a) => sum + (a.currentSession?.emailsSent || 0), 0)
  const avgHealthScore =
    accounts.length > 0 ? Math.round(accounts.reduce((sum, a) => sum + (100 - a.profile.riskScore), 0) / accounts.length) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Email Warmup
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor and optimize your email deliverability across all accounts
              </p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
        {accounts.length > 0 && (
          <StatsOverview
            stats={[
              {
                label: "Total Accounts",
                value: accounts.length,
                icon: <Users className="h-4 w-4 text-primary" />,
                color: "from-blue-500/5 to-cyan-500/5",
              },
              {
                label: "Active Warmups",
                value: activeAccounts.length,
                icon: <Activity className="h-4 w-4 text-primary" />,
                color: "from-emerald-500/5 to-teal-500/5",
              },
              {
                label: "Total Emails Sent",
                value: totalEmailsSent,
                icon: <Mail className="h-4 w-4 text-primary" />,
                color: "from-purple-500/5 to-indigo-500/5",
              },
              {
                label: "Avg Health Score",
                value: `${avgHealthScore}%`,
                icon: <TrendingUp className="h-4 w-4 text-primary" />,
                color: "from-amber-500/5 to-orange-500/5",
              },
            ]}
          />
        )}

        {accounts.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-2xl font-bold">No accounts yet</h3>
              <p className="mb-6 text-muted-foreground max-w-sm">
                Connect your first email account to start building reputation and improving deliverability
              </p>
              <Button size="lg" className="gap-2 shadow-lg">
                <Plus className="h-4 w-4" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onPauseResume={handlePauseResume}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}










