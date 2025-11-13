"use server"

import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { campaignPerformanceMonitor } from "@/lib/services/campaign-performance-monitor"

/**
 * Cron job to monitor campaign and account performance
 * Run every hour
 */
export async function GET(request: Request) {
  try {
    console.log("[v0] Starting performance monitoring cron")

    // Get all active campaigns
    const activeCampaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
      },
    })

    const results = {
      campaignsChecked: activeCampaigns.length,
      campaignsPaused: 0,
      accountsChecked: 0,
      accountsPaused: 0,
    }

    // Check each campaign
    for (const campaign of activeCampaigns) {
      const check = await campaignPerformanceMonitor.checkCampaignPerformance(campaign.id)

      if (check.shouldPause) {
        results.campaignsPaused++
        console.log(`[v0] Auto-paused campaign ${campaign.id}: ${check.reason}`)
      }
    }

    // Check all sending accounts
    const accounts = await db.sendingAccount.findMany({
      where: {
        isActive: true,
      },
    })

    results.accountsChecked = accounts.length

    for (const account of accounts) {
      const check = await campaignPerformanceMonitor.checkAccountHealth(account.id)

      if (check.shouldPause) {
        results.accountsPaused++
        console.log(`[v0] Auto-paused account ${account.id}: ${check.reason}`)
      }
    }

    console.log("[v0] Performance monitoring complete:", results)

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("[v0] Performance monitoring error:", error)
    return NextResponse.json({ error: "Failed to monitor performance" }, { status: 500 })
  }
}
