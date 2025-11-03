// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { decryptState, exchangeCodeForToken } from "@/lib/services/crm-oauth"
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }

//     const searchParams = request.nextUrl.searchParams
//     const code = searchParams.get("code")
//     const state = searchParams.get("state")
//     const provider = searchParams.get("provider") as "hubspot" | "salesforce" | "pipedrive"

//     if (!code || !state || !provider) {
//       return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
//     }

//     // Verify state for CSRF protection
//     const stateData = decryptState(state)
//     if (stateData.userId !== userId) {
//       return NextResponse.json({ error: "Invalid state" }, { status: 401 })
//     }

//     // Exchange code for token
//     const { accessToken, refreshToken, expiresIn } = await exchangeCodeForToken(provider, code)

//     // Store integration in database
//     await db.integration.upsert({
//       where: {
//         userId_type: { userId, type: provider.toUpperCase() as any },
//       },
//       update: {
//         accessToken,
//         refreshToken,
//         expiresAt: new Date(Date.now() + expiresIn * 1000),
//       },
//       create: {
//         userId,
//         type: provider.toUpperCase() as any,
//         accessToken,
//         refreshToken,
//         expiresAt: new Date(Date.now() + expiresIn * 1000),
//       },
//     })

//     // Redirect to success page
//     return NextResponse.redirect(new URL(`/dashboard/crm?connected=${provider}`, request.url))
//   } catch (error) {
//     console.error("[v0] CRM OAuth callback error:", error)
//     return NextResponse.redirect(new URL("/dashboard/crm?error=connection_failed", request.url))
//   }
// }

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { decryptState, exchangeCodeForToken } from "@/lib/services/crm-oauth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const provider = searchParams.get("provider") as "hubspot" | "salesforce" | "pipedrive"

    if (!code || !state || !provider) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    // Verify state for CSRF protection
    const stateData = decryptState(state)
    if (stateData.userId !== userId) {
      return NextResponse.json({ error: "Invalid state" }, { status: 401 })
    }

    // Exchange code for token
    const { accessToken, refreshToken, expiresIn } = await exchangeCodeForToken(provider, code)

    // Calculate expiration date
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null

    // Store integration in database
    await db.integration.upsert({
      where: {
        userId_type: { userId, type: provider.toUpperCase() as any },
      },
      update: {
        accessToken,
        ...(refreshToken && { refreshToken }), // Only include if present
        ...(expiresAt && { expiresAt }),
      },
      create: {
        userId,
        type: provider.toUpperCase() as any,
        name: provider, // Add name field
        accessToken,
        ...(refreshToken && { refreshToken }),
        ...(expiresAt && { expiresAt }),
      },
    })

    // Redirect to success page
    return NextResponse.redirect(new URL(`/dashboard/crm?connected=${provider}`, request.url))
  } catch (error) {
    console.error("[v0] CRM OAuth callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/crm?error=connection_failed", request.url))
  }
}
