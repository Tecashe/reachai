
import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import {
  warmupScheduler,
  // warmupAccountProcessor,
  // warmupReplyProcessor,
  // strategyMonitor,
  // imapReplyChecker,
  // threadProcessor,
  // peerCacheRebuilder,
  // reputationAnalyzer,
  // peerCacheRefresh,
  // healthMonitorJob,
  // healthCheckJob,
  // dailyMaintenance,
} from '@/lib/inngest/functions'
import {
  automationExecutor,
  automationContinuer,
} from '@/lib/inngest/functions/automation-executor'

// Register all Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    warmupScheduler,
    // Automation functions
    automationExecutor,
    automationContinuer,
    // warmupAccountProcessor,
    // warmupReplyProcessor,
    // peerCacheRebuilder,
    // threadProcessor,
    // peerCacheRefresh,
    // healthMonitorJob,
    // healthCheckJob,
    // dailyMaintenance,
    // imapReplyChecker,
    // //inboxMonitor,
    // strategyMonitor,
    // reputationAnalyzer,
    // //retryQueueProcessor,
    // //replyProcessor,
  ],
})
