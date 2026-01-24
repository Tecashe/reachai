"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    Eye,
    MessageSquare,
    AlertTriangle,
    Inbox,
    Loader2,
    Mail,
    Send
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ThreadParticipant {
    id: string
    email: string
    provider: string
    healthScore: number
}

interface ThreadMessage {
    id: string
    direction: 'OUTBOUND' | 'INBOUND'
    subject: string
    snippet: string | null
    sentAt: string | null
    deliveredAt: string | null
    openedAt: string | null
    repliedAt: string | null
    landedInInbox: boolean
    landedInSpam: boolean
    createdAt: string
    senderAccountId: string
}

interface ThreadDetails {
    id: string
    subject: string
    topic: string | null
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED'
    messageCount: number
    maxMessages: number
    nextScheduledAt: string | null
    startedAt: string
    completedAt: string | null
    createdAt: string
    updatedAt: string
    responseTimeMin: number
    responseTimeMax: number
    totalOpens: number
    totalReplies: number
    initiator: ThreadParticipant
    recipient: ThreadParticipant
    messages: ThreadMessage[]
}

interface ThreadDetailDialogProps {
    threadId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function getProviderColor(provider: string): string {
    const p = provider?.toLowerCase() || ''
    if (p.includes('gmail') || p.includes('google')) return 'text-red-400'
    if (p.includes('outlook') || p.includes('microsoft')) return 'text-blue-400'
    if (p.includes('yahoo')) return 'text-purple-400'
    return 'text-muted-foreground'
}

function formatDateTime(dateString: string | null): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
}

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

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, { bg: string; text: string }> = {
        ACTIVE: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
        PAUSED: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
        COMPLETED: { bg: 'bg-muted border-border', text: 'text-muted-foreground' },
        FAILED: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400' },
    }
    const v = variants[status] || variants.FAILED

    return (
        <Badge variant="outline" className={cn("text-[10px] font-medium border", v.bg, v.text)}>
            {status}
        </Badge>
    )
}

