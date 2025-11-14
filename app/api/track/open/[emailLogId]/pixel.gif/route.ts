// import { type NextRequest, NextResponse } from "next/server"
// import { emailTracking } from "@/lib/services/email-tracking"

// // 1x1 transparent GIF
// const PIXEL_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64")

// export async function GET(request: NextRequest, { params }: { params: { emailLogId: string } }) {
//   const { emailLogId } = params

//   // Record the open asynchronously (don't wait)
//   emailTracking.recordOpen(emailLogId).catch((error) => {
//     console.error("Failed to record open:", error)
//   })

//   // Return tracking pixel immediate
//   return new NextResponse(PIXEL_GIF, {
//     status: 200,
//     headers: {
//       "Content-Type": "image/gif",
//       "Cache-Control": "no-cache, no-store, must-revalidate",
//       Pragma: "no-cache",
//       Expires: "0",
//     },
//   })
// }
import { type NextRequest, NextResponse } from "next/server"
import { emailTracking } from "@/lib/services/email-tracking"

// 1x1 transparent GIF
const PIXEL_GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64")

export async function GET(request: NextRequest, { params }: { params: { emailLogId: string } }) {
  const { emailLogId } = params

  // Get user agent and IP for tracking
  const userAgent = request.headers.get("user-agent") || undefined
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

  // Record the open asynchronously (don't wait)
  emailTracking.trackEmailOpen(emailLogId, userAgent, ipAddress).catch((error) => {
    console.error("[track] Failed to record open:", error)
  })

  // Return tracking pixel immediately
  return new NextResponse(PIXEL_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}