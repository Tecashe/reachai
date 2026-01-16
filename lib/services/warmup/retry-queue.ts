// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"
// import { redis } from "../../redis"
// import { emailSender } from "./email-sender"

// interface RetryJob {
//   id: string
//   accountId: string
//   sessionId?: string
//   recipientEmail: string
//   recipientName?: string
//   emailType: "warmup" | "campaign"
//   payload: any
//   attempt: number
//   maxAttempts: number
//   nextRetryAt: Date
//   lastError?: string
// }

// export class RetryQueue {
//   private readonly MAX_ATTEMPTS = 5
//   private readonly QUEUE_KEY = "retry:queue"
//   private readonly PROCESSING_KEY = "retry:processing"

//   /**
//    * Add failed send to retry queue
//    */
//   async addToQueue(
//     accountId: string,
//     emailType: "warmup" | "campaign",
//     payload: {
//       sessionId?: string
//       recipientEmail: string
//       recipientName?: string
//       subject?: string
//       body?: string
//       prospectId?: string
//     },
//     error: string,
//   ): Promise<string> {
//     const jobId = `retry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//     const job: RetryJob = {
//       id: jobId,
//       accountId,
//       sessionId: payload.sessionId,
//       recipientEmail: payload.recipientEmail,
//       recipientName: payload.recipientName,
//       emailType,
//       payload,
//       attempt: 0,
//       maxAttempts: this.MAX_ATTEMPTS,
//       nextRetryAt: this.calculateNextRetry(0),
//       lastError: error,
//     }

//     // Store job in Redis sorted set (sorted by nextRetryAt)
//     const score = job.nextRetryAt.getTime()
//     await redis.zadd(this.QUEUE_KEY, score, JSON.stringify(job))

//     // Also create a database record for persistence
//     await prisma.emailRetryJob.create({
//       data: {
//         jobId,
//         accountId,
//         emailType,
//         recipientEmail: payload.recipientEmail,
//         payload: payload as any,
//         attempt: 0,
//         maxAttempts: this.MAX_ATTEMPTS,
//         nextRetryAt: job.nextRetryAt,
//         lastError: error,
//         status: "QUEUED",
//       },
//     })

//     logger.info("Added to retry queue", {
//       jobId,
//       accountId,
//       emailType,
//       nextRetryAt: job.nextRetryAt,
//     })

//     return jobId
//   }

//   /**
//    * Process retry queue
//    * Should be called every minute by a cron job
//    */
//   async processQueue(batchSize = 50): Promise<{
//     processed: number
//     succeeded: number
//     failed: number
//     requeued: number
//   }> {
//     const now = Date.now()

//     // Get jobs ready for retry (score <= now)
//     const jobStrings = await redis.zrangebyscore(this.QUEUE_KEY, 0, now, "LIMIT", 0, batchSize)

//     if (jobStrings.length === 0) {
//       return { processed: 0, succeeded: 0, failed: 0, requeued: 0 }
//     }

//     logger.info("Processing retry queue", { jobCount: jobStrings.length })

//     let succeeded = 0
//     let failed = 0
//     let requeued = 0

//     for (const jobString of jobStrings) {
//       const job: RetryJob = JSON.parse(jobString)

//       // Move to processing set
//       await redis.zadd(this.PROCESSING_KEY, now, jobString)
//       await redis.zrem(this.QUEUE_KEY, jobString)

//       try {
//         const success = await this.retryJob(job)

//         if (success) {
//           succeeded++
//           await this.markJobSuccess(job.id)
//           await redis.zrem(this.PROCESSING_KEY, jobString)
//         } else {
//           // Retry failed, requeue or mark as failed
//           if (job.attempt >= job.maxAttempts - 1) {
//             failed++
//             await this.markJobFailed(job.id, "Max attempts reached")
//             await redis.zrem(this.PROCESSING_KEY, jobString)
//           } else {
//             requeued++
//             await this.requeueJob(job)
//             await redis.zrem(this.PROCESSING_KEY, jobString)
//           }
//         }
//       } catch (error) {
//         logger.error("Retry job processing error", error as Error, { jobId: job.id })

