import { RevenueAttribution } from "@/components/analytics/revenue-attribution"
import { getRevenueData } from "@/lib/actions/analytics"

export default async function RevenueAnalyticsPage() {
    const revenueData = await getRevenueData()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Attribution</h1>
                <p className="text-muted-foreground">Track revenue generated from your email campaigns</p>
            </div>
            <RevenueAttribution
                revenueData={revenueData.revenueData}
                previousMonthRevenue={revenueData.previousMonthRevenue}
            />
        </div>
    )
}
