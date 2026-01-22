"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface PlacementData {
    trends: any[]
}

export function PlacementFunnel({ trends }: PlacementData) {
    if (!trends || trends.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Placement Funnel</CardTitle>
                    <CardDescription>30 Day Overview</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
                    No data available
                </CardContent>
            </Card>
        )
    }

    // Aggregate data for the funnel
    const totalSent = trends.reduce((acc, curr) => {
        // trends structure is like: { date: "...", gmail_vol: 10, outlook_vol: 5, ... }
        // We need to sum up volumes. This is tricky because the API returns flattened provider data.
        // Let's assume the API structure from route.ts: 
        // entry[`${provider}_vol`] = stats.sent
        // entry[`${provider}_rate`] = stats.rate

        // We actually need the raw sent/inbox/spam counts to build a true funnel.
        // But the provider-trends API returns Rates and Volumes by provider.
        // We can approximate "Inbox Volume" by (Volume * Rate / 100).

        let sent = 0
        let inbox = 0

        Object.keys(curr).forEach(key => {
            if (key.endsWith('_vol')) {
                const provider = key.replace('_vol', '')
                const vol = curr[key] as number
                const rate = curr[`${provider}_rate`] as number || 0
                sent += vol
                inbox += Math.round(vol * (rate / 100))
            }
        })
        return { sent: acc.sent + sent, inbox: acc.inbox + inbox }
    }, { sent: 0, inbox: 0 })

    const funnelData = [
        { name: "Sent", value: totalSent.sent, color: "#3b82f6" }, // Blue
        { name: "Inbox", value: totalSent.inbox, color: "#22c55e" }, // Green
        { name: "Spam/Missing", value: totalSent.sent - totalSent.inbox, color: "#ef4444" }, // Red
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Placement Funnel</CardTitle>
                <CardDescription>Aggregate performance (Last 30 Days)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {funnelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    {funnelData.map((d) => (
                        <div key={d.name}>
                            <p className="text-xl font-bold">{d.value.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{d.name}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
