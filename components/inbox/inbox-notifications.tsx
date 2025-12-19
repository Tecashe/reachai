

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import {
  Bell,
  Flame,
  MessageCircleQuestion,
  Inbox,
  CheckCheck,
  Mail,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  X,
  ArrowLeft,
  ExternalLink,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  delivered?: boolean
}

export function InboxNotifications() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const lastCheckedRef = useRef(new Date())
  const hasShownToastRef = useRef(new Set<string>())
  const optimisticReadRef = useRef(new Set<string>())

  const fetchNotifications = useCallback(async (isInitial = false) => {
    try {
      const lastChecked = lastCheckedRef.current.toISOString()
      const url = isInitial ? `/api/inbox/poll?initial=true` : `/api/inbox/poll?lastChecked=${lastChecked}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data?.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
        if (isInitial) {
          setNotifications(data.notifications)
          const unread = data.notifications.filter((n: Notification) => !n.delivered).length
          setUnreadCount(unread)
        } else {
          setNotifications((prev) => [...data.notifications, ...prev])
          const newUnread = data.notifications.filter((n: Notification) => !n.delivered).length
          setUnreadCount((prev) => prev + newUnread)

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

  useEffect(() => {
    fetchNotifications(true)
  }, [fetchNotifications])

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchNotifications(false)
    }, 10000)

    return () => clearInterval(pollInterval)
  }, [fetchNotifications])

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.volume = 0.5
    audio.play().catch((err) => {
      console.log("[InboxNotifications] Sound play failed:", err)
    })
  }

  const handleNotificationClick = useCallback((notification: Notification, fromPopover = false) => {
    const isAlreadyRead = notification.delivered || optimisticReadRef.current.has(notification.id)

    if (!isAlreadyRead) {
      optimisticReadRef.current.add(notification.id)
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, delivered: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
      markAsDelivered([notification.id])
    }

    if (fromPopover) {
      setPopoverOpen(false)
      setSelectedNotification(notification)
      setTimeout(() => setSheetOpen(true), 100)
    } else {
      setSelectedNotification(notification)
    }
  }, [])

  const handleViewInContext = useCallback(
    (notification: Notification) => {
      if (notification.entityType === "reply" && notification.entityId) {
        router.push(`/dashboard/inbox?replyId=${notification.entityId}`)
      } else if (notification.entityType === "prospect" && notification.entityId) {
        router.push(`/dashboard/prospects?prospectId=${notification.entityId}`)
      } else if (notification.entityType === "campaign" && notification.entityId) {
        router.push(`/dashboard/campaigns?campaignId=${notification.entityId}`)
      }
      setSheetOpen(false)
      setSelectedNotification(null)
    },
    [router],
  )

  const handleBackToList = useCallback(() => {
    setSelectedNotification(null)
  }, [])

  const markAsDelivered = async (notificationIds: string[]) => {
    try {
      console.log("[v0] Marking as delivered:", notificationIds)
      const response = await fetch("/api/inbox/mark-delivered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      })
      const result = await response.json()
      console.log("[v0] Mark delivered response:", response.status, result)
    } catch (error) {
      console.error("[InboxNotifications] Mark delivered error:", error)
    }
  }

  const markAllAsRead = useCallback(() => {
    const unreadIds = notifications.filter((n) => !n.delivered && !optimisticReadRef.current.has(n.id)).map((n) => n.id)

    unreadIds.forEach((id) => optimisticReadRef.current.add(id))
    setNotifications((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, delivered: true } : n)))
    setUnreadCount(0)

    if (unreadIds.length > 0) {
      markAsDelivered(unreadIds)
      toast.success("All notifications marked as read")
    }
  }, [notifications])

  const handleViewAll = useCallback(() => {
    setPopoverOpen(false)
    setSelectedNotification(null)
    setTimeout(() => setSheetOpen(true), 100)
  }, [])

  const goToInbox = useCallback(() => {
    setSheetOpen(false)
    setSelectedNotification(null)
    router.push("/dashboard/inbox")
  }, [router])

  const getPriorityConfig = (priority: string) => {
    if (priority === "URGENT") {
      return {
        icon: Flame,
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-gradient-to-br from-rose-500/15 to-orange-500/10 dark:from-rose-500/25 dark:to-orange-500/15",
        border: "border-rose-500/20",
      }
    }
    if (priority === "HIGH") {
      return {
        icon: Flame,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-gradient-to-br from-orange-500/15 to-amber-500/10 dark:from-orange-500/25 dark:to-amber-500/15",
        border: "border-orange-500/20",
      }
    }
    if (priority === "MEDIUM") {
      return {
        icon: MessageCircleQuestion,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-gradient-to-br from-amber-500/15 to-yellow-500/10 dark:from-amber-500/25 dark:to-yellow-500/15",
        border: "border-amber-500/20",
      }
    }
    return {
      icon: Bell,
      color: "text-slate-500 dark:text-slate-400",
      bg: "bg-slate-500/10 dark:bg-slate-500/15",
      border: "border-slate-500/20",
    }
  }

  const getEntityConfig = (entityType?: string) => {
    switch (entityType) {
      case "reply":
        return { icon: Mail, label: "Reply", color: "text-blue-600 dark:text-blue-400" }
      case "prospect":
        return { icon: Users, label: "Prospect", color: "text-emerald-600 dark:text-emerald-400" }
      case "campaign":
        return { icon: Sparkles, label: "Campaign", color: "text-violet-600 dark:text-violet-400" }
      default:
        return { icon: FileText, label: "Update", color: "text-slate-500 dark:text-slate-400" }
    }
  }

  const formatTime = (date: Date | string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  const formatFullDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isRead = (notification: Notification) =>
    notification.delivered || optimisticReadRef.current.has(notification.id)

  const NotificationItem = ({
    notification,
    compact = false,
    fromPopover = false,
  }: {
    notification: Notification
    compact?: boolean
    fromPopover?: boolean
  }) => {
    const priorityConfig = getPriorityConfig(notification.priority)
    const PriorityIcon = priorityConfig.icon
    const entityConfig = getEntityConfig(notification.entityType)
    const EntityIcon = entityConfig.icon
    const read = isRead(notification)

    return (
      <button
        onClick={() => handleNotificationClick(notification, fromPopover)}
        className={cn(
          "group relative w-full text-left transition-all duration-300 focus:outline-none",
          "hover:bg-muted/50 focus-visible:bg-muted/50 active:scale-[0.995]",
          compact ? "px-4 py-3.5" : "px-5 py-4",
          !read && "bg-primary/[0.02] dark:bg-primary/[0.04]",
        )}
      >
        {!read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-primary rounded-r-full" />}

        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div
              className={cn(
                "rounded-xl p-2.5 transition-all duration-300 border",
                "group-hover:scale-110 group-hover:shadow-md",
                priorityConfig.bg,
                priorityConfig.border,
              )}
            >
              <PriorityIcon className={cn("h-4 w-4", priorityConfig.color)} />
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <p
                className={cn(
                  "font-semibold leading-snug tracking-tight",
                  compact ? "text-[13px]" : "text-sm",
                  !read ? "text-foreground" : "text-foreground/70",
                )}
              >
                {notification.title}
              </p>
              <span className="text-[11px] text-muted-foreground/60 font-medium whitespace-nowrap pt-0.5">
                {formatTime(notification.createdAt)}
              </span>
            </div>

            <p
              className={cn(
                "text-muted-foreground leading-relaxed",
                compact ? "text-xs line-clamp-1" : "text-[13px] line-clamp-2",
              )}
            >
              {notification.message}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <div className={cn("flex items-center gap-1", entityConfig.color)}>
                <EntityIcon className="h-3 w-3" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{entityConfig.label}</span>
              </div>
              {notification.priority === "URGENT" && (
                <Badge className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400 border-0 hover:bg-rose-500/20">
                  Urgent
                </Badge>
              )}
              {notification.priority === "HIGH" && (
                <Badge className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-wide bg-orange-500/15 text-orange-600 dark:text-orange-400 border-0 hover:bg-orange-500/20">
                  High
                </Badge>
              )}
            </div>
          </div>

          <ArrowRight
            className={cn(
              "h-4 w-4 shrink-0 mt-0.5",
              "text-transparent group-hover:text-muted-foreground/50",
              "transition-all duration-300 group-hover:translate-x-1",
            )}
          />
        </div>
      </button>
    )
  }

  const NotificationDetails = ({ notification }: { notification: Notification }) => {
    const priorityConfig = getPriorityConfig(notification.priority)
    const PriorityIcon = priorityConfig.icon
    const entityConfig = getEntityConfig(notification.entityType)
    const EntityIcon = entityConfig.icon

    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-b from-muted/20 to-transparent">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to notifications
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className={cn("rounded-2xl p-4 border", priorityConfig.bg, priorityConfig.border)}>
                <PriorityIcon className={cn("h-6 w-6", priorityConfig.color)} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className={cn("flex items-center gap-1.5", entityConfig.color)}>
                    <EntityIcon className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{entityConfig.label}</span>
                  </div>
                  {notification.priority === "URGENT" && (
                    <Badge className="h-5 px-2 text-[10px] font-bold uppercase tracking-wide bg-rose-500/15 text-rose-600 dark:text-rose-400 border-0">
                      Urgent
                    </Badge>
                  )}
                  {notification.priority === "HIGH" && (
                    <Badge className="h-5 px-2 text-[10px] font-bold uppercase tracking-wide bg-orange-500/15 text-orange-600 dark:text-orange-400 border-0">
                      High Priority
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs">{formatFullDate(notification.createdAt)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight leading-tight">{notification.title}</h2>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {notification.message}
              </p>
            </div>

            {notification.entityId && (
              <>
                <Separator />
                <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Related {entityConfig.label}
                  </p>
                  <p className="text-sm font-mono text-foreground/80 break-all">ID: {notification.entityId}</p>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {notification.entityId && (
          <div className="px-5 py-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
            <Button onClick={() => handleViewInContext(notification)} className="w-full h-11 font-semibold shadow-sm">
              View {entityConfig.label} Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  const EmptyState = ({ large = false }: { large?: boolean }) => (
    <div className={cn("flex flex-col items-center justify-center px-6 text-center", large ? "py-20" : "py-14")}>
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 mb-5",
          "flex items-center justify-center",
          large ? "h-20 w-20" : "h-16 w-16",
        )}
      >
        <Inbox className={cn("text-muted-foreground/30", large ? "h-10 w-10" : "h-8 w-8")} />
      </div>
      <p className={cn("font-semibold text-foreground/80", large ? "text-base" : "text-sm")}>All caught up!</p>
      <p className={cn("text-muted-foreground mt-1.5 max-w-[220px]", large ? "text-sm" : "text-xs")}>
        No new notifications. We'll let you know when something happens.
      </p>
    </div>
  )

  const LoadingState = ({ large = false }: { large?: boolean }) => (
    <div className={cn("flex flex-col items-center justify-center px-6", large ? "py-20" : "py-14")}>
      <div className="relative">
        <div className={cn("rounded-full border-2 border-muted/50", large ? "h-12 w-12" : "h-10 w-10")} />
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin",
            large ? "h-12 w-12" : "h-10 w-10",
          )}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-4">Loading...</p>
    </div>
  )

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-10 w-10 rounded-xl transition-all duration-300",
              "hover:bg-muted hover:scale-105 active:scale-100",
              popoverOpen && "bg-muted scale-105",
            )}
          >
            <Bell
              className={cn(
                "h-5 w-5 transition-all duration-300",
                popoverOpen && "scale-110",
                unreadCount > 0 && "text-foreground",
              )}
            />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute -top-0.5 -right-0.5 flex items-center justify-center",
                  "h-5 min-w-5 px-1.5 text-[11px] font-bold rounded-full",
                  "bg-rose-500 text-white",
                  "ring-2 ring-background",
                  "animate-in zoom-in-75 fade-in duration-300",
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-[380px] p-0 overflow-hidden",
            "rounded-2xl border border-border/60",
            "bg-background/98 backdrop-blur-2xl",
            "shadow-2xl shadow-black/10 dark:shadow-black/30",
          )}
          align="end"
          sideOffset={12}
        >
          <div className="px-5 py-4 bg-gradient-to-b from-muted/30 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base tracking-tight">Notifications</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {notifications.length > 0
                    ? `${unreadCount} unread of ${notifications.length} total`
                    : "Stay updated on your campaigns"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAllAsRead()
                  }}
                  className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  Read all
                </Button>
              )}
            </div>
          </div>

          <Separator className="opacity-50" />

          {isLoading ? (
            <LoadingState />
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-h-[340px] overflow-y-auto overscroll-contain">
              <div className="divide-y divide-border/40">
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} compact fromPopover />
                ))}
              </div>
            </div>
          )}

          {notifications.length > 0 && (
            <>
              <Separator className="opacity-50" />
              <div className="p-3 bg-gradient-to-t from-muted/30 to-transparent">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full h-9 font-semibold bg-muted/60 hover:bg-muted"
                  onClick={handleViewAll}
                >
                  View all notifications
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setSelectedNotification(null)
        }}
      >
        <SheetContent
          className={cn("w-full sm:max-w-[460px] p-0", "flex flex-col", "border-l border-border/50", "bg-background")}
        >
          {selectedNotification ? (
            <NotificationDetails notification={selectedNotification} />
          ) : (
            <>
              <SheetHeader className="px-6 py-5 border-b border-border/50 bg-gradient-to-b from-muted/20 to-transparent space-y-0">
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-xl font-bold tracking-tight">Notifications</SheetTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notifications.length > 0
                        ? `${unreadCount} unread · ${notifications.length} total`
                        : "No notifications yet"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllAsRead}
                        className="h-8 gap-1.5 text-xs font-semibold bg-transparent"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all read
                      </Button>
                    )}
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetHeader>

              <ScrollArea className="flex-1">
                {isLoading ? (
                  <LoadingState large />
                ) : notifications.length === 0 ? (
                  <EmptyState large />
                ) : (
                  <div className="divide-y divide-border/40">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                )}
              </ScrollArea>

              {notifications.length > 0 && (
                <div className="px-5 py-4 border-t border-border/50 bg-gradient-to-t from-muted/20 to-transparent">
                  <Button onClick={goToInbox} className="w-full h-11 font-semibold shadow-sm">
                    Open Inbox
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
