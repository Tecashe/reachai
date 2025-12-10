// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Brain, Loader2, CheckCircle2 } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"

// interface BatchResearchDialogProps {
//   campaignId: string
//   prospectCount: number
// }

// export function BatchResearchDialog({ campaignId, prospectCount }: BatchResearchDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [depth, setDepth] = useState("STANDARD")
//   const [researching, setResearching] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [complete, setComplete] = useState(false)
//   const [stats, setStats] = useState({ completed: 0, total: 0, avgScore: 0 })

//   const handleResearch = async () => {
//     setResearching(true)
//     setProgress(0)
//     setStats({ completed: 0, total: prospectCount, avgScore: 0 })

//     // Simulate batch research progress
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         const newProgress = prev + 5
//         if (newProgress >= 100) {
//           clearInterval(progressInterval)
//           setComplete(true)
//           setResearching(false)
//           setStats({ completed: prospectCount, total: prospectCount, avgScore: 87 })
//           return 100
//         }
//         setStats((s) => ({
//           ...s,
//           completed: Math.floor((newProgress / 100) * prospectCount),
//         }))
//         return newProgress
//       })
//     }, 400)
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setDepth("STANDARD")
//     setResearching(false)
//     setProgress(0)
//     setComplete(false)
//     setStats({ completed: 0, total: 0, avgScore: 0 })
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Brain className="h-4 w-4 mr-2" />
//           Batch Research
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-xl">
//         <DialogHeader>
//           <DialogTitle>Batch AI Research</DialogTitle>
//           <DialogDescription>Research all {prospectCount} prospects in this campaign at once.</DialogDescription>
//         </DialogHeader>

//         {!complete ? (
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="depth">Research Depth</Label>
//               <Select value={depth} onValueChange={setDepth} disabled={researching}>
//                 <SelectTrigger id="depth">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="BASIC">Basic - Fast & cost-effective</SelectItem>
//                   <SelectItem value="STANDARD">Standard - Balanced approach</SelectItem>
//                   <SelectItem value="DEEP">Deep - Maximum insights</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {researching && (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">
//                       Researching prospects... {stats.completed}/{stats.total}
//                     </p>
//                     <p className="text-xs text-muted-foreground">This may take a few minutes</p>
//                   </div>
//                 </div>
//                 <Progress value={progress} />
//               </div>
//             )}

//             <div className="bg-muted/50 rounded-lg p-4 space-y-3">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Prospects to research:</span>
//                 <span className="font-semibold">{prospectCount}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Estimated time:</span>
//                 <span className="font-semibold">
//                   {depth === "BASIC" ? "2-3 min" : depth === "STANDARD" ? "5-7 min" : "10-15 min"}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">AI credits required:</span>
//                 <span className="font-semibold">
//                   {depth === "BASIC" ? prospectCount : depth === "STANDARD" ? prospectCount * 2 : prospectCount * 5}
//                 </span>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <Button onClick={handleResearch} disabled={researching} className="flex-1">
//                 {researching ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Researching...
//                   </>
//                 ) : (
//                   <>
//                     <Brain className="h-4 w-4 mr-2" />
//                     Start Batch Research
//                   </>
//                 )}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={researching}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="py-8 text-center space-y-4">
//             <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Batch Research Complete!</h3>
//               <p className="text-sm text-muted-foreground">
//                 Successfully researched <span className="font-semibold text-foreground">{stats.completed}</span>{" "}
//                 prospects
//               </p>
//             </div>
//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Average Quality Score:</span>
//                 <span className="font-semibold text-green-600 dark:text-green-400">{stats.avgScore}/100</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">High Quality (90+):</span>
//                 <span className="font-medium">{Math.floor(stats.completed * 0.4)}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Medium Quality (70-89):</span>
//                 <span className="font-medium">{Math.floor(stats.completed * 0.5)}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Low Quality (&lt;70):</span>
//                 <span className="font-medium">{Math.floor(stats.completed * 0.1)}</span>
//               </div>
//             </div>
//             <Button onClick={handleClose} className="w-full">
//               Done
//             </Button>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Brain, Loader2, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { WaveLoader } from "../loader/wave-loader"

interface BatchResearchDialogProps {
  campaignId: string
  prospectCount: number
}

export function BatchResearchDialog({ campaignId, prospectCount }: BatchResearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [depth, setDepth] = useState("STANDARD")
  const [researching, setResearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [stats, setStats] = useState({ completed: 0, total: 0, avgScore: 0 })

  const handleResearch = async () => {
    setResearching(true)
    setProgress(0)
    setStats({ completed: 0, total: prospectCount, avgScore: 0 })

    try {
      const response = await fetch("/api/research/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          depth,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start batch research")
      }

      // Poll for progress
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/research/batch/status?campaignId=${campaignId}`)
        const statusData = await statusResponse.json()

        setProgress(statusData.progress || 0)
        setStats({
          completed: statusData.completed || 0,
          total: prospectCount,
          avgScore: statusData.avgScore || 0,
        })

        if (statusData.progress >= 100) {
          clearInterval(pollInterval)
          setComplete(true)
          setResearching(false)
        }
      }, 2000)
    } catch (error) {
      console.error("[builtbycashe] Batch research failed:", error)
      setResearching(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setDepth("STANDARD")
    setResearching(false)
    setProgress(0)
    setComplete(false)
    setStats({ completed: 0, total: 0, avgScore: 0 })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Batch Research
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Batch AI Research</DialogTitle>
          <DialogDescription>Research all {prospectCount} prospects in this campaign at once.</DialogDescription>
        </DialogHeader>

        {!complete ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="depth">Research Depth</Label>
              <Select value={depth} onValueChange={setDepth} disabled={researching}>
                <SelectTrigger id="depth">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">Basic - Fast & cost-effective</SelectItem>
                  <SelectItem value="STANDARD">Standard - Balanced approach</SelectItem>
                  <SelectItem value="DEEP">Deep - Maximum insights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {researching && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* <Loader2 className="h-5 w-5 animate-spin text-primary" /> */}
                  <WaveLoader size="sm" bars={8} gap="tight" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Researching prospects... {stats.completed}/{stats.total}
                    </p>
                    <p className="text-xs text-muted-foreground">This may take a few minutes</p>
                  </div>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Prospects to research:</span>
                <span className="font-semibold">{prospectCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated time:</span>
                <span className="font-semibold">
                  {depth === "BASIC" ? "2-3 min" : depth === "STANDARD" ? "5-7 min" : "10-15 min"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI credits required:</span>
                <span className="font-semibold">
                  {depth === "BASIC" ? prospectCount : depth === "STANDARD" ? prospectCount * 2 : prospectCount * 5}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleResearch} disabled={researching} className="flex-1">
                {researching ? (
                  <>
                    {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                    <WaveLoader size="sm" bars={8} gap="tight" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Start Batch Research
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={researching}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Batch Research Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Successfully researched <span className="font-semibold text-foreground">{stats.completed}</span>{" "}
                prospects
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Quality Score:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.avgScore}/100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">High Quality (90+):</span>
                <span className="font-medium">{Math.floor(stats.completed * 0.4)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Medium Quality (70-89):</span>
                <span className="font-medium">{Math.floor(stats.completed * 0.5)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Low Quality (&lt;70):</span>
                <span className="font-medium">{Math.floor(stats.completed * 0.1)}</span>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
