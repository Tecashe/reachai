import { auth } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || undefined
    const scoreFilter = searchParams.get("scoreFilter") || "all"

    const skip = (page - 1) * limit

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      campaign: { userId: user.id },
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    if (scoreFilter === "hot") {
      where.dealScore = { gte: 70 }
    } else if (scoreFilter === "warm") {
      where.dealScore = { gte: 40, lt: 70 }
    } else if (scoreFilter === "cold") {
      where.OR = [{ dealScore: { lt: 40 } }, { dealScore: null }]
    }

    const [leads, total] = await Promise.all([
      db.prospect.findMany({
        where,
        orderBy: { dealScore: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          jobTitle: true,
          dealScore: true,
          status: true,
          phoneNumber: true,
          crmSyncedAt: true,
          replied: true,
        },
      }),
      db.prospect.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("[CRM Leads] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
