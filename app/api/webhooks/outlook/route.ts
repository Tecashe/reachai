import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const validationToken = headersList.get("validationtoken")

    // Microsoft Graph webhook validation
    if (validationToken) {
      return new NextResponse(validationToken, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      })
    }

    const body = await req.json()
    const { value } = body

    if (!value || !Array.isArray(value)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Process each notification
    for (const notification of value) {
      const { resource, resourceData } = notification

      if (resourceData?.["@odata.type"] === "#Microsoft.Graph.Message") {
        await processOutlookReply(resourceData)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Outlook webhook error", error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processOutlookReply(messageData: any) {
  logger.info("Processing Outlook reply", { messageId: messageData.id })
  // Implementation will process the reply through the reply detector
}
