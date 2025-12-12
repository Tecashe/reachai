"use client"

import { Mail, Sparkles, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SequenceEmptyStateProps {
  hasSequences: boolean
  onCreateSequence: () => void
  onGenerateWithAI?: () => void
}

export function SequenceEmptyState({ hasSequences, onCreateSequence }: SequenceEmptyStateProps) {
  if (hasSequences) {
    // No results for current filters
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No sequences found</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          No sequences match your current filters. Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  // No sequences at all
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-secondary">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground">Create your first sequence</h3>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        Sequences automate your outreach with multi-step, multi-channel campaigns. Create personalized email flows that
        convert.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button onClick={onCreateSequence} size="lg" className="gap-2">
          <Mail className="h-4 w-4" />
          Create Sequence
        </Button>
        <Button variant="outline" size="lg" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>
      <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Multi-channel outreach",
            description: "Combine email, LinkedIn, and calls in one flow",
          },
          {
            title: "Smart personalization",
            description: "AI-powered variables and dynamic content",
          },
          {
            title: "A/B testing built-in",
            description: "Test and optimize every step automatically",
          },
        ].map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border bg-card p-4 text-center">
            <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