//         // Requeue or fail
//         if (job.attempt >= job.maxAttempts - 1) {
//           failed++
//           await this.markJobFailed(job.id, (error as Error).message)
//           await redis.zrem(this.PROCESSING_KEY, jobString)
//         } else {
//           requeued++
//           await this.requeueJob(job)
//           await redis.zrem(this.PROCESSING_KEY, jobString)
//         }
//       }
//     }

//     const summary = {
//       processed: jobStrings.length,
//       succeeded,
//       failed,
//       requeued,
//     }

//     logger.info("Retry queue processed", summary)

//     return summary
//   }

//   /**
//    * Retry a single job
//    */
//   private async retryJob(job: RetryJob): Promise<boolean> {
//     logger.info("Retrying job", {
//       jobId: job.id,
//       attempt: job.attempt + 1,
//       emailType: job.emailType,
//     })

//     // Update job attempt in DB
//     await prisma.emailRetryJob.update({
//       where: { jobId: job.id },
//       data: {
//         attempt: job.attempt + 1,
//         lastAttemptAt: new Date(),
//         status: "PROCESSING",
//       },
//     })

//     try {
//       // Get account
//       const account = await prisma.sendingAccount.findUnique({
//         where: { id: job.accountId },
//         include: {
//           user: {
//             select: { subscriptionTier: true },
//           },
//         },
//       })

//       if (!account) {
//         throw new Error("Account not found")
//       }

//       // Check account health
//       if (!account.isActive || account.pausedAt) {
//         throw new Error("Account is paused")
//       }

//       if (account.healthScore < 50) {
//         throw new Error("Account health too low")
//       }

//       // Attempt to send
//       let result

//       if (job.emailType === "warmup") {
//         result = await emailSender.sendWarmupEmail(job.sessionId!, account, job.recipientEmail, job.recipientName)
//       } else {
//         // Campaign email retry logic would go here
//         // For now, just log
//         logger.info("Campaign retry not yet implemented", { jobId: job.id })
//         return false
//       }

//       return result.success
//     } catch (error) {
//       logger.error("Retry job failed", error as Error, { jobId: job.id })

//       // Update last error
//       await prisma.emailRetryJob.update({
//         where: { jobId: job.id },
//         data: {
//           lastError: (error as Error).message,
//         },
//       })

//       return false
//     }
//   }

//   /**
//    * Requeue job with exponential backoff
//    */
//   private async requeueJob(job: RetryJob): Promise<void> {
//     const newAttempt = job.attempt + 1
//     const nextRetryAt = this.calculateNextRetry(newAttempt)

//     const updatedJob: RetryJob = {
//       ...job,
//       attempt: newAttempt,
//       nextRetryAt,
//     }

//     // Add back to queue with new retry time
//     const score = nextRetryAt.getTime()
//     await redis.zadd(this.QUEUE_KEY, score, JSON.stringify(updatedJob))

//     // Update database
//     await prisma.emailRetryJob.update({
//       where: { jobId: job.id },
//       data: {
//         attempt: newAttempt,
//         nextRetryAt,
//         status: "QUEUED",
//       },
//     })

//     logger.info("Job requeued", {
//       jobId: job.id,
//       attempt: newAttempt,
//       nextRetryAt,
//     })
//   }

//   /**
//    * Mark job as successful
//    */
//   private async markJobSuccess(jobId: string): Promise<void> {
//     await prisma.emailRetryJob.update({
//       where: { jobId },
//       data: {
//         status: "COMPLETED",
//         completedAt: new Date(),
//       },
//     })

//     logger.info("Retry job succeeded", { jobId })
//   }

//   /**
//    * Mark job as permanently failed
//    */
//   private async markJobFailed(jobId: string, error: string): Promise<void> {
//     await prisma.emailRetryJob.update({
//       where: { jobId },
//       data: {
//         status: "FAILED",
//         lastError: error,
//         completedAt: new Date(),
//       },
//     })

