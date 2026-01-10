// import { prisma } from "@/lib/db"

// /**
//  * Track email threads and conversation chains for warmup
//  */
// export class WarmupThreadTracker {
//   /**
//    * Get all interactions in a thread
//    */
//   async getThreadInteractions(threadId: string) {
//     return prisma.warmupInteraction.findMany({
//       where: { threadId },
//       orderBy: { sentAt: "asc" },
//       include: {
//         sendingAccount: {
//           select: {
//             id: true,
//             email: true,
//             name: true,
//           },
//         },
//       },
//     })
//   }

//   /**
//    * Get conversation statistics
//    */
//   async getThreadStats(threadId: string) {
//     const interactions = await this.getThreadInteractions(threadId)

//     const outbound = interactions.filter((i) => i.direction === "OUTBOUND")
//     const inbound = interactions.filter((i) => i.direction === "INBOUND")

//     return {
//       totalMessages: interactions.length,
//       outboundCount: outbound.length,
//       inboundCount: inbound.length,
//       replyRate: outbound.length > 0 ? (inbound.length / outbound.length) * 100 : 0,
//       avgResponseTime: this.calculateAvgResponseTime(interactions),
//       conversationAge: this.getConversationAge(interactions),
//     }
//   }

//   /**
//    * Calculate average response time between messages
//    */
//   private calculateAvgResponseTime(interactions: any[]): number {
//     if (interactions.length < 2) return 0

//     const responseTimes: number[] = []

//     for (let i = 1; i < interactions.length; i++) {
//       const prev = interactions[i - 1]
//       const curr = interactions[i]

//       if (prev.direction !== curr.direction && curr.sentAt && prev.sentAt) {
//         const diff = new Date(curr.sentAt).getTime() - new Date(prev.sentAt).getTime()
//         responseTimes.push(diff)
//       }
//     }

//     if (responseTimes.length === 0) return 0

//     const avg = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
//     return Math.round(avg / (1000 * 60)) // Convert to minutes
//   }

//   /**
//    * Get conversation age in days
//    */
//   private getConversationAge(interactions: any[]): number {
//     if (interactions.length === 0) return 0

//     const first = interactions[0]
//     const last = interactions[interactions.length - 1]

//     const diff = new Date(last.sentAt).getTime() - new Date(first.sentAt).getTime()
//     return Math.round(diff / (1000 * 60 * 60 * 24)) // Convert to days
//   }

//   /**
//    * Find orphaned warmup emails (no reply after X days)
//    */
//   async findOrphanedThreads(daysWithoutReply = 7) {
//     const cutoffDate = new Date(Date.now() - daysWithoutReply * 24 * 60 * 60 * 1000)

//     // Find outbound warmup emails with no inbound reply
//     const orphanedOutbound = await prisma.warmupInteraction.findMany({
//       where: {
//         direction: "OUTBOUND",
//         warmupId: { not: null },
//         sentAt: { lte: cutoffDate },
//       },
//       select: {
//         warmupId: true,
//         threadId: true,
//       },
//     })

//     const orphaned = []

//     for (const outbound of orphanedOutbound) {
//       if (!outbound.threadId) continue

//       // Check if there's any inbound reply in this thread
//       const hasReply = await prisma.warmupInteraction.findFirst({
//         where: {
//           threadId: outbound.threadId,
//           direction: "INBOUND",
//         },
//       })

//       if (!hasReply) {
//         orphaned.push(outbound)
//       }
//     }

//     return orphaned
//   }

//   /**
//    * Detect conversation loops (same sender/recipient pair)
//    */
//   async detectConversationLoops(accountId: string, days = 30) {
//     const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

//     const interactions = await prisma.warmupInteraction.findMany({
//       where: {
//         sendingAccountId: accountId,
//         sentAt: { gte: cutoffDate },
//         threadId: { not: null },
//       },
//       select: {
//         threadId: true,
//         warmupId: true,
//       },
//     })

//     // Group by thread and count messages
//     const threadCounts = new Map<string, number>()

//     for (const interaction of interactions) {
//       if (!interaction.threadId) continue

//       const count = threadCounts.get(interaction.threadId) || 0
//       threadCounts.set(interaction.threadId, count + 1)
//     }

