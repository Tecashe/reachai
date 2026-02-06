import { ProspectEngagement } from "@/components/analytics/prospect-engagement"
import { getProspectEngagement } from "@/lib/actions/analytics"

export default async function EngagementAnalyticsPage() {
    const prospectEngagementData = await getProspectEngagement()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prospect Engagement</h1>
                <p className="text-muted-foreground">Understand how prospects interact with your campaigns</p>
            </div>
            <ProspectEngagement
                engagementLevels={prospectEngagementData.engagementLevels}
                topProspects={prospectEngagementData.topProspects}
            />
        </div>
    )
}
