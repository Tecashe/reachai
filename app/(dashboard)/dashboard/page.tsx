
import { Suspense } from "react"
import { Flame, BarChart3, ArrowUpRight, Sparkles, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecentCampaigns } from "@/components/dashboard-stats/recent-campaigns"
import { ActivityFeed } from "@/components/dashboard-stats/activity-feed"
import { PerformanceChart } from "@/components/dashboard-stats/performance-chart"
import { DomainHealthRing } from "@/components/dashboard-stats/domain-health-ring"
import { CampaignStatusChart } from "@/components/dashboard-stats/campaign-status-chart"
import { ProspectStatusChart } from "@/components/dashboard-stats/prospect-status-chart"
import { EmailEngagementChart } from "@/components/dashboard-stats/email-engagement-chart"
import { SendingAccountsHealth } from "@/components/dashboard-stats/sending-accounts-health"
import { QuickOverviewCard } from "@/components/dashboard-stats/quick-overview-card"
import { StatCard } from "@/components/dashboard-stats/stat-card"
import { CreditCard as CreditCardComponent } from "@/components/dashboard-stats/credit-card"
import { SkeletonCard } from "@/components/dashboard-stats/skeleton-card"
import { LivePulse } from "@/components/dashboard-stats/live-pulse"
import { ConversionFunnel } from "@/components/dashboard-stats/conversion-funnel"
import { ActivityHeatmap } from "@/components/dashboard-stats/activity-heatmap"
import { DeliverabilityGauge } from "@/components/dashboard-stats/deliverability-gauge"
import { GoalProgress } from "@/components/dashboard-stats/goal-progress"
import { SmartInsights } from "@/components/dashboard-stats/smart-insights"
import { getDashboardData } from "@/lib/actions/dashboard-stats"
import { OnboardingProgress } from "@/components/getting-started/onboarding-progress"
import { EmailSetupBanner } from "@/components/dashboard/email-setup-banner"

async function DashboardContent() {
  const data = await getDashboardData()

  const formatTrend = (change: number | null): string | undefined => {
    if (change === null) return undefined
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }

  const statCards = [
    {
      title: "Emails Sent",
      value: data.overview.totalEmailsSent.toLocaleString(),
      iconName: "Mail" as const,
      description: "Total outreach",
      trend: formatTrend(data.trends.emailsSentChange),
      trendUp: (data.trends.emailsSentChange ?? 0) >= 0,
      sparklineData: data.sparklines.emailsSent,
    },
    {
      title: "Active Prospects",
      value: data.overview.activeProspects.toLocaleString(),
      iconName: "Users" as const,
      description: `of ${data.overview.totalProspects.toLocaleString()} total`,
      trend: formatTrend(data.trends.prospectsChange),
      trendUp: (data.trends.prospectsChange ?? 0) >= 0,
    },
    {
      title: "Open Rate",
      value: `${data.rates.openRate}%`,
      iconName: "TrendingUp" as const,
      description: "Across all campaigns",
      trend: formatTrend(data.trends.openRateChange),
      trendUp: (data.trends.openRateChange ?? 0) >= 0,
    },
    {
      title: "Reply Rate",
      value: `${data.rates.replyRate}%`,
      iconName: "MousePointerClick" as const,
      description: "Engagement rate",
      trend: formatTrend(data.trends.replyRateChange),
      trendUp: (data.trends.replyRateChange ?? 0) >= 0,
      highlight: Number(data.rates.replyRate) > 5,
    },
  ]

  return (
    <>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Credits Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <CreditCardComponent
          title="Email Credits"
          value={data.overview.emailCredits}
          iconName="Mail"
          href="/dashboard/billing"
          description="Send unlimited campaigns"
        />
        <CreditCardComponent
          title="Research Credits"
          value={data.overview.researchCredits}
          iconName="Search"
          href="/dashboard/billing"
          description="AI-powered prospect research"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SmartInsights data={data.insights} />
        <GoalProgress {...data.goals} />
      </div>

      <DeliverabilityGauge {...data.deliverability} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ConversionFunnel data={data.funnel} />
        <ActivityHeatmap data={data.charts.heatmapData} />
      </div>

      {/* Performance Chart + Domain Health */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.01] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl hover:shadow-foreground/[0.05] transition-all duration-300 overflow-hidden">
            <div className="flex flex-row items-center justify-between p-6 border-b border-border/50">
              <div>
                <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                  <div className="p-1.5 rounded-lg bg-foreground/5">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  Email Performance
                </div>
                <p className="text-sm text-muted-foreground mt-1">Last 14 days activity</p>
              </div>
              <div className="flex items-center gap-4">
                <LivePulse />
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground group/btn">
                  View Details
                  <ArrowUpRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="p-6">
              <PerformanceChart data={data.charts.dailyPerformance} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.01] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          <div className="h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl hover:shadow-foreground/[0.05] transition-all duration-300 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                <div className="p-1.5 rounded-lg bg-foreground/5">
                  <Flame className="h-4 w-4" />
                </div>
                Warmup Status
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground group/btn"
              >
                <Link href="/dashboard/warmup">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col items-center p-6">
              <DomainHealthRing value={data.sendingAccounts.avgHealthScore} />
              <div className="grid grid-cols-2 gap-6 w-full mt-6 pt-6 border-t border-border/30">
                <div className="text-center p-3 rounded-xl bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors">
                  <p className="text-2xl font-bold text-foreground">{data.sendingAccounts.active}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active Accounts</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors">
                  <p className="text-2xl font-bold text-foreground">{data.sendingAccounts.total}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Accounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donut Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <CampaignStatusChart data={data.charts.campaignStatus} total={data.overview.totalCampaigns} />
        <ProspectStatusChart data={data.charts.prospectStatus} total={data.overview.totalProspects} />
        <EmailEngagementChart data={data.charts.emailEngagement} totalSent={data.overview.totalEmailsSent} />
      </div>

      {/* Quick Overview */}
      <QuickOverviewCard rates={data.rates} overview={data.overview} />

      {/* Sending Accounts Health */}
      <SendingAccountsHealth
        accounts={data.sendingAccounts.accounts}
        warmupStages={data.sendingAccounts.warmupStages}
      />

      {/* Bottom Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentCampaigns campaigns={data.topCampaigns} />
        <ActivityFeed activities={data.activityFeed} />
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} variant="stat" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SkeletonCard variant="stat" />
        <SkeletonCard variant="stat" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonCard variant="chart" className="h-[280px]" />
        <SkeletonCard variant="chart" className="h-[280px]" />
      </div>
      <SkeletonCard variant="chart" className="h-[320px]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard variant="chart" className="h-[300px]" />
        <SkeletonCard variant="chart" className="h-[300px]" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SkeletonCard variant="chart" className="h-[400px]" />
        </div>
        <div className="lg:col-span-4">
          <SkeletonCard variant="chart" className="h-[400px]" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} variant="chart" />
        ))}
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/[0.02] via-transparent to-foreground/[0.02] rounded-2xl -z-10" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-lg shadow-foreground/[0.02]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-foreground/5 shadow-inner">
                <Activity className="h-5 w-5 text-foreground/70" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your campaign overview.</p>
          </div>
          <Button
            asChild
            className="relative overflow-hidden bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/20 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/25 hover:-translate-y-0.5 group"
          >
            <Link href="/dashboard/campaigns/new" className="flex items-center gap-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles className="h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <OnboardingProgress />
        <EmailSetupBanner />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
