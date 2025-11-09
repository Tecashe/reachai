import { type NextRequest, NextResponse } from "next/server"
import { emailTracking } from "@/lib/services/email-tracking"

export async function GET(request: NextRequest, { params }: { params: { emailLogId: string } }) {
  const { emailLogId } = params
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing target URL" }, { status: 400 })
  }

  // Record the click asynchronously
  emailTracking.recordClick(emailLogId, targetUrl).catch((error) => {
    console.error("Failed to record click:", error)
  })

  // Redirect to target URL immediately
  return NextResponse.redirect(targetUrl)
}