//     logger.error("Retry job permanently failed", { jobId, error })
//   }

//   /**
//    * Calculate next retry time with exponential backoff
//    * Attempt 0: 1 minute
//    * Attempt 1: 5 minutes
//    * Attempt 2: 15 minutes
//    * Attempt 3: 1 hour
//    * Attempt 4: 4 hours
//    */
//   private calculateNextRetry(attempt: number): Date {
//     const delays = [
//       60000, // 1 min
//       300000, // 5 min
//       900000, // 15 min
//       3600000, // 1 hour
//       14400000, // 4 hours
//     ]

//     const delay = delays[attempt] || delays[delays.length - 1]
//     return new Date(Date.now() + delay)
//   }

//   /**
//    * Get queue stats
//    */
//   async getStats(): Promise<{
//     queued: number
//     processing: number
//     completedToday: number
//     failedToday: number
//     avgRetryAttempts: number
//   }> {
//     const queued = await redis.zcard(this.QUEUE_KEY)
//     const processing = await redis.zcard(this.PROCESSING_KEY)

//     const today = new Date()
//     today.setHours(0, 0, 0, 0)

//     const jobs = await prisma.emailRetryJob.findMany({
//       where: {
//         createdAt: { gte: today },
//       },
//       select: {
//         status: true,
//         attempt: true,
//       },
//     })

//     const completedToday = jobs.filter((j) => j.status === "COMPLETED").length
//     const failedToday = jobs.filter((j) => j.status === "FAILED").length
//     const avgRetryAttempts = jobs.length > 0 ? jobs.reduce((sum, j) => sum + j.attempt, 0) / jobs.length : 0

//     return {
//       queued,
//       processing,
//       completedToday,
//       failedToday,
//       avgRetryAttempts: Math.round(avgRetryAttempts * 10) / 10,
//     }
//   }

//   /**
//    * Clear old completed/failed jobs
//    */
//   async cleanup(daysOld = 7): Promise<number> {
//     const cutoffDate = new Date()
//     cutoffDate.setDate(cutoffDate.setDate(cutoffDate.getDate() - daysOld))

//     const deleted = await prisma.emailRetryJob.deleteMany({
//       where: {
//         status: { in: ["COMPLETED", "FAILED"] },
//         completedAt: { lte: cutoffDate },
//       },
//     })

//     logger.info("Retry queue cleanup completed", {
//       deleted: deleted.count,
//       daysOld,
//     })

//     return deleted.count
//   }
// }

// export const retryQueue = new RetryQueue()

import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"
import { redis } from "@/lib/redis"

interface RetryJob {
  id: string
  accountId: string
  sessionId?: string
  peerAccountId?: string
  prospectId?: string
  recipientEmail: string
  recipientName?: string
  emailType: "WARMUP" | "CAMPAIGN"
  payload: any
  attempt: number
  maxAttempts: number
  nextRetryAt: Date
  lastError?: string
}

export class RetryQueue {
  private readonly MAX_ATTEMPTS = 5
  private readonly QUEUE_KEY = "retry:queue"
  private readonly PROCESSING_KEY = "retry:processing"

