import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Eye, MousePointerClick, MessageSquare, AlertCircle, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: string
  status: string
  prospectName: string
  prospectEmail: string
  company: string | null
  timestamp: Date
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const ACTIVITY_CONFIG: Record<string, { icon: typeof Mail; color: string; bg: string }> = {
  email_sent: { icon: Mail, color: "text-foreground/70", bg: "bg-foreground/5" },
  email_opened: { icon: Eye, color: "text-chart-1", bg: "bg-chart-1/10" },
  email_clicked: { icon: MousePointerClick, color: "text-chart-2", bg: "bg-chart-2/10" },
  email_replied: { icon: MessageSquare, color: "text-chart-3", bg: "bg-chart-3/10" },
  email_bounced: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Activity className="h-4 w-4" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-foreground/[0.03] mb-4">
            <Activity className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No activity yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Activity will appear here as you send emails</p>
        </CardContent>
      </Card>
    )
  }

  const getActivityMessage = (activity: ActivityItem) => {
    const name = activity.prospectName || activity.prospectEmail
    switch (activity.type) {
      case "email_sent":
        return `Email sent to ${name}`
      case "email_opened":
        return `${name} opened your email`
      case "email_clicked":
        return `${name} clicked a link`
      case "email_replied":
        return `${name} replied`
      case "email_bounced":
        return `Email bounced for ${name}`
      default:
        return `Activity for ${name}`
    }
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <div className="p-1.5 rounded-lg bg-foreground/5">
            <Activity className="h-4 w-4" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map((activity, index) => {
          const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.email_sent
          const Icon = config.icon

          return (
            <div key={activity.id} className="flex gap-4 group relative">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                    config.bg,
                    "group-hover:scale-105 shadow-sm",
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-full bg-gradient-to-b from-border/50 to-transparent mt-2 min-h-[20px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">{getActivityMessage(activity)}</p>
                {activity.company && <p className="text-xs text-muted-foreground mt-1 truncate">{activity.company}</p>}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
