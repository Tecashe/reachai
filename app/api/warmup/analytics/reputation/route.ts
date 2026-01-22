import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const user = await getCurrentUserFromDb()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const accounts = await db.sendingAccount.findMany({
            where: { userId: user.id, warmupEnabled: true },
            include: {
                reputationProfile: true
            }
        })

        // Aggregate Risk Distribution
        const riskBuckets = { low: 0, medium: 0, high: 0, critical: 0 }

        // DNS Health Check
        const dnsStats = { spf_ok: 0, dkim_ok: 0, dmarc_ok: 0, total: 0 }

        // Avg Reputation Metrics
        let totalRep = 0, totalBounce = 0, totalSpam = 0, count = 0

        accounts.forEach(acc => {
            const p = acc.reputationProfile
            if (!p) return

            // Risk
            if (p.riskScore < 30) riskBuckets.low++
            else if (p.riskScore < 60) riskBuckets.medium++
            else if (p.riskScore < 80) riskBuckets.high++
            else riskBuckets.critical++

            // DNS
            if (p.hasSpfRecord) dnsStats.spf_ok++
            if (p.hasDkimRecord) dnsStats.dkim_ok++
            if (p.hasDmarcRecord) dnsStats.dmarc_ok++
            dnsStats.total++

            // Averages
            totalRep += p.domainReputation
            totalBounce += p.lifetimeBounceRate
            totalSpam += p.lifetimeSpamRate
            count++
        })

        const avgStats = count > 0 ? {
            reputation: Math.round(totalRep / count),
            bounceRate: totalBounce / count,
            spamRate: totalSpam / count
        } : { reputation: 50, bounceRate: 0, spamRate: 0 }

        return NextResponse.json({
            riskBuckets,
            dnsStats,
            avgStats,
            totalAccounts: count
        })

    } catch (error) {
        console.error("Error generating reputation matrix:", error)
        return NextResponse.json({ error: "Failed to generate reputation matrix" }, { status: 500 })
    }
}
