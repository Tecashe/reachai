"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface EmailSummaryProps {
  replyId: string
  emailBody: string
}

interface SummaryData {
  tldr: string
  keyPoints: string[]
  sentiment: string
  suggestedAction: string
}

export function EmailSummary({ replyId, emailBody }: EmailSummaryProps) {
  const [summary, setSummary] = React.useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const generateSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/inbox/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyId }),
      })

      if (!response.ok) throw new Error()

      const data = await response.json()
      setSummary(data.summary)
      setIsOpen(true)
    } catch {
      toast.error("Failed to summarize email")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="h-4 w-4 animate-pulse" />
          <span>Summarizing email...</span>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (!summary) {
    return (
      <Button variant="outline" size="sm" onClick={generateSummary} className="gap-2 rounded-xl bg-transparent">
        <FileText className="h-4 w-4" />
        TL;DR
      </Button>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300">AI Summary</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  generateSummary()
                }}
                className="h-7 px-2 rounded-lg"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* TL;DR */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">TL;DR</p>
              <p className="text-sm">{summary.tldr}</p>
            </div>

            {/* Key Points */}
            {summary.keyPoints && summary.keyPoints.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Key Points</p>
                <ul className="space-y-1">
                  {summary.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Action */}
            {summary.suggestedAction && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Suggested Action</p>
                <p className="text-sm">{summary.suggestedAction}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
