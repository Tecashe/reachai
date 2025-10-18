import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { CampaignPerformance } from "@/components/analytics/campaign-performance"
import { EmailMetrics } from "@/components/analytics/email-metrics"
import { ProspectEngagement } from "@/components/analytics/prospect-engagement"
import { RevenueAttribution } from "@/components/analytics/revenue-attribution"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track performance, engagement, and ROI across all campaigns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="emails">Email Metrics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignPerformance />
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <EmailMetrics />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <ProspectEngagement />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAttribution />
        </TabsContent>
      </Tabs>
    </div>
  )
}
