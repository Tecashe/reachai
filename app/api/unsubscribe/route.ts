import { type NextRequest, NextResponse } from "next/server"
import { complianceManager } from "@/lib/services/compliance-manager"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 })
  }

  try {
    // Decode token to get prospect ID
    const decoded = Buffer.from(token, "base64url").toString()
    const [prospectId] = decoded.split(":")

    // Get prospect email
    const { db } = await import("@/lib/db")
    const prospect = await db.prospect.findUnique({
      where: { id: prospectId },
      select: { email: true },
    })

    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 })
    }

    // Process unsubscribe
    await complianceManager.handleUnsubscribe({
      email: prospect.email,
      source: "link",
    })

    // Return success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 100px auto;
              padding: 40px;
              text-align: center;
            }
            h1 { color: #10b981; }
            p { color: #6b7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>✓ You've been unsubscribed</h1>
          <p>You will no longer receive emails from us at <strong>${prospect.email}</strong>.</p>
          <p>If this was a mistake, please contact us.</p>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    logger.error("Unsubscribe failed", error as Error, { token })
    return NextResponse.json({ error: "Failed to process unsubscribe" }, { status: 500 })
  }
}
