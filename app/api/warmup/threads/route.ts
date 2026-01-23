import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch recent active threads
        const threads = await db.warmupThread.findMany({
            where: {
                OR: [
                    { initiatorAccount: { userId: user.id } },
                    { recipientAccount: { userId: user.id } }
                ],
                status: 'ACTIVE'
            },
            include: {
                initiatorAccount: {
                    select: { email: true, provider: true }
                },
                recipientAccount: {
                    select: { email: true, provider: true }
                },
                interactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        subject: true,
                        createdAt: true,
                        snippet: true
                    }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 20
        })

        const formattedThreads = threads.map(t => ({
            id: t.id,
            subject: t.threadSubject,
            topic: t.threadTopic,
            status: t.status,
            messageCount: t.messageCount,
            maxMessages: t.maxMessages,
            lastMessageAt: t.lastMessageAt || t.updatedAt,
            initiator: t.initiatorAccount.email,
            recipient: t.recipientAccount.email,
            lastSnippet: t.interactions[0]?.snippet || "",
            nextScheduledAt: t.nextScheduledAt
        }))

        return NextResponse.json({ threads: formattedThreads })

    } catch (error) {
        console.error("Error fetching warmup threads:", error)
        return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
    }
}
