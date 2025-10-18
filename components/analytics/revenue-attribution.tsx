import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"

const revenueData = [
  { campaign: "Q1 Tech Outreach", revenue: 45000, deals: 12, avgDealSize: 3750 },
  { campaign: "Product Demo Follow-up", revenue: 38500, deals: 8, avgDealSize: 4812 },
  { campaign: "Enterprise Outreach", revenue: 32000, deals: 5, avgDealSize: 6400 },
  { campaign: "Re-engagement Campaign", revenue: 12000, deals: 6, avgDealSize: 2000 },
]

export function RevenueAttribution() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalDeals = revenueData.reduce((sum, item) => sum + item.deals, 0)

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
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+18.7% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals Closed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(totalRevenue / totalDeals).toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>+5.3% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Campaign</CardTitle>
          <CardDescription>Campaign contribution to total revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.campaign} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.campaign}</span>
                  <div className="text-right">
                    <p className="font-semibold">${item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.deals} deals • ${item.avgDealSize.toLocaleString()} avg
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    style={{ width: `${(item.revenue / totalRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
