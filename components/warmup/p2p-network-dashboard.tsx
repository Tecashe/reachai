"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, TrendingUp, Lock, Crown, Zap } from "lucide-react"
import Link from "next/link"

interface P2PNetworkStats {
  network: {
    totalPeers: number
    avgHealthScore: number
    activeSessions: number
    todaysSessions: number
    providerDistribution: Array<{
      provider: string
      count: number
      percentage: string
    }>
  }
  userContribution: {
    activeConnections: number
    contributionLevel: string
  }
}

interface P2PNetworkDashboardProps {
  userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
}

export function P2PNetworkDashboard({ userTier }: P2PNetworkDashboardProps) {
  const [stats, setStats] = useState<P2PNetworkStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNetworkStats()
  }, [])

  const fetchNetworkStats = async () => {
    try {
      const response = await fetch("/api/warmup/peer-network/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching P2P network stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      FREE: { label: "Free", icon: Lock, color: "bg-gray-500" },
      STARTER: { label: "Starter", icon: Zap, color: "bg-blue-500" },
      PRO: { label: "Pro", icon: Shield, color: "bg-purple-500" },
      AGENCY: { label: "Agency", icon: Crown, color: "bg-amber-500" },
    }

    const config = tierConfig[tier as keyof typeof tierConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getTierAccess = (tier: string) => {
    const access = {
      FREE: { canUse: false, pool: "None - Pool warmup only", quality: "N/A" },
      STARTER: { canUse: false, pool: "None - Pool warmup only", quality: "N/A" },
      PRO: { canUse: true, pool: "Standard Pool (Mixed providers)", quality: "Medium" },
      AGENCY: { canUse: true, pool: "Premium Pool (G-Suite/Office 365 only)", quality: "High" },
    }

    return access[tier as keyof typeof access]
  }

  const tierAccess = getTierAccess(userTier)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            P2P Warmup Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                P2P Warmup Network
              </CardTitle>
              <CardDescription className="mt-2">
                Peer-to-peer email exchange network for advanced warmup
              </CardDescription>
            </div>
            {getTierBadge(userTier)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tier Access Status */}
          <div className="rounded-lg border-2 border-dashed border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  {tierAccess.canUse ? (
                    <>
                      <Shield className="h-4 w-4 text-green-600" />
                      P2P Access Enabled
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-amber-600" />
                      P2P Access Locked
                    </>
                  )}
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Pool:</span> {tierAccess.pool}
                  </div>
                  <div>
                    <span className="font-medium">Quality:</span> {tierAccess.quality}
                  </div>
                </div>
              </div>
              {!tierAccess.canUse && (
                <Button asChild size="sm">
                  <Link href="/dashboard/settings?tab=billing">Upgrade to Pro</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Network Stats */}
          {stats && tierAccess.canUse && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Peers</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.network.totalPeers.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Network Health</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.network.avgHealthScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Today's Sessions</p>
                  <p className="text-2xl font-bold text-green-600">{stats.network.todaysSessions.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Your Contribution</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.userContribution.contributionLevel}</p>
                </div>
              </div>

              {/* Provider Distribution */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Provider Distribution</h4>
                <div className="space-y-2">
                  {stats.network.providerDistribution.map((provider) => (
                    <div key={provider.provider} className="flex items-center gap-3">
                      <div className="w-28 text-sm text-muted-foreground capitalize">{provider.provider}</div>
                      <div className="flex-1">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                            style={{ width: `${provider.percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-medium">{provider.percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  P2P Network Benefits
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Real email exchange with verified accounts</li>
                  <li>• Natural engagement patterns (opens, replies, forwards)</li>
                  <li>• Provider diversity for better reputation signals</li>
                  <li>• Continuous warmup even during campaigns</li>
                </ul>
              </div>
            </>
          )}

          {!tierAccess.canUse && (
            <div className="space-y-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-600" />
                Upgrade to Access P2P Network
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>
                    <strong>Pro Plan:</strong> Access standard pool with mixed providers and medium-quality peers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>
                    <strong>Agency Plan:</strong> Access premium pool with Google Workspace and Office 365 accounts only
                  </span>
                </li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard/settings?tab=billing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
