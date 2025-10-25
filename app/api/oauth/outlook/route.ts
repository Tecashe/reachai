import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { outlookOAuth } from "@/lib/services/oauth/outlook-oauth"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate OAuth URL
    const authUrl = outlookOAuth.getAuthUrl(userId)

    // Redirect user to Microsoft OAuth consent screen
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("[v0] Outlook OAuth error:", error)
    return NextResponse.json({ error: "Failed to initiate Outlook OAuth" }, { status: 500 })
  }
}
