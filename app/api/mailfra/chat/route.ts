import { type NextRequest } from "next/server"
import { streamText } from "ai"
import { fastModel } from "@/lib/ai-provider"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { MAILFRA_SUPPORT_SYSTEM_PROMPT } from "@/lib/services/mailfra-prompts"

export const maxDuration = 30

export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth()

        // Support chat is available to everyone (even unauthenticated for basic Q&A)
        const body = await request.json()
        const { messages, conversationId } = body

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Messages are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Get or create conversation for logged-in users
        let dbConversationId = conversationId
        if (clerkId) {
            const dbUser = await db.user.findUnique({ where: { clerkId } })
            if (dbUser) {
                if (conversationId) {
                    // Verify the conversation belongs to this user
                    const existing = await db.mailfraConversation.findFirst({
                        where: { id: conversationId, userId: dbUser.id },
                    })
                    if (!existing) dbConversationId = null
                }

                if (!dbConversationId) {
                    const conversation = await db.mailfraConversation.create({
                        data: {
                            userId: dbUser.id,
                            mode: "support",
                            title: messages[0]?.content?.slice(0, 50) || "Support Chat",
                        },
                    })
                    dbConversationId = conversation.id
                }

                // Save the user message
                const lastUserMessage = messages[messages.length - 1]
                if (lastUserMessage?.role === "user") {
                    await db.mailfraMessage.create({
                        data: {
                            conversationId: dbConversationId,
                            role: "user",
                            content: lastUserMessage.content,
                        },
                    })
                }
            }
        }

        const result = streamText({
            model: fastModel,
            system: MAILFRA_SUPPORT_SYSTEM_PROMPT,
            messages,
            onFinish: async ({ text }) => {
                // Save assistant response for logged-in users
                if (dbConversationId) {
                    try {
                        await db.mailfraMessage.create({
                            data: {
                                conversationId: dbConversationId,
                                role: "assistant",
                                content: text,
                            },
                        })
                    } catch (e) {
                        console.error("[mailfra] Failed to save assistant message:", e)
                    }
                }
            },
        })

        return result.toTextStreamResponse({
            headers: {
                "X-Conversation-Id": dbConversationId || "",
            },
        })
    } catch (error) {
        console.error("[mailfra] Chat API error:", error)
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