//     // Flag threads with excessive back-and-forth (more than 5 messages)
//     const loops = []
//     for (const [threadId, count] of threadCounts.entries()) {
//       if (count > 5) {
//         loops.push({ threadId, messageCount: count })
//       }
//     }

//     return loops
//   }
// }

// export const warmupThreadTracker = new WarmupThreadTracker()
import { prisma } from "@/lib/db"

/**
 * Track email threads and conversation chains for warmup
 */
export class WarmupThreadTracker {
  /**
   * Get all interactions in a thread
   */
  async getThreadInteractions(threadId: string) {
    return prisma.warmupInteraction.findMany({
      where: { threadId },
      orderBy: { sentAt: "asc" },
      include: {
        session: {
          include: {
            sendingAccount: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Get conversation statistics
   */
  async getThreadStats(threadId: string) {
    const interactions = await this.getThreadInteractions(threadId)

    const outbound = interactions.filter((i) => i.direction === "OUTBOUND")
    const inbound = interactions.filter((i) => i.direction === "INBOUND")

    return {
      totalMessages: interactions.length,
      outboundCount: outbound.length,
      inboundCount: inbound.length,
      replyRate: outbound.length > 0 ? (inbound.length / outbound.length) * 100 : 0,
      avgResponseTime: this.calculateAvgResponseTime(interactions),
      conversationAge: this.getConversationAge(interactions),
    }
  }

  /**
   * Calculate average response time between messages
   */
  private calculateAvgResponseTime(interactions: any[]): number {
    if (interactions.length < 2) return 0

    const responseTimes: number[] = []

    for (let i = 1; i < interactions.length; i++) {
      const prev = interactions[i - 1]
      const curr = interactions[i]

      if (prev.direction !== curr.direction && curr.sentAt && prev.sentAt) {
        const diff = new Date(curr.sentAt).getTime() - new Date(prev.sentAt).getTime()
        responseTimes.push(diff)
      }
    }

    if (responseTimes.length === 0) return 0

    const avg = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    return Math.round(avg / (1000 * 60)) // Convert to minutes
  }

  /**
   * Get conversation age in days
   */
  private getConversationAge(interactions: any[]): number {
    if (interactions.length === 0) return 0

    const first = interactions[0]
    const last = interactions[interactions.length - 1]

    if (!first.sentAt || !last.sentAt) return 0

    const diff = new Date(last.sentAt).getTime() - new Date(first.sentAt).getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24)) // Convert to days
  }

  /**
   * Find orphaned warmup emails (no reply after X days)
   */
  async findOrphanedThreads(daysWithoutReply = 7) {
    const cutoffDate = new Date(Date.now() - daysWithoutReply * 24 * 60 * 60 * 1000)

    // Find outbound warmup emails with no inbound reply
    const orphanedOutbound = await prisma.warmupInteraction.findMany({
      where: {
        direction: "OUTBOUND",
        warmupId: { not: null },
        sentAt: { lte: cutoffDate },
      },
      select: {
        warmupId: true,
        threadId: true,
      },
    })

    const orphaned = []

    for (const outbound of orphanedOutbound) {
      if (!outbound.threadId) continue

      // Check if there's any inbound reply in this thread
      const hasReply = await prisma.warmupInteraction.findFirst({
        where: {
          threadId: outbound.threadId,
          direction: "INBOUND",
        },
      })

      if (!hasReply) {
        orphaned.push(outbound)
      }
    }

    return orphaned
  }

  /**
   * Detect conversation loops (same sender/recipient pair)
   */
  async detectConversationLoops(accountId: string, days = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const interactions = await prisma.warmupInteraction.findMany({
      where: {
        session: {
          sendingAccountId: accountId,
        },
        sentAt: { gte: cutoffDate },
        threadId: { not: null },
      },
      select: {
        threadId: true,
        warmupId: true,
      },
    })

    // Group by thread and count messages
    const threadCounts = new Map<string, number>()

    for (const interaction of interactions) {
      if (!interaction.threadId) continue

      const count = threadCounts.get(interaction.threadId) || 0
      threadCounts.set(interaction.threadId, count + 1)
    }

    // Flag threads with excessive back-and-forth (more than 5 messages)
    const loops = []
    for (const [threadId, count] of threadCounts.entries()) {
      if (count > 5) {
        loops.push({ threadId, messageCount: count })
      }
    }

    return loops
  }
}

export const warmupThreadTracker = new WarmupThreadTracker()