// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
// import { ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
// import { toast } from "sonner"

// interface ResearchStepProps {
//   campaign: any
//   onNext: () => void
//   onBack: () => void
//   isFirstStep: boolean
//   isLastStep: boolean
// }

// export function ResearchStep({ campaign, onNext, onBack }: ResearchStepProps) {
//   const [isResearching, setIsResearching] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [researchedCount, setResearchedCount] = useState(0)
//   const [totalProspects, setTotalProspects] = useState(campaign._count.prospects)

//   const startResearch = async () => {
//     setIsResearching(true)
//     setProgress(0)
//     setResearchedCount(0)

//     try {
//       const response = await fetch("/api/research/batch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           campaignId: campaign.id,
//           depth: campaign.researchDepth || "STANDARD",
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Research failed")
//       }

//       const data = await response.json()

//       // Poll for progress
//       const pollInterval = setInterval(async () => {
//         const statusResponse = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
//         const status = await statusResponse.json()

//         setResearchedCount(status.completed)
//         setProgress((status.completed / status.total) * 100)

//         if (status.completed === status.total) {
//           clearInterval(pollInterval)
//           setIsResearching(false)
//           toast.success(`Research complete! ${status.completed} prospects enriched.`)
//         }
//       }, 2000)
//     } catch (error) {
//       console.error("[v0] Research error:", error)
//       toast.error("Failed to start research. Please try again.")
//       setIsResearching(false)
//     }
//   }

//   const canProceed = researchedCount === totalProspects && totalProspects > 0

//   return (
//     <div className="space-y-6">
//       <div className="text-center space-y-4 py-8">
//         <div className="flex items-center justify-center">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
//             <Sparkles className="h-8 w-8 text-primary" />
//           </div>
//         </div>
//         <div>
//           <h3 className="text-xl font-semibold">AI-Powered Prospect Research</h3>
//           <p className="text-muted-foreground mt-2">
//             Our AI will research each prospect to gather insights, pain points, and personalization data
//           </p>
//         </div>

//         {isResearching ? (
//           <div className="space-y-4 max-w-md mx-auto">
//             <div className="flex items-center justify-center gap-2">
//               <Loader2 className="h-5 w-5 animate-spin text-primary" />
//               <span className="text-sm font-medium">
//                 Researching {researchedCount} of {totalProspects} prospects...
//               </span>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>
//         ) : researchedCount === totalProspects && totalProspects > 0 ? (
//           <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
//             <CheckCircle2 className="h-5 w-5" />
//             <span className="font-medium">Research Complete!</span>
//           </div>
//         ) : (
//           <Button onClick={startResearch} size="lg" className="gap-2">
//             <Sparkles className="h-4 w-4" />
//             Start AI Research
//           </Button>
//         )}

