"use client"

import React, { useRef, useEffect, useState } from "react"
import { useMailfraChat } from "./mailfra-chat-provider"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    ArrowUp,
    Loader2,
    Trash2,
    Zap,
    HelpCircle,
    ChevronDown,
    RotateCcw,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

// ─── Markdown-lite renderer ───
function renderMarkdown(text: string) {
    // Simple markdown rendering for chat messages
    let html = text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-xs font-mono">$1</code>')
        // Headers (## and ###)
        .replace(/^### (.*$)/gm, '<h4 class="font-semibold text-sm mt-3 mb-1">$1</h4>')
        .replace(/^## (.*$)/gm, '<h3 class="font-semibold text-base mt-3 mb-1">$1</h3>')
        // Bullet points
        .replace(/^[•\-\*] (.*$)/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
        // Line breaks
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>')

    // Wrap consecutive <li> elements
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*(?:<br\/>)?)+)/g, '<ul class="space-y-0.5 my-1">$1</ul>')

    return html
}

// ─── Quick Action Pills ───
const supportQuickActions = [
    { label: "How does email warmup work?", icon: "🔥" },
    { label: "Tips for better open rates", icon: "📈" },
    { label: "What is deliverability?", icon: "📬" },
    { label: "How to write cold emails", icon: "✍️" },
]

const agentQuickActions = [
    { label: "Show my top leads by score", icon: "🎯" },
    { label: "Analyze my best campaign", icon: "📊" },
    { label: "Check my deliverability health", icon: "🏥" },
    { label: "Give me an account overview", icon: "📋" },
    { label: "Draft an email for a prospect", icon: "📧" },
    { label: "Show recent replies", icon: "💬" },
]

// ─── Message Bubble ───
function MessageBubble({ role, content, isLatest }: { role: string; content: string; isLatest?: boolean }) {
    const isUser = role === "user"

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("flex gap-2.5 w-full", isUser ? "flex-row-reverse" : "flex-row")}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                )}
            >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            {/* Message */}
            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/80 text-foreground rounded-bl-md border border-border/30"
                )}
            >
                <div
                    className="mailfra-message-content [&_table]:w-full [&_table]:text-xs [&_table]:my-2 [&_table]:border-collapse [&_th]:text-left [&_th]:p-1.5 [&_th]:border-b [&_th]:border-border [&_td]:p-1.5 [&_td]:border-b [&_td]:border-border/50"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
            </div>
        </motion.div>
    )
}

// ─── Typing Indicator ───
function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex gap-2.5"
        >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-muted/80 rounded-2xl rounded-bl-md px-4 py-3 border border-border/30">
                <div className="flex items-center gap-1">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    />
                </div>
            </div>
        </motion.div>
    )
}

