"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { unifiedInbox } from "@/lib/services/unified-inbox"

// export async function getInboxMessages(filters?: { category?: string; isRead?: boolean; isArchived?: boolean }) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })
//   if (!user) throw new Error("User not found")

//   return await unifiedInbox.getInboxMessages(user.id, filters)
// }
export async function getInboxMessages(filters?: { category?: string; isRead?: boolean; isArchived?: boolean }) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) throw new Error("User not found")

  return await unifiedInbox.getInboxMessages(user.id, filters)
}

export async function getInboxStats() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) throw new Error("User not found")

  return await unifiedInbox.getInboxStats(user.id)
}

export async function categorizeReply(replyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.categorizeReply(replyId)
}

export async function markReplyAsRead(replyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.markAsRead(replyId)
}

export async function markReplyAsUnread(replyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.markAsUnread(replyId)
}

export async function archiveReply(replyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.archiveReply(replyId)
}

export async function unarchiveReply(replyId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.unarchiveReply(replyId)
}

export async function bulkMarkAsRead(replyIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.bulkMarkAsRead(replyIds)
}

export async function bulkArchive(replyIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await unifiedInbox.bulkArchive(replyIds)
}
