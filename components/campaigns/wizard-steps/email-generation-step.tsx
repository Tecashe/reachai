
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles, Eye, RefreshCw, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail } from "lucide-react"
import { WaveLoader } from "@/components/loader/wave-loader"


import { WizardSequenceBuilder } from "./components/wizard-sequence-builder"

interface EmailGenerationStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isPaidUser: boolean
}

export function EmailGenerationStep({
  campaign,
  onNext,
  onBack,
  isPaidUser
}: EmailGenerationStepProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [sampleResearchData, setSampleResearchData] = useState<any>(null)

  // Fetch a sample prospect with research data to provide context for AI generation
  useEffect(() => {
    const loadContext = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaign.id}/prospects?limit=1`)
        if (response.ok) {
          const data = await response.json()
          if (data.prospects && data.prospects.length > 0) {
            setSampleResearchData(data.prospects[0].researchData)
          }
        }
      } catch (error) {
        console.error("Failed to load campaign context")
      } finally {
        setIsLoading(false)
      }
    }
    loadContext()
  }, [campaign.id])

  const handleSaveSequence = async (steps: any[]) => {
    try {
      const response = await fetch(`/api/campaigns/${campaign.id}/save-sequence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps }),
      })

      if (!response.ok) throw new Error("Failed to save sequence")

      toast.success("Sequence saved successfully")
      onNext()
    } catch (error) {
      toast.error("Failed to save sequence")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <WaveLoader size="sm" bars={5} />
      </div>
    )
  }

  return (
    <WizardSequenceBuilder
      prospectsCount={campaign._count?.prospects || 0}
      researchData={sampleResearchData}
      isPaidUser={isPaidUser}
      onNext={handleSaveSequence}
      onBack={onBack}
    // Pass existing sequence steps if we had them saved, but for now we start fresh
    // or we could fetch existing steps if the user goes back to this step
    />
  )
}


