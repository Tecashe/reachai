import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { protectApiRoute } from "@/lib/api-protection"

export async function POST(request: NextRequest) {
  const authResult = await protectApiRoute()
  if (!authResult.user || !authResult.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { emails, folderId } = body

    console.log("[v0] Check duplicates request - emails count:", emails?.length, "folderId:", folderId)

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ duplicates: [], total: 0, found: 0 })
    }

    // Normalize emails for comparison
    const normalizedEmails = emails
      .filter((e): e is string => typeof e === "string" && e.length > 0)
      .map((e) => e.toLowerCase().trim())

    console.log("[v0] Normalized emails count:", normalizedEmails.length)

    if (normalizedEmails.length === 0) {
      return NextResponse.json({ duplicates: [], total: 0, found: 0 })
    }

    // Check ALL user's prospects, not just in the specific folder
    const existingProspects = await db.prospect.findMany({
      where: {
        userId: authResult.userId,
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

    console.log("[v0] Found existing prospects:", existingProspects.length)

    const duplicateEmails = existingProspects.map((p) => p.email.toLowerCase())

    return NextResponse.json({
      duplicates: duplicateEmails,
      total: emails.length,
      found: duplicateEmails.length,
    })
  } catch (error) {
    console.error("[v0] Check duplicates error:", error)
    return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 })
  }
}
