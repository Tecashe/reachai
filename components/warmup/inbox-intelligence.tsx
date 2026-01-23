"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Inbox,
    Mail,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Shield,
    Globe,
    RefreshCw,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DNSRecord {
    type: 'SPF' | 'DKIM' | 'DMARC'
    status: 'valid' | 'invalid' | 'missing'
    value?: string
}

interface ProviderReputation {
    name: string
    score: number
    trend: 'up' | 'down' | 'stable'
    icon: string
}

interface BlacklistEntry {
    list: string
    status: 'clear' | 'listed'
    lastChecked: string
}

interface InboxIntelligenceProps {
    inboxRate: number
    spamRate: number
    dnsRecords: DNSRecord[]
    providerReputations?: ProviderReputation[]
    blacklists?: BlacklistEntry[]
    onRefresh?: () => void
    lastUpdated?: string
}

// Placement funnel component
function PlacementFunnel({ inboxRate, spamRate }: { inboxRate: number; spamRate: number }) {
    const otherRate = 100 - inboxRate - spamRate

    return (
        <div className="space-y-4">
            {/* Funnel visualization */}
            <div className="relative">
                {/* Inbox (Primary) */}
                <div className="relative mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium">Primary Inbox</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">{inboxRate}%</span>
                    </div>
                    <div className="relative h-10 rounded-lg overflow-hidden bg-emerald-500/20">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out"
                            style={{ width: `${inboxRate}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                        {/* Animated pulse */}
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/20 via-white/40 to-transparent -translate-x-full animate-shimmer"
                            style={{ width: `${inboxRate}%`, animationDuration: '2s', animationIterationCount: 'infinite' }}
                        />
                    </div>
                </div>

                {/* Other folders */}
                <div className="relative mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium">Promotions/Other</span>
                        </div>
                        <span className="text-lg font-bold text-amber-400">{otherRate}%</span>
                    </div>
                    <div className="relative h-8 rounded-lg overflow-hidden bg-amber-500/20">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-out"
                            style={{ width: `${Math.max(otherRate * 2, 0)}%` }}
                        />
                    </div>
                </div>

                {/* Spam */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-medium">Spam</span>
                        </div>
                        <span className="text-lg font-bold text-rose-400">{spamRate}%</span>
                    </div>
                    <div className="relative h-6 rounded-lg overflow-hidden bg-rose-500/20">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-1000 ease-out"
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
                return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Valid' }
            case 'invalid':
                return { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/20', label: 'Invalid' }
            case 'missing':
                return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Missing' }
            default:
                return { icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Unknown' }
        }
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
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : record.status === 'invalid'
                                    ? "border-rose-500/30 bg-rose-500/5"
                                    : "border-amber-500/30 bg-amber-500/5"
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

// Provider reputation cards
function ProviderReputationCards({ reputations }: { reputations: ProviderReputation[] }) {
    const getReputationColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400'
        if (score >= 60) return 'text-amber-400'
        return 'text-rose-400'
    }

    return (
        <div className="grid grid-cols-3 gap-3">
            {reputations.map((provider) => (
                <div
                    key={provider.name}
                    className="p-4 rounded-xl bg-muted/30 border border-border/30 text-center"
                >
                    <span className="text-2xl mb-2 block">{provider.icon}</span>
                    <p className="text-xs text-muted-foreground mb-1">{provider.name}</p>
                    <div className="flex items-center justify-center gap-1">
                        <span className={cn("text-xl font-bold", getReputationColor(provider.score))}>
                            {provider.score}
                        </span>
                        {provider.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        {provider.trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                    </div>
                </div>
            ))}
        </div>
    )
}

// Blacklist monitor
function BlacklistMonitor({ blacklists }: { blacklists: BlacklistEntry[] }) {
    const listedCount = blacklists.filter(b => b.status === 'listed').length
    const clearCount = blacklists.filter(b => b.status === 'clear').length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        listedCount > 0 ? "bg-rose-500/20" : "bg-emerald-500/20"
                    )}>
                        <Globe className={cn(
                            "w-5 h-5",
                            listedCount > 0 ? "text-rose-400" : "text-emerald-400"
                        )} />
                    </div>
                    <div>
                        <p className="font-semibold">Blacklist Status</p>
                        <p className="text-xs text-muted-foreground">
                            {listedCount > 0
                                ? `Listed on ${listedCount} blacklist${listedCount > 1 ? 's' : ''}`
                                : 'All clear across major blacklists'}
                        </p>
                    </div>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        listedCount > 0
                            ? "border-rose-500/50 text-rose-400 bg-rose-500/10"
                            : "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                    )}
                >
                    {clearCount}/{blacklists.length} Clear
                </Badge>
            </div>

            <div className="space-y-2">
                {blacklists.slice(0, 5).map((bl) => (
                    <div
                        key={bl.list}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                    >
                        <div className="flex items-center gap-2">
                            {bl.status === 'clear' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                            )}
                            <span className="text-sm">{bl.list}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{bl.lastChecked}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function InboxIntelligence({
    inboxRate,
    spamRate,
    dnsRecords,
    providerReputations = [
        { name: 'Gmail', score: 85, trend: 'up', icon: '📧' },
        { name: 'Outlook', score: 78, trend: 'stable', icon: '📬' },
        { name: 'Yahoo', score: 72, trend: 'down', icon: '📮' },
    ],
    blacklists = [
        { list: 'Spamhaus', status: 'clear', lastChecked: '2 hours ago' },
        { list: 'SORBS', status: 'clear', lastChecked: '2 hours ago' },
        { list: 'Barracuda', status: 'clear', lastChecked: '2 hours ago' },
        { list: 'SpamCop', status: 'clear', lastChecked: '2 hours ago' },
        { list: 'SURBL', status: 'clear', lastChecked: '2 hours ago' },
    ],
    onRefresh,
    lastUpdated
}: InboxIntelligenceProps) {
    return (
        <div className="space-y-6">
            {/* Placement Funnel */}
            <Card className="border-border/50 overflow-hidden">
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

            <div className="grid md:grid-cols-2 gap-6">
                {/* DNS Health */}
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

                {/* Provider Reputation */}
                <Card className="border-border/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Mail className="w-5 h-5 text-primary" />
                            Provider Reputation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProviderReputationCards reputations={providerReputations} />
                    </CardContent>
                </Card>
            </div>

            {/* Blacklist Monitor */}
            <Card className="border-border/50">
                <CardContent className="pt-6">
                    <BlacklistMonitor blacklists={blacklists} />
                </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Recommended Actions</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Maintain current email sending patterns for consistent deliverability
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Consider increasing daily warmup volume for accounts with 90%+ health
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                    Monitor Gmail reputation closely - it affects 45% of your sends
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
