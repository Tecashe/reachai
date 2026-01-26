"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"
import { EmbeddedSequenceBuilder } from "./components/embedded-sequence-builder"
import { ProspectEmailPreview } from "./components/prospect-email-preview"
import { createSequenceForCampaign, updateSequenceFromCampaign } from "@/lib/actions/campaign-sequence-actions"
import type { SequenceStep } from "@/lib/types/sequence"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Hammer, Eye } from "lucide-react"

interface EmailGenerationStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isPaidUser: boolean
}

interface Prospect {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  jobTitle?: string | null
  researchData?: any
}

export function EmailGenerationStep({
  campaign,
  onNext,
  onBack,
  isPaidUser,
}: EmailGenerationStepProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [sampleResearchData, setSampleResearchData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"builder" | "preview">("builder")
  const [currentSteps, setCurrentSteps] = useState<SequenceStep[]>([])
  const [existingSequenceId, setExistingSequenceId] = useState<string | null>(null)

  // Fetch prospects with research data
  useEffect(() => {
    const loadContext = async () => {
      try {
        // Fetch first 5 prospects for preview
        const response = await fetch(`/api/campaigns/${campaign.id}/prospects?limit=5`)
        if (response.ok) {
          const data = await response.json()
          if (data.prospects && data.prospects.length > 0) {
            setProspects(data.prospects)
            setSampleResearchData(data.prospects[0].researchData)
          }
        }

        // Check if campaign already has a sequence
        if (campaign.sequenceId) {
          setExistingSequenceId(campaign.sequenceId)
          // Fetch existing sequence steps
          const seqResponse = await fetch(`/api/sequences/${campaign.sequenceId}`)
          if (seqResponse.ok) {
            const seqData = await seqResponse.json()
            if (seqData.sequence?.steps) {
              setCurrentSteps(seqData.sequence.steps)
            }
          }
        }
      } catch (error) {
        console.error("Failed to load campaign context:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadContext()
  }, [campaign.id, campaign.sequenceId])

  const handleSaveSequence = async (steps: SequenceStep[], sequenceName: string) => {
    try {
      // Convert steps to the format expected by the server action
      const stepsInput = steps.map((step) => ({
        order: step.order,
        stepType: step.stepType,
        delayValue: step.delayValue,
        delayUnit: step.delayUnit,
        subject: step.subject,
        body: step.body,
        linkedInMessage: step.linkedInMessage,
        callScript: step.callScript,
        taskTitle: step.taskTitle,
        taskDescription: step.taskDescription,
        internalNotes: step.internalNotes,
      }))

      let result
      if (existingSequenceId) {
        // Update existing sequence
        result = await updateSequenceFromCampaign(
          campaign.userId,
          existingSequenceId,
          sequenceName,
          stepsInput
        )
      } else {
        // Create new sequence
        result = await createSequenceForCampaign(
          campaign.userId,
          campaign.id,
          sequenceName,
          stepsInput
        )
        if (result.sequenceId) {
          setExistingSequenceId(result.sequenceId)
        }
      }

      if (result.success) {
        setCurrentSteps(steps)
        toast.success("Sequence saved successfully!")
        onNext()
      } else {
        throw new Error(result.error || "Failed to save sequence")
      }
    } catch (error) {
      toast.error("Failed to save sequence. Please try again.")
      console.error(error)
      throw error // Re-throw so the builder knows save failed
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WaveLoader size="sm" bars={5} />
        <p className="text-sm text-muted-foreground">Loading sequence builder...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tab selector for Builder / Preview */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "builder" | "preview")}>
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="builder" className="gap-2">
            <Hammer className="h-4 w-4" />
            Build Sequence
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2" disabled={currentSteps.length === 0}>
            <Eye className="h-4 w-4" />
            Preview Emails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-4">
          <EmbeddedSequenceBuilder
            campaignId={campaign.id}
            campaignName={campaign.name}
            userId={campaign.userId}
            researchData={sampleResearchData}
            prospectsCount={campaign._count?.prospects || 0}
            isPaidUser={isPaidUser}
            initialSteps={currentSteps.length > 0 ? currentSteps : undefined}
            onSave={handleSaveSequence}
            onBack={onBack}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          {currentSteps.length > 0 && prospects.length > 0 ? (
            <ProspectEmailPreview
              prospects={prospects}
              steps={currentSteps}
              className="h-[600px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Eye className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Build your sequence first to preview emails
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
