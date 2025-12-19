


import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db as prisma } from "@/lib/db"
import { addWarmupEmail } from "@/lib/actions/warmup-emails"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const emails = await prisma.warmupEmail.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        isActive: true,
        inboxPlacement: true,
        lastEmailSentAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json(emails)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warmup emails" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const result = await addWarmupEmail(data)

    return NextResponse.json({ success: true, warmupEmail: result })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add warmup email" }, { status: 500 })
  }
}
