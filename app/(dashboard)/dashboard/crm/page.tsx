"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, DollarSign, Target, Plus, RefreshCw } from "lucide-react"
import { CrmIntegrationSetup } from "@/components/crm/crm-integration-setup"
import { CrmPipeline } from "@/components/crm/crm-pipeline"
import { CrmLeadsList } from "@/components/crm/crm-leads-list"
import { CrmDealScoring } from "@/components/crm/crm-deal-scoring"
import { useToast } from "@/hooks/use-toast"

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
    return <div className="flex items-center justify-center h-96">Loading...</div>
  }

  if (!integrationConnected) {
    return <CrmIntegrationSetup onSuccess={() => setIntegrationConnected(true)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM & Deal Intelligence</h1>
          <p className="text-muted-foreground">AI-powered lead management synced from your CRM</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSync} disabled={syncing} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {syncing ? "Syncing..." : "Sync CRM"}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From your CRM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hotLeads}</div>
            <p className="text-xs text-muted-foreground">AI score &gt; 80</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.pipelineValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Weighted by AI score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="leads">All Leads</TabsTrigger>
          <TabsTrigger value="scoring">AI Deal Scoring</TabsTrigger>
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
