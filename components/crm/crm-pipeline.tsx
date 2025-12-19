

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PipelineStage {
  name: string
  count: number
  value: number
}

interface HotDeal {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  company: string | null
  dealScore: number | null
  crmSyncedAt: Date | null
}

export function CrmPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [deals, setDeals] = useState<HotDeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [pipelineRes, dealsRes] = await Promise.all([fetch("/api/crm/pipeline"), fetch("/api/crm/deals?limit=5")])

        const pipelineData = await pipelineRes.json()
        const dealsData = await dealsRes.json()

        if (pipelineData.success && pipelineData.data) {
          setStages(pipelineData.data)
        }
        if (dealsData.success && dealsData.data) {
          setDeals(dealsData.data)
        }
      } catch (error) {
        console.error("[CRM Pipeline] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalValue = stages.reduce((sum, s) => sum + s.value, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-[200px] flex-shrink-0" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pipeline stages */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4 min-w-max">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-[200px] flex-shrink-0"
            >
              <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:shadow-foreground/[0.02] transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stage.name}</p>
                    <div className="w-2 h-2 rounded-full bg-foreground/30" />
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-muted/50 mb-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/50"
                      initial={{ width: 0 }}
                      animate={{ width: totalValue > 0 ? `${(stage.value / totalValue) * 100}%` : "0%" }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    />
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stage.count}</p>
                      <p className="text-xs text-muted-foreground">leads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${(stage.value / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Hot Deals */}
      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-foreground/70" />
              Hot Deals
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">AI Score &gt; 70</p>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hot deals yet. Sync your CRM to see leads with high AI scores.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {deals.map((deal, index) => {
                const name = [deal.firstName, deal.lastName].filter(Boolean).join(" ") || deal.email
                const initials =
                  deal.firstName && deal.lastName
                    ? `${deal.firstName[0]}${deal.lastName[0]}`
                    : deal.email.substring(0, 2).toUpperCase()
                const lastActivity = deal.crmSyncedAt ? new Date(deal.crmSyncedAt).toLocaleDateString() : "Never"

                return (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-center justify-between p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                        <AvatarFallback className="bg-foreground/5 text-foreground font-medium">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{deal.company || "Unknown Company"}</p>
                        <p className="text-sm text-muted-foreground">{name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{lastActivity}</span>
                        </div>
                      </div>

                      <Badge className="bg-foreground/10 text-foreground border-foreground/20 font-semibold">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {deal.dealScore || 0}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
