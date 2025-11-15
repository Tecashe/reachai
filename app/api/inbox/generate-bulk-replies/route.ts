// import { type NextRequest, NextResponse } from "next/server"
// import { getCurrentUserFromDb } from "@/lib/auth"
// import { db } from "@/lib/db"
// import { generateText } from "ai"
// import { logger } from "@/lib/logger"

// export async function POST(req: NextRequest) {
//   try {
//     const user = await getCurrentUserFromDb()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { replyIds, tone = "professional" } = await req.json()

//     if (!Array.isArray(replyIds) || replyIds.length === 0) {
//       return NextResponse.json({ error: "Invalid request" }, { status: 400 })
//     }

//     const replies = await db.emailReply.findMany({
//       where: {
//         id: { in: replyIds },
//         prospect: { userId: user.id },
//       },
//       include: {
//         prospect: true,
//       },
//     })

//     const generatedReplies = await Promise.all(
//       replies.map(async (reply) => {
//         const prompt = `You are writing a personalized email reply. Use these variables in your response:
// - {{firstName}}: ${reply.prospect.firstName || "there"}
// - {{lastName}}: ${reply.prospect.lastName || ""}
// - {{company}}: ${reply.prospect.company || "your company"}
// - {{jobTitle}}: ${reply.prospect.jobTitle || ""}

// Original email: "${reply.body}"

// Write a ${tone} reply that:
// 1. Uses the variables naturally (wrap them in {{variable}} format in your response)
// 2. Addresses their specific points
// 3. Is concise and actionable
// 4. Maintains a ${tone} tone

// Reply:`

//         const { text } = await generateText({
//           model: "openai/gpt-4o-mini",
//           prompt,
//           maxTokens: 300,
//         })

//         return {
//           replyId: reply.id,
//           generatedReply: text,
//           prospectName: `${reply.prospect.firstName} ${reply.prospect.lastName}`.trim(),
//           prospectEmail: reply.prospect.email,
//         }
//       })
//     )

//     return NextResponse.json({ success: true, replies: generatedReplies })
//   } catch (error) {
//     logger.error("Bulk reply generation error", error as Error)
//     return NextResponse.json({ error: "Failed to generate replies" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateText } from "ai"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { replyIds, tone = "professional" } = await req.json()

    if (!Array.isArray(replyIds) || replyIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const replies = await db.emailReply.findMany({
      where: {
        id: { in: replyIds },
        prospect: { userId: user.id },
      },
      include: {
        prospect: true,
      },
    })

    const generatedReplies = await Promise.all(
      replies.map(async (reply) => {
        const prompt = `You are writing a personalized email reply. Use these variables in your response:
- {{firstName}}: ${reply.prospect.firstName || "there"}
- {{lastName}}: ${reply.prospect.lastName || ""}
- {{company}}: ${reply.prospect.company || "your company"}
- {{jobTitle}}: ${reply.prospect.jobTitle || ""}

Original email: "${reply.body}"

Write a ${tone} reply that:
1. Uses the variables naturally (wrap them in {{variable}} format in your response)
2. Addresses their specific points
3. Is concise and actionable
4. Maintains a ${tone} tone

Reply:`

        const { text } = await generateText({
          model: "openai/gpt-4o-mini",
          prompt,
        })

        return {
          replyId: reply.id,
          generatedReply: text,
          prospectName: `${reply.prospect.firstName} ${reply.prospect.lastName}`.trim(),
          prospectEmail: reply.prospect.email,
        }
      })
    )

    return NextResponse.json({ success: true, replies: generatedReplies })
  } catch (error) {
    logger.error("Bulk reply generation error", error as Error)
    return NextResponse.json({ error: "Failed to generate replies" }, { status: 500 })
  }
}
