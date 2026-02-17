import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateObject } from "ai"
import { fastModel } from "@/lib/ai-provider"
import { z } from "zod"

const summarySchema = z.object({
  tldr: z.string(),
  keyPoints: z.array(z.string()).max(4),
  sentiment: z.enum(["positive", "neutral", "negative", "mixed"]),
  suggestedAction: z.string(),
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
      schema: summarySchema,
      prompt: `Summarize this email reply from a sales context.

Original Email Subject: ${reply.emailLog?.subject || reply.subject}
Original Email: ${reply.emailLog?.body || ""}

Their Reply:
${reply.body}

Prospect: ${reply.prospect.firstName} ${reply.prospect.lastName}
Company: ${reply.prospect.company || "Unknown"}
Job Title: ${reply.prospect.jobTitle || "Unknown"}

Provide:
1. A concise TL;DR (1-2 sentences)
2. Up to 4 key points from the email
3. Overall sentiment (positive, neutral, negative, or mixed)
4. A suggested next action for the sales rep`,
    })

    return NextResponse.json({ success: true, summary: object })
  } catch (error) {
    console.error("Summarize error:", error)
    return NextResponse.json({ error: "Failed to summarize email" }, { status: 500 })
  }
}
