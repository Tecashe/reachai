"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { useChat, type UIMessage } from "@ai-sdk/react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bot,
    User,
    Send,
    Sparkles,
    ArrowUp,
    Loader2,
    Zap,
    Search,
    BarChart3,
    Mail,
    Users,
    Shield,
    Calendar,
    FileText,
    Layout,
    MessageCircle,
    RotateCcw,
    ChevronDown,
    Clock,
    Trash2,
    Plus,
    History,
    ArrowRight,
    Crown,
    Lock,
} from "lucide-react"

import Image from "next/image"

// ─── Markdown renderer (shared) ───
function renderMarkdown(text: string) {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">$1</code>')
        .replace(/^### (.*$)/gm, '<h4 class="font-semibold text-sm mt-4 mb-2">$1</h4>')
        .replace(/^## (.*$)/gm, '<h3 class="font-semibold text-base mt-4 mb-2">$1</h3>')
        .replace(/^[•\-\*] (.*$)/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>')
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*(?:<br\/>)?)+)/g, '<ul class="space-y-1 my-2">$1</ul>')
    return html
}

// ─── Quick Action Cards ───
const agentActions = [
    {
        title: "Find Top Leads",
        description: "Search and filter your best prospects",
        icon: Search,
        prompt: "Show me my top 10 leads by quality score",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Campaign Analytics",
        description: "Analyze performance and get insights",
        icon: BarChart3,
        prompt: "Analyze my most recent campaign performance and give me insights",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Generate Email",
        description: "AI-crafted personalized cold emails",
        icon: Mail,
        prompt: "Generate a professional cold email to pitch a B2B SaaS product to a VP of Marketing",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "CRM Insights",
        description: "Pipeline analysis and engagement data",
        icon: Users,
        prompt: "Give me a full CRM pipeline summary with engagement trends",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Deliverability Health",
        description: "Check sending account status",
        icon: Shield,
        prompt: "Check the deliverability health of all my sending accounts",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Account Overview",
        description: "Full dashboard summary at a glance",
        icon: Layout,
        prompt: "Give me a comprehensive overview of my account — campaigns, leads, credits, and key metrics",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Template Performance",
        description: "Optimize your email templates",
        icon: FileText,
        prompt: "Analyze my email templates and show which ones perform best",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
    {
        title: "Schedule Campaign",
        description: "Configure sending schedules via AI",
        icon: Calendar,
        prompt: "Show me the current schedule for my campaigns",
        color: "from-primary/10 to-primary/5",
        iconColor: "text-primary",
        borderColor: "border-primary/20 hover:border-primary/40",
    },
]

// ─── Message Component ───
function AgentMessage({ role, content }: { role: string; content: string }) {
    const isUser = role === "user"
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn("flex gap-3 max-w-3xl", isUser ? "flex-row-reverse ml-auto" : "")}
        >
            <div
                className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                )}
            >
                {isUser ? <User className="h-4 w-4" /> : <div className="relative w-full h-full"><Image src="/mailfra-avatar.png" alt="A" fill className="object-cover rounded-xl" /></div>}
            </div>
            <div
                className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%]",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 border border-border/50 rounded-bl-md"
                )}
            >
                <div
                    className="mailfra-message-content [&_table]:w-full [&_table]:text-xs [&_table]:my-3 [&_table]:border-collapse [&_th]:text-left [&_th]:p-2 [&_th]:border-b [&_th]:border-border [&_th]:font-semibold [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
            </div>
        </motion.div>
    )
}

