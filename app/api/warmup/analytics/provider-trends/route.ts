import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // We need to join with SendingAccount to get the provider
        const interactions = await db.warmupInteraction.findMany({
            where: {
                session: { sendingAccount: { userId: user.id } },
                sentAt: { gte: thirtyDaysAgo },
                direction: 'OUTBOUND'
            },
            select: {
                sentAt: true,
                landedInInbox: true,
                session: {
                    select: {
                        sendingAccount: {
                            select: { provider: true }
                        }
                    }
                }
            }
        })

        // Group by Date + Provider
        const dailyStats: Record<string, Record<string, { sent: number, inbox: number }>> = {}

        interactions.forEach(i => {
            if (!i.sentAt) return
            const date = i.sentAt.toISOString().split('T')[0] // YYYY-MM-DD
            const provider = i.session.sendingAccount.provider || 'unknown'

            if (!dailyStats[date]) dailyStats[date] = {}
            if (!dailyStats[date][provider]) dailyStats[date][provider] = { sent: 0, inbox: 0 }

            dailyStats[date][provider].sent++
            if (i.landedInInbox) dailyStats[date][provider].inbox++
        })

        // Transform for Recharts
        const trendData = Object.entries(dailyStats).map(([date, providers]) => {
            const entry: any = { date }
            Object.entries(providers).forEach(([provider, stats]) => {
                entry[`${provider}_rate`] = stats.sent > 0 ? Math.round((stats.inbox / stats.sent) * 100) : 0
                entry[`${provider}_vol`] = stats.sent
            })
            return entry
        }).sort((a, b) => a.date.localeCompare(b.date))

        return NextResponse.json({ trends: trendData })

    } catch (error) {
        console.error("Error generating provider trends:", error)
        return NextResponse.json({ error: "Failed to generate trends" }, { status: 500 })
    }
}
