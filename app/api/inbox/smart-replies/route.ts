import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateObject } from "ai"
import { fastModel } from "@/lib/ai-provider"
import { z } from "zod"

const smartRepliesSchema = z.object({
  replies: z.array(z.string()).length(3),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyId } = await req.json()

    const reply = await db.emailReply.findUnique({
      where: { id: replyId },
      include: {
        prospect: true,
        emailLog: true,
      },
    })

    if (!reply || reply.prospect.userId !== user.id) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    const { object } = await generateObject({
      model: fastModel,
      schema: smartRepliesSchema,
      prompt: `You are an AI sales assistant. Generate exactly 3 short, one-click reply suggestions for this email.

Original Email Subject: ${reply.emailLog?.subject || reply.subject}
Their Reply: ${reply.body}

Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}
Category: ${reply.category || "Unknown"}
Sentiment: ${reply.sentiment || "Unknown"}

Generate 3 different short reply options (1-2 sentences each):
1. A positive/interested response
2. A question-asking response to gather more info
3. A scheduling/next-steps response

Keep each reply concise, professional, and actionable. Do not include greetings or signatures.`,
    })

    return NextResponse.json({ success: true, replies: object.replies })
  } catch (error) {
    console.error("Smart replies error:", error)
    return NextResponse.json({ error: "Failed to generate smart replies" }, { status: 500 })
  }
}
