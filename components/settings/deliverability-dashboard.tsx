"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, TrendingUp, Mail, Shield, Zap } from "lucide-react"
import { WaveLoader } from "../loader/wave-loader"

interface AccountHealth {
  id: string
  email: string
  healthScore: number
  warmupStage: string
  bounceRate: number
  replyRate: number
  openRate: number
  isActive: boolean
  dailyLimit: number
  emailsSentToday: number
}

export function DeliverabilityDashboard() {
  const [accounts, setAccounts] = useState<AccountHealth[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccountHealth()
  }, [])

  const fetchAccountHealth = async () => {
    try {
      const response = await fetch("/api/settings/sending-accounts")
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Failed to fetch account health:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const getWarmupStageInfo = (stage: string) => {
    const stages = {
      NEW: { label: "New", color: "bg-blue-500", progress: 20 },
      WARMING: { label: "Warming Up", color: "bg-yellow-500", progress: 40 },
      WARM: { label: "Warm", color: "bg-orange-500", progress: 60 },
      ACTIVE: { label: "Active", color: "bg-green-500", progress: 80 },
      ESTABLISHED: { label: "Established", color: "bg-emerald-500", progress: 100 },
    }
    return stages[stage as keyof typeof stages] || stages.NEW
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
          <WaveLoader size="sm" bars={8} gap="tight" />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Accounts</p>
              <p className="text-2xl font-bold">{accounts.filter((a) => a.isActive).length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Health Score</p>
              <p className="text-2xl font-bold">
                {accounts.length > 0
                  ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / accounts.length)
                  : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Reply Rate</p>
              <p className="text-2xl font-bold">
                {accounts.length > 0
                  ? (accounts.reduce((sum, a) => sum + a.replyRate, 0) / accounts.length).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emails Today</p>
              <p className="text-2xl font-bold">{accounts.reduce((sum, a) => sum + a.emailsSentToday, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Sending Account Health</h3>
          <Button onClick={fetchAccountHealth} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {accounts.map((account) => {
          const warmupInfo = getWarmupStageInfo(account.warmupStage)

          return (
            <Card key={account.id} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{account.email}</h4>
                      {account.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Paused</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.emailsSentToday} / {account.dailyLimit} emails sent today
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getHealthColor(account.healthScore)}`}>
                      {account.healthScore}
                    </div>
                    <div className="text-sm text-muted-foreground">Health Score</div>
                  </div>
                </div>

                {/* Warmup Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Warmup Stage</span>
                    <Badge className={`${warmupInfo.color} text-white`}>{warmupInfo.label}</Badge>
                  </div>
                  <Progress value={warmupInfo.progress} className="h-2" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Bounce Rate</p>
                    <p
                      className={`text-lg font-semibold ${account.bounceRate > 5 ? "text-red-600" : "text-green-600"}`}
                    >
                      {account.bounceRate.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reply Rate</p>
                    <p className="text-lg font-semibold text-blue-600">{account.replyRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-lg font-semibold text-purple-600">{account.openRate.toFixed(2)}%</p>
                  </div>
                </div>

                {/* Warnings */}
                {(account.bounceRate > 5 || account.healthScore < 60) && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900">Action Required</p>
                      <p className="text-yellow-700">
                        {account.bounceRate > 5 && "High bounce rate detected. "}
                        {account.healthScore < 60 && "Low health score may affect deliverability."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {accounts.length === 0 && (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sending Accounts</h3>
            <p className="text-muted-foreground mb-4">Add a sending account to start monitoring deliverability</p>
            <Button>Add Sending Account</Button>
          </Card>
        )}
      </div>
    </div>
  )
}
