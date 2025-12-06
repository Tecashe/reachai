"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

const WARMUP_LABELS: Record<string, string> = {
  NEW: "New",
  WARMING: "Warming",
  WARM: "Warm",
  ACTIVE: "Active",
  ESTABLISHED: "Established",
}

export function SendingAccountsHealth({ accounts, warmupStages }: SendingAccountsHealthProps) {
  if (accounts.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Server className="h-5 w-5" />
            Sending Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No sending accounts configured</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add a sending account to start outreach</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Server className="h-5 w-5" />
          Sending Accounts Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Warmup stage summary */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {warmupStages.map((stage) => (
            <div key={stage.name} className="p-3 rounded-xl bg-foreground/[0.02] border border-border/50 text-center">
              <p className="text-lg font-bold text-foreground">{stage.value}</p>
              <p className="text-xs text-muted-foreground">{WARMUP_LABELS[stage.name] || stage.name}</p>
            </div>
          ))}
        </div>

        {/* Account list */}
        <div className="space-y-3">
          {accounts.slice(0, 5).map((account) => (
            <div
              key={account.id}
              className="p-4 rounded-xl border border-border/50 bg-foreground/[0.01] hover:bg-foreground/[0.03] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${account.isActive ? "bg-chart-2" : "bg-muted-foreground"}`} />
                  <div>
                    <p className="font-medium text-foreground text-sm">{account.name}</p>
                    <p className="text-xs text-muted-foreground">{account.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-foreground/5 text-foreground/70 border-0">
                  {WARMUP_LABELS[account.warmupStage] || account.warmupStage}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className="font-medium text-foreground">{account.healthScore}%</span>
                  </div>
                  <Progress value={account.healthScore} className="h-1.5 bg-foreground/10" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Daily Usage</span>
                    <span className="font-medium text-foreground">{account.utilization}%</span>
                  </div>
                  <Progress value={account.utilization} className="h-1.5 bg-foreground/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