// ─── Typing Indicator ───
function AgentTyping() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 max-w-3xl"
        >
            <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center border border-border px-1 py-1">
                <div className="relative w-full h-full"><Image src="/mailfra-avatar.png" alt="A" fill className="object-cover rounded-lg" /></div>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground mr-1">Thinking</span>
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }} />
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Dashboard Page ───
export default function MailfraDashboardPage() {
    const [isPaidUser, setIsPaidUser] = useState<boolean | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showScrollDown, setShowScrollDown] = useState(false)

    // Check subscription status
    useEffect(() => {
        fetch("/api/mailfra/conversations")
            .then((r) => {
                if (r.status === 403) setIsPaidUser(false)
                else setIsPaidUser(true)
            })
            .catch(() => setIsPaidUser(false))
    }, [])

    const [input, setInput] = useState("")

    const {
        messages,
        status,
        sendMessage,
        stop,
        error,
        regenerate,
        setMessages,
    } = useChat({
        api: "/api/mailfra/agent",
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: `Welcome to **Mailfra AI Command Center** 🚀\n\nI'm your AI-powered assistant with full access to your data. I can:\n\n- 🎯 **Search & filter** your leads and prospects\n- 📊 **Analyze** campaign performance with insights\n- ✍️ **Generate** personalized cold emails\n- 🏥 **Monitor** deliverability and account health\n- 📋 **Summarize** your pipeline and CRM data\n- ⚡ **Execute** bulk actions on your prospects\n\nWhat would you like me to do?`,
            },
        ],
    } as any)

    const isLoading = status === "streaming" || status === "submitted"

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault()
            if (!input.trim() || isLoading) return
            sendMessage({ role: "user", content: input } as any)
            setInput("")
        },
        [input, isLoading, sendMessage]
    )

    const handleQuickAction = (prompt: string) => {
        setInput(prompt)
        setTimeout(() => {
            const form = document.getElementById("mailfra-agent-form") as HTMLFormElement
            if (form) form.requestSubmit()
        }, 50)
    }

    const clearConversation = () => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: `Welcome to **Mailfra AI Command Center** 🚀\n\nI'm ready to help. What would you like me to do?`,
            } as any,
        ])
    }

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isLoading])

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
    }, [])

    const handleScroll = () => {
        if (!scrollContainerRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const showQuickActions = messages.length <= 1

    // ─── Upgrade Gate for Free Users ───
    if (isPaidUser === false) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg text-center space-y-6"
                >
                    <div className="relative mx-auto w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Crown className="h-4 w-4 text-primary-foreground" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Mailfra AI Agent
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-md mx-auto">
                            Unlock the full power of AI-driven cold email. Search leads, analyze campaigns, generate personalized emails, and more — all through conversation.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
                        {[
                            { icon: Search, label: "Smart Lead Search" },
                            { icon: BarChart3, label: "Campaign Analytics" },
                            { icon: Mail, label: "AI Email Drafts" },
                            { icon: Shield, label: "Deliverability Check" },
                            { icon: Users, label: "CRM Insights" },
                            { icon: Zap, label: "Bulk Actions" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <item.icon className="h-3.5 w-3.5 text-primary" />
                                {item.label}
                            </div>
                        ))}
                    </div>
                    <a
                        href="/dashboard/billing"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-200"
                    >
                        <Zap className="h-4 w-4" />
                        Upgrade to Starter — $29/mo
                        <ArrowRight className="h-4 w-4" />
                    </a>
                    <p className="text-[10px] text-muted-foreground/50">
                        Free support chat is always available via the chat bubble →
                    </p>
                </motion.div>
            </div>
        )
    }

    if (isPaidUser === null) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
            {/* ─── Header ─── */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center p-1">
                            <div className="relative w-full h-full"><Image src="/mailfra-avatar.png" alt="Mailfra" fill className="object-cover rounded-lg" /></div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Mailfra AI Agent</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Zap className="h-3 w-3 text-primary" />
                            Powered by GPT-4o • Full platform access
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={clearConversation}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 transition-colors"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New Chat
                    </button>
                </div>
            </div>

            {/* ─── Messages Area ─── */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin relative"
            >
                {messages.map((msg: any) => (
                    <AgentMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}

                <AnimatePresence>
                    {isLoading && <AgentTyping />}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-3xl text-xs text-destructive bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20 flex items-center justify-between"
                    >
                        <span>{error?.message || "Something went wrong. Please try again."}</span>
                        <button onClick={() => regenerate()} className="text-destructive underline font-medium">
                            Retry
                        </button>
                    </motion.div>
                )}

                {/* ─── Quick Action Cards ─── */}
                {showQuickActions && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="max-w-3xl pt-4"
                    >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Zap className="h-3 w-3" />
                            Quick Actions
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {agentActions.map((action) => (
                                <button
                                    key={action.title}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    className={cn(
                                        "group flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-md cursor-pointer",
                                        action.borderColor,
                                        `bg-card hover:bg-muted/50`
                                    )}
                                >
                                    <div className={cn("p-2 rounded-lg bg-background/80 shadow-sm", action.iconColor)}>
                                        <action.icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground group-hover:text-foreground/90">{action.title}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{action.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom */}
            <AnimatePresence>
                {showScrollDown && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                        className="absolute bottom-28 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── Input Area ─── */}
            <div className="pt-4 pb-2 border-t border-border/50">
                <form
                    id="mailfra-agent-form"
                    onSubmit={handleSubmit}
                    className="flex items-end gap-3 max-w-3xl mx-auto"
                >
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder='Ask Mailfra anything... Try "Find my top leads" or "Analyze my campaigns"'
                            rows={1}
                            className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all max-h-[120px] scrollbar-thin shadow-sm"
                            style={{ height: "auto", minHeight: "48px", maxHeight: "120px" }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = "auto"
                                target.style.height = Math.min(target.scrollHeight, 120) + "px"
                            }}
                            disabled={isLoading}
                        />
                    </div>

                    {isLoading ? (
                        <button
                            type="button"
                            onClick={stop}
                            className="flex-shrink-0 w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors shadow-sm"
                        >
                            <div className="w-3.5 h-3.5 rounded-sm bg-destructive" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className={cn(
                                "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm",
                                input.trim()
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105"
                                    : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            <ArrowUp className="h-5 w-5" />
                        </button>
                    )}
                </form>
                <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
                    Mailfra AI Agent uses GPT-4o and consumes 1 AI credit per interaction
                </p>
            </div>
        </div>
    )
}
