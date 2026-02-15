import { type NextRequest } from "next/server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { createMailfraTools } from "@/lib/services/mailfra-tools"
import { MAILFRA_AGENT_SYSTEM_PROMPT } from "@/lib/services/mailfra-prompts"

export const maxDuration = 60

export async function POST(request: NextRequest) {
    try {
        // Agent mode requires authentication and paid subscription
        const { error, userId, user } = await protectApiRoute()
        if (error) return error

        // Subscription gate: require STARTER or above
        if (user!.subscriptionTier === "FREE") {
            return new Response(
                JSON.stringify({
                    error: "Mailfra AI Agent is available for paid plans only. Upgrade to Starter or above to unlock powerful AI-driven actions.",
                    upgradeRequired: true,
                }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            )
        }

        const body = await request.json()
        const { messages, conversationId } = body

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Messages are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            })
        }

        // Get or create conversation
        let dbConversationId = conversationId
        if (conversationId) {
            const existing = await db.mailfraConversation.findFirst({
                where: { id: conversationId, userId: user!.id },
            })
            if (!existing) dbConversationId = null
        }

        if (!dbConversationId) {
            const conversation = await db.mailfraConversation.create({
                data: {
                    userId: user!.id,
                    mode: "agent",
                    title: messages[0]?.content?.slice(0, 50) || "AI Agent",
                },
            })
            dbConversationId = conversation.id
        }

        // Save user message
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

        // Create tools scoped to this user
        const tools = createMailfraTools(userId!, user!.id)

        const result = streamText({
            model: openai("gpt-4o"),
            system: MAILFRA_AGENT_SYSTEM_PROMPT,
            messages,
            tools,
            maxSteps: 5, // Allow multi-step tool calls
            onFinish: async ({ text }) => {
                // Save assistant response
                if (dbConversationId && text) {
                    try {
                        await db.mailfraMessage.create({
                            data: {
                                conversationId: dbConversationId,
                                role: "assistant",
                                content: text,
                            },
                        })
                    } catch (e) {
                        console.error("[mailfra] Failed to save agent message:", e)
                    }
                }

                // Deduct AI credits
                try {
                    await db.user.update({
                        where: { id: user!.id },
                        data: { aiCreditsUsed: { increment: 1 } },
                    })
                } catch (e) {
                    console.error("[mailfra] Failed to deduct credits:", e)
                }
            },
        })

        return result.toDataStreamResponse({
            headers: {
                "X-Conversation-Id": dbConversationId || "",
            },
        })
    } catch (error) {
        console.error("[mailfra] Agent API error:", error)
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
