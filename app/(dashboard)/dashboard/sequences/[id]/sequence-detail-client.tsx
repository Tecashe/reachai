"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { SequenceFlowVisualization } from "@/components/sequences/sequence-flow-visualization"
import { SequenceMonitoringStats } from "@/components/sequences/sequence-monitoring-stats"
import { AdvancedSequenceBuilder } from "@/components/sequences/advanced-sequence-builder"
import { AddStepDialog } from "@/components/sequences/add-step-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  GitBranch,
  Workflow,
  Zap,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SequenceDetailClientProps {
  campaign: {
    id: string
    name: string
    status: string
    emailSequences: Array<{
      id: string
      stepNumber: number
      delayDays: number
      sendOnlyIfNotReplied: boolean
      sendOnlyIfNotOpened: boolean
      template: {
        id: string
        name: string
        subject: string
        body: string
      }
    }>
  }
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

export function SequenceDetailClient({ campaign, scheduleStats, prospectsByStep }: SequenceDetailClientProps) {
  const router = useRouter()
  const [showAddStep, setShowAddStep] = useState(false)
  const [insertAfterStep, setInsertAfterStep] = useState<number | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("flow")

  const isActive = campaign.status === "ACTIVE"
  const totalProspects = scheduleStats.reduce((sum, stat) => sum + stat._count, 0)

  const handleAddStep = (afterStepIndex?: number) => {
    setInsertAfterStep(afterStepIndex)
    setShowAddStep(true)
  }

  const handleStepAdded = () => {
    router.refresh()
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background via-background to-muted/30 border shadow-xl shadow-black/5"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="relative p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left side - Title and info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/sequences">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight">{campaign.name}</h1>
                    <Badge
                      className={cn(
                        "h-7 px-3 text-sm font-semibold",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
                        )}
                      />
                      {isActive ? "Active" : campaign.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Multi-step email sequence for targeted outreach</p>
                </div>
              </div>

              {/* Quick Stats Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{campaign.emailSequences.length}</span>
                  <span className="text-muted-foreground text-sm">steps</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">{totalProspects}</span>
                  <span className="text-muted-foreground text-sm">prospects</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold">45%</span>
                  <span className="text-muted-foreground text-sm">avg. open rate</span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" className="gap-2 h-12 px-5 rounded-xl bg-background hover:bg-muted">
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause Sequence
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Activate
                  </>
                )}
              </Button>
              <Button
                size="lg"
                onClick={() => handleAddStep()}
                className="gap-2 h-12 px-5 rounded-xl shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <Settings className="h-4 w-4" />
                    Sequence Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <GitBranch className="h-4 w-4" />
                    Duplicate Sequence
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 rounded-lg">
                    <TrendingUp className="h-4 w-4" />
                    Export Analytics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 rounded-lg text-destructive focus:text-destructive">
                    Delete Sequence
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <SequenceMonitoringStats scheduleStats={scheduleStats} prospectsByStep={prospectsByStep} />

      {/* Tabs Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="h-14 p-1.5 bg-muted/50 rounded-2xl inline-flex">
            <TabsTrigger
              value="flow"
              className="gap-2 h-full px-6 rounded-xl data-[state=active]:shadow-lg data-[state=active]:bg-background"
            >
              <Workflow className="h-4 w-4" />
              Sequence Flow
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className="gap-2 h-full px-6 rounded-xl data-[state=active]:shadow-lg data-[state=active]:bg-background"
            >
              <Zap className="h-4 w-4" />
              Automation Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-8">
            <SequenceFlowVisualization
              sequences={campaign.emailSequences}
              campaignName={campaign.name}
              onAddStep={handleAddStep}
              onEditStep={(id) => {
                // TODO: Implement edit step
                console.log("Edit step:", id)
              }}
              onDeleteStep={(id) => {
                // TODO: Implement delete step
                console.log("Delete step:", id)
              }}
              onDuplicateStep={(id) => {
                // TODO: Implement duplicate step
                console.log("Duplicate step:", id)
              }}
            />
          </TabsContent>

          <TabsContent value="automation" className="mt-8">
            <AdvancedSequenceBuilder campaignId={campaign.id} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Add Step Dialog */}
      <AddStepDialog
        open={showAddStep}
        onOpenChange={setShowAddStep}
        campaignId={campaign.id}
        afterStepNumber={insertAfterStep}
        onStepAdded={handleStepAdded}
      />
    </div>
  )
}
