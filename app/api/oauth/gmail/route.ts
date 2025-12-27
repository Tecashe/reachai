// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { gmailOAuth } from "@/lib/services/oauth/gmail-oauth"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Generate OAuth URL
//     const authUrl = gmailOAuth.getAuthUrl(userId)

//     // Redirect user to Google OAuth consent screen
//     return NextResponse.redirect(authUrl)
//   } catch (error) {
//     console.error("[builtbycashe] Gmail OAuth error:", error)
//     return NextResponse.json({ error: "Failed to initiate Gmail OAuth" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/email-connection`)
//   } catch (error) {
//     console.error("[v0] Email connection redirect error:", error)
//     return NextResponse.json({ error: "Failed to initiate email connection" }, { status: 500 })
//   }
// }


// app/api/auth/gmail/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { gmailXOAuth2 } from "@/lib/services/oauth/gmail-xoauth2"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.log("[v0] Unauthorized OAuth attempt")
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=unauthorized`)
    }

    console.log("[v0] Initiating Gmail OAuth for user:", userId)

    // Generate authorization URL with user ID as state
    const authUrl = gmailXOAuth2.getAuthorizationUrl(userId)

    console.log("[v0] Redirecting to Google OAuth...")
    
    // Redirect user to Google's OAuth consent screen
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error("[v0] Gmail OAuth initiation error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=oauth_init_failed`)
  }
}