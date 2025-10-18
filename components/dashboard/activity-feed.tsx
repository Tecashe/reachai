import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/utils/format"

const activities = [
  {
    id: "1",
    type: "reply",
    message: "Sarah Chen replied to your email",
    campaign: "Q1 Outreach - Tech Startups",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "2",
    type: "opened",
    message: "Marcus Rodriguez opened your email",
    campaign: "SaaS Founders Follow-up",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "3",
    type: "sent",
    message: "25 emails sent successfully",
    campaign: "Enterprise Sales Campaign",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: "4",
    type: "clicked",
    message: "Emily Watson clicked a link",
    campaign: "Q1 Outreach - Tech Startups",
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.campaign}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
