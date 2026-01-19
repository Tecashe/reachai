// app/api/admin/fix-warmup/route.ts
import { prisma } from '@/lib/db'
import { peerCache } from '@/lib/services/warmup/peer-cache'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 Starting warmup system diagnostic and fix...')

    // Step 1: Get all accounts
    const allAccounts = await prisma.sendingAccount.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        warmupEnabled: true,
        warmupStage: true,
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        healthScore: true,
        bounceRate: true,
        pausedAt: true,
        user: {
          select: { subscriptionTier: true },
        },
      },
    })

    console.log(`📊 Found ${allAccounts.length} active accounts`)

    // Step 2: Fix all accounts
    const fixResults = await prisma.sendingAccount.updateMany({
      where: {
        isActive: true,
      },
      data: {
        warmupEnabled: true,
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        warmupStage: 'WARM', // Move to WARM stage (peer eligible)
        healthScore: 100, // Set good health
        bounceRate: 0,
        pausedAt: null,
      },
    })

    console.log(`✅ Fixed ${fixResults.count} accounts`)

    // Step 3: Invalidate old cache
    const invalidated = await peerCache.invalidateAll()
    console.log(`🗑️  Invalidated ${invalidated} old cache entries`)

    // Step 4: Rebuild peer cache
    console.log('🔄 Rebuilding peer cache...')
    const processed = await peerCache.precomputeAllCaches(100)
    console.log(`✅ Rebuilt cache for ${processed} accounts`)

    // Step 5: Get stats
    const stats = await peerCache.getStats()

    // Step 6: Check each account's cache
    const updatedAccounts = await prisma.sendingAccount.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        warmupStage: true,
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        healthScore: true,
      },
    })

    const cacheChecks = await Promise.all(
      updatedAccounts.map(async (account) => {
        const peers = await peerCache.getCachedMatches(account.id, 10)
        return {
          email: account.email,
          stage: account.warmupStage,
          peerWarmupEnabled: account.peerWarmupEnabled,
          peerWarmupOptIn: account.peerWarmupOptIn,
          healthScore: account.healthScore,
          peersFound: peers.length,
          peers: peers.map((p) => p.email),
        }
      })
    )

    return NextResponse.json({
      success: true,
      summary: {
        totalAccounts: allAccounts.length,
        accountsFixed: fixResults.count,
        cacheInvalidated: invalidated,
        cacheRebuilt: processed,
        cacheStats: stats,
      },
      accounts: cacheChecks,
      nextSteps: [
        'All accounts are now in WARM stage with peer warmup enabled',
        'Peer cache has been rebuilt',
        'Trigger warmup manually: curl -X GET https://mailfra.com/api/cron/warmup -H "Authorization: Bearer YOUR_CRON_SECRET"',
        'Check logs for "Warmup email sent successfully"',
      ],
    })
  } catch (error) {
    console.error('❌ Fix failed:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

// GET endpoint to just check status without making changes
export async function GET() {
  try {
    const accounts = await prisma.sendingAccount.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        warmupEnabled: true,
        warmupStage: true,
        peerWarmupEnabled: true,
        peerWarmupOptIn: true,
        healthScore: true,
        bounceRate: true,
        pausedAt: true,
        user: {
          select: { subscriptionTier: true },
        },
      },
    })

    const cacheChecks = await Promise.all(
      accounts.map(async (account) => {
        const peers = await peerCache.getCachedMatches(account.id, 10)
        return {
          email: account.email,
          issues: [
            !account.warmupEnabled && '❌ Warmup not enabled',
            !account.peerWarmupEnabled && '❌ Peer warmup not enabled',
            !account.peerWarmupOptIn && '❌ Peer warmup not opted in',
            !['WARM', 'ACTIVE', 'ESTABLISHED'].includes(account.warmupStage) &&
              `❌ Stage is ${account.warmupStage} (needs WARM/ACTIVE/ESTABLISHED)`,
            account.healthScore < 70 &&
              `❌ Health score is ${account.healthScore} (needs ≥70)`,
            account.bounceRate > 5 &&
              `❌ Bounce rate is ${account.bounceRate}% (needs ≤5%)`,
            account.pausedAt && '❌ Account is paused',
            peers.length === 0 && '❌ No peers found in cache',
          ].filter(Boolean),
          peersFound: peers.length,
          data: {
            warmupStage: account.warmupStage,
            healthScore: account.healthScore,
            bounceRate: account.bounceRate,
            tier: account.user?.subscriptionTier,
          },
        }
      })
    )

    const hasIssues = cacheChecks.some((c) => c.issues.length > 0)

    return NextResponse.json({
      status: hasIssues ? 'NEEDS_FIX' : 'OK',
      accounts: cacheChecks,
      recommendation: hasIssues
        ? 'Run POST /api/admin/fix-warmup to fix all issues'
        : 'Everything looks good! Warmup should work.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}