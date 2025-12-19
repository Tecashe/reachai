
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

interface RevenueAttributionProps {
  revenueData: Array<{
    campaignId: string
    campaignName: string
    revenue: number
    deals: number
  }>
  previousMonthRevenue?: number
}

export function RevenueAttribution({ revenueData, previousMonthRevenue = 0 }: RevenueAttributionProps) {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalDeals = revenueData.reduce((sum, item) => sum + item.deals, 0)
  const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0

  const revenueGrowth =
    previousMonthRevenue > 0 ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            {previousMonthRevenue > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>
                  {revenueGrowth > 0 ? "+" : ""}
                  {revenueGrowth.toFixed(1)}% from last month
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals Closed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgDealSize).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Campaign</CardTitle>
          <CardDescription>Campaign contribution to total revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet</p>
          ) : (
            <div className="space-y-4">
              {revenueData.map((item) => {
                const avgDeal = item.deals > 0 ? item.revenue / item.deals : 0
                const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0

                return (
                  <div key={item.campaignId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.campaignName}</span>
                      <div className="text-right">
                        <p className="font-semibold">${item.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.deals} deals • ${Math.round(avgDeal).toLocaleString()} avg
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
