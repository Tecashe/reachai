// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/db"
// import { networkQualityControl } from "@/lib/services/netwrok-quality-control"
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

//     logger.info("Starting network quality check")

//     // Get all accounts opted into peer warmup
//     const peerAccounts = await prisma.sendingAccount.findMany({
//       where: {
//         peerWarmupOptIn: true,
//         isActive: true,
//       },
//       include: {
//         user: true,
//       },
//     })

//     logger.info(`Found ${peerAccounts.length} peer accounts to evaluate`)

//     let evaluated = 0
//     let downgraded = 0
//     let removed = 0

//     // Evaluate each peer account
//     for (const account of peerAccounts) {
//       try {
//         const result = await networkQualityControl.enforceQualityStandards(account.id)

//         evaluated++
//         if (result.action === "downgrade") downgraded++
//         if (result.action === "remove") removed++
//       } catch (error) {
//         logger.error(`Error evaluating peer account ${account.email}:`, error as Error)
//       }
//     }

//     logger.info("Network quality check complete", { evaluated, downgraded, removed })

//     return NextResponse.json({
//       success: true,
//       evaluated,
//       downgraded,
//       removed,
//       timestamp: new Date().toISOString(),
//     })
//   } catch (error) {
//     logger.error("Network quality check error", error as Error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { networkQualityControl } from "@/lib/services/netwrok-quality-control"
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

    logger.info("Starting network quality check")

    // Get all accounts opted into peer warmup
    const peerAccounts = await prisma.sendingAccount.findMany({
      where: {
        peerWarmupOptIn: true,
        isActive: true,
      },
      include: {
        user: true,
      },
    })

    logger.info(`Found ${peerAccounts.length} peer accounts to evaluate`)

    const result = await networkQualityControl.enforceQualityStandards()

    logger.info("Network quality check complete", {
      evaluated: result.evaluated,
      downgraded: result.downgraded,
      removed: result.removed,
    })

    return NextResponse.json({
      success: true,
      evaluated: result.evaluated,
      downgraded: result.downgraded,
      removed: result.removed,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Network quality check error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
