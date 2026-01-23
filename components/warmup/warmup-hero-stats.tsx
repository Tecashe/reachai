"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Users,
    Mail,
    Inbox,
    Activity,
    MessageSquare,
    ShieldAlert,
    TrendingUp,
    TrendingDown,
    Minus
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroStat {
    id: string
    label: string
    value: number
    suffix?: string
    trend?: number
    trendLabel?: string
    icon: React.ReactNode
    gradient: string
    accentColor: string
}

interface WarmupHeroStatsProps {
    stats: {
        activeAccounts: number
        totalAccounts: number
        emailsSentToday: number
        inboxRate: number
        healthScore: number
        activeThreads: number
        spamRescued: number
    }
    trends?: {
        accounts: number
        emails: number
        inboxRate: number
        healthScore: number
    }
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1000) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        const startValue = countRef.current
        const difference = end - startValue

        const animate = (currentTime: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = currentTime
            }

            const elapsed = currentTime - startTimeRef.current
            const progress = Math.min(elapsed / duration, 1)

            // Easing function (ease-out-expo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            const currentValue = Math.round(startValue + difference * easeProgress)
            setCount(currentValue)
            countRef.current = currentValue

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        startTimeRef.current = null
        requestAnimationFrame(animate)
    }, [end, duration])

    return count
}

function StatCard({ stat, index }: { stat: HeroStat; index: number }) {
    const animatedValue = useAnimatedCounter(stat.value, 1200)

    const TrendIcon = stat.trend && stat.trend > 0
        ? TrendingUp
        : stat.trend && stat.trend < 0
            ? TrendingDown
            : Minus

    return (
        <Card
            className={cn(
                "relative overflow-hidden border-0 transition-all duration-500",
                "hover:scale-[1.02] hover:-translate-y-1",
                "group cursor-default"
            )}
            style={{
                animationDelay: `${index * 100}ms`,
                background: `linear-gradient(135deg, ${stat.gradient})`,
            }}
        >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-[2px]" />

            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Glow effect */}
            <div
                className="absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity blur-xl"
                style={{ background: stat.gradient }}
            />

            <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                            {stat.label}
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
                                {animatedValue.toLocaleString()}
                            </span>
                            {stat.suffix && (
                                <span className="text-lg font-medium text-white/80">{stat.suffix}</span>
                            )}
                        </div>
                        {stat.trend !== undefined && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                stat.trend > 0 ? "text-emerald-300" : stat.trend < 0 ? "text-rose-300" : "text-white/60"
                            )}>
                                <TrendIcon className="w-3 h-3" />
                                <span>{stat.trend > 0 ? "+" : ""}{stat.trend}%</span>
                                {stat.trendLabel && (
                                    <span className="text-white/50 ml-1">{stat.trendLabel}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        "p-3 rounded-xl transition-all duration-300",
                        "bg-white/10 backdrop-blur-sm",
                        "group-hover:scale-110 group-hover:bg-white/20"
                    )}>
                        {stat.icon}
                    </div>
                </div>

                {/* Progress bar for percentage stats */}
                {stat.suffix === "%" && (
                    <div className="mt-4">
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-white/60 transition-all duration-1000 ease-out"
                                style={{ width: `${Math.min(stat.value, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function WarmupHeroStats({ stats, trends }: WarmupHeroStatsProps) {
    const heroStats: HeroStat[] = [
        {
            id: "active-accounts",
            label: "Active Accounts",
            value: stats.activeAccounts,
            trend: trends?.accounts,
            trendLabel: "vs last week",
            icon: <Users className="w-5 h-5 text-white/90" />,
            gradient: "rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%",
            accentColor: "#667eea",
        },
        {
            id: "emails-today",
            label: "Emails Sent Today",
            value: stats.emailsSentToday,
            trend: trends?.emails,
            trendLabel: "vs yesterday",
            icon: <Mail className="w-5 h-5 text-white/90" />,
            gradient: "rgba(79, 172, 254, 0.9) 0%, rgba(0, 242, 254, 0.9) 100%",
            accentColor: "#4facfe",
        },
        {
            id: "inbox-rate",
            label: "Inbox Placement",
            value: stats.inboxRate,
            suffix: "%",
            trend: trends?.inboxRate,
            trendLabel: "this month",
            icon: <Inbox className="w-5 h-5 text-white/90" />,
            gradient: "rgba(17, 153, 142, 0.9) 0%, rgba(56, 239, 125, 0.9) 100%",
            accentColor: "#11998e",
        },
        {
            id: "health-score",
            label: "Network Health",
            value: stats.healthScore,
            suffix: "%",
            trend: trends?.healthScore,
            icon: <Activity className="w-5 h-5 text-white/90" />,
            gradient: "rgba(250, 112, 154, 0.9) 0%, rgba(254, 225, 64, 0.9) 100%",
            accentColor: "#fa709a",
        },
        {
            id: "active-threads",
            label: "Active Threads",
            value: stats.activeThreads,
            icon: <MessageSquare className="w-5 h-5 text-white/90" />,
            gradient: "rgba(168, 85, 247, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%",
            accentColor: "#a855f7",
        },
        {
            id: "spam-rescued",
            label: "Spam Rescued",
            value: stats.spamRescued,
            icon: <ShieldAlert className="w-5 h-5 text-white/90" />,
            gradient: "rgba(251, 146, 60, 0.9) 0%, rgba(251, 191, 36, 0.9) 100%",
            accentColor: "#fb923c",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {heroStats.map((stat, index) => (
                <StatCard key={stat.id} stat={stat} index={index} />
            ))}
        </div>
    )
}
