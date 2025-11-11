import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const { id: campaignId } = await params
    const { emails, template } = await request.json()

    const campaign = await db.campaign.findUnique({
      where: { id: campaignId, userId: user!.id },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const updatePromises = Object.entries(emails).map(([prospectId, email]: [string, any]) =>
      db.prospect.update({
        where: { id: prospectId },
        data: {
          generatedEmail: {
            subject: email.subject,
            body: email.body,
            qualityScore: email.qualityScore,
            personalizationScore: email.personalizationScore,
          },
        },
      }),
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: `Saved ${Object.keys(emails).length} emails`,
    })
  } catch (error) {
    console.error("[builtbycashe] Failed to save emails:", error)
    return NextResponse.json({ error: "Failed to save emails" }, { status: 500 })
  }
}
