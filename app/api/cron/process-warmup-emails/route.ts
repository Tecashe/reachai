// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { warmupEmailManager } from "@/lib/services/warmup-email-manager"
// import { logger } from "@/lib/logger"

// export const dynamic = "force-dynamic"
// export const maxDuration = 60

// export async function GET(request: Request) {
//   try {
//     // Verify cron secret
//     const authHeader = request.headers.get("authorization")
//     if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     logger.info("Starting warmup email processing")

//     // Get all active warmup sessions that are ready to send
//     const sessions = await db.warmupSession.findMany({
//       where: {
//         status: "ACTIVE",
//         nextScheduledSend: {
//           lte: new Date(),
//         },
//       },
//       include: {
//         sendingAccount: true,
//       },
//     })

//     logger.info(`Found ${sessions.length} sessions ready to send`)

//     const results = {
//       processed: 0,
//       succeeded: 0,
//       failed: 0,
//     }

//     // Process each session
//     for (const session of sessions) {
//       results.processed++

//       // Check daily limit
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)

//       const sentToday = await db.warmupInteraction.count({
//         where: {
//           sessionId: session.id,
//           sentAt: {
//             gte: today,
//           },
//         },
//       })

//       if (sentToday >= session.dailyLimit) {
//         logger.info("Daily limit reached for session", { sessionId: session.id })
//         continue
//       }

//       // Send warmup email
//       const result = await warmupEmailManager.sendWarmupEmail(session.id)
//       if (result.success) {
//         results.succeeded++
//       } else {
//         results.failed++
//       }
//     }

//     logger.info("Warmup email processing complete", results)

//     return NextResponse.json({
//       success: true,
//       ...results,
//     })
//   } catch (error) {
//     logger.error("Warmup email processing error", error as Error)
//     return NextResponse.json(
//       {
//         success: false,
//         error: (error as Error).message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processAccountWarmup, processScheduledReplies } from "@/lib/services/warmup-email-manager"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    logger.info("Starting warmup email processing")

    await processScheduledReplies()

    // Get all sending accounts with warmup enabled
    const sendingAccounts = await prisma.sendingAccount.findMany({
      where: {
        warmupEnabled: true,
        isActive: true,
        pausedAt: null,
      },
    })

    logger.info(`Found ${sendingAccounts.length} accounts for warmup`)

    let processed = 0
    let errors = 0

    // Process each account
    for (const account of sendingAccounts) {
      try {
        await processAccountWarmup(account.id)
        processed++
      } catch (error) {
        logger.error(`Error processing warmup for ${account.email}:`, error as Error)
        errors++
      }
    }

    logger.info("Warmup processing complete", { processed, errors })

    return NextResponse.json({
      success: true,
      processed,
      errors,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Warmup cron error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
