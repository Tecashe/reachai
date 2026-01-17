import { inngest } from "../client"
import { logger } from "@/lib/logger"
import { conversationThreadManager } from "@/lib/services/warmup/conversation-thread-manager"

/**
 * Process conversation threads
 * Runs every 30 minutes to send next messages in active threads
 */
export const threadProcessor = inngest.createFunction(
  {
    id: "thread-processor",
    name: "Process Conversation Threads",
    concurrency: { limit: 4 },
  },
  { cron: "*/30 * * * *" }, // Every 30 minutes
  async ({ step }) => {
    logger.info("[ThreadProcessor] Starting")

    const threadIds = await step.run("get-ready-threads", async () => {
      return await conversationThreadManager.getThreadsReadyForNextMessage(100)
    })

    if (threadIds.length === 0) {
      return { processed: 0 }
    }

    const results = await step.run("process-threads", async () => {
      const promises = threadIds.map((threadId) => conversationThreadManager.processThreadMessage(threadId))
      return await Promise.all(promises)
    })

    const succeeded = results.filter((r) => r.success).length

    logger.info("[ThreadProcessor] Completed", {
      total: threadIds.length,
      succeeded,
    })

    return { processed: threadIds.length, succeeded }
  },
)
