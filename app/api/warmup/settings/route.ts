import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"

// GET warmup settings for current user
export async function GET() {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create user warmup settings
    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    })

    // Return default settings if none exist
    if (!settings) {
      return NextResponse.json({
        startVolume: 5,
        targetVolume: 50,
        rampSpeed: "moderate",
        businessHoursOnly: true,
        weekendSending: false,
        timezone: "America/New_York",
        spamRecovery: {
          enabled: true,
          moveToInbox: true,
          markAsNotSpam: true,
          markAsImportant: true,
          starMessage: false,
          addToPrimary: true,
          frequency: "immediate",
        },
        contentQuality: "enhanced",
        replyPercentage: 50,
        conversationLength: 3,
        alerts: {
          emailNotifications: true,
          inboxRateThreshold: 90,
          spamRateThreshold: 5,
          reputationThreshold: 85,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching warmup settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT update warmup settings
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      startVolume,
      targetVolume,
      rampSpeed,
      businessHoursOnly,
      weekendSending,
      timezone,
      spamRecovery,
      contentQuality,
      replyPercentage,
      conversationLength,
      alerts,
    } = body

    // Upsert user settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        // Store warmup-specific settings in the preferences JSON field
        preferences: {
          warmup: {
            startVolume,
            targetVolume,
            rampSpeed,
            businessHoursOnly,
            weekendSending,
            timezone,
            spamRecovery,
            contentQuality,
            replyPercentage,
            conversationLength,
            alerts,
          },
        },
      },
      create: {
        userId: user.id,
        preferences: {
          warmup: {
            startVolume,
            targetVolume,
            rampSpeed,
            businessHoursOnly,
            weekendSending,
            timezone,
            spamRecovery,
            contentQuality,
            replyPercentage,
            conversationLength,
            alerts,
          },
        },
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Error updating warmup settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
