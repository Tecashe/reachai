import { NextResponse } from 'next/server'
import { inngest } from '@/lib/inngest/client'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * LIGHTWEIGHT CRON SCHEDULER
 * This endpoint is hit by Vercel Cron
 * It just triggers the Inngest scheduler - no heavy processing here!
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('Cron triggered - sending event to Inngest')

    // Just send an event to Inngest - let it handle the heavy lifting
    await inngest.send({
      name: 'warmup/scheduler.trigger',
      data: {
        triggeredBy: 'cron',
        timestamp: new Date().toISOString(),
      },
    })

    logger.info('Inngest event sent successfully')

    return NextResponse.json({
      success: true,
      message: 'Warmup scheduler triggered',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Cron error', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}