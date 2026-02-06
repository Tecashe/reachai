import { EmailMetrics } from "@/components/analytics/email-metrics"
import { getEmailMetrics } from "@/lib/actions/analytics"

export default async function EmailsAnalyticsPage() {
    const emailMetricsData = await getEmailMetrics()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Email Metrics</h1>
                <p className="text-muted-foreground">Track open rates, click rates, and delivery metrics</p>
            </div>
            <EmailMetrics metrics={emailMetricsData.metrics} bestTimes={emailMetricsData.bestTimes} />
        </div>
    )
}
