import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Eye, MousePointerClick, MessageSquare, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: string
  status: string
  prospectName: string
  prospectEmail: string
  company: string | null
  timestamp: Date
}

interface ActivityFeedProps {
  activities: Activity[]
}

const ACTIVITY_ICONS: Record<string, typeof Mail> = {
  email_sent: Mail,
  email_opened: Eye,
  email_clicked: MousePointerClick,
  email_replied: MessageSquare,
  email_bounced: AlertCircle,
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No activity yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Activity will appear here as you send emails</p>
        </CardContent>
      </Card>
    )
  }

  const getActivityMessage = (activity: Activity) => {
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = ACTIVITY_ICONS[activity.type] || Mail
          return (
            <div key={activity.id} className="flex gap-4 group">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner group-hover:bg-foreground/10 transition-colors ${
                    activity.type === "email_bounced" ? "bg-destructive/10" : "bg-foreground/5"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      activity.type === "email_bounced" ? "text-destructive" : "text-foreground/70"
                    }`}
                  />
                </div>
                {index < activities.length - 1 && <div className="w-px h-full bg-border/50 mt-2" />}
              </div>
              {/* Content */}
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-foreground">{getActivityMessage(activity)}</p>
                {activity.company && <p className="text-xs text-muted-foreground mt-1">{activity.company}</p>}
                <p className="text-xs text-muted-foreground/70 mt-1">
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
