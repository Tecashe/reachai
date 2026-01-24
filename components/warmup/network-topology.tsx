"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
    Mail,
    Send
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

// Format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

// Get provider display info
function getProviderInfo(provider: string): { label: string; color: string } {
    const p = provider?.toLowerCase() || 'email'
    if (p.includes('gmail') || p.includes('google')) {
        return { label: 'Gmail', color: 'text-red-400' }
    }
    if (p.includes('outlook') || p.includes('microsoft') || p.includes('hotmail')) {
        return { label: 'Outlook', color: 'text-blue-400' }
    }
    if (p.includes('yahoo')) {
        return { label: 'Yahoo', color: 'text-purple-400' }
    }
    if (p.includes('icloud') || p.includes('apple')) {
        return { label: 'iCloud', color: 'text-gray-400' }
    }
    return { label: 'Email', color: 'text-muted-foreground' }
}

// Extract display name from email
function getDisplayName(email: string): string {
    if (!email || email === 'Unknown') return 'Unknown'
    const parts = email.split('@')
    return parts[0] || email
}

// Status indicator component
function StatusIndicator({ status }: { status: string }) {
    switch (status) {
        case 'ACTIVE':
            return (
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Active</span>
                </div>
            )
        case 'PAUSED':
            return (
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">Paused</span>
                </div>
            )
        case 'COMPLETED':
            return (
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Done</span>
                </div>
            )
        default:
            return (
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span className="text-[10px] font-medium text-rose-400 uppercase tracking-wider">Failed</span>
                </div>
            )
    }
}

// Thread row component - Clean table-like row
function ThreadRow({ thread, onClick }: { thread: ThreadConnection; onClick?: () => void }) {
    const initiatorInfo = getProviderInfo(thread.initiator.provider)
    const recipientInfo = getProviderInfo(thread.recipient.provider)

    return (
        <div
            className={cn(
                "group relative px-4 py-4 transition-all cursor-pointer",
                "border-b border-border/30 last:border-0",
                "hover:bg-muted/30"
            )}
            onClick={onClick}
        >
            {/* Main content grid */}
            <div className="flex items-center gap-4">
                {/* Initiator */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted/80 border border-border/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-foreground">
                                {getDisplayName(thread.initiator.email).charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {getDisplayName(thread.initiator.email)}
                            </p>
                            <p className={cn("text-[10px] font-medium", initiatorInfo.color)}>
                                {initiatorInfo.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Connection indicator */}
                <div className="flex items-center gap-2 px-3">
                    <div className="w-12 h-px bg-border relative">
                        {thread.status === 'ACTIVE' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
                        )}
                    </div>
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        thread.status === 'ACTIVE' ? "bg-primary/10 border border-primary/30" :
                            thread.status === 'PAUSED' ? "bg-amber-500/10 border border-amber-500/30" :
                                thread.status === 'COMPLETED' ? "bg-muted" : "bg-rose-500/10 border border-rose-500/30"
                    )}>
                        {thread.status === 'ACTIVE' && <Send className="w-3 h-3 text-primary" />}
                        {thread.status === 'PAUSED' && <PauseCircle className="w-3 h-3 text-amber-400" />}
                        {thread.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3 text-muted-foreground" />}
                        {thread.status === 'FAILED' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                    </div>
                    <div className="w-12 h-px bg-border relative">
                        {thread.status === 'ACTIVE' && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Recipient */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-end">
                        <div className="min-w-0 text-right">
                            <p className="text-sm font-medium text-foreground truncate">
                                {getDisplayName(thread.recipient.email)}
                            </p>
                            <p className={cn("text-[10px] font-medium", recipientInfo.color)}>
                                {recipientInfo.label}
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted/80 border border-border/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-foreground">
                                {getDisplayName(thread.recipient.email).charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
                <div className="flex items-center gap-4">
                    <StatusIndicator status={thread.status} />
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MessageSquare className="w-3 h-3" />
                        <span>{thread.messageCount} messages</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(thread.lastActivity)}</span>
                </div>
            </div>

            {/* Subject if available */}
            {thread.subject && (
                <p className="mt-2 text-xs text-muted-foreground truncate">
                    <span className="text-foreground/70">Subject:</span> {thread.subject}
                </p>
            )}
        </div>
    )
}

// Network statistics summary
function NetworkStats({ threads }: { threads: ThreadConnection[] }) {
    const activeCount = threads.filter(t => t.status === 'ACTIVE').length
    const pausedCount = threads.filter(t => t.status === 'PAUSED').length
    const completedCount = threads.filter(t => t.status === 'COMPLETED').length
    const totalMessages = threads.reduce((sum, t) => sum + t.messageCount, 0)
    const uniqueAccounts = new Set([
        ...threads.map(t => t.initiator.id),
        ...threads.map(t => t.recipient.id)
    ]).size

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-muted-foreground font-medium">Active</span>
                </div>
                <span className="text-xl font-bold">{activeCount}</span>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] text-muted-foreground font-medium">Messages</span>
                </div>
                <span className="text-xl font-bold">{totalMessages}</span>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-muted-foreground font-medium">Accounts</span>
                </div>
                <span className="text-xl font-bold">{uniqueAccounts}</span>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground font-medium">Completed</span>
                </div>
                <span className="text-xl font-bold">{completedCount}</span>
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
            <Card className="border-dashed border-2 border-border/50 bg-transparent">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Network className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">No Active Threads</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Peer-to-peer warmup conversations will appear here once they start
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Network Overview */}
            <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Network className="w-4 h-4 text-primary" />
                                Network Overview
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                Peer-to-peer warmup conversation activity
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-medium">
                            {threads.length} thread{threads.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <NetworkStats threads={threads} />
                </CardContent>
            </Card>

            {/* Thread List */}
            <Card className="border-border/50 bg-card/50 overflow-hidden">
                <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Connections
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[420px]">
                    <div className="divide-y divide-border/30">
                        {sortedThreads.map((thread) => (
                            <ThreadRow
                                key={thread.id}
                                thread={thread}
                                onClick={() => onThreadClick?.(thread.id)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    )
}
