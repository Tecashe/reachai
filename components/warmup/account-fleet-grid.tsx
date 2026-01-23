"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Progress
} from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Mail,
    MoreVertical,
    Pause,
    Play,
    Settings,
    TrendingUp,
    TrendingDown,
    Inbox,
    AlertTriangle,
    CheckCircle2,
    Clock,
    MessageSquare,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountData {
    id: string
    email: string
    name?: string
    provider: string
    stage: string
    healthScore: number
    sentToday: number
    dailyLimit: number
    lastActive: string | null
    inboxRate: number
    activeThreads: number
}

interface AccountFleetGridProps {
    accounts: AccountData[]
    onAction: (accountId: string, action: 'pause' | 'resume' | 'settings') => void
    loading?: boolean
}

// Provider icon component
function ProviderIcon({ provider }: { provider: string }) {
    const getProviderColor = () => {
        switch (provider.toLowerCase()) {
            case 'gmail': return 'from-red-500 to-orange-500'
            case 'outlook': return 'from-blue-500 to-cyan-500'
            case 'yahoo': return 'from-purple-500 to-pink-500'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    return (
        <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br shadow-lg",
            getProviderColor()
        )}>
            <Mail className="w-5 h-5 text-white" />
        </div>
    )
}

// Mini sparkline component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data, 1)
    const min = Math.min(...data, 0)
    const range = max - min || 1

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - ((value - min) / range) * 100
        return `${x},${y}`
    }).join(' ')

    return (
        <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

// Stage badge with progress
function StageBadge({ stage }: { stage: string }) {
    const getStageConfig = () => {
        switch (stage) {
            case 'NEW':
                return {
                    label: 'New',
                    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
                    progress: 10,
                    icon: <Clock className="w-3 h-3" />
                }
            case 'WARMING':
                return {
                    label: 'Warming Up',
                    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    progress: 40,
                    icon: <Zap className="w-3 h-3" />
                }
            case 'WARM':
                return {
                    label: 'Warm',
                    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    progress: 70,
                    icon: <TrendingUp className="w-3 h-3" />
                }
            case 'ESTABLISHED':
                return {
                    label: 'Established',
                    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    progress: 100,
                    icon: <CheckCircle2 className="w-3 h-3" />
                }
            case 'PAUSED':
                return {
                    label: 'Paused',
                    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                    progress: 0,
                    icon: <Pause className="w-3 h-3" />
                }
            default:
                return {
                    label: stage,
                    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                    progress: 50,
                    icon: <Mail className="w-3 h-3" />
                }
        }
    }

    const config = getStageConfig()

    return (
        <Badge variant="outline" className={cn("gap-1 font-medium", config.color)}>
            {config.icon}
            {config.label}
        </Badge>
    )
}

// Health score gauge
function HealthGauge({ score }: { score: number }) {
    const getHealthColor = () => {
        if (score >= 80) return { color: 'text-emerald-400', bg: 'bg-emerald-500' }
        if (score >= 60) return { color: 'text-amber-400', bg: 'bg-amber-500' }
        return { color: 'text-rose-400', bg: 'bg-rose-500' }
    }

    const colors = getHealthColor()

    return (
        <div className="flex items-center gap-2">
            <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle
                        className="text-muted/20"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        r="16"
                        cx="18"
                        cy="18"
                    />
                    <circle
                        className={colors.color}
                        strokeWidth="3"
                        strokeDasharray={`${score}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        r="16"
                        cx="18"
                        cy="18"
                    />
                </svg>
                <span className={cn("absolute inset-0 flex items-center justify-center text-xs font-bold", colors.color)}>
                    {score}
                </span>
            </div>
        </div>
    )
}

function AccountCard({ account, onAction }: { account: AccountData; onAction: AccountFleetGridProps['onAction'] }) {
    const [isHovered, setIsHovered] = useState(false)
    const isPaused = account.stage === 'PAUSED'

    // Generate mock sparkline data (in real app, this would come from API)
    const sparklineData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 20)

    const utilizationPercent = Math.round((account.sentToday / account.dailyLimit) * 100)

    return (
        <Card
            className={cn(
                "relative overflow-hidden transition-all duration-300",
                "bg-gradient-to-br from-card via-card to-muted/20",
                "border border-border/50 hover:border-primary/30",
                "hover:shadow-lg hover:shadow-primary/5",
                isHovered && "scale-[1.01]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Status indicator bar */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                isPaused ? "bg-rose-500" : account.healthScore >= 80 ? "bg-emerald-500" : account.healthScore >= 60 ? "bg-amber-500" : "bg-rose-500"
            )} />

            <CardContent className="p-5 pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <ProviderIcon provider={account.provider} />
                        <div className="min-w-0">
                            <p className="font-semibold text-sm truncate max-w-[180px]">
                                {account.email}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {account.provider}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isPaused ? (
                                <DropdownMenuItem onClick={() => onAction(account.id, 'resume')}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Resume Warmup
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => onAction(account.id, 'pause')}>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause Warmup
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => onAction(account.id, 'settings')}>
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Stage Badge */}
                <div className="mb-4">
                    <StageBadge stage={account.stage} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Health Score */}
                    <div className="flex items-center gap-2">
                        <HealthGauge score={account.healthScore} />
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</p>
                            <p className="text-sm font-medium">
                                {account.healthScore >= 80 ? 'Excellent' : account.healthScore >= 60 ? 'Good' : 'Poor'}
                            </p>
                        </div>
                    </div>

                    {/* Inbox Rate */}
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Inbox Rate</p>
                        <div className="flex items-center gap-2">
                            <Inbox className={cn(
                                "w-4 h-4",
                                account.inboxRate >= 90 ? "text-emerald-400" : account.inboxRate >= 70 ? "text-amber-400" : "text-rose-400"
                            )} />
                            <span className="text-lg font-bold">{account.inboxRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Daily Progress */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Daily Volume</span>
                        <span className="font-medium">{account.sentToday} / {account.dailyLimit}</span>
                    </div>
                    <Progress value={utilizationPercent} className="h-2" />
                </div>

                {/* Sparkline - 7 Day Trend */}
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">7-Day Trend</p>
                    <MiniSparkline
                        data={sparklineData}
                        color={account.healthScore >= 80 ? "#10b981" : account.healthScore >= 60 ? "#f59e0b" : "#ef4444"}
                    />
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>{account.activeThreads} threads</span>
                    </div>
                    {account.lastActive && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(account.lastActive).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export function AccountFleetGrid({ accounts, onAction, loading }: AccountFleetGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-[340px] animate-pulse bg-muted/50" />
                ))}
            </div>
        )
    }

    if (accounts.length === 0) {
        return (
            <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Warmup Accounts</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Add your first email account to start building reputation and improving deliverability
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
                <AccountCard key={account.id} account={account} onAction={onAction} />
            ))}
        </div>
    )
}