function MessageItem({ message, isFromInitiator, initiatorEmail, recipientEmail }: {
    message: ThreadMessage
    isFromInitiator: boolean
    initiatorEmail: string
    recipientEmail: string
}) {
    const isOutbound = message.direction === 'OUTBOUND'
    const senderEmail = isFromInitiator ? initiatorEmail : recipientEmail

    return (
        <div className={cn(
            "flex gap-3",
            isOutbound ? "flex-row" : "flex-row-reverse"
        )}>
            <Avatar className="w-8 h-8 flex-shrink-0 border border-border/50">
                <AvatarFallback className={cn(
                    "text-xs font-medium",
                    isOutbound ? "bg-primary/10 text-primary" : "bg-indigo-500/10 text-indigo-400"
                )}>
                    {senderEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex-1 max-w-[85%] rounded-lg p-3 border",
                isOutbound
                    ? "bg-primary/5 border-primary/20"
                    : "bg-indigo-500/5 border-indigo-500/20"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        {isOutbound ? (
                            <ArrowUpRight className="w-3 h-3 text-primary" />
                        ) : (
                            <ArrowDownLeft className="w-3 h-3 text-indigo-400" />
                        )}
                        <span className="text-xs font-medium truncate">
                            {senderEmail.split('@')[0]}
                        </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(message.sentAt || message.createdAt)}
                    </span>
                </div>

                {/* Subject */}
                <p className="text-sm font-medium mb-1">{message.subject}</p>

                {/* Snippet */}
                {message.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                        {message.snippet}
                    </p>
                )}

                {/* Status indicators */}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/30">
                    {message.sentAt && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Send className="w-3 h-3" />
                            <span>Sent</span>
                        </div>
                    )}
                    {message.deliveredAt && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Delivered</span>
                        </div>
                    )}
                    {message.openedAt && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400">
                            <Eye className="w-3 h-3" />
                            <span>Opened</span>
                        </div>
                    )}
                    {message.repliedAt && (
                        <div className="flex items-center gap-1 text-[10px] text-primary">
                            <MessageSquare className="w-3 h-3" />
                            <span>Replied</span>
                        </div>
                    )}
                    {message.landedInSpam && (
                        <div className="flex items-center gap-1 text-[10px] text-rose-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Spam</span>
                        </div>
                    )}
                    {message.landedInInbox && !message.landedInSpam && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <Inbox className="w-3 h-3" />
                            <span>Inbox</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export function ThreadDetailDialog({ threadId, open, onOpenChange }: ThreadDetailDialogProps) {
    const [loading, setLoading] = useState(false)
    const [thread, setThread] = useState<ThreadDetails | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!threadId || !open) {
            setThread(null)
            setError(null)
            return
        }

        const fetchThread = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/warmup/threads/${threadId}`)
                if (!res.ok) {
                    throw new Error("Failed to load thread")
                }
                const data = await res.json()
                setThread(data)
            } catch (err) {
                setError("Failed to load thread details")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchThread()
    }, [threadId, open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                        <p className="text-sm text-muted-foreground">Loading thread...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertTriangle className="w-8 h-8 text-rose-400 mb-3" />
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                ) : thread ? (
                    <>
                        <DialogHeader className="pb-4 border-b border-border/50">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <DialogTitle className="text-lg truncate pr-8">
                                        {thread.subject}
                                    </DialogTitle>
                                    <DialogDescription className="flex items-center gap-2 mt-1">
                                        {thread.topic && (
                                            <Badge variant="secondary" className="text-[10px]">
                                                {thread.topic}
                                            </Badge>
                                        )}
                                        <StatusBadge status={thread.status} />
                                    </DialogDescription>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                                    <span>Progress</span>
                                    <span>{thread.messageCount} / {thread.maxMessages} messages</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${(thread.messageCount / thread.maxMessages) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Participants */}
                        <div className="py-4 border-b border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-3">PARTICIPANTS</p>
                            <div className="flex items-center gap-4">
                                {/* Initiator */}
                                <div className="flex-1 flex items-center gap-2">
                                    <Avatar className="w-10 h-10 border-2 border-primary/30">
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                            {thread.initiator.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {thread.initiator.email.split('@')[0]}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-[10px] font-medium", getProviderColor(thread.initiator.provider))}>
                                                {thread.initiator.provider || 'Email'}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] h-4 px-1">
                                                {thread.initiator.healthScore}% health
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex items-center gap-1 px-2">
                                    <div className="w-8 h-px bg-border" />
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <div className="w-8 h-px bg-border" />
                                </div>

                                {/* Recipient */}
                                <div className="flex-1 flex items-center gap-2 justify-end">
                                    <div className="min-w-0 text-right">
                                        <p className="text-sm font-medium truncate">
                                            {thread.recipient.email.split('@')[0]}
                                        </p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className={cn("text-[10px] font-medium", getProviderColor(thread.recipient.provider))}>
                                                {thread.recipient.provider || 'Email'}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] h-4 px-1">
                                                {thread.recipient.healthScore}% health
                                            </Badge>
                                        </div>
                                    </div>
                                    <Avatar className="w-10 h-10 border-2 border-indigo-500/30">
                                        <AvatarFallback className="bg-indigo-500/10 text-indigo-400 font-medium">
                                            {thread.recipient.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 min-h-0">
                            <div className="flex items-center justify-between py-3">
                                <p className="text-xs font-medium text-muted-foreground">CONVERSATION</p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>Started {formatDateTime(thread.startedAt)}</span>
                                </div>
                            </div>
                            <ScrollArea className="h-[280px] pr-4">
                                {thread.messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <MessageSquare className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No messages yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pb-4">
                                        {thread.messages.map((msg) => (
                                            <MessageItem
                                                key={msg.id}
                                                message={msg}
                                                isFromInitiator={msg.senderAccountId === thread.initiator.id}
                                                initiatorEmail={thread.initiator.email}
                                                recipientEmail={thread.recipient.email}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Footer stats */}
                        <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {thread.totalOpens} opens
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {thread.totalReplies} replies
                                    </span>
                                </div>
                                {thread.nextScheduledAt && thread.status === 'ACTIVE' && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Next: {formatDateTime(thread.nextScheduledAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
