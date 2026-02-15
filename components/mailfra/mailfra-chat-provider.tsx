"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useChat, type Message } from "ai/react"
import { useAuth } from "@clerk/nextjs"

interface MailfraChatContextType {
    // Chat state
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    mode: "support" | "agent"
    setMode: (mode: "support" | "agent") => void

    // Chat hook data
    messages: Message[]
    input: string
    setInput: (input: string) => void
    handleSubmit: (e?: React.FormEvent) => void
    isLoading: boolean
    error: Error | undefined
    reload: () => void
    stop: () => void

    // Conversation management
    conversationId: string | null
    clearConversation: () => void
    isPaidUser: boolean
}

const MailfraChatContext = createContext<MailfraChatContextType | null>(null)

export function useMailfraChat() {
    const ctx = useContext(MailfraChatContext)
    if (!ctx) throw new Error("useMailfraChat must be used within MailfraChatProvider")
    return ctx
}

export function MailfraChatProvider({ children, isPaidUser = false }: { children: React.ReactNode; isPaidUser?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"support" | "agent">(isPaidUser ? "agent" : "support")
    const [conversationId, setConversationId] = useState<string | null>(null)
    const { isSignedIn } = useAuth()

    const apiEndpoint = mode === "agent" ? "/api/mailfra/agent" : "/api/mailfra/chat"

    const {
        messages,
        input,
        setInput,
        handleSubmit: rawHandleSubmit,
        isLoading,
        error,
        reload,
        stop,
        setMessages,
    } = useChat({
        api: apiEndpoint,
        body: { conversationId },
        onResponse: (response) => {
            const newConvId = response.headers.get("X-Conversation-Id")
            if (newConvId && !conversationId) {
                setConversationId(newConvId)
            }
        },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: mode === "agent"
                    ? "Hey! 👋 I'm **Mailfra AI Agent**. I can search your leads, analyze campaigns, generate emails, check deliverability, and much more. What would you like me to do?"
                    : "Hey! 👋 I'm **Mailfra**, your email outreach assistant. Ask me anything about cold email, deliverability, or how to use Mailfra!",
            },
        ],
    })

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault()
            if (!input.trim()) return
            rawHandleSubmit(e)
        },
        [input, rawHandleSubmit]
    )

    const clearConversation = useCallback(() => {
        setMessages([
            {
                id: "welcome",
                role: "assistant",
                content: mode === "agent"
                    ? "Hey! 👋 I'm **Mailfra AI Agent**. I can search your leads, analyze campaigns, generate emails, check deliverability, and much more. What would you like me to do?"
                    : "Hey! 👋 I'm **Mailfra**, your email outreach assistant. Ask me anything about cold email, deliverability, or how to use Mailfra!",
            },
        ])
        setConversationId(null)
    }, [mode, setMessages])

    // Reset conversation when mode changes
    useEffect(() => {
        clearConversation()
    }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <MailfraChatContext.Provider
            value={{
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
                reload,
                stop,
                conversationId,
                clearConversation,
                isPaidUser,
            }}
        >
            {children}
        </MailfraChatContext.Provider>
    )
}
