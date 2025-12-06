// "use client"

// import { useEffect, useState } from "react"
// import { useAuth } from "@clerk/nextjs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { TrendingUp, Users, DollarSign, Target, Plus, RefreshCw } from "lucide-react"
// import { CrmIntegrationSetup } from "@/components/crm/crm-integration-setup"
// import { CrmPipeline } from "@/components/crm/crm-pipeline"
// import { CrmLeadsList } from "@/components/crm/crm-leads-list"
// import { CrmDealScoring } from "@/components/crm/crm-deal-scoring"
// import { useToast } from "@/hooks/use-toast"

// export default function CrmPage() {
//   const { userId } = useAuth()
//   const { toast } = useToast()
//   const [integrationConnected, setIntegrationConnected] = useState(false)
//   const [stats, setStats] = useState({
//     totalLeads: 0,
//     hotLeads: 0,
//     pipelineValue: 0,
//     conversionRate: 0,
//   })
//   const [loading, setLoading] = useState(true)
//   const [syncing, setSyncing] = useState(false)

//   useEffect(() => {
//     checkIntegration()
//     loadStats()
//   }, [userId])

//   const checkIntegration = async () => {
//     try {
//       const response = await fetch("/api/integrations/crm/status")
//       const data = await response.json()
//       setIntegrationConnected(data.connected)
//     } catch (error) {
//       console.error("[builtbycashe] Error checking CRM integration:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadStats = async () => {
//     try {
//       const response = await fetch("/api/crm/stats")
//       const data = await response.json()
//       setStats(data)
//     } catch (error) {
//       console.error("[builtbycashe] Error loading CRM stats:", error)
//     }
//   }

//   const handleSync = async () => {
//     setSyncing(true)
//     try {
//       const response = await fetch("/api/integrations/crm/sync", { method: "POST" })
//       if (!response.ok) throw new Error("Sync failed")
//       await loadStats()
//       toast({ title: "Success", description: "CRM synced successfully" })
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to sync CRM", variant: "destructive" })
//     } finally {
//       setSyncing(false)
//     }
//   }

//   if (loading) {
//     return <div className="flex items-center justify-center h-96">Loading...</div>
//   }

//   if (!integrationConnected) {
//     return <CrmIntegrationSetup onSuccess={() => setIntegrationConnected(true)} />
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">CRM & Deal Intelligence</h1>
//           <p className="text-muted-foreground">AI-powered lead management synced from your CRM</p>
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={handleSync} disabled={syncing} variant="outline">
//             <RefreshCw className="h-4 w-4 mr-2" />
//             {syncing ? "Syncing..." : "Sync CRM"}
//           </Button>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Add Lead
//           </Button>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalLeads.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">From your CRM</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.hotLeads}</div>
//             <p className="text-xs text-muted-foreground">AI score &gt; 80</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">${(stats.pipelineValue / 1000).toFixed(0)}K</div>
//             <p className="text-xs text-muted-foreground">Weighted by AI score</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.conversionRate}%</div>
//             <p className="text-xs text-muted-foreground">Last 30 days</p>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="pipeline" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
//           <TabsTrigger value="leads">All Leads</TabsTrigger>
//           <TabsTrigger value="scoring">AI Deal Scoring</TabsTrigger>
//         </TabsList>

//         <TabsContent value="pipeline" className="space-y-4">
//           <CrmPipeline />
//         </TabsContent>

//         <TabsContent value="leads" className="space-y-4">
//           <CrmLeadsList />
//         </TabsContent>

//         <TabsContent value="scoring" className="space-y-4">
//           <CrmDealScoring />
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Target, Plus, RefreshCw, ArrowUpRight, ArrowDownRight, Sparkles, LayoutGrid, List, Brain } from 'lucide-react'
import { CrmIntegrationSetup } from "@/components/crm/crm-integration-setup"
import { CrmPipeline } from "@/components/crm/crm-pipeline"
import { CrmLeadsList } from "@/components/crm/crm-leads-list"
import { CrmDealScoring } from "@/components/crm/crm-deal-scoring"
import { useToast } from "@/hooks/use-toast"
import { AnimatedCounter } from "@/components/dashboard-stats/animated-counter"

export default function CrmPage() {
  const { userId } = useAuth()
  const { toast } = useToast()
  const [integrationConnected, setIntegrationConnected] = useState(false)
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    pipelineValue: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    checkIntegration()
    loadStats()
  }, [userId])

  const checkIntegration = async () => {
    try {
      const response = await fetch("/api/integrations/crm/status")
      const data = await response.json()
      setIntegrationConnected(data.connected)
    } catch (error) {
      console.error("[builtbycashe] Error checking CRM integration:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/crm/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("[builtbycashe] Error loading CRM stats:", error)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/integrations/crm/sync", { method: "POST" })
      if (!response.ok) throw new Error("Sync failed")
      await loadStats()
      toast({ title: "Success", description: "CRM synced successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to sync CRM", variant: "destructive" })
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading CRM...</p>
        </div>
      </div>
    )
  }

  if (!integrationConnected) {
    return <CrmIntegrationSetup onSuccess={() => setIntegrationConnected(true)} />
  }

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: Users,
      description: "From your CRM",
      trend: "+12%",
      trendUp: true,
      color: "from-blue-500/20 to-blue-600/5"
    },
    {
      title: "Hot Leads",
      value: stats.hotLeads,
      icon: TrendingUp,
      description: "AI score > 80",
      trend: "+8%",
      trendUp: true,
      color: "from-orange-500/20 to-orange-600/5"
    },
    {
      title: "Pipeline Value",
      value: stats.pipelineValue,
      icon: DollarSign,
      description: "Weighted by AI score",
      prefix: "$",
      suffix: "K",
      divisor: 1000,
      trend: "+23%",
      trendUp: true,
      color: "from-emerald-500/20 to-emerald-600/5"
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate,
      icon: Target,
      description: "Last 30 days",
      suffix: "%",
      trend: "-2%",
      trendUp: false,
      color: "from-purple-500/20 to-purple-600/5"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">CRM & Deal Intelligence</h1>
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">AI-powered lead management synced from your CRM</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing} variant="outline" className="shadow-sm bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "Syncing..." : "Sync CRM"}
          </Button>
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`
              group relative overflow-hidden
              bg-gradient-to-br ${stat.color}
              backdrop-blur-xl border-border/50
              hover:shadow-lg hover:shadow-foreground/[0.03]
              hover:-translate-y-0.5 transition-all duration-300
            `}>
              {/* Liquid glass effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30 shadow-sm">
                    <stat.icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  {stat.trend && (
                    <Badge 
                      variant="secondary" 
                      className={`
                        text-xs font-medium
                        ${stat.trendUp 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }
                      `}
                    >
                      {stat.trendUp ? (
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      )}
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="text-3xl font-bold tracking-tight">
                    {stat.prefix}
                    <AnimatedCounter 
                      value={stat.divisor ? Math.round(stat.value / stat.divisor) : stat.value} 
                    />
                    {stat.suffix}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="pipeline" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutGrid className="w-4 h-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="leads" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <List className="w-4 h-4 mr-2" />
            All Leads
          </TabsTrigger>
          <TabsTrigger value="scoring" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Deal Scoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <CrmPipeline />
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <CrmLeadsList />
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <CrmDealScoring />
        </TabsContent>
      </Tabs>
    </div>
  )
}
