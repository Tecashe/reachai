// import { type NextRequest, NextResponse } from "next/server"
// import { emailTracking } from "@/lib/services/email-tracking"

// export async function GET(request: NextRequest, { params }: { params: { emailLogId: string } }) {
//   const { emailLogId } = params
//   const { searchParams } = new URL(request.url)
//   const targetUrl = searchParams.get("url")

//   if (!targetUrl) {
//     return NextResponse.json({ error: "Missing target URL" }, { status: 400 })
//   }

//   // Record the click asynchronous
//   emailTracking.recordClick(emailLogId, targetUrl).catch((error) => {
//     console.error("Failed to record click:", error)
//   })

//   // Redirect to target URL immediately
//   return NextResponse.redirect(targetUrl)
// }

import { type NextRequest, NextResponse } from "next/server"
import { emailTracking } from "@/lib/services/email-tracking"

export async function GET(request: NextRequest, { params }: { params: { emailLogId: string } }) {
  const { emailLogId } = params
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing target URL" }, { status: 400 })
  }

  const userAgent = request.headers.get("user-agent") || undefined
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

  // Record the click asynchronously (don't wait)
  emailTracking.trackLinkClick(emailLogId, targetUrl, userAgent, ipAddress).catch((error) => {
    console.error("[track] Failed to record click:", error)
  })

  // Redirect to target URL immediately
  return NextResponse.redirect(targetUrl)
}