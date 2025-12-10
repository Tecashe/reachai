// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Sparkles, GitBranch, CheckCircle2, Loader2, AlertCircle, ArrowRight } from "lucide-react"
// import { toast } from "sonner"

// interface AIRecommendation {
//   prospectId: string
//   prospectName: string
//   prospectEmail: string
//   recommendedSequenceId: string
//   recommendedSequenceName: string
//   confidence: number
//   reasoning: string
// }

// interface AISequenceRecommenderProps {
//   prospectIds: string[]
//   onAssign: (assignments: { prospectId: string; sequenceId: string }[]) => void
// }

// export function AISequenceRecommender({ prospectIds, onAssign }: AISequenceRecommenderProps) {
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
//   const [progress, setProgress] = useState(0)
//   const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set())

//   const analyzeProspects = async () => {
//     setIsAnalyzing(true)
//     setProgress(0)
//     setRecommendations([])

//     try {
//       const response = await fetch("/api/ai/sequence-recommendations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prospectIds }),
//       })

//       if (!response.ok) throw new Error("Failed to get recommendations")

//       const data = await response.json()
//       setRecommendations(data.recommendations)

//       // Auto-select high confidence recommendations
//       const highConfidence = new Set(
//         data.recommendations
//           .filter((r: AIRecommendation) => r.confidence >= 0.8)
//           .map((r: AIRecommendation) => r.prospectId),
//       )
//       setSelectedRecommendations(highConfidence)

