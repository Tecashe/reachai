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

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ duplicates: [] })
    }

    // Normalize emails for comparison
    const normalizedEmails = emails.map((e: string) => e.toLowerCase().trim())

    // Find existing prospects with matching emails
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
