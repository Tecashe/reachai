

import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import {
  warmupScheduler,
  warmupAccountProcessor,
  warmupReplyProcessor,
  peerCacheRebuilder,
  peerCacheRefresh,
  healthMonitorJob,
  healthCheckJob,
  dailyMaintenance,
} from '@/lib/inngest/functions'

// Register all Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    warmupScheduler,
    warmupAccountProcessor,
    warmupReplyProcessor,
    peerCacheRebuilder,
    peerCacheRefresh,
    healthMonitorJob,
    healthCheckJob,
    dailyMaintenance,
  ],
})