//         <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6">
//           <div className="text-center p-4 rounded-lg bg-muted/50">
//             <div className="text-2xl font-bold">{totalProspects}</div>
//             <div className="text-xs text-muted-foreground">Total Prospects</div>
//           </div>
//           <div className="text-center p-4 rounded-lg bg-muted/50">
//             <div className="text-2xl font-bold">{researchedCount}</div>
//             <div className="text-xs text-muted-foreground">Researched</div>
//           </div>
//           <div className="text-center p-4 rounded-lg bg-muted/50">
//             <div className="text-2xl font-bold">{Math.round(progress)}%</div>
//             <div className="text-xs text-muted-foreground">Progress</div>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-4 border-t">
//         <Button variant="outline" onClick={onBack} disabled={isResearching}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back
//         </Button>
//         <Button onClick={onNext} disabled={!canProceed || isResearching}>
//           Continue to Email Generation
//           <ArrowRight className="ml-2 h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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
  const [successfulCount, setSuccessfulCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [totalProspects, setTotalProspects] = useState(campaign._count.prospects)
  const [hasStarted, setHasStarted] = useState(false)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)

  // Check if research has already been completed on mount
  useEffect(() => {
    checkExistingResearch()
  }, [campaign.id])

  const checkExistingResearch = async () => {
    try {
      const response = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
      if (response.ok) {
        const status = await response.json()
        if (status.completed > 0) {
          setResearchedCount(status.completed)
          setSuccessfulCount(status.successful || status.completed)
          setFailedCount(status.failed || 0)
          setProgress((status.completed / status.total) * 100)
          setHasStarted(true)
          
          if (status.completed === status.total) {
            toast.info(`Research already completed for ${status.completed} prospects`)
          }
        }
      }
    } catch (error) {
      console.error("Failed to check existing research:", error)
    }
  }

  const startResearch = async () => {
    setIsResearching(true)
    setHasStarted(true)
    setProgress(0)
    setResearchedCount(0)
    setSuccessfulCount(0)
    setFailedCount(0)

    const startTime = Date.now()

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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Research failed")
      }

      // Poll for progress with more frequent updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
          
          if (!statusResponse.ok) {
            clearInterval(pollInterval)
            setIsResearching(false)
            return
          }

          const status = await statusResponse.json()

          setResearchedCount(status.completed)
          setSuccessfulCount(status.successful || status.completed)
          setFailedCount(status.failed || 0)
          const newProgress = (status.completed / status.total) * 100
          setProgress(newProgress)

          // Calculate estimated time remaining
          if (status.completed > 0 && status.completed < status.total) {
            const elapsed = Date.now() - startTime
            const avgTimePerProspect = elapsed / status.completed
            const remaining = (status.total - status.completed) * avgTimePerProspect
            setEstimatedTimeRemaining(Math.ceil(remaining / 1000))
          }

          if (status.completed >= status.total) {
            clearInterval(pollInterval)
            setIsResearching(false)
            setEstimatedTimeRemaining(null)
            
            const successRate = ((status.successful / status.total) * 100).toFixed(0)
            
            if (status.failed > 0) {
              toast.success(
                `Research complete! ${status.successful} successful, ${status.failed} partial results.`,
                { duration: 5000 }
              )
            } else {
              toast.success(`Research complete! All ${status.completed} prospects enriched.`, {
                duration: 5000
              })
            }
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 1500) // Poll every 1.5 seconds for more responsive updates

      // Cleanup interval if component unmounts
      return () => clearInterval(pollInterval)
    } catch (error) {
      console.error("[v0] Research error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to start research. Please try again.")
      setIsResearching(false)
    }
  }

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `~${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `~${minutes}m ${secs}s`
  }

  // Allow proceeding if we have ANY research results, not just complete
  const canProceed = researchedCount > 0 && !isResearching
  const isComplete = researchedCount === totalProspects && totalProspects > 0
  const hasPartialResults = researchedCount > 0 && researchedCount < totalProspects

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
            
            {estimatedTimeRemaining && (
              <p className="text-xs text-muted-foreground">
                Estimated time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
              </p>
            )}
            
            {failedCount > 0 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                {successfulCount} successful, {failedCount} with partial data
              </p>
            )}
          </div>
        ) : isComplete ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Research Complete!</span>
            </div>
            {failedCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {successfulCount} fully researched, {failedCount} with partial data
              </p>
            )}
          </div>
        ) : hasPartialResults ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Partial Results Available</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              {researchedCount} of {totalProspects} prospects researched. You can continue with these results or resume research.
            </p>
            <Button onClick={startResearch} variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Resume Research
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button onClick={startResearch} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Start AI Research
            </Button>
            <p className="text-xs text-muted-foreground">
              Average time: ~30-60s per prospect
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{totalProspects}</div>
            <div className="text-xs text-muted-foreground">Total Prospects</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {successfulCount}
            </div>
            <div className="text-xs text-muted-foreground">Fully Researched</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {failedCount}
            </div>
            <div className="text-xs text-muted-foreground">Partial Data</div>
          </div>
        </div>

        {hasStarted && (
          <div className="max-w-md mx-auto pt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isResearching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {hasPartialResults && !isComplete && (
            <span className="text-xs text-muted-foreground">
              Continue with {researchedCount} prospects
            </span>
          )}
          <Button onClick={onNext} disabled={!canProceed}>
            Continue to Email Generation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}