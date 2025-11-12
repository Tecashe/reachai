"use client"

import { useEffect, useState } from "react"
import { Bell, Flame, MessageCircleQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  entityType?: string
  entityId?: string
  playSound: boolean
  createdAt: Date
}

export function InboxNotifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastChecked, setLastChecked] = useState(new Date())

  useEffect(() => {
    // Poll for new notifications every 10 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/inbox/poll?lastChecked=${lastChecked.toISOString()}`)
        const data = await response.json()

        if (data.notifications?.length > 0) {
          setNotifications((prev) => [...data.notifications, ...prev])
          setUnreadCount((prev) => prev + data.notifications.length)
          setLastChecked(new Date())

          // Show toast for high priority notifications
          data.notifications.forEach((notif: Notification) => {
            if (notif.priority === "HIGH" || notif.priority === "URGENT") {
              toast(notif.title, {
                description: notif.message,
                action: {
                  label: "View",
                  onClick: () => handleNotificationClick(notif),
                },
              })

              // Play sound for urgent notifications
              if (notif.playSound) {
                playNotificationSound()
              }
            }
          })
        }
      } catch (error) {
        console.error("[v0] Notification poll error:", error)
      }
    }, 10000)

    return () => clearInterval(pollInterval)
  }, [lastChecked])

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = 0.5
    audio.play().catch(() => {
      // Ignore errors (e.g., autoplay policy)
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.entityType === "reply" && notification.entityId) {
      router.push(`/dashboard/inbox?replyId=${notification.entityId}`)
    } else if (notification.entityType === "prospect" && notification.entityId) {
      router.push(`/dashboard/prospects?prospectId=${notification.entityId}`)
    }

    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "URGENT" || priority === "HIGH") {
      return <Flame className="h-4 w-4 text-red-500" />
    }
    if (priority === "MEDIUM") {
      return <MessageCircleQuestion className="h-4 w-4 text-orange-500" />
    }
    return <Bell className="h-4 w-4" />
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">Real-time updates on your campaigns</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="w-full p-4 text-left hover:bg-muted/50 transition-colors border-b last:border-0"
              >
                <div className="flex items-start gap-3">
                  {getPriorityIcon(notification.priority)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
