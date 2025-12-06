"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SendingAccount {
  id: string
  name: string
  email: string
  isActive: boolean
  healthScore: number
  warmupStage: string
  utilization: number
}

interface SendingAccountsHealthProps {
  accounts: SendingAccount[]
  warmupStages: Array<{ name: string; value: number }>
}

const WARMUP_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: "New", color: "bg-muted text-muted-foreground" },
  WARMING: { label: "Warming", color: "bg-chart-1/10 text-chart-1" },
  WARM: { label: "Warm", color: "bg-chart-3/10 text-chart-3" },
  ACTIVE: { label: "Active", color: "bg-chart-2/10 text-chart-2" },
  ESTABLISHED: { label: "Established", color: "bg-foreground/10 text-foreground" },
}

export function SendingAccountsHealth({ accounts, warmupStages }: SendingAccountsHealthProps) {
  if (accounts.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Server className="h-4 w-4" />
            </div>
            Sending Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Server className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No sending accounts configured</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add a sending account to start outreach</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
    >
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Server className="h-4 w-4" />
            </div>
            Sending Accounts Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Warmup stage summary - horizontal pills */}
          <div className="flex flex-wrap gap-2 mb-6 p-4 rounded-xl bg-foreground/[0.02] border border-border/30">
            {warmupStages.map((stage) => {
              const config = WARMUP_LABELS[stage.name] || WARMUP_LABELS.NEW
              return (
                <div
                  key={stage.name}
                  className={cn("px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2", config.color)}
                >
                  <span className="text-lg font-bold">{stage.value}</span>
                  <span className="text-xs opacity-80">{config.label}</span>
                </div>
              )
            })}
          </div>

          {/* Account list with enhanced styling */}
          <div className="space-y-3">
            {accounts.slice(0, 5).map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-xl border border-border/50 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-all duration-200 hover:shadow-md hover:shadow-foreground/[0.02] group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full shadow-sm",
                          account.isActive ? "bg-chart-2" : "bg-muted-foreground/30",
                        )}
                      />
                      {account.isActive && (
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-chart-2 animate-ping opacity-30" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{account.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 shadow-sm",
                      WARMUP_LABELS[account.warmupStage]?.color || "bg-muted text-muted-foreground",
                    )}
                  >
                    {WARMUP_LABELS[account.warmupStage]?.label || account.warmupStage}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Health Score</span>
                      <span
                        className={cn(
                          "font-semibold",
                          account.healthScore >= 80
                            ? "text-chart-2"
                            : account.healthScore >= 50
                              ? "text-chart-3"
                              : "text-destructive",
                        )}
                      >
                        {account.healthScore}%
                      </span>
                    </div>
                    <Progress value={account.healthScore} className="h-1.5 bg-foreground/5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Daily Usage</span>
                      <span className="font-semibold text-foreground">{account.utilization}%</span>
                    </div>
                    <Progress value={account.utilization} className="h-1.5 bg-foreground/5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
