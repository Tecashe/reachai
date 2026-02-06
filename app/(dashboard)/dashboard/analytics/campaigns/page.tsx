import { CampaignPerformance } from "@/components/analytics/campaign-performance"
import { getCampaignPerformance } from "@/lib/actions/analytics"

export default async function CampaignsAnalyticsPage() {
    const campaignPerformance = await getCampaignPerformance()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
                <p className="text-muted-foreground">Analyze performance across all your campaigns</p>
            </div>
            <CampaignPerformance campaigns={campaignPerformance} />
        </div>
    )
}
