"use server"

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateObject } from "ai"
import { z } from "zod"

const replySchema = z.object({
  subject: z.string(),
  body: z.string(),
  tone: z.enum(["professional", "friendly", "casual"]),
  keyPoints: z.array(z.string()),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyId, tone, customInstructions } = await req.json()

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

    const { object: suggestion } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: replySchema,
      prompt: `You are an AI sales assistant. Generate a professional reply to this prospect.

Original Email Subject: ${reply.emailLog.subject}
Original Email: ${reply.emailLog.body}

Their Reply: ${reply.body}

Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName} at ${reply.prospect.company}
Category: ${reply.category}
Sentiment: ${reply.sentiment}

${customInstructions ? `Additional Instructions: ${customInstructions}` : ""}

Generate a ${tone || "professional"} reply that:
1. Addresses their concerns/questions
2. Moves the conversation forward
3. Includes a clear call-to-action
4. Maintains the right tone

Keep it concise and actionable.`,
    })

    return NextResponse.json({ success: true, suggestion })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 })
  }
}
