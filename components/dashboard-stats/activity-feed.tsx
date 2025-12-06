"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mail, Eye, MousePointerClick, MessageSquare, AlertCircle, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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

const ACTIVITY_CONFIG: Record<string, { icon: typeof Mail; color: string; bg: string; label: string }> = {
  email_sent: { icon: Mail, color: "text-foreground/70", bg: "bg-foreground/5", label: "Sent" },
  email_opened: { icon: Eye, color: "text-chart-1", bg: "bg-chart-1/10", label: "Opened" },
  email_clicked: { icon: MousePointerClick, color: "text-chart-2", bg: "bg-chart-2/10", label: "Clicked" },
  email_replied: { icon: MessageSquare, color: "text-chart-3", bg: "bg-chart-3/10", label: "Replied" },
  email_bounced: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Bounced" },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-lg shadow-foreground/[0.03] hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Activity className="h-4 w-4" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <div className="p-1.5 rounded-lg bg-foreground/5">
              <Activity className="h-4 w-4" />
            </div>
            Recent Activity
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-foreground/5 px-2 py-1 rounded-full">
            {activities.length} events
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[340px] pr-4">
          <div className="space-y-1">
            {activities.map((activity, index) => {
              const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.email_sent
              const Icon = config.icon

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex gap-3 group relative py-2 px-2 rounded-lg hover:bg-foreground/[0.02] transition-colors"
                >
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                        config.bg,
                        "group-hover:scale-105 shadow-sm",
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-border/50 to-transparent mt-2 min-h-[16px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-tight truncate">
                        {getActivityMessage(activity)}
                      </p>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0",
                          config.bg,
                          config.color,
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.company && (
                        <>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{activity.company}</p>
                          <span className="text-muted-foreground/30">·</span>
                        </>
                      )}
                      <p className="text-xs text-muted-foreground/60">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
