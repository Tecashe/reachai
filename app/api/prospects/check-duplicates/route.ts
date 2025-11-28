// import { type NextRequest, NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import { protectApiRoute } from "@/lib/api-protection"

// export async function POST(request: NextRequest) {
//   const authResult = await protectApiRoute()
//   if (authResult.error || !authResult.user) {
//     return authResult.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const userId = authResult.user.id

//   try {
//     const body = await request.json()
//     const { emails, folderId } = body

//     console.log("[v0] Check duplicates - userId:", userId, "emails count:", emails?.length)

//     if (!Array.isArray(emails) || emails.length === 0) {
//       console.log("[v0] No emails provided")
//       return NextResponse.json({ duplicates: [], total: 0, found: 0 })
//     }

//     // Normalize emails for comparison
//     const normalizedEmails = emails
//       .filter((e): e is string => typeof e === "string" && e.length > 0)
//       .map((e) => e.toLowerCase().trim())

//     console.log("[v0] Normalized emails:", normalizedEmails.slice(0, 3), "...")

//     if (normalizedEmails.length === 0) {
//       return NextResponse.json({ duplicates: [], total: 0, found: 0 })
//     }

//     // Check ALL user's prospects for duplicates
//     const existingProspects = await db.prospect.findMany({
//       where: {
//         userId: userId,
//         email: {
//           in: normalizedEmails,
//           mode: "insensitive",
//         },
//         isTrashed: false,
//       },
//       select: {
//         email: true,
//       },
//     })

//     console.log("[v0] Found existing prospects with matching emails:", existingProspects.length)

//     const duplicateEmails = existingProspects.map((p) => p.email.toLowerCase())

//     return NextResponse.json({
//       duplicates: duplicateEmails,
//       total: emails.length,
//       found: duplicateEmails.length,
//     })
//   } catch (error) {
//     console.error("[v0] Check duplicates error:", error)
//     return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { protectApiRoute } from "@/lib/api-protection"

export async function POST(request: NextRequest) {
  const authResult = await protectApiRoute()
  if (authResult.error || !authResult.user) {
    return authResult.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = authResult.user.id

  try {
    const body = await request.json()
    const { emails } = body

    console.log("[check-duplicates] ==========================================")
    console.log("[check-duplicates] User ID:", userId)
    console.log("[check-duplicates] Emails received:", emails?.length)

    if (!Array.isArray(emails) || emails.length === 0) {
      console.log("[check-duplicates] No emails provided")
      return NextResponse.json({ duplicates: [], total: 0, found: 0 })
    }

    // Normalize emails for comparison
    const normalizedEmails = emails
      .filter((e): e is string => typeof e === "string" && e.length > 0)
      .map((e) => e.toLowerCase().trim())

    console.log("[check-duplicates] Normalized emails count:", normalizedEmails.length)
    console.log("[check-duplicates] First 5 emails:", normalizedEmails.slice(0, 5))

    if (normalizedEmails.length === 0) {
      return NextResponse.json({ duplicates: [], total: 0, found: 0 })
    }

    // First, count ALL prospects for this user to verify data exists
    const totalProspects = await db.prospect.count({
      where: {
        userId: userId,
        isTrashed: false,
      },
    })
    console.log("[check-duplicates] Total prospects for user (not trashed):", totalProspects)

    // Get some sample prospects to verify
    const sampleProspects = await db.prospect.findMany({
      where: {
        userId: userId,
        isTrashed: false,
      },
      select: { email: true },
      take: 5,
    })
    console.log(
      "[check-duplicates] Sample existing emails:",
      sampleProspects.map((p) => p.email),
    )

    // Check for duplicates
    const existingProspects = await db.prospect.findMany({
      where: {
        userId: userId,
        email: {
          in: normalizedEmails,
          mode: "insensitive",
        },
        isTrashed: false,
      },
      select: {
        email: true,
      },
    })

    console.log("[check-duplicates] Found matching prospects:", existingProspects.length)
    console.log("[check-duplicates] ==========================================")

    const duplicateEmails = existingProspects.map((p) => p.email.toLowerCase())

    return NextResponse.json({
      duplicates: duplicateEmails,
      total: emails.length,
      found: duplicateEmails.length,
    })
  } catch (error) {
    console.error("[check-duplicates] Error:", error)
    return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 })
  }
}
