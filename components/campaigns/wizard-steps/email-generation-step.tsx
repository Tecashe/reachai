"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  ListChecks,
  Sparkles,
  Check,
  Mail,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"
import { createSequenceForCampaign, linkSequenceToCampaign } from "@/lib/actions/campaign-sequence-actions"
import { cn } from "@/lib/utils"

interface EmailGenerationStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isPaidUser: boolean
}

interface ExistingSequence {
  id: string
  name: string
  totalSteps: number
  status: string
  createdAt: string
}

export function EmailGenerationStep({
  campaign,
  onNext,
  onBack,
}: EmailGenerationStepProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mode, setMode] = useState<"create" | "existing">("create")
  const [sequenceName, setSequenceName] = useState(`${campaign.name} Sequence`)
  const [existingSequences, setExistingSequences] = useState<ExistingSequence[]>([])
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(
    campaign.sequenceId || null
  )

  // Load existing sequences
  useEffect(() => {
    const loadSequences = async () => {
      try {
        const response = await fetch("/api/sequences")
        if (response.ok) {
          const data = await response.json()
          setExistingSequences(data.sequences || [])
        }

        // If campaign already has a sequence, select it
        if (campaign.sequenceId) {
          setMode("existing")
          setSelectedSequenceId(campaign.sequenceId)
        }
      } catch (error) {
        console.error("Failed to load sequences:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSequences()
  }, [campaign.sequenceId])

  const handleContinue = async () => {
    setIsSaving(true)

    try {
      if (mode === "create") {
        // Create a new sequence with just the name
        const result = await createSequenceForCampaign(
          campaign.userId,
          campaign.id,
          sequenceName,
          [] // Empty steps - user will configure in sequence page
        )

        if (!result.success) {
          throw new Error(result.error || "Failed to create sequence")
        }

        toast.success("Sequence created! You'll configure it after launch.")
      } else {
        // Link existing sequence
        if (!selectedSequenceId) {
          toast.error("Please select a sequence")
          setIsSaving(false)
          return
        }

        const result = await linkSequenceToCampaign(
          campaign.userId,
          campaign.id,
          selectedSequenceId
        )

        if (!result.success) {
          throw new Error(result.error || "Failed to link sequence")
        }

        toast.success("Sequence linked successfully!")
      }

      onNext()
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WaveLoader size="sm" bars={5} />
        <p className="text-sm text-muted-foreground">Loading sequences...</p>
      </div>
    )
  }

  const prospectsCount = campaign._count?.prospects || 0

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>
            {prospectsCount} prospects with AI research data will use this sequence
          </span>
        </div>
      </div>

      {/* Mode Selection */}
      <RadioGroup
        value={mode}
        onValueChange={(v) => setMode(v as "create" | "existing")}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Create New Option */}
        <Label
          htmlFor="create"
          className={cn(
            "cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50",
            mode === "create" ? "border-primary bg-primary/5" : "border-muted"
          )}
        >
          <RadioGroupItem value="create" id="create" className="sr-only" />
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                Create New Sequence
                {mode === "create" && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Create a fresh sequence for this campaign
              </p>
            </div>
          </div>
        </Label>

        {/* Use Existing Option */}
        <Label
          htmlFor="existing"
          className={cn(
            "cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50",
            mode === "existing" ? "border-primary bg-primary/5" : "border-muted"
          )}
        >
          <RadioGroupItem value="existing" id="existing" className="sr-only" />
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <ListChecks className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                Use Existing Sequence
                {mode === "existing" && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a sequence you've already created
              </p>
            </div>
          </div>
        </Label>
      </RadioGroup>

      {/* Create New Form */}
      {mode === "create" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Sequence Name</CardTitle>
            <CardDescription>
              You'll configure the sequence steps after launching the campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
              placeholder="Enter sequence name..."
              className="text-base"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: After launch, you'll be directed to the sequence page to add email steps
              using your prospects' research data as personalization variables.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Existing Sequences List */}
      {mode === "existing" && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Select a Sequence</CardTitle>
            <CardDescription>
              Choose an existing sequence to use for this campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {existingSequences.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <ListChecks className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No sequences found</p>
                <p className="text-sm">Create one by selecting "Create New Sequence"</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[300px]">
                <div className="divide-y">
                  {existingSequences.map((seq) => (
                    <button
                      key={seq.id}
                      onClick={() => setSelectedSequenceId(seq.id)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-muted/50",
                        selectedSequenceId === seq.id && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full border-2",
                              selectedSequenceId === seq.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted"
                            )}
                          >
                            {selectedSequenceId === seq.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{seq.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{seq.totalSteps} steps</span>
                              <span>•</span>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px]",
                                  seq.status === "ACTIVE" && "bg-green-500/10 text-green-600"
                                )}
                              >
                                {seq.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isSaving}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            isSaving ||
            (mode === "create" && !sequenceName.trim()) ||
            (mode === "existing" && !selectedSequenceId)
          }
        >
          {isSaving ? "Saving..." : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
