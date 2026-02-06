import { AnalyticsOverview } from "@/components/analytics/analytics-overview"

export default function OverviewAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
                <p className="text-muted-foreground">Get a high-level view of your campaign performance</p>
            </div>
            <AnalyticsOverview />
        </div>
    )
}
