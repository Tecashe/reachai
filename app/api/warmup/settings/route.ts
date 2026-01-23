import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const settings = await db.userSettings.findUnique({
            where: { userId: user.id },
        })

        const preferences = (settings?.preferences as any) || {}

        // Default warmup settings
        const warmupSettings = {
            autoWarmupEnabled: preferences.warmup_auto_enabled ?? true,
            aiOptimizationEnabled: preferences.warmup_ai_enabled ?? true,
            peerWarmupEnabled: preferences.warmup_peer_enabled ?? true,
            defaultDailyLimit: preferences.warmup_daily_limit ?? 20,
            healthAlertsEnabled: preferences.warmup_health_alerts ?? true,
            spamDetectionEnabled: preferences.warmup_spam_alerts ?? true,
            dailySummaryEnabled: preferences.warmup_daily_summary ?? false,
            blacklistAlertsEnabled: preferences.warmup_blacklist_alerts ?? true,
            activeDays: preferences.warmup_schedule_days ?? ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            activeHours: preferences.warmup_schedule_hours ?? [9, 18],
        }

        return NextResponse.json(warmupSettings)
    } catch (error) {
        console.error("[Settings] Error fetching warmup settings:", error)
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const {
            autoWarmupEnabled,
            aiOptimizationEnabled,
            peerWarmupEnabled,
            defaultDailyLimit,
            healthAlertsEnabled,
            spamDetectionEnabled,
            dailySummaryEnabled,
            blacklistAlertsEnabled,
            activeDays,
            activeHours
        } = body

        // Get existing settings to merge
        const currentSettings = await db.userSettings.findUnique({
            where: { userId: user.id },
        })

        const currentPreferences = (currentSettings?.preferences as any) || {}

        // Update preferences
        const updatedPreferences = {
            ...currentPreferences,
            warmup_auto_enabled: autoWarmupEnabled,
            warmup_ai_enabled: aiOptimizationEnabled,
            warmup_peer_enabled: peerWarmupEnabled,
            warmup_daily_limit: defaultDailyLimit,
            warmup_health_alerts: healthAlertsEnabled,
            warmup_spam_alerts: spamDetectionEnabled,
            warmup_daily_summary: dailySummaryEnabled,
            warmup_blacklist_alerts: blacklistAlertsEnabled,
            warmup_schedule_days: activeDays,
            warmup_schedule_hours: activeHours,
        }

        await db.userSettings.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                preferences: updatedPreferences,
            },
            update: {
                preferences: updatedPreferences,
            },
        })

        return NextResponse.json({ success: true, settings: updatedPreferences })
    } catch (error) {
        console.error("[Settings] Error updating warmup settings:", error)
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }
}
