"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface VolumeData {
    trends: any[]
}

export function VolumeTrendChart({ trends }: VolumeData) {
    // Transform trends to get total volume per day
    const chartData = trends.map(day => {
        let total = 0
        Object.keys(day).forEach(key => {
            if (key.endsWith('_vol')) {
                total += day[key] as number
            }
        })
        return {
            date: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            volume: total
        }
    })

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Volume Trends</CardTitle>
                <CardDescription>Daily sending volume over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                                stroke="hsl(var(--muted-foreground))"
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--popover))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="hsl(var(--chart-1))"
                                fillOpacity={1}
                                fill="url(#colorVolume)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
