import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, category, subject, bodyText, variables } = body

    const template = await db.emailTemplate.create({
      data: {
        userId: user.id,
        name,
        category,
        subject,
        body: bodyText,
        variables: variables || [],
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("Failed to create template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
