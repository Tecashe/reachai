"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Zap, Mail, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Sequence {
  id: string
  name: string
  description: string | null
  status: string
  totalSteps: number
  totalEnrolled: number
  avgOpenRate: number | null
  avgReplyRate: number | null
}

interface SequenceSelectorProps {
  selectedSequenceId: string | null
  onSelect: (sequenceId: string) => void
}

export function SequenceSelector({ selectedSequenceId, onSelect }: SequenceSelectorProps) {
  const [sequences, setSequences] = useState<Sequence[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSequences() {
      try {
        const response = await fetch("/api/sequences?status=ACTIVE")
        if (!response.ok) throw new Error("Failed to fetch sequences")
        const data = await response.json()
        setSequences(data.sequences || [])
      } catch (error) {
        console.error("[v0] Failed to fetch sequences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSequences()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Select Sequence</Label>
        <div className="rounded-lg border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">Loading sequences...</p>
        </div>
      </div>
    )
  }

  if (sequences.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Select Sequence</Label>
        <div className="rounded-lg border p-8 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No Active Sequences</h3>
          <p className="text-sm text-muted-foreground mb-4">Create and activate a sequence first to enroll prospects</p>
          <Button variant="outline" size="sm" onClick={() => window.open("/dashboard/sequences/new", "_blank")}>
            Create Sequence
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label>Select Sequence</Label>
      <ScrollArea className="h-[300px] rounded-lg border">
        <div className="p-4 space-y-2">
          {sequences.map((sequence) => (
            <button
              key={sequence.id}
              onClick={() => onSelect(sequence.id)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                "hover:border-primary/50 hover:bg-accent/50",
                selectedSequenceId === sequence.id ? "border-primary bg-primary/5" : "border-border bg-background",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {selectedSequenceId === sequence.id ? (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <h4 className="font-semibold truncate">{sequence.name}</h4>
                  </div>
                  {sequence.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 ml-7">{sequence.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 ml-7">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{sequence.totalSteps} steps</span>
                    </div>
                    {sequence.avgOpenRate !== null && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>{Math.round(sequence.avgOpenRate)}% open rate</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="flex-shrink-0">
                  {sequence.totalEnrolled} enrolled
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
