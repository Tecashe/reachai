

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/utils/format"
import { getRecentActivity } from "@/lib/actions/dashboard"

export async function ActivityFeed() {
  const activities = await getRecentActivity()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.prospect.company}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

