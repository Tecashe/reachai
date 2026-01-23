"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Network,
    MessageSquare,
    ArrowRight,
    Clock,
    CheckCircle2,
    PauseCircle,
    AlertCircle,
    Users,
    Zap,
    TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ConnectionNode {
    id: string
    email: string
    healthScore: number
    provider: string
}

interface ThreadConnection {
    id: string
    initiator: ConnectionNode
    recipient: ConnectionNode
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED'
    messageCount: number
    lastActivity: string
    subject?: string
}

interface NetworkTopologyProps {
    threads: ThreadConnection[]
    onThreadClick?: (threadId: string) => void
}

// Thread status badge
function ThreadStatusBadge({ status }: { status: string }) {
    const getStatusConfig = () => {
        switch (status) {
            case 'ACTIVE':
                return {
                    color: 'bg-primary/20 text-primary border-primary/30',
                    icon: <Zap className="w-3 h-3" />,
                    label: 'Active'
                }
            case 'PAUSED':
                return {
                    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    icon: <PauseCircle className="w-3 h-3" />,
                    label: 'Paused'
                }
            case 'COMPLETED':
                return {
                    color: 'bg-primary/20 text-primary border-primary/30',
                    icon: <CheckCircle2 className="w-3 h-3" />,
                    label: 'Completed'
                }
            case 'FAILED':
                return {
                    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                    icon: <AlertCircle className="w-3 h-3" />,
                    label: 'Failed'
                }
            default:
                return {
                    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                    icon: <Clock className="w-3 h-3" />,
                    label: status
                }
        }
    }

    const config = getStatusConfig()

    return (
        <Badge variant="outline" className={cn("gap-1 text-[10px]", config.color)}>
            {config.icon}
            {config.label}
        </Badge>
    )
}

// Node component for the connection visualization
function ConnectionNodeComponent({ node, side }: { node: ConnectionNode; side: 'left' | 'right' }) {
    const getHealthColor = () => {
        if (node.healthScore >= 80) return 'border-primary'
        if (node.healthScore >= 60) return 'border-muted-foreground'
        return 'border-destructive'
    }

    return (
        <div className={cn(
            "flex items-center gap-3",
            side === 'right' && "flex-row-reverse"
        )}>
            <div className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center",
                "bg-gradient-to-br from-muted to-muted/50",
                getHealthColor()
            )}>
                <span className="text-lg font-bold">
                    {node.email.charAt(0).toUpperCase()}
                </span>
            </div>
            <div className={cn(side === 'right' && "text-right")}>
                <p className="text-sm font-medium truncate max-w-[120px]">
                    {node.email.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                    {node.provider}
                </p>
            </div>
        </div>
    )
}

// Thread connection card
function ThreadCard({ thread, onClick }: { thread: ThreadConnection; onClick?: () => void }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className={cn(
                "relative p-4 rounded-xl border border-border/50 transition-all cursor-pointer",
                "bg-gradient-to-br from-card via-card to-muted/20",
                "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                isHovered && "scale-[1.01]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Status indicator */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-0.5 rounded-t-xl",
                thread.status === 'ACTIVE' ? "bg-primary" :
                    thread.status === 'PAUSED' ? "bg-muted-foreground" :
                        thread.status === 'COMPLETED' ? "bg-muted" : "bg-destructive"
            )} />

            {/* Connection visualization */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <ConnectionNodeComponent node={thread.initiator} side="left" />

                {/* Connection line with animation */}
                <div className="flex-1 relative h-8 flex items-center justify-center">
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-border" />
                    <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 flex items-center justify-center",
                        "w-8 h-8 rounded-full bg-background border-2",
                        thread.status === 'ACTIVE' ? "border-primary" : "border-muted"
                    )}>
                        {thread.status === 'ACTIVE' && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                        {thread.status === 'PAUSED' && (
                            <PauseCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                        {thread.status === 'COMPLETED' && (
                            <CheckCircle2 className="w-4 h-4 text-muted" />
                        )}
                        {thread.status === 'FAILED' && (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                    </div>
                    {/* Animated data flow */}
                    {thread.status === 'ACTIVE' && (
                        <>
                            <div className="absolute h-1 bg-gradient-to-r from-primary/50 to-transparent animate-flow-right"
                                style={{ left: '20%', width: '20%' }} />
                            <div className="absolute h-1 bg-gradient-to-l from-primary/50 to-transparent animate-flow-left"
                                style={{ right: '20%', width: '20%' }} />
                        </>
                    )}
                </div>

                <ConnectionNodeComponent node={thread.recipient} side="right" />
            </div>

            {/* Thread info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ThreadStatusBadge status={thread.status} />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {thread.messageCount} messages
                    </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {thread.lastActivity}
                </span>
            </div>

            {/* Subject line if available */}
            {thread.subject && (
                <p className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground truncate">
                    <span className="font-medium text-foreground">Subject:</span> {thread.subject}
                </p>
            )}
        </div>
    )
}

// Network statistics summary
function NetworkStats({ threads }: { threads: ThreadConnection[] }) {
    const activeCount = threads.filter(t => t.status === 'ACTIVE').length
    const totalMessages = threads.reduce((sum, t) => sum + t.messageCount, 0)
    const uniqueAccounts = new Set([
        ...threads.map(t => t.initiator.id),
        ...threads.map(t => t.recipient.id)
    ]).size

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Active Threads</span>
                </div>
                <span className="text-2xl font-bold text-primary">{activeCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Messages</span>
                </div>
                <span className="text-2xl font-bold text-primary">{totalMessages}</span>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Accounts</span>
                </div>
                <span className="text-2xl font-bold text-primary">{uniqueAccounts}</span>
            </div>
        </div>
    )
}

export function NetworkTopology({ threads, onThreadClick }: NetworkTopologyProps) {
    // Sort threads: active first, then by last activity
    const sortedThreads = [...threads].sort((a, b) => {
        if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
        if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    })

    if (threads.length === 0) {
        return (
            <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4">
                        <Network className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Threads</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Peer-to-peer warmup threads will appear here once they start
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Network Overview Header */}
            <Card className="border-border/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <CardHeader className="pb-4 relative">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Network className="w-5 h-5 text-primary" />
                        Peer Network Topology
                    </CardTitle>
                    <CardDescription>
                        Live view of peer-to-peer warmup conversations
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <NetworkStats threads={threads} />
                </CardContent>
            </Card>

            {/* Thread List */}
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Active Connections</CardTitle>
                        <Badge variant="secondary">{threads.length} threads</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[450px]">
                        <div className="p-4 space-y-4">
                            {sortedThreads.map((thread) => (
                                <ThreadCard
                                    key={thread.id}
                                    thread={thread}
                                    onClick={() => onThreadClick?.(thread.id)}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Style for animations */}
            <style jsx global>{`
        @keyframes flow-right {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes flow-left {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .animate-flow-right {
          animation: flow-right 2s ease-in-out infinite;
        }
        .animate-flow-left {
          animation: flow-left 2s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
