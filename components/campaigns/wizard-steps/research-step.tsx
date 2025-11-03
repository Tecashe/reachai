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

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface ResearchStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface ResearchStatus {
  completed: number
  total: number
  successful: number
  failed: number
  isRunning: boolean
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
  const [researchError, setResearchError] = useState<string | null>(null)
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const hasCheckedExistingRef = useRef(false)

  // Check if research has already been completed on mount
  useEffect(() => {
    if (!hasCheckedExistingRef.current) {
      hasCheckedExistingRef.current = true
      checkExistingResearch()
    }

    // Cleanup polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [campaign.id])

  const checkExistingResearch = async () => {
    try {
      console.log("[UI] Checking existing research for campaign:", campaign.id)
      const response = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
      
      if (!response.ok) {
        console.warn("[UI] Failed to check existing research:", response.status)
        return
      }

      const status: ResearchStatus = await response.json()
      console.log("[UI] Existing research status:", status)
      
      if (status.completed > 0) {
        setResearchedCount(status.completed)
        setSuccessfulCount(status.successful || status.completed)
        setFailedCount(status.failed || 0)
        setTotalProspects(status.total)
        setProgress((status.completed / status.total) * 100)
        setHasStarted(true)
        
        if (status.completed === status.total) {
          console.log("[UI] Research already completed")
          toast.info(`Research already completed for ${status.completed} prospects`)
        } else if (status.completed > 0) {
          console.log("[UI] Partial research found")
          toast.info(`Found ${status.completed} of ${status.total} prospects already researched`)
        }
      }
    } catch (error) {
      console.error("[UI] Failed to check existing research:", error)
    }
  }

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      console.log("[UI] Stopping progress polling")
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  const startPolling = () => {
    // Clear any existing interval
    stopPolling()

    console.log("[UI] Starting progress polling")
    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/research/batch/status?campaignId=${campaign.id}`)
        
        if (!statusResponse.ok) {
          console.warn("[UI] Status check failed:", statusResponse.status)
          return
        }

        const status: ResearchStatus = await statusResponse.json()
        console.log("[UI] Progress update:", status)

        // Update all state at once
        setResearchedCount(status.completed)
        setSuccessfulCount(status.successful || status.completed)
        setFailedCount(status.failed || 0)
        setTotalProspects(status.total)
        
        const newProgress = (status.completed / status.total) * 100
        setProgress(newProgress)

        // Calculate estimated time remaining
        if (status.completed > 0 && status.completed < status.total && startTimeRef.current > 0) {
          const elapsed = Date.now() - startTimeRef.current
          const avgTimePerProspect = elapsed / status.completed
          const remaining = (status.total - status.completed) * avgTimePerProspect
          setEstimatedTimeRemaining(Math.ceil(remaining / 1000))
        }

        // Check if research is complete
        if (status.completed >= status.total) {
          console.log("[UI] Research completed!")
          stopPolling()
          setIsResearching(false)
          setEstimatedTimeRemaining(null)
          
          const successRate = ((status.successful / status.total) * 100).toFixed(0)
          
          if (status.failed > 0) {
            toast.success(
              `Research complete! ${status.successful} successful, ${status.failed} with partial data.`,
              { duration: 5000 }
            )
          } else {
            toast.success(
              `Research complete! All ${status.completed} prospects enriched. Success rate: ${successRate}%`,
              { duration: 5000 }
            )
          }
        } else if (!status.isRunning && status.completed < status.total) {
          // Research stopped but not complete
          console.warn("[UI] Research stopped unexpectedly")
          stopPolling()
          setIsResearching(false)
          toast.warning(
            `Research paused at ${status.completed}/${status.total} prospects. You can continue or proceed with current results.`,
            { duration: 6000 }
          )
        }
      } catch (error) {
        console.error("[UI] Polling error:", error)
        // Don't stop polling on transient errors, but count them
      }
    }, 1500) // Poll every 1.5 seconds
  }

  const startResearch = async () => {
    console.log("[UI] Starting research...")
    setIsResearching(true)
    setHasStarted(true)
    setResearchError(null)
    startTimeRef.current = Date.now()

    // Start polling immediately
    startPolling()

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
        const errorData = await response.json().catch(() => ({ error: "Research request failed" }))
        throw new Error(errorData.error || "Research failed")
      }

      console.log("[UI] Research request accepted")
      // Don't stop researching here - let polling handle completion
    } catch (error) {
      console.error("[UI] Research error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to start research"
      setResearchError(errorMessage)
      toast.error(errorMessage)
      stopPolling()
      setIsResearching(false)
      setEstimatedTimeRemaining(null)
    }
  }

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) return `~${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `~${minutes}m ${secs}s`
  }

  // Allow proceeding if we have ANY research results
  const canProceed = researchedCount > 0 && !isResearching
  const isComplete = researchedCount === totalProspects && totalProspects > 0
  const hasPartialResults = researchedCount > 0 && researchedCount < totalProspects && !isResearching

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

        {/* Active Research State */}
        {isResearching && (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">
                Researching {researchedCount} of {totalProspects} prospects...
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {estimatedTimeRemaining !== null && (
              <p className="text-xs text-muted-foreground">
                Estimated time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
              </p>
            )}
            
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="text-green-600 dark:text-green-400">
                ✓ {successfulCount} successful
              </span>
              {failedCount > 0 && (
                <span className="text-yellow-600 dark:text-yellow-400">
                  ⚠ {failedCount} partial
                </span>
              )}
            </div>
          </div>
        )}

        {/* Complete State */}
        {!isResearching && isComplete && (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold text-lg">Research Complete!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {successfulCount} fully researched
              {failedCount > 0 && `, ${failedCount} with partial data`}
            </p>
          </div>
        )}

        {/* Partial Results State */}
        {!isResearching && hasPartialResults && (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Partial Results Available</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {researchedCount} of {totalProspects} prospects researched ({successfulCount} complete, {failedCount} partial). 
              You can continue with these results or resume research.
            </p>
            <Button onClick={startResearch} variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Resume Research ({totalProspects - researchedCount} remaining)
            </Button>
          </div>
        )}

        {/* Initial State */}
        {!isResearching && !hasStarted && (
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

        {/* Error State */}
        {researchError && (
          <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <XCircle className="h-4 w-4" />
            <span>{researchError}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-6">
          <div className="text-center p-4 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{totalProspects}</div>
            <div className="text-xs text-muted-foreground">Total Prospects</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {successfulCount}
            </div>
            <div className="text-xs text-muted-foreground">Fully Researched</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {failedCount}
            </div>
            <div className="text-xs text-muted-foreground">Partial Data</div>
          </div>
        </div>

        {/* Progress Bar (always visible when started) */}
        {hasStarted && (
          <div className="max-w-md mx-auto pt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{researchedCount} / {totalProspects} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isResearching}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          {hasPartialResults && (
            <span className="text-xs text-muted-foreground">
              Continue with {researchedCount} prospects
            </span>
          )}
          <Button 
            onClick={onNext} 
            disabled={!canProceed}
            className="gap-2"
          >
            {canProceed ? (
              <>
                Continue to Email Generation
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for research...
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}