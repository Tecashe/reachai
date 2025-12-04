"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Mail, MousePointer, Reply, Clock, Eye, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "sent" | "opened" | "clicked" | "replied" | "bounced"
  description: string
  timestamp: Date
  metadata?: {
    link?: string
    count?: number
  }
}

interface ActivitySidebarProps {
  prospectId: string
  prospectName: string
  children?: React.ReactNode
}

export function ActivitySidebar({ prospectId, prospectName, children }: ActivitySidebarProps) {
  const [activities, setActivities] = React.useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/inbox/activity/${prospectId}`)
      if (!response.ok) throw new Error()
      const data = await response.json()
      setActivities(data.activities || [])
    } catch {
      // Use mock data for now
      setActivities([
        {
          id: "1",
          type: "sent",
          description: "Email sent: Initial outreach",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: "2",
          type: "opened",
          description: "Email opened",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          metadata: { count: 3 },
        },
        {
          id: "3",
          type: "clicked",
          description: "Clicked link: Product demo",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          metadata: { link: "/demo" },
        },
        {
          id: "4",
          type: "opened",
          description: "Email opened",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          metadata: { count: 2 },
        },
        {
          id: "5",
          type: "replied",
          description: "Replied to email",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen && activities.length === 0) {
      fetchActivities()
    }
  }, [isOpen])

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "sent":
        return <Mail className="h-4 w-4" />
      case "opened":
        return <Eye className="h-4 w-4" />
      case "clicked":
        return <MousePointer className="h-4 w-4" />
      case "replied":
        return <Reply className="h-4 w-4" />
      case "bounced":
        return <X className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "sent":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "opened":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "clicked":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "replied":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "bounced":
        return "bg-red-500/10 text-red-600 border-red-500/20"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl">
            <Activity className="h-4 w-4" />
            Activity
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Timeline
          </SheetTitle>
          <p className="text-sm text-muted-foreground">Engagement history for {prospectName}</p>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted/50 p-4 mb-4">
                  <Activity className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs text-muted-foreground">Engagement will appear here</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      {/* Icon */}
                      <div
                        className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border",
                          getActivityColor(activity.type),
                        )}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                          </span>
                          {activity.metadata?.count && (
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                              {activity.metadata.count}x
                            </Badge>
                          )}
                          {activity.metadata?.link && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1.5 gap-1">
                              <ExternalLink className="h-2.5 w-2.5" />
                              Link
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
