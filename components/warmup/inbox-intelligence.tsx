"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Inbox,
    Mail,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Shield,
    RefreshCw,
    TrendingUp,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DNSRecord {
    type: 'SPF' | 'DKIM' | 'DMARC'
    status: 'valid' | 'invalid' | 'missing'
    value?: string
}

interface InboxIntelligenceProps {
    inboxRate: number
    spamRate: number
    dnsRecords: DNSRecord[]
    onRefresh?: () => void
    lastUpdated?: string
}

// Placement funnel component
function PlacementFunnel({ inboxRate, spamRate }: { inboxRate: number; spamRate: number }) {
    const otherRate = Math.max(0, 100 - inboxRate - spamRate)

    return (
        <div className="space-y-4">
            {/* Funnel visualization */}
            <div className="relative">
                {/* Inbox (Primary) */}
                <div className="relative mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Primary Inbox</span>
                        </div>
                        <span className="text-lg font-bold text-primary">{inboxRate}%</span>
                    </div>
                    <div className="relative h-10 rounded-lg overflow-hidden bg-primary/20">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
                            style={{ width: `${inboxRate}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Other folders */}
                <div className="relative mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Promotions/Other</span>
                        </div>
                        <span className="text-lg font-bold text-muted-foreground">{otherRate}%</span>
                    </div>
                    <div className="relative h-8 rounded-lg overflow-hidden bg-muted/30">
                        <div
                            className="absolute inset-y-0 left-0 bg-muted-foreground/50 transition-all duration-1000 ease-out"
                            style={{ width: `${Math.max(otherRate * 2, 0)}%` }}
                        />
                    </div>
                </div>

                {/* Spam */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="text-sm font-medium">Spam</span>
                        </div>
                        <span className="text-lg font-bold text-destructive">{spamRate}%</span>
                    </div>
                    <div className="relative h-6 rounded-lg overflow-hidden bg-destructive/20">
                        <div
                            className="absolute inset-y-0 left-0 bg-destructive transition-all duration-1000 ease-out"
                            style={{ width: `${Math.max(spamRate * 3, 0)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// DNS health monitor
function DNSHealthMonitor({ records }: { records: DNSRecord[] }) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'valid':
                return { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/20', label: 'Valid' }
            case 'invalid':
                return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/20', label: 'Invalid' }
            case 'missing':
                return { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted/20', label: 'Missing' }
            default:
                return { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted/20', label: 'Unknown' }
        }
    }

    if (records.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground text-sm">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No DNS records configured</p>
                <p className="text-xs mt-1">Connect a domain to see DNS status</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {records.map((record) => {
                const config = getStatusConfig(record.status)
                const StatusIcon = config.icon

                return (
                    <div
                        key={record.type}
                        className={cn(
                            "p-4 rounded-xl border transition-all",
                            record.status === 'valid'
                                ? "border-primary/30 bg-primary/5"
                                : record.status === 'invalid'
                                    ? "border-destructive/30 bg-destructive/5"
                                    : "border-muted bg-muted/5"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg", config.bg)}>
                                    <Shield className={cn("w-4 h-4", config.color)} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">{record.type}</span>
                                        <Badge variant="outline" className={cn("text-[10px]", config.color, config.bg)}>
                                            {config.label}
                                        </Badge>
                                    </div>
                                    {record.value && (
                                        <p className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-[200px]">
                                            {record.value}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <StatusIcon className={cn("w-5 h-5", config.color)} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Dynamic recommendations based on actual data
function Recommendations({ inboxRate, spamRate }: { inboxRate: number; spamRate: number }) {
    const recommendations: string[] = []

    if (inboxRate >= 90) {
        recommendations.push("Maintain current email sending patterns for consistent deliverability")
        recommendations.push("Consider increasing daily warmup volume for accounts with high health")
    } else if (inboxRate >= 70) {
        recommendations.push("Focus on improving reply rates to boost inbox placement")
        recommendations.push("Review email content for potential spam trigger words")
    } else {
        recommendations.push("Reduce sending volume temporarily to rebuild sender reputation")
        recommendations.push("Check DNS records and authentication status")
    }

    if (spamRate > 5) {
        recommendations.push("High spam rate detected - review email content and sending patterns")
    }

    if (recommendations.length === 0) {
        recommendations.push("Continue warmup activities to maintain sender reputation")
    }

    return (
        <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">Recommended Actions</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {recommendations.slice(0, 3).map((rec, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function InboxIntelligence({
    inboxRate,
    spamRate,
    dnsRecords,
    onRefresh,
    lastUpdated
}: InboxIntelligenceProps) {
    return (
        <div className="space-y-6">
            {/* Placement Funnel */}
            <Card className="border-border/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="pb-4 relative">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Inbox className="w-5 h-5 text-primary" />
                            Inbox Placement Analysis
                        </CardTitle>
                        {onRefresh && (
                            <Button variant="ghost" size="icon" onClick={onRefresh}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                    {lastUpdated && (
                        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
                    )}
                </CardHeader>
                <CardContent className="relative">
                    <PlacementFunnel inboxRate={inboxRate} spamRate={spamRate} />
                </CardContent>
            </Card>

            {/* DNS Health - only show if records exist */}
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="w-5 h-5 text-primary" />
                        DNS Authentication
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DNSHealthMonitor records={dnsRecords} />
                </CardContent>
            </Card>

            {/* Dynamic Recommendations */}
            <Recommendations inboxRate={inboxRate} spamRate={spamRate} />
        </div>
    )
}
