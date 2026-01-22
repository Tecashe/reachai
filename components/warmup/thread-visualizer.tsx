"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Clock, CheckCircle2, MoreHorizontal } from "lucide-react"

interface Thread {
    id: string
    subject: string
    messageCount: number
    maxMessages: number
    lastMessageAt: string
    initiator: string
    recipient: string
    lastSnippet: string
    status: string
    topic: string
}

interface ThreadVisualizerProps {
    threads: Thread[]
}

export function ThreadVisualizer({ threads }: ThreadVisualizerProps) {
    if (threads.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                    <p>No active peer-to-peer threads</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {threads.map((thread) => (
                <Card key={thread.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3 bg-muted/30">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    {thread.subject}
                                    <Badge variant="secondary" className="text-[10px] h-5">{thread.topic}</Badge>
                                </CardTitle>
                                <CardDescription className="text-xs mt-1 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Updated {new Date(thread.lastMessageAt).toLocaleTimeString()}
                                </CardDescription>
                            </div>
                            <Badge variant={thread.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {thread.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 grid md:grid-cols-[1fr_200px] gap-4">
                        {/* Conversation Flow Visualization */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 border-2 border-primary/20">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">A</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted/50 rounded-lg p-2 text-sm max-w-[80%]">
                                    <p className="font-medium text-xs text-muted-foreground mb-0.5">{thread.initiator}</p>
                                    <p className="truncate">Initial outreach...</p>
                                </div>
                            </div>

                            {thread.messageCount > 1 && (
                                <div className="flex items-center gap-3 flex-row-reverse">
                                    <Avatar className="w-8 h-8 border-2 border-indigo-500/20">
                                        <AvatarFallback className="bg-indigo-500/10 text-indigo-500 text-xs">B</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-indigo-500/5 rounded-lg p-2 text-sm max-w-[80%]">
                                        <p className="font-medium text-xs text-muted-foreground mb-0.5 text-right">{thread.recipient}</p>
                                        <p className="truncate">{thread.lastSnippet}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thread Stats */}
                        <div className="bg-muted/20 rounded-lg p-3 space-y-3 border border-border/50">
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Progress</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: thread.maxMessages }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-4 rounded-sm ${i < thread.messageCount ? 'bg-primary' : 'bg-muted'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-muted-foreground text-xs">{thread.messageCount}/{thread.maxMessages}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Participants</p>
                                <div className="flex -space-x-2">
                                    <Avatar className="w-6 h-6 border-2 border-background" title={thread.initiator}>
                                        <AvatarFallback className="bg-primary/10 text-[10px]">A</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="w-6 h-6 border-2 border-background" title={thread.recipient}>
                                        <AvatarFallback className="bg-indigo-500/10 text-[10px]">B</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
