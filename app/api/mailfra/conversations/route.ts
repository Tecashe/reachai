import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"

// GET: List conversations for the current user
export async function GET(request: NextRequest) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode") // "support" | "agent" | null (all)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50)

    const where: any = { userId: user!.id }
    if (mode) where.mode = mode

    const conversations = await db.mailfraConversation.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: {
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { content: true, role: true, createdAt: true },
            },
            _count: { select: { messages: true } },
        },
    })

    return NextResponse.json({
        conversations: conversations.map((c) => ({
            id: c.id,
            title: c.title,
            mode: c.mode,
            messageCount: c._count.messages,
            lastMessage: c.messages[0] || null,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
        })),
    })
}

// POST: Create a new conversation
export async function POST(request: NextRequest) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    const body = await request.json()
    const { mode = "support", title } = body

    const conversation = await db.mailfraConversation.create({
        data: {
            userId: user!.id,
            mode,
            title: title || "New Conversation",
        },
    })

    return NextResponse.json({ conversation })
}

// DELETE: Delete a conversation
export async function DELETE(request: NextRequest) {
    const { error, user } = await protectApiRoute()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("id")

    if (!conversationId) {
        return NextResponse.json({ error: "Conversation ID required" }, { status: 400 })
    }

    // Verify ownership
    const conversation = await db.mailfraConversation.findFirst({
        where: { id: conversationId, userId: user!.id },
    })

    if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    await db.mailfraConversation.delete({ where: { id: conversationId } })

    return NextResponse.json({ success: true })
}