// ─── Main Widget ───
export function MailfraChatWidget() {
    const {
        isOpen,
        setIsOpen,
        mode,
        setMode,
        messages,
        input,
        setInput,
        handleSubmit,
        isLoading,
        error,
        clearConversation,
        isPaidUser,
        stop,
    } = useMailfraChat()

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [showScrollDown, setShowScrollDown] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setMounted(true) }, [])

    // Auto-scroll on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    // Scroll detection for "scroll to bottom" button
    const handleScroll = () => {
        if (!scrollContainerRef.current) return
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleQuickAction = (label: string) => {
        setInput(label)
        // Use setTimeout to submit after state update
        setTimeout(() => {
            const form = document.getElementById("mailfra-chat-form") as HTMLFormElement
            if (form) form.requestSubmit()
        }, 50)
    }

    const quickActions = mode === "agent" ? agentQuickActions : supportQuickActions
    const showQuickActions = messages.length <= 1

    return (
        <>
            {/* ─── Floating Trigger Button ─── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/30 flex items-center justify-center group cursor-pointer hover:shadow-violet-500/50 transition-shadow duration-300"
                        aria-label="Open Mailfra Chat"
                    >
                        <MessageCircle className="h-6 w-6 group-hover:hidden" />
                        <Sparkles className="h-6 w-6 hidden group-hover:block" />

                        {/* Pulse ring animation */}
                        <span className="absolute inset-0 rounded-full animate-ping bg-violet-400/30" />
                        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-400/20 blur-sm" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── Chat Panel ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/20 border border-border/50"
                        style={{
                            background: "var(--background)",
                            backdropFilter: "blur(20px)",
                        }}
                    >
                        {/* ─── Header ─── */}
                        <div className="relative px-4 py-3 border-b border-border/50 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10">
                            {/* Decorative gradient bar */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        {/* Active indicator */}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">Mailfra AI</h3>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {mode === "agent" ? (
                                                <span className="flex items-center gap-1">
                                                    <Zap className="h-2.5 w-2.5 text-amber-400" />
                                                    Agent Mode • Can take actions
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <HelpCircle className="h-2.5 w-2.5 text-blue-400" />
                                                    Support Mode • Always free
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {/* Mode Toggle (only for paid users) */}
                                    {isPaidUser && (
                                        <button
                                            onClick={() => setMode(mode === "agent" ? "support" : "agent")}
                                            className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-200 border",
                                                mode === "agent"
                                                    ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30 hover:border-amber-500/50"
                                                    : "bg-muted/50 text-muted-foreground border-border/50 hover:border-border"
                                            )}
                                        >
                                            {mode === "agent" ? "⚡ Agent" : "💬 Support"}
                                        </button>
                                    )}

                                    {/* Clear conversation */}
                                    <button
                                        onClick={clearConversation}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                        title="New conversation"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </button>

                                    {/* Close */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Messages ─── */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin"
                        >
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    role={msg.role}
                                    content={msg.content}
                                    isLatest={msg.id === messages[messages.length - 1]?.id}
                                />
                            ))}

                            {/* Typing indicator */}
                            <AnimatePresence>
                                {isLoading && <TypingIndicator />}
                            </AnimatePresence>

                            {/* Error display */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20"
                                >
                                    Something went wrong. Please try again.
                                </motion.div>
                            )}

                            {/* Quick Actions */}
                            {showQuickActions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-2"
                                >
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                        Try asking
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {quickActions.map((action) => (
                                            <button
                                                key={action.label}
                                                onClick={() => handleQuickAction(action.label)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50 hover:border-border transition-all duration-150 cursor-pointer"
                                            >
                                                <span>{action.icon}</span>
                                                <span>{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Upgrade CTA for free users */}
                            {!isPaidUser && messages.length > 3 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 rounded-xl p-3 border border-violet-500/20"
                                >
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="h-4 w-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-semibold text-foreground">Unlock Mailfra AI Agent</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                Upgrade to search leads, analyze campaigns, generate emails, and more — all through conversation.
                                            </p>
                                            <a
                                                href="/dashboard/billing"
                                                className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 transition-colors"
                                            >
                                                <Zap className="h-3 w-3" />
                                                Upgrade Now
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollDown && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-24 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ChevronDown className="h-4 w-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* ─── Input Area ─── */}
                        <div className="px-3 py-3 border-t border-border/50 bg-card/50">
                            <form
                                id="mailfra-chat-form"
                                onSubmit={handleSubmit}
                                className="flex items-end gap-2"
                            >
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={mode === "agent" ? "Ask Mailfra to do something..." : "Ask Mailfra anything..."}
                                        rows={1}
                                        className="w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all max-h-[100px] scrollbar-thin"
                                        style={{
                                            height: "auto",
                                            minHeight: "40px",
                                            maxHeight: "100px",
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement
                                            target.style.height = "auto"
                                            target.style.height = Math.min(target.scrollHeight, 100) + "px"
                                        }}
                                        disabled={isLoading}
                                    />
                                </div>

                                {isLoading ? (
                                    <button
                                        type="button"
                                        onClick={stop}
                                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                                    >
                                        <div className="w-3 h-3 rounded-sm bg-destructive" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className={cn(
                                            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                            input.trim()
                                                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105"
                                                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                                        )}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </button>
                                )}
                            </form>

                            <p className="text-[9px] text-muted-foreground/50 text-center mt-1.5">
                                Mailfra AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
