import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        // Fetch thread with all details
        const thread = await db.warmupThread.findFirst({
            where: {
                id,
                OR: [
                    { initiatorAccount: { userId: user.id } },
                    { recipientAccount: { userId: user.id } }
                ]
            },
            include: {
                initiatorAccount: {
                    select: {
                        id: true,
                        email: true,
                        provider: true,
                        warmupConfig: {
                            select: { healthScore: true }
                        }
                    }
                },
                recipientAccount: {
                    select: {
                        id: true,
                        email: true,
                        provider: true,
                        warmupConfig: {
                            select: { healthScore: true }
                        }
                    }
                },
                interactions: {
                    orderBy: { createdAt: 'asc' },
                    select: {
                        id: true,
                        direction: true,
                        subject: true,
                        snippet: true,
                        sentAt: true,
                        deliveredAt: true,
                        openedAt: true,
                        repliedAt: true,
                        landedInInbox: true,
                        landedInSpam: true,
                        createdAt: true,
                        sendingAccountId: true
                    }
                }
            }
        })

        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 })
        }

        // Format response
        const formattedThread = {
            id: thread.id,
            subject: thread.subject,
            topic: thread.topic,
            status: thread.status,
            messageCount: thread.messageCount,
            maxMessages: thread.maxMessages,
            nextScheduledAt: thread.nextScheduledAt,
            startedAt: thread.startedAt,
            completedAt: thread.completedAt,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            responseTimeMin: thread.responseTimeMin,
            responseTimeMax: thread.responseTimeMax,
            totalOpens: thread.totalOpens,
            totalReplies: thread.totalReplies,
            initiator: {
                id: thread.initiatorAccountId,
                email: thread.initiatorAccount!.email,
                provider: thread.initiatorAccount!.provider || 'gmail',
                healthScore: thread.initiatorAccount!.warmupConfig?.healthScore ?? 80
            },
            recipient: {
                id: thread.recipientAccountId,
                email: thread.recipientAccount!.email,
                provider: thread.recipientAccount!.provider || 'gmail',
                healthScore: thread.recipientAccount!.warmupConfig?.healthScore ?? 80
            },
            messages: thread.interactions.map(i => ({
                id: i.id,
                direction: i.direction,
                subject: i.subject,
                snippet: i.snippet,
                sentAt: i.sentAt,
                deliveredAt: i.deliveredAt,
                openedAt: i.openedAt,
                repliedAt: i.repliedAt,
                landedInInbox: i.landedInInbox,
                landedInSpam: i.landedInSpam,
                createdAt: i.createdAt,
                senderAccountId: i.sendingAccountId
            }))
        }

        return NextResponse.json(formattedThread)

    } catch (error) {
        console.error("Error fetching thread details:", error)
        return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 })
    }
}
