// "use client"

// import { useEffect, useState } from "react"
// import { Bell, Flame, MessageCircleQuestion, Inbox } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { useRouter } from "next/navigation"
// import { cn } from "@/lib/utils"

// interface Notification {
//   id: string
//   type: string
//   title: string
//   message: string
//   priority: string
//   entityType?: string
//   entityId?: string
//   playSound: boolean
//   createdAt: Date
// }

// export function InboxNotifications() {
//   const router = useRouter()
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [lastChecked, setLastChecked] = useState(new Date())

//   useEffect(() => {
//     const pollInterval = setInterval(async () => {
//       try {
//         const response = await fetch(`/api/inbox/poll?lastChecked=${lastChecked.toISOString()}`)
//         const data = await response.json()

//         if (data.notifications?.length > 0) {
//           setNotifications((prev) => [...data.notifications, ...prev])
//           setUnreadCount((prev) => prev + data.notifications.length)
//           setLastChecked(new Date())

//           data.notifications.forEach((notif: Notification) => {
//             if (notif.priority === "HIGH" || notif.priority === "URGENT") {
//               toast(notif.title, {
//                 description: notif.message,
//                 action: {
//                   label: "View",
//                   onClick: () => handleNotificationClick(notif),
//                 },
//               })

//               if (notif.playSound) {
//                 playNotificationSound()
//               }
//             }
//           })
//         }
//       } catch (error) {
//         console.error("[v0] Notification poll error:", error)
//       }
//     }, 10000)

//     return () => clearInterval(pollInterval)
//   }, [lastChecked])

//   const playNotificationSound = () => {
//     const audio = new Audio("/sounds/notification.mp3")
//     audio.volume = 0.5
//     audio.play().catch(() => {})
//   }

//   const handleNotificationClick = (notification: Notification) => {
//     if (notification.entityType === "reply" && notification.entityId) {
//       router.push(`/dashboard/inbox?replyId=${notification.entityId}`)
//     } else if (notification.entityType === "prospect" && notification.entityId) {
//       router.push(`/dashboard/prospects?prospectId=${notification.entityId}`)
//     }

//     setUnreadCount((prev) => Math.max(0, prev - 1))
//   }

//   const getPriorityConfig = (priority: string) => {
//     if (priority === "URGENT" || priority === "HIGH") {
//       return { icon: Flame, color: "text-red-500", bg: "bg-red-500/10" }
//     }
//     if (priority === "MEDIUM") {
//       return { icon: MessageCircleQuestion, color: "text-amber-500", bg: "bg-amber-500/10" }
//     }
//     return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" }
//   }

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-accent">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <Badge
//               className={cn(
//                 "absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center",
//                 "p-0 text-xs font-medium rounded-full",
//                 "bg-red-500 text-white border-2 border-background",
//               )}
//             >
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </Badge>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         className="w-96 p-0 rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl"
//         align="end"
//       >
//         <div className="p-4 border-b border-border/50">
//           <h3 className="font-semibold">Notifications</h3>
//           <p className="text-sm text-muted-foreground">Real-time updates on your campaigns</p>
//         </div>
//         <ScrollArea className="max-h-96">
//           {notifications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 px-4">
//               <div className="rounded-full bg-muted/50 p-4 mb-4">
//                 <Inbox className="h-8 w-8 text-muted-foreground/50" />
//               </div>
//               <p className="text-sm text-muted-foreground">No new notifications</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-border/30">
//               {notifications.slice(0, 10).map((notification) => {
//                 const priorityConfig = getPriorityConfig(notification.priority)
//                 const PriorityIcon = priorityConfig.icon

//                 return (
//                   <button
//                     key={notification.id}
//                     onClick={() => handleNotificationClick(notification)}
//                     className="w-full p-4 text-left hover:bg-accent/50 transition-colors"
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className={cn("rounded-lg p-2", priorityConfig.bg)}>
//                         <PriorityIcon className={cn("h-4 w-4", priorityConfig.color)} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-sm">{notification.title}</p>
//                         <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
//                         <p className="text-xs text-muted-foreground mt-1.5">
//                           {new Date(notification.createdAt).toLocaleTimeString()}
//                         </p>
//                       </div>
//                     </div>
//                   </button>
//                 )
//               })}
//             </div>
//           )}
//         </ScrollArea>
//       </PopoverContent>
//     </Popover>
//   )
// }
"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Bell, Flame, MessageCircleQuestion, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  entityType?: string
  entityId?: string
  playSound: boolean
  createdAt: Date | string
}

