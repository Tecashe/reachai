

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Mail, Users, MousePointerClick } from "lucide-react"
import { getAnalyticsOverview } from "@/lib/actions/analytics"

export async function AnalyticsOverview() {
  const analytics = await getAnalyticsOverview().catch(() => ({
    emailsSent: 0,
    emailsDelivered: 0,
    emailsOpened: 0,
    emailsClicked: 0,
    emailsReplied: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    replyRate: 0,
    activeCampaigns: 0,
    totalProspects: 0,
  }))

  const stats = [
    {
      title: "Total Emails Sent",
      value: analytics.emailsSent.toLocaleString(),
      icon: Mail,
      description: `${analytics.deliveryRate}% delivery rate`,
    },
    {
      title: "Active Prospects",
      value: analytics.totalProspects.toLocaleString(),
      icon: Users,
      description: `${analytics.activeCampaigns} active campaigns`,
    },
    {
      title: "Avg. Open Rate",
      value: `${analytics.openRate}%`,
      icon: TrendingUp,
      description: `${analytics.emailsOpened} total opens`,
    },
    {
      title: "Avg. Reply Rate",
      value: `${analytics.replyRate}%`,
      icon: MousePointerClick,
      description: `${analytics.emailsReplied} total replies`,
    },
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Overall email campaign metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Emails Sent</span>
              <span className="text-lg font-semibold">{analytics.emailsSent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Delivered</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {analytics.emailsDelivered} ({analytics.deliveryRate}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Opened</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {analytics.emailsOpened} ({analytics.openRate}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Clicked</span>
              <span className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">
                {analytics.emailsClicked} ({analytics.clickRate}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Replied</span>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                {analytics.emailsReplied} ({analytics.replyRate}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

