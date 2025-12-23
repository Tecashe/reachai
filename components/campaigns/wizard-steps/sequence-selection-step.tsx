"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Zap, Plus } from "lucide-react"
import { SequenceSelector } from "./sequence-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface SequenceSelectionStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  hasGeneratedEmails: boolean
}

export function SequenceSelectionStep({ campaign, onNext, onBack, hasGeneratedEmails }: SequenceSelectionStepProps) {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null)
  const [createNewSequence, setCreateNewSequence] = useState(false)

  const handleNext = () => {
    if (createNewSequence) {
      // Save decision to create sequence from generated emails
      localStorage.setItem(`campaign_${campaign.id}_create_sequence`, "true")
    } else {
      localStorage.setItem(`campaign_${campaign.id}_selected_sequence`, selectedSequenceId || "")
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Choose Your Sequence Strategy</h3>
        <p className="text-muted-foreground">
          Select an existing sequence or create a new one from your generated emails
        </p>
      </div>

      {hasGeneratedEmails && (
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            You've generated {campaign._count.prospects} personalized emails. You can create a new sequence from these
            or use an existing sequence instead.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`p-6 cursor-pointer border-2 transition-all ${
            !createNewSequence ? "border-primary bg-primary/5" : "border-border"
          }`}
          onClick={() => setCreateNewSequence(false)}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Use Existing Sequence</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose from your library of proven sequences. Generated emails will be discarded.
            </p>
            {!createNewSequence && (
              <div className="pt-4">
                <SequenceSelector selectedSequenceId={selectedSequenceId} onSelect={setSelectedSequenceId} />
              </div>
            )}
          </div>
        </Card>

        {hasGeneratedEmails && (
          <Card
            className={`p-6 cursor-pointer border-2 transition-all ${
              createNewSequence ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => setCreateNewSequence(true)}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Create New Sequence</h4>
                <Badge variant="secondary">From Generated Emails</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically create a sequence using the {campaign._count.prospects} emails you just generated.
              </p>
              {createNewSequence && (
                <div className="pt-4 space-y-2">
                  <Alert>
                    <AlertDescription>
                      A new sequence will be created with your generated emails as the first step. You can add
                      follow-ups later.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!createNewSequence && !selectedSequenceId}>
          Continue to Launch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
