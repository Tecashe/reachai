"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface ResearchStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function ResearchStep({ campaign, onNext, onBack }: ResearchStepProps) {
  const [isResearching, setIsResearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [researchedCount, setResearchedCount] = useState(0)
  const [totalProspects, setTotalProspects] = useState(campaign._count.prospects)

  const startResearch = async () => {
    setIsResearching(true)
    setProgress(0)
    setResearchedCount(0)

    try {
      const response = await fetch("/api/research/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          depth: campaign.researchDepth || "STANDARD",
        }),
      })

      if (!response.ok) {
        throw new Error("Research failed")
      }

      const data = await response.json()

      // Poll for progress
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
        const status = await statusResponse.json()

        setResearchedCount(status.completed)
        setProgress((status.completed / status.total) * 100)

        if (status.completed === status.total) {
          clearInterval(pollInterval)
          setIsResearching(false)
          toast.success(`Research complete! ${status.completed} prospects enriched.`)
        }
      }, 2000)
    } catch (error) {
      console.error("[v0] Research error:", error)
      toast.error("Failed to start research. Please try again.")
      setIsResearching(false)
    }
  }

  const canProceed = researchedCount === totalProspects && totalProspects > 0

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">AI-Powered Prospect Research</h3>
          <p className="text-muted-foreground mt-2">
            Our AI will research each prospect to gather insights, pain points, and personalization data
          </p>
        </div>

        {isResearching ? (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">
                Researching {researchedCount} of {totalProspects} prospects...
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : researchedCount === totalProspects && totalProspects > 0 ? (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Research Complete!</span>
          </div>
        ) : (
          <Button onClick={startResearch} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Start AI Research
          </Button>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{totalProspects}</div>
            <div className="text-xs text-muted-foreground">Total Prospects</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{researchedCount}</div>
            <div className="text-xs text-muted-foreground">Researched</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground">Progress</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isResearching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed || isResearching}>
          Continue to Email Generation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
