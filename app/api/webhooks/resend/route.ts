import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { EmailStatus, ProspectStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log("[builtbycashe] Resend webhook:", type, data)

    // Handle different webhook events
    switch (type) {
      case "email.delivered":
        await handleDelivered(data)
        break
      case "email.bounced":
        await handleBounced(data)
        break
      case "email.complained":
        await handleComplained(data)
        break
      default:
        console.log("[builtbycashe] Unknown webhook type:", type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[builtbycashe] Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleDelivered(data: any) {
  const { email_id } = data

  await db.emailLog.updateMany({
    where: { providerId: email_id },
    data: {
      status: EmailStatus.DELIVERED,
      deliveredAt: new Date(),
    },
  })
}

async function handleBounced(data: any) {
  const { email_id } = data

  const log = await db.emailLog.findFirst({
    where: { providerId: email_id },
  })

  if (log) {
    await db.emailLog.update({
      where: { id: log.id },
      data: {
        status: EmailStatus.BOUNCED,
        bouncedAt: new Date(),
        errorMessage: "Email bounced",
      },
    })

    // Mark prospect as bounced
    if (log.prospectId) {
      await db.prospect.update({
        where: { id: log.prospectId },
        data: {
          status: ProspectStatus.BOUNCED,
          bounced: true,
        },
      })
    }
  }
}

async function handleComplained(data: any) {
  const { email_id } = data

  const log = await db.emailLog.findFirst({
    where: { providerId: email_id },
  })

  if (log) {
    await db.emailLog.update({
      where: { id: log.id },
      data: {
        status: EmailStatus.FAILED,
        errorMessage: "Spam complaint",
      },
    })

    // Mark prospect as unsubscribed
    if (log.prospectId) {
      await db.prospect.update({
        where: { id: log.prospectId },
        data: {
          status: ProspectStatus.UNSUBSCRIBED,
          unsubscribed: true,
        },
      })
    }
  }
}
