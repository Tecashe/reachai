"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ProviderTrendChartProps {
    data: any[]
}

export function ProviderTrendChart({ data }: ProviderTrendChartProps) {
    if (!data || data.length === 0) return <div>No data available</div>

    // Identify providers dynamically
    const providers = Object.keys(data[0])
        .filter(k => k.endsWith('_rate'))
        .map(k => k.replace('_rate', ''))

    const colors: Record<string, string> = {
        'gmail': 'hsl(var(--chart-1))',
        'outlook': 'hsl(var(--chart-2))',
        'yahoo': 'hsl(var(--chart-3))',
        'custom': 'hsl(var(--chart-4))',
        'unknown': 'hsl(var(--muted))'
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>ISP Performance Trends</CardTitle>
                <CardDescription>Inbox Placement Rate by Provider over last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickMargin={10} minTickGap={30} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} unit="%" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                            />
                            <Legend />
                            {providers.map(p => (
                                <Area
                                    key={p}
                                    type="monotone"
                                    dataKey={`${p}_rate`}
                                    name={p.charAt(0).toUpperCase() + p.slice(1)}
                                    stroke={colors[p] || 'gray'}
                                    fill={colors[p] || 'gray'}
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                    connectNulls
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
