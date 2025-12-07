import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const prospectId = searchParams.get("prospectId")

    if (!prospectId) {
      return NextResponse.json({ error: "Prospect ID required" }, { status: 400 })
    }

    const prospect = await db.prospect.findFirst({
      where: {
        id: prospectId,
        campaign: { userId: user.id },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        dealScore: true,
        emailsReceived: true,
        emailsOpened: true,
        emailsClicked: true,
        replied: true,
        status: true,
        crmSyncedAt: true,
      },
    })

    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 })
    }

    // Calculate score breakdown
    const engagement = {
      score: 0,
      max: 30,
      factors: [] as Array<{ name: string; value: string; impact: string }>,
    }

    const profile = {
      score: 0,
      max: 25,
      factors: [] as Array<{ name: string; value: string; impact: string }>,
    }

    const activity = {
      score: 0,
      max: 25,
      factors: [] as Array<{ name: string; value: string; impact: string }>,
    }

    const timing = {
      score: 0,
      max: 20,
      factors: [] as Array<{ name: string; value: string; impact: string }>,
    }

    // Engagement scoring
    const openRate = prospect.emailsReceived > 0 ? (prospect.emailsOpened / prospect.emailsReceived) * 100 : 0
    const clickRate = prospect.emailsOpened > 0 ? (prospect.emailsClicked / prospect.emailsOpened) * 100 : 0

    if (openRate >= 50) {
      engagement.score += 15
      engagement.factors.push({ name: "Open Rate", value: `${openRate.toFixed(0)}%`, impact: "positive" })
    } else if (openRate >= 25) {
      engagement.score += 8
      engagement.factors.push({ name: "Open Rate", value: `${openRate.toFixed(0)}%`, impact: "neutral" })
    } else {
      engagement.factors.push({ name: "Open Rate", value: `${openRate.toFixed(0)}%`, impact: "negative" })
    }

    if (clickRate >= 20) {
      engagement.score += 10
      engagement.factors.push({ name: "Click Rate", value: `${clickRate.toFixed(0)}%`, impact: "positive" })
    } else if (clickRate >= 5) {
      engagement.score += 5
      engagement.factors.push({ name: "Click Rate", value: `${clickRate.toFixed(0)}%`, impact: "neutral" })
    }

    if (prospect.replied) {
      engagement.score += 5
      engagement.factors.push({ name: "Has Replied", value: "Yes", impact: "positive" })
    }

    // Profile scoring
    if (prospect.company) {
      profile.score += 10
      profile.factors.push({ name: "Company", value: prospect.company, impact: "positive" })
    } else {
      profile.factors.push({ name: "Company", value: "Missing", impact: "negative" })
    }

    if (prospect.jobTitle) {
      profile.score += 10
      profile.factors.push({ name: "Job Title", value: prospect.jobTitle, impact: "positive" })
    }

    if (prospect.firstName && prospect.lastName) {
      profile.score += 5
      profile.factors.push({
        name: "Full Name",
        value: `${prospect.firstName} ${prospect.lastName}`,
        impact: "positive",
      })
    }

    // Activity scoring
    if (prospect.status === "REPLIED") {
      activity.score += 25
      activity.factors.push({ name: "Status", value: "Replied", impact: "positive" })
    } else if (prospect.status === "CONTACTED") {
      activity.score += 10
      activity.factors.push({ name: "Status", value: "Contacted", impact: "neutral" })
    } else {
      activity.factors.push({ name: "Status", value: prospect.status, impact: "neutral" })
    }

    // Timing scoring
    if (prospect.crmSyncedAt) {
      const daysSinceSync = Math.floor((Date.now() - new Date(prospect.crmSyncedAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceSync <= 7) {
        timing.score += 20
        timing.factors.push({ name: "Last Sync", value: `${daysSinceSync} days ago`, impact: "positive" })
      } else if (daysSinceSync <= 30) {
        timing.score += 10
        timing.factors.push({ name: "Last Sync", value: `${daysSinceSync} days ago`, impact: "neutral" })
      } else {
        timing.factors.push({ name: "Last Sync", value: `${daysSinceSync} days ago`, impact: "negative" })
      }
    }

    const totalScore = engagement.score + profile.score + activity.score + timing.score

    // Generate recommendation
    let recommendation = ""
    if (totalScore >= 70) {
      recommendation = "High Priority - Schedule a call or send a personalized follow-up immediately"
    } else if (totalScore >= 40) {
      recommendation = "Nurture Lead - Add to drip sequence and monitor engagement"
    } else {
      recommendation = "Low Priority - Focus on leads with higher engagement signals"
    }

    return NextResponse.json({
      success: true,
      data: {
        prospect: {
          id: prospect.id,
          email: prospect.email,
          firstName: prospect.firstName,
          lastName: prospect.lastName,
          company: prospect.company,
          dealScore: prospect.dealScore,
        },
        breakdown: { engagement, profile, activity, timing },
        totalScore,
        recommendation,
      },
    })
  } catch (error) {
    console.error("[CRM Scoring] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
