"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HeatmapData {
    sent: number
    inbox: number
    spam: number
    rate: number
}

interface DeliverabilityHeatmapProps {
    data: HeatmapData[][] // 7 days x 24 hours
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function DeliverabilityHeatmap({ data }: DeliverabilityHeatmapProps) {
    if (!data || data.length === 0) return <div>No data available</div>

    const getColor = (rate: number, sent: number) => {
        if (sent === 0) return "bg-muted/30"
        // Use opacity based on volume, Hue based on rate
        // High Rate = Green, Low = Red
        // High Volume = Darker

        if (rate >= 90) return `bg-green-500/${Math.min(sent * 10 + 20, 90)}`
        if (rate >= 70) return `bg-yellow-500/${Math.min(sent * 10 + 20, 90)}`
        return `bg-red-500/${Math.min(sent * 10 + 20, 90)}`
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Deliverability Matrix</CardTitle>
                <CardDescription>Inbox placement rate by Day & Hour (Darker = Higher Volume)</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-1">
                        {/* Header Row */}
                        <div className="h-6 w-8"></div>
                        {HOURS.map(h => (
                            <div key={h} className="text-[10px] text-center text-muted-foreground">{h}</div>
                        ))}

                        {/* Rows */}
                        {DAYS.map((day, dIndex) => (
                            <>
                                <div key={day} className="text-xs text-muted-foreground h-8 flex items-center">{day}</div>
                                {HOURS.map((hour, hIndex) => {
                                    const cell = data[dIndex]?.[hour] || { sent: 0, rate: 0, inbox: 0 }
                                    return (
                                        <TooltipProvider key={`${dIndex}-${hIndex}`}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className={`h-8 w-full rounded-sm transition-all hover:scale-110 cursor-help ${getColor(cell.rate, cell.sent)}`} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="text-xs">
                                                        <p className="font-bold mb-1">{day} @ {hour}:00</p>
                                                        <p>Inbox Rate: <span className={cell.rate >= 90 ? "text-green-500" : "text-amber-500"}>{cell.rate}%</span></p>
                                                        <p>Volume: {cell.sent} emails</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1">
                                                            {cell.inbox} Inbox / {cell.spam} Spam
                                                        </p>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )
                                })}
                            </>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
