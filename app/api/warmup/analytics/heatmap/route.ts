import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get 30 days of data
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const interactions = await db.warmupInteraction.findMany({
            where: {
                session: { sendingAccount: { userId: user.id } },
                sentAt: { gte: thirtyDaysAgo },
                direction: 'OUTBOUND'
            },
            select: {
                sentAt: true,
                landedInInbox: true,
                landedInSpam: true
            }
        })

        // 7x24 Grid (Day x Hour)
        // Initialize structure: days[0-6][hours 0-23]
        const grid = Array(7).fill(0).map(() =>
            Array(24).fill(0).map(() => ({ sent: 0, inbox: 0, spam: 0, rate: 0 }))
        )

        interactions.forEach(i => {
            if (!i.sentAt) return
            const date = new Date(i.sentAt)
            const day = date.getDay() // 0 = Sun, 6 = Sat
            const hour = date.getHours() // 0-23

            grid[day][hour].sent++
            if (i.landedInInbox) grid[day][hour].inbox++
            if (i.landedInSpam) grid[day][hour].spam++
        })

        // Calculate rates
        grid.forEach(day => {
            day.forEach(hour => {
                hour.rate = hour.sent > 0 ? Math.round((hour.inbox / hour.sent) * 100) : 0
            })
        })

        return NextResponse.json({ heatmap: grid })

    } catch (error) {
        console.error("Error generating heatmap:", error)
        return NextResponse.json({ error: "Failed to generate heatmap" }, { status: 500 })
    }
}
