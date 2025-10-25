import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { gmailOAuth } from "@/lib/services/oauth/gmail-oauth"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate OAuth URL
    const authUrl = gmailOAuth.getAuthUrl(userId)

    // Redirect user to Google OAuth consent screen
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("[v0] Gmail OAuth error:", error)
    return NextResponse.json({ error: "Failed to initiate Gmail OAuth" }, { status: 500 })
  }
}
