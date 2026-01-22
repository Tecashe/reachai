import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get all user's warmup accounts to filter interactions
        const accounts = await db.sendingAccount.findMany({
            where: { userId: user.id },
            select: { id: true }
        })
        const accountIds = accounts.map(a => a.id)

        // Fetch recent activity (sent emails, replies, inbox landings)
        const interactions = await db.warmupInteraction.findMany({
            where: {
                OR: [
                    { sendingAccountId: { in: accountIds } }, // Sent by user
                    // For inbound, we need to join with sessions linked to user's accounts, 
                    // but simplest is to check if the session's sendingAccount is the user's
                    { session: { sendingAccountId: { in: accountIds } } }
                ]
            },
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                session: {
                    include: {
                        sendingAccount: {
                            select: { email: true }
                        }
                    }
                },
                replyFromAccount: {
                    select: { email: true }
                }
            }
        })

        const activity = interactions.map(i => {
            let type = 'SENT'
            if (i.direction === 'INBOUND') type = 'RECEIVED'
            if (i.repliedAt) type = 'REPLIED'

            // Determine description
            let description = `Email sent`
            let actor = i.session.sendingAccount.email

            if (i.direction === 'INBOUND') {
                description = "Reply received"
                // If it was a peer reply
                if (i.replyFromAccountId) {
                    actor = i.replyFromAccount?.email || "Peer"
                    description = "Peer reply received"
                } else {
                    actor = "Warmup Pool"
                }
            } else if (i.isPendingPeerReply) {
                type = 'SCHEDULED'
                description = "Peer reply scheduled"
            }

            return {
                id: i.id,
                type,
                actor, // Who did the action
                target: i.direction === 'OUTBOUND' ? "Peer/Pool" : i.session.sendingAccount.email,
                subject: i.subject,
                timestamp: i.createdAt,
                inbox: i.landedInInbox,
                spam: i.landedInSpam
            }
        })

        return NextResponse.json({ activity })

    } catch (error) {
        console.error("Error fetching warmup activity:", error)
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
    }
}