  /**
   * Add failed send to retry queue
   */
  async addToQueue(
    accountId: string,
    emailType: "WARMUP" | "CAMPAIGN",
    payload: {
      sessionId?: string
      peerAccountId?: string
      prospectId?: string
      recipientEmail: string
      recipientName?: string
      subject?: string
      body?: string
    },
    error: string,
  ): Promise<string> {
    const jobId = `retry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // const retryData = {
    //   sendingAccountId: accountId,
    //   emailType,
    //   sessionId: payload.sessionId,
    //   prospectId: payload.prospectId,
    //   toEmail: payload.recipientEmail,
    //   fromEmail: "",
    //   subject: payload.subject ?? "No subject",
    //   body: payload.body ?? "",
    //   attemptCount: 0,
    //   maxAttempts: this.MAX_ATTEMPTS,
    //   nextRetryAt: this.calculateNextRetry(0),
    //   lastError: error,
    //   status: "PENDING" as const,
    // }
    const account = await prisma.sendingAccount.findUnique({
      where: { id: accountId },
      select: { userId: true }
    })

    if (!account) {
      throw new Error("Account not found")
    }

    const retryData = {
      userId: account.userId, // Add this
      sendingAccountId: accountId,
      emailType,
      sessionId: payload.sessionId,
      prospectId: payload.prospectId,
      toEmail: payload.recipientEmail,
      fromEmail: "",
      subject: payload.subject ?? "No subject",
      body: payload.body ?? "",
      attemptCount: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      nextRetryAt: this.calculateNextRetry(0),
      lastError: error,
      status: "PENDING" as const,
    }

    const score = retryData.nextRetryAt.getTime()
    await redis.zadd(this.QUEUE_KEY, {
      score,
      member: jobId,
    })

    await prisma.retryQueue.create({
      data: retryData,
    })

    logger.info("Added to retry queue", {
      jobId,
      accountId,
      emailType,
      nextRetryAt: retryData.nextRetryAt,
    })

    return jobId
  }

  /**
   * Process retry queue
   * Should be called every minute by a cron job
   */
  async processQueue(batchSize = 50): Promise<{
    processed: number
    succeeded: number
    failed: number
    requeued: number
  }> {
    const now = Date.now()

    const jobIds = await redis.zrange(this.QUEUE_KEY, 0, now, {
      byScore: true,
    })

    if (jobIds.length === 0) {
      return { processed: 0, succeeded: 0, failed: 0, requeued: 0 }
    }

    logger.info("Processing retry queue", { jobCount: jobIds.length })

    let succeeded = 0
    let failed = 0
    let requeued = 0

    for (const jobId of jobIds) {
      const retryRecord = await prisma.retryQueue.findUnique({
        where: { id: jobId as string },
      })

      if (!retryRecord) continue

      const job: RetryJob = {
        id: retryRecord.id,
        accountId: retryRecord.sendingAccountId,
        sessionId: retryRecord.sessionId || undefined,
        prospectId: retryRecord.prospectId || undefined,
        recipientEmail: retryRecord.toEmail,
        emailType: retryRecord.emailType as "WARMUP" | "CAMPAIGN",
        payload: {},
        attempt: retryRecord.attemptCount,
        maxAttempts: retryRecord.maxAttempts,
        nextRetryAt: retryRecord.nextRetryAt,
        lastError: retryRecord.lastError || undefined,
      }

      await redis.zrem(this.QUEUE_KEY, jobId as string)

      try {
        const success = await this.retryJob(job)

        if (success) {
          succeeded++
          await this.markJobSuccess(job.id)
        } else {
          if (job.attempt >= job.maxAttempts - 1) {
            failed++
            await this.markJobFailed(job.id, "Max attempts reached")
          } else {
            requeued++
            await this.requeueJob(job)
          }
        }
      } catch (error) {
        logger.error("Retry job processing error", error as Error, { jobId: job.id })

        if (job.attempt >= job.maxAttempts - 1) {
          failed++
          await this.markJobFailed(job.id, (error as Error).message)
        } else {
          requeued++
          await this.requeueJob(job)
        }
      }
    }

    const summary = {
      processed: jobIds.length,
      succeeded,
      failed,
      requeued,
    }

    logger.info("Retry queue processed", summary)

    return summary
  }

  /**
   * Retry a single job
   */
  private async retryJob(job: RetryJob): Promise<boolean> {
    logger.info("Retrying job", {
      jobId: job.id,
      attempt: job.attempt + 1,
      emailType: job.emailType,
    })

    await prisma.retryQueue.update({
      where: { id: job.id },
      data: {
        attemptCount: job.attempt + 1,
        lastAttemptAt: new Date(),
        status: "PROCESSING",
      },
    })

    try {
      // Get account
      const account = await prisma.sendingAccount.findUnique({
        where: { id: job.accountId },
        include: {
          user: {
            select: { subscriptionTier: true },
          },
        },
      })

      if (!account) {
        throw new Error("Account not found")
      }

      // Check account health
      if (!account.isActive || account.pausedAt) {
        throw new Error("Account is paused")
      }

      if (account.healthScore < 50) {
        throw new Error("Account health too low")
      }

      // For now, return false to indicate retry is needed
      // Actual implementation would call email sender
      return false
    } catch (error) {
      logger.error("Retry job failed", error as Error, { jobId: job.id })

      await prisma.retryQueue.update({
        where: { id: job.id },
        data: {
          lastError: (error as Error).message,
        },
      })

      return false
    }
  }

  /**
   * Requeue job with exponential backoff
   */
  private async requeueJob(job: RetryJob): Promise<void> {
    const newAttempt = job.attempt + 1
    const nextRetryAt = this.calculateNextRetry(newAttempt)

    const score = nextRetryAt.getTime()
    await redis.zadd(this.QUEUE_KEY, {
      score,
      member: job.id,
    })

    // Update database
    await prisma.retryQueue.update({
      where: { id: job.id },
      data: {
        attemptCount: newAttempt,
        nextRetryAt,
        status: "PENDING",
      },
    })

    logger.info("Job requeued", {
      jobId: job.id,
      attempt: newAttempt,
      nextRetryAt,
    })
  }

  /**
   * Mark job as successful
   */
  private async markJobSuccess(jobId: string): Promise<void> {
    await prisma.retryQueue.update({
      where: { id: jobId },
      data: {
        status: "SUCCEEDED",
        succeededAt: new Date(),
      },
    })

    logger.info("Retry job succeeded", { jobId })
  }

  /**
   * Mark job as permanently failed
   */
  private async markJobFailed(jobId: string, error: string): Promise<void> {
    await prisma.retryQueue.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        lastError: error,
        failedAt: new Date(),
      },
    })

    logger.error("Retry job permanently failed", { jobId, error })
  }

  /**
   * Calculate next retry time with exponential backoff
   * Attempt 0: 1 minute
   * Attempt 1: 5 minutes
   * Attempt 2: 15 minutes
   * Attempt 3: 1 hour
   * Attempt 4: 4 hours
   */
  private calculateNextRetry(attempt: number): Date {
    const delays = [
      60000, // 1 min
      300000, // 5 min
      900000, // 15 min
      3600000, // 1 hour
      14400000, // 4 hours
    ]

    const delay = delays[attempt] || delays[delays.length - 1]
    return new Date(Date.now() + delay)
  }

  /**
   * Get queue stats
   */
  async getStats(): Promise<{
    queued: number
    processing: number
    completedToday: number
    failedToday: number
    avgRetryAttempts: number
  }> {
    const queued = await redis.zcard(this.QUEUE_KEY)
    const processing = await redis.zcard(this.PROCESSING_KEY)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const jobs = await prisma.retryQueue.findMany({
      where: {
        createdAt: { gte: today },
      },
      select: {
        status: true,
        attemptCount: true,
      },
    })

    const completedToday = jobs.filter((j) => j.status === "SUCCEEDED").length
    const failedToday = jobs.filter((j) => j.status === "FAILED").length
    const avgRetryAttempts = jobs.length > 0 ? jobs.reduce((sum, j) => sum + j.attemptCount, 0) / jobs.length : 0

    return {
      queued,
      processing,
      completedToday,
      failedToday,
      avgRetryAttempts: Math.round(avgRetryAttempts * 10) / 10,
    }
  }

  /**
   * Clear old completed/failed jobs
   */
  async cleanup(daysOld = 7): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const deleted = await prisma.retryQueue.deleteMany({
      where: {
        status: { in: ["SUCCEEDED", "FAILED"] },
        OR: [{ succeededAt: { lte: cutoffDate } }, { failedAt: { lte: cutoffDate } }],
      },
    })

    logger.info("Retry queue cleanup completed", {
      deleted: deleted.count,
      daysOld,
    })

    return deleted.count
  }
}

export const retryQueue = new RetryQueue()
