"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type NotificationType =
  | "CAMPAIGN_COMPLETED"
  | "CAMPAIGN_PAUSED"
  | "NEW_REPLY"
  | "PROSPECT_IMPORTED"
  | "EMAIL_BOUNCED"
  | "CREDIT_LOW"
  | "SUBSCRIPTION_EXPIRING"
  | "TEAM_INVITE"
  | "SYSTEM_UPDATE"

export async function getNotifications() {
  try {
    const { userId } = await auth()
    if (!userId) return []

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return notifications
  } catch (error) {
    console.error("[v0] Error fetching notifications:", error)
    return []
  }
}

export async function getUnreadCount() {
  try {
    const { userId } = await auth()
    if (!userId) return 0

    const count = await db.notification.count({
      where: { userId, read: false },
    })

    return count
  } catch (error) {
    console.error("[v0] Error fetching unread count:", error)
    return 0
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: "Unauthorized" }

    await db.notification.update({
      where: { id: notificationId, userId },
      data: { read: true, readAt: new Date() },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error marking notification as read:", error)
    return { success: false, error: "Failed to mark as read" }
  }
}

export async function markAllAsRead() {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: "Unauthorized" }

    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error marking all as read:", error)
    return { success: false, error: "Failed to mark all as read" }
  }
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  entityType,
  entityId,
  actionUrl,
  metadata,
}: {
  userId: string
  type: NotificationType
  title: string
  message: string
  entityType?: string
  entityId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}) {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        entityType,
        entityId,
        actionUrl,
        metadata,
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error creating notification:", error)
    return { success: false, error: "Failed to create notification" }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: "Unauthorized" }

    await db.notification.delete({
      where: { id: notificationId, userId },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting notification:", error)
    return { success: false, error: "Failed to delete notification" }
  }
}
