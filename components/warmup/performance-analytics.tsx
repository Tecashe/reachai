"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChartIcon,
    Download,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    Mail,
    Eye,
    MessageSquare,
    AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChartDataPoint {
    date: string
    sent: number
    opened: number
    replied: number
    bounced: number
    inboxRate: number
}

interface ProviderData {
    name: string
    value: number
    color: string
}

interface PerformanceAnalyticsProps {
    chartData: ChartDataPoint[]
    providerBreakdown?: ProviderData[]
    insights?: string[]
    period: string
    onPeriodChange: (period: string) => void
}

// Insight card component
function InsightCard({ insight, index }: { insight: string; index: number }) {
    return (
        <div
            className={cn(
                "p-4 rounded-xl border border-border/50",
                "bg-gradient-to-br from-primary/5 via-transparent to-transparent",
                "hover:border-primary/30 transition-colors"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
            </div>
        </div>
    )
}

// Metric summary card
function MetricCard({
    label,
    value,
    change,
    icon: Icon,
    color
}: {
    label: string
    value: number | string
    change?: number
    icon: React.ElementType
    color: string
}) {
    return (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", color)}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">{value}</span>
                        {change !== undefined && (
                            <span className={cn(
                                "flex items-center text-xs font-medium",
                                change >= 0 ? "text-emerald-400" : "text-rose-400"
                            )}>
                                {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {Math.abs(change)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null

    return (
        <div className="rounded-xl border border-border/50 bg-popover/95 backdrop-blur-sm p-4 shadow-xl">
            <p className="text-sm font-semibold mb-3 text-popover-foreground">
                {new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <div className="space-y-2">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="font-semibold">{entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PerformanceAnalytics({
    chartData,
    providerBreakdown,
    insights = [],
    period,
    onPeriodChange
}: PerformanceAnalyticsProps) {
    const [chartType, setChartType] = useState<'area' | 'bar'>('area')

    // Calculate totals
    const totalSent = chartData.reduce((sum, d) => sum + d.sent, 0)
    const totalOpened = chartData.reduce((sum, d) => sum + d.opened, 0)
    const totalReplied = chartData.reduce((sum, d) => sum + d.replied, 0)
    const totalBounced = chartData.reduce((sum, d) => sum + d.bounced, 0)

    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0
    const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0
    const bounceRate = totalSent > 0 ? Math.round((totalBounced / totalSent) * 100) : 0

    // Default provider breakdown if not provided
    const providers = providerBreakdown || [
        { name: 'Gmail', value: 45, color: '#ea4335' },
        { name: 'Outlook', value: 35, color: '#0078d4' },
        { name: 'Yahoo', value: 15, color: '#6001d2' },
        { name: 'Other', value: 5, color: '#6b7280' },
    ]

    // Default insights if not provided
    const displayInsights = insights.length > 0 ? insights : [
        "Your open rates peaked on Tuesday mornings between 9-11 AM",
        "Gmail accounts show 15% higher inbox placement than Outlook",
        "Consider increasing daily limits for accounts with 95%+ health scores",
    ]

    return (
        <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Emails Sent"
                    value={totalSent.toLocaleString()}
                    change={12}
                    icon={Mail}
                    color="bg-blue-500"
                />
                <MetricCard
                    label="Open Rate"
                    value={`${openRate}%`}
                    change={5}
                    icon={Eye}
                    color="bg-emerald-500"
                />
                <MetricCard
                    label="Reply Rate"
                    value={`${replyRate}%`}
                    change={-2}
                    icon={MessageSquare}
                    color="bg-purple-500"
                />
                <MetricCard
                    label="Bounce Rate"
                    value={`${bounceRate}%`}
                    change={-8}
                    icon={AlertTriangle}
                    color="bg-rose-500"
                />
            </div>

            {/* Main Chart */}
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                Performance Trends
                            </CardTitle>
                            <CardDescription>
                                Email engagement metrics over time
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={period} onValueChange={onPeriodChange}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex rounded-lg border border-border/50 p-1">
                                <Button
                                    variant={chartType === 'area' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => setChartType('area')}
                                >
                                    <TrendingUp className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => setChartType('bar')}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'area' ? (
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="fillSent" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="fillOpened" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="fillReplied" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                        }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="sent"
                                        stroke="#3b82f6"
                                        fill="url(#fillSent)"
                                        strokeWidth={2}
                                        name="Sent"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="opened"
                                        stroke="#10b981"
                                        fill="url(#fillOpened)"
                                        strokeWidth={2}
                                        name="Opened"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="replied"
                                        stroke="#a855f7"
                                        fill="url(#fillReplied)"
                                        strokeWidth={2}
                                        name="Replied"
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                        }}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="sent" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sent" />
                                    <Bar dataKey="opened" fill="#10b981" radius={[4, 4, 0, 0]} name="Opened" />
                                    <Bar dataKey="replied" fill="#a855f7" radius={[4, 4, 0, 0]} name="Replied" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm text-muted-foreground">Sent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-muted-foreground">Opened</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            <span className="text-sm text-muted-foreground">Replied</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Grid: Provider Breakdown + AI Insights */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Provider Breakdown */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <PieChartIcon className="w-5 h-5 text-primary" />
                            Provider Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="w-[140px] h-[140px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={providers}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={60}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {providers.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-3">
                                {providers.map((provider, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                                            <span className="text-sm">{provider.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold">{provider.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="w-5 h-5 text-primary" />
                            AI Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {displayInsights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} index={index} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
