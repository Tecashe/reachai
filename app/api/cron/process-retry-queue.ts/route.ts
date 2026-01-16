import { logger } from "@/lib/logger"
import { retryQueue } from "@/lib/services/warmup/retry-queue"

/**
 * Cron job to process retry queue
 * Should run every minute
 */
export async function processRetryQueue() {
  logger.info("Starting retry queue processing")

  try {
    const result = await retryQueue.processQueue(50)

    logger.info("Retry queue processing completed", result)

    return result
  } catch (error) {
    logger.error("Retry queue processing failed", error as Error)
    throw error
  }
}

/**
 * Cleanup old retry jobs
 * Should run daily
 */
export async function cleanupRetryQueue() {
  logger.info("Starting retry queue cleanup")

  try {
    const deleted = await retryQueue.cleanup(7) // Keep 7 days

    logger.info("Retry queue cleanup completed", { deleted })

    return { deleted }
  } catch (error) {
    logger.error("Retry queue cleanup failed", error as Error)
    throw error
  }
}
