"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Mail,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  Settings,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { toast } from "sonner"

interface EmailAccount {
  id: string
  email: string
  provider: "gmail" | "outlook" | "yahoo" | "custom"
  status: "active" | "paused" | "warming" | "issues" | "completed"
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

interface WarmupAccountsTabProps {
  accounts: EmailAccount[]
  userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
  onAccountUpdate: () => void
  onAddAccount: () => void
}

export function WarmupAccountsTab({ accounts, userTier, onAccountUpdate, onAddAccount }: WarmupAccountsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  const filteredAccounts = accounts
    .filter((account) => {
      if (searchQuery && !account.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (statusFilter !== "all" && account.status !== statusFilter) return false
      if (providerFilter !== "all" && account.provider !== providerFilter) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "inbox":
          return b.stats.inboxRate - a.stats.inboxRate
        case "volume":
          return b.stats.emailsSentToday - a.stats.emailsSentToday
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleToggleStatus = async (accountId: string, currentStatus: string) => {
    const newEnabled = currentStatus === "paused"
    try {
      const response = await fetch(`/api/settings/sending-accounts/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warmupEnabled: newEnabled }),
      })
      if (!response.ok) throw new Error("Failed to update")
      toast.success(newEnabled ? "Warmup resumed" : "Warmup paused")
      onAccountUpdate()
    } catch (error) {
      toast.error("Failed to update account status")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      case "warming":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Warming Up</Badge>
      case "paused":
        return <Badge className="bg-muted text-muted-foreground border-border">Paused</Badge>
      case "issues":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Issues</Badge>
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-success" />
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-destructive" />
    return null
  }

  const getWarmupStageLabel = (daysActive: number) => {
    if (daysActive < 7) return { label: "Initial", progress: (daysActive / 7) * 25 }
    if (daysActive < 21) return { label: "Ramp Up", progress: 25 + ((daysActive - 7) / 14) * 35 }
    if (daysActive < 30) return { label: "Stabilization", progress: 60 + ((daysActive - 21) / 9) * 25 }
    return { label: "Maintenance", progress: 100 }
  }

  const getReputationColor = (score: number) => {
    if (score >= 90) return "text-success"
    if (score >= 75) return "text-warning"
    return "text-destructive"
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="warming">Warming Up</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="issues">Issues</SelectItem>
            </SelectContent>
          </Select>
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="gmail">Gmail</SelectItem>
              <SelectItem value="outlook">Outlook</SelectItem>
              <SelectItem value="yahoo">Yahoo</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="inbox">Inbox Rate</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Account Cards Grid */}
      {filteredAccounts.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Accounts Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {accounts.length === 0
                ? "Connect your first email account to start warming up"
                : "No accounts match your current filters"}
            </p>
            {accounts.length === 0 && (
              <Button onClick={onAddAccount} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Email Account
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => {
            const stageInfo = getWarmupStageLabel(account.warmupConfig.daysActive)

            return (
              <Card key={account.id} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate" title={account.email}>
                          {account.email}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize text-xs">
                            {account.provider}
                          </Badge>
                          {getStatusBadge(account.status)}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => handleToggleStatus(account.id, account.status)}
                        >
                          {account.status === "paused" ? (
                            <>
                              <Play className="h-4 w-4" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause className="h-4 w-4" /> Pause
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Settings className="h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {account.stats.emailsSentToday}/{account.warmupConfig.targetVolume}
                      </p>
                      <p className="text-xs text-muted-foreground">Sent Today</p>
                      <Progress
                        value={(account.stats.emailsSentToday / account.warmupConfig.targetVolume) * 100}
                        className="h-1 mt-1"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <p
                          className={`text-lg font-semibold ${account.stats.inboxRate >= 95 ? "text-success" : account.stats.inboxRate >= 90 ? "text-warning" : "text-destructive"}`}
                        >
                          {account.stats.inboxRate}%
                        </p>
                        {getTrendIcon(account.stats.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">Inbox Rate</p>
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${getReputationColor(account.stats.reputationScore)}`}>
                        {account.stats.reputationScore}
                      </p>
                      <p className="text-xs text-muted-foreground">Reputation</p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Day {account.warmupConfig.daysActive} - {stageInfo.label}
                      </span>
                      <span className="text-muted-foreground">{Math.round(stageInfo.progress)}%</span>
                    </div>
                    <Progress value={stageInfo.progress} className="h-2" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 bg-transparent"
                      onClick={() => handleToggleStatus(account.id, account.status)}
                    >
                      {account.status === "paused" ? (
                        <>
                          <Play className="h-3 w-3" /> Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3" /> Pause
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
