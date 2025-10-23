// import { db } from "../db"
// import { logger } from "../logger"

// interface WarmupConfig {
//   stage: string
//   dailyLimit: number
//   daysInStage: number
//   nextStage: string | null
// }

// const WARMUP_STAGES: Record<string, WarmupConfig> = {
//   NEW: {
//     stage: "NEW",
//     dailyLimit: 20,
//     daysInStage: 7,
//     nextStage: "WARMING",
//   },
//   WARMING: {
//     stage: "WARMING",
//     dailyLimit: 40,
//     daysInStage: 7,
//     nextStage: "WARM",
//   },
//   WARM: {
//     stage: "WARM",
//     dailyLimit: 60,
//     daysInStage: 7,
//     nextStage: "ACTIVE",
//   },
//   ACTIVE: {
//     stage: "ACTIVE",
//     dailyLimit: 80,
//     daysInStage: 8,
//     nextStage: "ESTABLISHED",
//   },
//   ESTABLISHED: {
//     stage: "ESTABLISHED",
//     dailyLimit: 150,
//     daysInStage: 0,
//     nextStage: null,
//   },
// }

// class WarmupManager {
//   async checkAndProgressWarmup(accountId: string): Promise<void> {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//     })

//     if (!account || !account.warmupEnabled) {
//       return
//     }

//     const currentStage = WARMUP_STAGES[account.warmupStage]
//     if (!currentStage) {
//       logger.error("Invalid warmup stage", { accountId, stage: account.warmupStage })
//       return
//     }

//     // Check if account should progress to next stage
//     const daysInStage = Math.floor((Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24))

//     if (currentStage.nextStage && daysInStage >= currentStage.daysInStage) {
//       // Check health before progressing
//       if (account.healthScore >= 80) {
//         const nextStageConfig = WARMUP_STAGES[currentStage.nextStage]

//         await db.sendingAccount.update({
//           where: { id: accountId },
//           data: {
//             warmupStage: currentStage.nextStage as any,
//             warmupDailyLimit: nextStageConfig.dailyLimit,
//             warmupProgress: 0,
//           },
//         })

//         logger.info("Account progressed to next warmup stage", {
//           accountId,
//           oldStage: currentStage.stage,
//           newStage: currentStage.nextStage,
//           newLimit: nextStageConfig.dailyLimit,
//         })
//       } else {
//         logger.warn("Account health too low to progress warmup", {
//           accountId,
//           healthScore: account.healthScore,
//           currentStage: currentStage.stage,
//         })
//       }
//     }
//   }

//   async getWarmupStatus(accountId: string) {
//     const account = await db.sendingAccount.findUnique({
//       where: { id: accountId },
//     })

//     if (!account) {
//       return null
//     }

//     const currentStage = WARMUP_STAGES[account.warmupStage]
//     const daysInStage = Math.floor((Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24))

//     const daysUntilNext = currentStage.nextStage ? Math.max(0, currentStage.daysInStage - daysInStage) : 0

//     return {
//       currentStage: account.warmupStage,
//       dailyLimit: account.warmupDailyLimit,
//       daysInStage,
//       daysUntilNext,
//       nextStage: currentStage.nextStage,
//       healthScore: account.healthScore,
//       canProgress: account.healthScore >= 80,
//     }
//   }

//   async pauseWarmup(accountId: string, reason: string): Promise<void> {
//     await db.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         warmupEnabled: false,
//         isActive: false,
//         pausedReason: reason,
//         pausedAt: new Date(),
//       },
//     })

//     logger.warn("Warmup paused", { accountId, reason })
//   }

//   async resumeWarmup(accountId: string): Promise<void> {
//     await db.sendingAccount.update({
//       where: { id: accountId },
//       data: {
//         warmupEnabled: true,
//         isActive: true,
//         pausedReason: null,
//         pausedAt: null,
//       },
//     })

//     logger.info("Warmup resumed", { accountId })
//   }
// }

// export const warmupManager = new WarmupManager()
import { db } from "../db"
import { logger } from "../logger"

interface WarmupConfig {
  stage: string
  dailyLimit: number
  daysInStage: number
  nextStage: string | null
}

const WARMUP_STAGES: Record<string, WarmupConfig> = {
  NEW: {
    stage: "NEW",
    dailyLimit: 20,
    daysInStage: 7,
    nextStage: "WARMING",
  },
  WARMING: {
    stage: "WARMING",
    dailyLimit: 40,
    daysInStage: 7,
    nextStage: "WARM",
  },
  WARM: {
    stage: "WARM",
    dailyLimit: 60,
    daysInStage: 7,
    nextStage: "ACTIVE",
  },
  ACTIVE: {
    stage: "ACTIVE",
    dailyLimit: 80,
    daysInStage: 8,
    nextStage: "ESTABLISHED",
  },
  ESTABLISHED: {
    stage: "ESTABLISHED",
    dailyLimit: 150,
    daysInStage: 0,
    nextStage: null,
  },
}

class WarmupManager {
  async checkAndProgressWarmup(accountId: string): Promise<void> {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account || !account.warmupEnabled) {
      return
    }

    const currentStage = WARMUP_STAGES[account.warmupStage]
    if (!currentStage) {
      logger.error("Invalid warmup stage", undefined, { accountId, stage: account.warmupStage })
      return
    }

    // Check if account should progress to next stage
    const daysInStage = Math.floor((Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24))

    if (currentStage.nextStage && daysInStage >= currentStage.daysInStage) {
      // Check health before progressing
      if (account.healthScore >= 80) {
        const nextStageConfig = WARMUP_STAGES[currentStage.nextStage]

        await db.sendingAccount.update({
          where: { id: accountId },
          data: {
            warmupStage: currentStage.nextStage as any,
            warmupDailyLimit: nextStageConfig.dailyLimit,
            warmupProgress: 0,
          },
        })

        logger.info("Account progressed to next warmup stage", {
          accountId,
          oldStage: currentStage.stage,
          newStage: currentStage.nextStage,
          newLimit: nextStageConfig.dailyLimit,
        })
      } else {
        logger.warn("Account health too low to progress warmup", {
          accountId,
          healthScore: account.healthScore,
          currentStage: currentStage.stage,
        })
      }
    }
  }

  async getWarmupStatus(accountId: string) {
    const account = await db.sendingAccount.findUnique({
      where: { id: accountId },
    })

    if (!account) {
      return null
    }

    const currentStage = WARMUP_STAGES[account.warmupStage]
    const daysInStage = Math.floor((Date.now() - account.warmupStartDate.getTime()) / (1000 * 60 * 60 * 24))

    const daysUntilNext = currentStage.nextStage ? Math.max(0, currentStage.daysInStage - daysInStage) : 0

    return {
      currentStage: account.warmupStage,
      dailyLimit: account.warmupDailyLimit,
      daysInStage,
      daysUntilNext,
      nextStage: currentStage.nextStage,
      healthScore: account.healthScore,
      canProgress: account.healthScore >= 80,
    }
  }

  async pauseWarmup(accountId: string, reason: string): Promise<void> {
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: false,
        isActive: false,
        pausedReason: reason,
        pausedAt: new Date(),
      },
    })

    logger.warn("Warmup paused", { accountId, reason })
  }

  async resumeWarmup(accountId: string): Promise<void> {
    await db.sendingAccount.update({
      where: { id: accountId },
      data: {
        warmupEnabled: true,
        isActive: true,
        pausedReason: null,
        pausedAt: null,
      },
    })

    logger.info("Warmup resumed", { accountId })
  }
}

export const warmupManager = new WarmupManager()
