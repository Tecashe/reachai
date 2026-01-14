
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  LayoutGrid,
  List,
  Brain,
  CheckCircle2,
  Settings,
  Rocket,
} from "lucide-react"
import { CrmIntegrationSetup } from "@/components/crm/crm-integration-setup"
import { CrmPipeline } from "@/components/crm/crm-pipeline"
import { CrmLeadsList } from "@/components/crm/crm-leads-list"
import { CrmDealScoring } from "@/components/crm/crm-deal-scoring"
import { useToast } from "@/hooks/use-toast"
import { AnimatedCounter } from "@/components/dashboard-stats/animated-counter"
import Image from "next/image"
import { WaveLoader } from "@/components/loader/wave-loader"

interface CRMStats {
  totalLeads: number
  hotLeads: number
  pipelineValue: number
  conversionRate: number
}

interface ConnectedCRM {
  type: string
  name: string
  lastSyncedAt: string | null
}

const crmLogos: Record<string, string> = {
  HUBSPOT: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  SALESFORCE:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
  PIPEDRIVE: "https://www.pipedrive.com/favicon.ico",
}

const crmNames: Record<string, string> = {
  HUBSPOT: "HubSpot",
  SALESFORCE: "Salesforce",
  PIPEDRIVE: "Pipedrive",
}

export default function CrmPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [integrationConnected, setIntegrationConnected] = useState<boolean | null>(null)
  const [connectedCRM, setConnectedCRM] = useState<ConnectedCRM | null>(null)
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    hotLeads: 0,
    pipelineValue: 0,
    conversionRate: 0,
  })
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success === "connected") {
      toast({ title: "Success", description: "CRM connected successfully!" })
      setIntegrationConnected(true)
      checkIntegration()
    } else if (error) {
      const errorMessages: Record<string, string> = {
        oauth_denied: "OAuth authorization was denied",
        missing_params: "Missing OAuth parameters",
        user_not_found: "User not found",
        invalid_crm: "Invalid CRM type",
        connection_failed: "CRM connection failed",
      }
      toast({
        title: "Error",
        description: errorMessages[error] || "An error occurred",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  useEffect(() => {
    checkIntegration()
    loadStats()
  }, [])

  const checkIntegration = async () => {
    try {
      const response = await fetch("/api/integrations/crm/status")
      const data = await response.json()
      setIntegrationConnected(data.connected)
      if (data.integration) {
        setConnectedCRM(data.integration)
      }
    } catch (error) {
      console.error("[CRM] Error checking integration:", error)
      setIntegrationConnected(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/crm/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("[CRM] Error loading stats:", error)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/integrations/crm/sync", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        await loadStats()
        toast({
          title: "Sync Complete",
          description: `Synced ${data.leadsSynced || 0} leads and scored ${data.dealsScored || 0} deals`,
        })
      } else {
        throw new Error(data.error || "Sync failed")
      }
    } catch (error) {
      console.error("[CRM] Sync error:", error)
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync CRM",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  if (integrationConnected === null) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
           <WaveLoader size="sm" bars={8} gap="tight" />
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
    },
    {
      title: "Hot Leads",
      value: stats.hotLeads,
      icon: TrendingUp,
      description: "AI score > 70",
      trend: "+8%",
      trendUp: true,
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
    },
    {
      title: "Conversion Rate",
      value: stats.conversionRate,
      icon: Target,
      description: "Replied leads",
      suffix: "%",
      trend: "-2%",
      trendUp: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">CRM & Deal Intelligence</h1>
            <Badge variant="outline" className="bg-foreground/5 border-foreground/10">
              <Rocket size={60} color="#e6e6ea" absoluteStrokeWidth />
              AI Powered
            </Badge>
          </div>
          <p className="text-muted-foreground">AI-powered lead management synced from your CRM</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing} variant="outline" className="shadow-sm bg-transparent">
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync CRM"}
          </Button>
          <Button className="shadow-lg shadow-foreground/5">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {connectedCRM && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg shadow-foreground/[0.02]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center overflow-hidden shadow-sm">
                    <Image
                      src={crmLogos[connectedCRM.type] || "/placeholder.svg?height=32&width=32"}
                      alt={crmNames[connectedCRM.type] || "CRM"}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {crmNames[connectedCRM.type] || connectedCRM.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {connectedCRM.lastSyncedAt
                        ? `Last synced ${new Date(connectedCRM.lastSyncedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Never synced"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    toast({
                      title: "Manage CRM",
                      description: "CRM management options coming soon",
                    })
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:shadow-foreground/[0.03] hover:-translate-y-0.5 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardContent className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-foreground/5 backdrop-blur-sm border border-border/30 shadow-sm">
                    <stat.icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  {stat.trend && (
                    <Badge
                      variant="secondary"
                      className={`text-xs font-medium ${
                        stat.trendUp ? "bg-foreground/10 text-foreground" : "bg-foreground/5 text-muted-foreground"
                      }`}
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
                    <AnimatedCounter value={stat.divisor ? Math.round(stat.value / stat.divisor) : stat.value} />
                    {stat.suffix}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
