"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SmartRepliesProps {
  replyId: string
  emailBody: string
  onSelectReply: (reply: string) => void
}

export function SmartReplies({ replyId, emailBody, onSelectReply }: SmartRepliesProps) {
  const [replies, setReplies] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

  const generateReplies = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/inbox/smart-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      setReplies(data.replies || [])
    } catch {
      toast.error("Failed to generate smart replies")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (replyId && replies.length === 0) {
      generateReplies()
    }
  }, [replyId])

  const handleCopy = (reply: string, index: number) => {
    navigator.clipboard.writeText(reply)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
    toast.success("Copied to clipboard")
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Generating smart replies...</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (replies.length === 0) {
    return (
      <Button variant="outline" size="sm" onClick={generateReplies} className="gap-2 rounded-xl bg-transparent">
        <Sparkles className="h-4 w-4" />
        Generate Smart Replies
      </Button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Smart Replies</span>
        </div>
        <Button variant="ghost" size="sm" onClick={generateReplies} className="h-8 px-2 rounded-lg">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-2">
        {replies.map((reply, index) => (
          <div
            key={index}
            className={cn(
              "group relative p-3 rounded-xl border border-border/50",
              "bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer",
            )}
            onClick={() => onSelectReply(reply)}
          >
            <p className="text-sm pr-8 line-clamp-2">{reply}</p>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                handleCopy(reply, index)
              }}
            >
              {copiedIndex === index ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