//       setProgress(100)
//     } catch (error) {
//       toast.error("Failed to analyze prospects")
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   const toggleSelection = (prospectId: string) => {
//     const newSelected = new Set(selectedRecommendations)
//     if (newSelected.has(prospectId)) {
//       newSelected.delete(prospectId)
//     } else {
//       newSelected.add(prospectId)
//     }
//     setSelectedRecommendations(newSelected)
//   }

//   const applyRecommendations = () => {
//     const assignments = recommendations
//       .filter((r) => selectedRecommendations.has(r.prospectId))
//       .map((r) => ({
//         prospectId: r.prospectId,
//         sequenceId: r.recommendedSequenceId,
//       }))

//     onAssign(assignments)
//     toast.success(`${assignments.length} prospects assigned to sequences`)
//   }

//   const getConfidenceColor = (confidence: number) => {
//     if (confidence >= 0.8) return "text-green-600 bg-green-100"
//     if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100"
//     return "text-red-600 bg-red-100"
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-primary" />
//               AI Sequence Recommender
//             </CardTitle>
//             <CardDescription>
//               Let AI analyze your prospects and recommend the best sequence for each one
//             </CardDescription>
//           </div>
//           {recommendations.length === 0 && (
//             <Button onClick={analyzeProspects} disabled={isAnalyzing || prospectIds.length === 0}>
//               {isAnalyzing ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="h-4 w-4 mr-2" />
//                   Analyze {prospectIds.length} Prospects
//                 </>
//               )}
//             </Button>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isAnalyzing && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between text-sm">
//               <span>Analyzing prospects with AI...</span>
//               <span>{progress}%</span>
//             </div>
//             <Progress value={progress} />
//           </div>
//         )}

//         {recommendations.length > 0 && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-muted-foreground">
//                 {selectedRecommendations.size} of {recommendations.length} selected
//               </p>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setSelectedRecommendations(new Set(recommendations.map((r) => r.prospectId)))}
//                 >
//                   Select All
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => setSelectedRecommendations(new Set())}>
//                   Clear
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {recommendations.map((rec) => (
//                 <div
//                   key={rec.prospectId}
//                   className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                     selectedRecommendations.has(rec.prospectId)
//                       ? "border-primary bg-primary/5"
//                       : "border-border hover:border-primary/50"
//                   }`}
//                   onClick={() => toggleSelection(rec.prospectId)}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         {selectedRecommendations.has(rec.prospectId) ? (
//                           <CheckCircle2 className="h-5 w-5 text-primary" />
//                         ) : (
//                           <div className="h-5 w-5 border-2 rounded-full" />
//                         )}
//                         <span className="font-medium">{rec.prospectName || rec.prospectEmail}</span>
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1 ml-7">{rec.prospectEmail}</p>
//                     </div>
//                     <Badge className={getConfidenceColor(rec.confidence)}>
//                       {Math.round(rec.confidence * 100)}% confidence
//                     </Badge>
//                   </div>

//                   <div className="mt-3 ml-7 flex items-center gap-2 text-sm">
//                     <ArrowRight className="h-4 w-4 text-muted-foreground" />
//                     <GitBranch className="h-4 w-4 text-primary" />
//                     <span className="font-medium">{rec.recommendedSequenceName}</span>
//                   </div>

//                   <p className="mt-2 ml-7 text-xs text-muted-foreground">{rec.reasoning}</p>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end pt-4 border-t">
//               <Button onClick={applyRecommendations} disabled={selectedRecommendations.size === 0}>
//                 <CheckCircle2 className="h-4 w-4 mr-2" />
//                 Apply {selectedRecommendations.size} Assignments
//               </Button>
//             </div>
//           </div>
//         )}

//         {!isAnalyzing && recommendations.length === 0 && prospectIds.length === 0 && (
//           <div className="text-center py-8">
//             <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//             <h3 className="font-semibold mb-2">No Prospects Selected</h3>
//             <p className="text-sm text-muted-foreground">
//               Select prospects from the list to get AI-powered sequence recommendations
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, GitBranch, CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { toast } from "sonner"
import { WaveLoader } from "../loader/wave-loader"

interface AIRecommendation {
  prospectId: string
  prospectName: string
  prospectEmail: string
  recommendedSequenceId: string
  recommendedSequenceName: string
  confidence: number
  reasoning: string
}

interface AISequenceRecommenderProps {
  prospectIds: string[]
  onAssign: (assignments: { prospectId: string; sequenceId: string }[]) => void
}

export function AISequenceRecommender({ prospectIds, onAssign }: AISequenceRecommenderProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [progress, setProgress] = useState(0)
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set())

  const analyzeProspects = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setRecommendations([])

    try {
      const response = await fetch("/api/ai/sequence-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds }),
      })

      if (!response.ok) throw new Error("Failed to get recommendations")

      const data = await response.json()
      setRecommendations(data.recommendations)

      // Fixed Set<unknown> error by explicitly typing the map result as string[]
      const highConfidenceIds: string[] = data.recommendations
        .filter((r: AIRecommendation) => r.confidence >= 0.8)
        .map((r: AIRecommendation) => r.prospectId)
      setSelectedRecommendations(new Set(highConfidenceIds))

      setProgress(100)
    } catch (error) {
      toast.error("Failed to analyze prospects")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleSelection = (prospectId: string) => {
    const newSelected = new Set(selectedRecommendations)
    if (newSelected.has(prospectId)) {
      newSelected.delete(prospectId)
    } else {
      newSelected.add(prospectId)
    }
    setSelectedRecommendations(newSelected)
  }

  const applyRecommendations = () => {
    const assignments = recommendations
      .filter((r) => selectedRecommendations.has(r.prospectId))
      .map((r) => ({
        prospectId: r.prospectId,
        sequenceId: r.recommendedSequenceId,
      }))

    onAssign(assignments)
    toast.success(`${assignments.length} prospects assigned to sequences`)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100"
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Sequence Recommender
            </CardTitle>
            <CardDescription>
              Let AI analyze your prospects and recommend the best sequence for each one
            </CardDescription>
          </div>
          {recommendations.length === 0 && (
            <Button onClick={analyzeProspects} disabled={isAnalyzing || prospectIds.length === 0}>
              {isAnalyzing ? (
                <>
                  {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                  <WaveLoader size="sm" bars={8} gap="tight" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze {prospectIds.length} Prospects
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Analyzing prospects with AI...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedRecommendations.size} of {recommendations.length} selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecommendations(new Set(recommendations.map((r) => r.prospectId)))}
                >
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedRecommendations(new Set())}>
                  Clear
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recommendations.map((rec) => (
                <div
                  key={rec.prospectId}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecommendations.has(rec.prospectId)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleSelection(rec.prospectId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {selectedRecommendations.has(rec.prospectId) ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <div className="h-5 w-5 border-2 rounded-full" />
                        )}
                        <span className="font-medium">{rec.prospectName || rec.prospectEmail}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-7">{rec.prospectEmail}</p>
                    </div>
                    <Badge className={getConfidenceColor(rec.confidence)}>
                      {Math.round(rec.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  <div className="mt-3 ml-7 flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <GitBranch className="h-4 w-4 text-primary" />
                    <span className="font-medium">{rec.recommendedSequenceName}</span>
                  </div>

                  <p className="mt-2 ml-7 text-xs text-muted-foreground">{rec.reasoning}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={applyRecommendations} disabled={selectedRecommendations.size === 0}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply {selectedRecommendations.size} Assignments
              </Button>
            </div>
          </div>
        )}

        {!isAnalyzing && recommendations.length === 0 && prospectIds.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Prospects Selected</h3>
            <p className="text-sm text-muted-foreground">
              Select prospects from the list to get AI-powered sequence recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
