"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Globe,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  Server,
  WifiOff,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { DomainSetupWizard } from "./domain-setup-wizard"
import { DNSVerificationGuide } from "./dns-verification-guide"
import { DomainList } from "./domain-list"

// =============================================================================
// TYPES
// =============================================================================

interface DomainStatus {
  id: string
  domain: string
  isVerified: boolean
  emailProviderId?: string
  dkimSelector?: string
  spfStatus: "VALID" | "INVALID" | "PENDING" | null
  dkimStatus: "VALID" | "INVALID" | "PENDING" | null
  dmarcStatus: "VALID" | "INVALID" | "PENDING" | null
  mxStatus: "VALID" | "INVALID" | "PENDING" | null
  healthScore: number
  lastVerificationCheck?: Date
  verificationAttempts: number
}

interface Stats {
  totalDomains: number
  verifiedDomains: number
  pendingDomains: number
  averageHealthScore: number
  sendingAccounts: number
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function EmailSetupDashboard() {
  const [domains, setDomains] = useState<DomainStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Calculate stats
  const stats: Stats = {
    totalDomains: domains.length,
    verifiedDomains: domains.filter((d) => d.isVerified).length,
    pendingDomains: domains.filter((d) => !d.isVerified).length,
    averageHealthScore:
      domains.length > 0 ? Math.round(domains.reduce((acc, d) => acc + (d.healthScore || 0), 0) / domains.length) : 0,
    sendingAccounts: domains.filter((d) => d.isVerified).length * 2, // Placeholder
  }

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Fetch domains
  const fetchDomains = useCallback(async () => {
    if (!isOnline) {
      setError("You're offline. Please check your internet connection.")
      setLoading(false)
      return
    }

    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    try {
      setError(null)
      const response = await fetch("/api/domains", {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch domains: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setDomains(data.domains || [])
        // Auto-select first pending domain
        const pending = data.domains?.find((d: DomainStatus) => !d.isVerified)
        if (pending) {
          setSelectedDomainId(pending.id)
        } else if (data.domains?.[0]) {
          setSelectedDomainId(data.domains[0].id)
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Failed to load domains")
    } finally {
      setLoading(false)
    }
  }, [isOnline])

  useEffect(() => {
    fetchDomains()
    return () => abortControllerRef.current?.abort()
  }, [fetchDomains])

  // Handle domain added
  const handleDomainAdded = useCallback(
    (domainId: string) => {
      fetchDomains()
      setSelectedDomainId(domainId)
      setActiveTab("dns")
      toast.success("Domain added! Now let's configure your DNS records.")
    },
    [fetchDomains],
  )

  // Handle domain selected for configuration
  const handleConfigureDomain = useCallback((domainId: string) => {
    setSelectedDomainId(domainId)
    setActiveTab("dns")
  }, [])

  // Offline banner
  if (!isOnline) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Empty>
          <EmptyMedia>
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>You're Offline</EmptyTitle>
            <EmptyDescription>Please check your internet connection and try again.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Empty>
          <EmptyMedia>
            <Spinner/>
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Loading your domains...</EmptyTitle>
            <EmptyDescription>Please wait while we fetch your configuration.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Empty>
          <EmptyMedia>
            <AlertCircle className="h-12 w-12 text-destructive" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={fetchDomains}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      {/* Header with liquid glass effect */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-8">
        {/* Liquid glass background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-2xl" />
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Email Domain Setup</h1>
                <p className="text-muted-foreground">Configure your domains for maximum deliverability</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6">
            <QuickStat icon={Globe} label="Domains" value={stats.totalDomains} />
            <QuickStat icon={CheckCircle2} label="Verified" value={stats.verifiedDomains} color="text-green-500" />
            <QuickStat
              icon={TrendingUp}
              label="Avg. Health"
              value={`${stats.averageHealthScore}%`}
              color="text-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="add" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Domain</span>
          </TabsTrigger>
          <TabsTrigger value="dns" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">DNS Config</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {domains.length === 0 ? (
            <WelcomeCard onGetStarted={() => setActiveTab("add")} />
          ) : (
            <>
              <StatsCards stats={stats} />
              <DomainList domains={domains} onConfigure={handleConfigureDomain} onRefresh={fetchDomains} />
            </>
          )}
        </TabsContent>

        {/* Add Domain Tab */}
        <TabsContent value="add" className="space-y-6">
          <DomainSetupWizard onDomainAdded={handleDomainAdded} existingDomains={domains} />
        </TabsContent>

        {/* DNS Configuration Tab */}
        <TabsContent value="dns" className="space-y-6">
          {domains.length === 0 ? (
            <Empty>
              <EmptyMedia>
                <Server className="h-12 w-12 text-muted-foreground" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No Domains Yet</EmptyTitle>
                <EmptyDescription>Add a domain first to configure DNS records.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setActiveTab("add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Domain
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <DNSVerificationGuide
              domains={domains}
              selectedDomainId={selectedDomainId}
              onDomainSelect={setSelectedDomainId}
              onVerificationComplete={fetchDomains}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function QuickStat({
  icon: Icon,
  label,
  value,
  color = "text-foreground",
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="text-center">
      <div className={cn("text-2xl font-bold", color)}>{value}</div>
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </div>
    </div>
  )
}

function WelcomeCard({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <Card className="relative overflow-hidden border-dashed">
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      </div>

      <CardContent className="relative p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to Email Setup</h2>
            <p className="text-muted-foreground text-balance">
              Get your domain ready for cold email outreach in just a few minutes. We'll guide you through SPF, DKIM,
              and DMARC configuration step by step.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid gap-4 sm:grid-cols-3 text-left">
            <BenefitCard
              icon={Shield}
              title="Better Deliverability"
              description="Properly authenticated emails land in inbox, not spam"
            />
            <BenefitCard
              icon={TrendingUp}
              title="Higher Open Rates"
              description="Trusted sender reputation means more engagement"
            />
            <BenefitCard
              icon={CheckCircle2}
              title="Easy Setup"
              description="Step-by-step guidance with copy-paste DNS records"
            />
          </div>

          <Button size="lg" onClick={onGetStarted} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground">Takes about 10-15 minutes to complete</p>
        </div>
      </CardContent>
    </Card>
  )
}

function BenefitCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card/50 p-4 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-primary mb-2" aria-hidden="true" />
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

function StatsCards({ stats }: { stats: Stats }) {
  const healthColor =
    stats.averageHealthScore >= 80
      ? "text-green-500"
      : stats.averageHealthScore >= 50
        ? "text-amber-500"
        : "text-red-500"

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Domains" value={stats.totalDomains} icon={Globe} description="Domains configured" />
      <StatCard
        title="Verified"
        value={stats.verifiedDomains}
        icon={CheckCircle2}
        description="Ready to send"
        iconColor="text-green-500"
      />
      <StatCard
        title="Pending Setup"
        value={stats.pendingDomains}
        icon={Clock}
        description="Need DNS configuration"
        iconColor="text-amber-500"
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Health</CardTitle>
          <TrendingUp className={cn("h-4 w-4", healthColor)} aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", healthColor)}>{stats.averageHealthScore}%</div>
          <Progress value={stats.averageHealthScore} className="mt-2 h-1.5" />
          <p className="text-xs text-muted-foreground mt-2">Across all domains</p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconColor = "text-muted-foreground",
}: {
  title: string
  value: number
  icon: React.ElementType
  description: string
  iconColor?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