export function InboxNotifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const lastCheckedRef = useRef(new Date())
  const hasShownToastRef = useRef(new Set<string>())

  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      const lastChecked = lastCheckedRef.current.toISOString()
      const url = isInitial 
        ? `/api/inbox/poll?initial=true`
        : `/api/inbox/poll?lastChecked=${lastChecked}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      console.log('[InboxNotifications] API Response:', data)

      if (data?.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
        if (isInitial) {
          // Initial load - just set notifications
          setNotifications(data.notifications)
          setUnreadCount(data.notifications.length)
        } else {
          // Polling - add new notifications to top
          setNotifications((prev) => [...data.notifications, ...prev])
          setUnreadCount((prev) => prev + data.notifications.length)

          // Show toasts for high priority notifications (but only once per notification)
          data.notifications.forEach((notif: Notification) => {
            if (!hasShownToastRef.current.has(notif.id)) {
              if (notif.priority === "HIGH" || notif.priority === "URGENT") {
                toast(notif.title, {
                  description: notif.message,
                  action: {
                    label: "View",
                    onClick: () => handleNotificationClick(notif),
                  },
                })

                if (notif.playSound) {
                  playNotificationSound()
                }
              }
              hasShownToastRef.current.add(notif.id)
            }
          })
        }

        // Update last checked time
        lastCheckedRef.current = new Date()
      }
    } catch (error) {
      console.error("[InboxNotifications] Fetch error:", error)
    } finally {
      if (isInitial) {
        setIsLoading(false)
      }
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications(true)
  }, [fetchNotifications])

  // Set up polling interval
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchNotifications(false)
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(pollInterval)
  }, [fetchNotifications])

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = 0.5
    audio.play().catch((err) => {
      console.log("[InboxNotifications] Sound play failed:", err)
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.entityType === "reply" && notification.entityId) {
      router.push(`/dashboard/inbox?replyId=${notification.entityId}`)
    } else if (notification.entityType === "prospect" && notification.entityId) {
      router.push(`/dashboard/prospects?prospectId=${notification.entityId}`)
    }

    // Mark as read
    setUnreadCount((prev) => Math.max(0, prev - 1))
    
    // Optionally: Call API to mark as delivered
    markAsDelivered([notification.id])
  }

  const markAsDelivered = async (notificationIds: string[]) => {
    try {
      await fetch('/api/inbox/mark-delivered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      })
    } catch (error) {
      console.error('[InboxNotifications] Mark delivered error:', error)
    }
  }

  const getPriorityConfig = (priority: string) => {
    if (priority === "URGENT" || priority === "HIGH") {
      return { icon: Flame, color: "text-destructive", bg: "bg-destructive/10" }
    }
    if (priority === "MEDIUM") {
      return { icon: MessageCircleQuestion, color: "text-warning", bg: "bg-warning-muted" }
    }
    return { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" }
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    
    return d.toLocaleDateString()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-accent">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center",
                "p-0 text-xs font-medium rounded-full",
                "bg-destructive text-destructive-foreground border-2 border-background",
              )}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0 rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-xl"
        align="end"
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">Real-time updates on your campaigns</p>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-96">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium mb-1">No notifications yet</p>
              <p className="text-xs text-muted-foreground">We'll notify you when something happens</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.slice(0, 10).map((notification) => {
                const priorityConfig = getPriorityConfig(notification.priority)
                const PriorityIcon = priorityConfig.icon

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full p-4 text-left hover:bg-accent/50 transition-colors focus:outline-none focus:bg-accent/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("rounded-lg p-2 shrink-0", priorityConfig.bg)}>
                        <PriorityIcon className={cn("h-4 w-4", priorityConfig.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              onClick={() => router.push('/dashboard/inbox')}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}