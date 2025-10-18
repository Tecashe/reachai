import { type NextRequest, NextResponse } from "next/server"
import { emailSender } from "@/lib/services/email-sender"
import { protectApiRoute, checkCredits } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  const creditCheck = await checkCredits(user!, "email")
  if (!creditCheck.hasCredits) return creditCheck.error

  try {
    const body = await request.json()
    const { prospectId, subject, html, text } = body

    // Get prospect details
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
      include: { campaign: true },
    })

    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 })
    }

    if (prospect.campaign?.userId !== user!.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Send email
    const result = await emailSender.sendEmail({
      to: prospect.email,
      subject,
      html,
      text,
      trackingEnabled: true,
      prospectId,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Update prospect status
    await db.prospect.update({
      where: { id: prospectId },
      data: {
        status: "CONTACTED",
        lastContactedAt: new Date(),
      },
    })

    await db.user.update({
      where: { id: user!.id },
      data: { emailCredits: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      providerId: result.providerId,
      logId: result.logId,
    })
  } catch (error) {
    console.error("[v0] Send email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
