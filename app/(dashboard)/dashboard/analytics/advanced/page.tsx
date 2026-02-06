import { AdvancedAnalyticsTab } from "@/components/analytics/advanced-analytics-tab"

export default function AdvancedAnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
                <p className="text-muted-foreground">Deep dive into advanced metrics and custom reports</p>
            </div>
            <AdvancedAnalyticsTab />
        </div>
    )
}
