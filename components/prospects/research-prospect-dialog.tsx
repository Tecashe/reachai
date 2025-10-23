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
// import { Badge } from "@/components/ui/badge"

// interface ResearchProspectDialogProps {
//   prospectId: string
//   prospectEmail: string
// }

// export function ResearchProspectDialog({ prospectId, prospectEmail }: ResearchProspectDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [depth, setDepth] = useState("STANDARD")
//   const [researching, setResearching] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [complete, setComplete] = useState(false)
//   const [result, setResult] = useState<any>(null)

//   const handleResearch = async () => {
//     setResearching(true)
//     setProgress(0)

//     // Simulate progress
//     const progressInterval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 90) {
//           clearInterval(progressInterval)
//           return 90
//         }
//         return prev + 10
//       })
//     }, 300)

//     try {
//       // In production, call the actual API
//       await new Promise((resolve) => setTimeout(resolve, 3000))

//       // Mock result
//       const mockResult = {
//         qualityScore: 92,
//         companyInfo: "TechFlow is a B2B SaaS company providing workflow automation tools.",
//         recentNews: ["Raised $10M Series A", "Launched AI features", "Expanded to Europe"],
//         painPoints: ["Scaling sales operations", "Improving email response rates"],
//         competitorTools: ["Salesforce", "HubSpot", "Outreach"],
//         talkingPoints: [
//           "Recent Series A funding shows growth momentum",
//           "New AI features align with automation needs",
//           "European expansion indicates scaling challenges",
//         ],
//       }

//       clearInterval(progressInterval)
//       setProgress(100)
//       setResult(mockResult)
//       setComplete(true)
//     } catch (error) {
//       console.error("[v0] Research failed:", error)
//     } finally {
//       setResearching(false)
//     }
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setDepth("STANDARD")
//     setResearching(false)
//     setProgress(0)
//     setComplete(false)
//     setResult(null)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Brain className="h-4 w-4 mr-2" />
//           AI Research
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>AI Research Assistant</DialogTitle>
//           <DialogDescription>
//             Let AI research this prospect to find personalized talking points and insights.
//           </DialogDescription>
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
//                   <SelectItem value="BASIC">
//                     <div>
//                       <div className="font-medium">Basic</div>
//                       <div className="text-xs text-muted-foreground">Company name and website only</div>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="STANDARD">
//                     <div>
//                       <div className="font-medium">Standard</div>
//                       <div className="text-xs text-muted-foreground">Company info + recent news</div>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="DEEP">
//                     <div>
//                       <div className="font-medium">Deep</div>
//                       <div className="text-xs text-muted-foreground">Full research with competitor analysis</div>
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {researching && (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Researching {prospectEmail}...</p>
//                     <p className="text-xs text-muted-foreground">
//                       {progress < 30 && "Scraping company website..."}
//                       {progress >= 30 && progress < 60 && "Analyzing LinkedIn profile..."}
//                       {progress >= 60 && progress < 90 && "Searching recent news..."}
//                       {progress >= 90 && "Generating insights..."}
//                     </p>
//                   </div>
//                 </div>
//                 <Progress value={progress} />
//               </div>
//             )}

//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <p className="text-sm font-medium">What AI will research:</p>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li>• Company website and recent blog posts</li>
//                 <li>• LinkedIn profile and experience</li>
//                 <li>• Recent news and press releases</li>
//                 <li>• Competitor tools and technologies</li>
//                 <li>• Potential pain points and talking points</li>
//               </ul>
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
//                     Start Research
//                   </>
//                 )}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={researching}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
//               <div>
//                 <h3 className="text-lg font-semibold">Research Complete!</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Quality Score:{" "}
//                   <span className="font-semibold text-green-600 dark:text-green-400">{result.qualityScore}/100</span>
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Company Overview</h4>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{result.companyInfo}</p>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Recent News</h4>
//                 <ul className="space-y-1">
//                   {result.recentNews.map((news: string, index: number) => (
//                     <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
//                       <span className="text-primary">•</span>
//                       {news}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Talking Points</h4>
//                 <ul className="space-y-1">
//                   {result.talkingPoints.map((point: string, index: number) => (
//                     <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
//                       <span className="text-primary">•</span>
//                       {point}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Current Tools</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {result.competitorTools.map((tool: string, index: number) => (
//                     <Badge key={index} variant="secondary">
//                       {tool}
//                     </Badge>
//                   ))}
//                 </div>
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
// import { Badge } from "@/components/ui/badge"

// interface ResearchProspectDialogProps {
//   prospectId: string
//   prospectEmail: string
// }

// export function ResearchProspectDialog({ prospectId, prospectEmail }: ResearchProspectDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [depth, setDepth] = useState("STANDARD")
//   const [researching, setResearching] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [complete, setComplete] = useState(false)
//   const [result, setResult] = useState<any>(null)

//   const handleResearch = async () => {
//     setResearching(true)
//     setProgress(0)

//     const progressInterval = setInterval(() => {
//       setProgress((prev) => Math.min(prev + 10, 90))
//     }, 300)

//     try {
//       const response = await fetch("/api/research/prospect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           prospectId,
//           depth,
//         }),
//       })

//       clearInterval(progressInterval)

//       if (!response.ok) {
//         throw new Error("Failed to research prospect")
//       }

//       const data = await response.json()

//       setProgress(100)
//       setResult(data.research)
//       setComplete(true)
//     } catch (error) {
//       console.error("[v0] Research failed:", error)
//       clearInterval(progressInterval)
//     } finally {
//       setResearching(false)
//     }
//   }

//   const handleClose = () => {
//     setOpen(false)
//     setDepth("STANDARD")
//     setResearching(false)
//     setProgress(0)
//     setComplete(false)
//     setResult(null)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Brain className="h-4 w-4 mr-2" />
//           AI Research
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>AI Research Assistant</DialogTitle>
//           <DialogDescription>
//             Let AI research this prospect to find personalized talking points and insights.
//           </DialogDescription>
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
//                   <SelectItem value="BASIC">
//                     <div>
//                       <div className="font-medium">Basic</div>
//                       <div className="text-xs text-muted-foreground">Company name and website only</div>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="STANDARD">
//                     <div>
//                       <div className="font-medium">Standard</div>
//                       <div className="text-xs text-muted-foreground">Company info + recent news</div>
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="DEEP">
//                     <div>
//                       <div className="font-medium">Deep</div>
//                       <div className="text-xs text-muted-foreground">Full research with competitor analysis</div>
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {researching && (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">Researching {prospectEmail}...</p>
//                     <p className="text-xs text-muted-foreground">
//                       {progress < 30 && "Scraping company website..."}
//                       {progress >= 30 && progress < 60 && "Analyzing LinkedIn profile..."}
//                       {progress >= 60 && progress < 90 && "Searching recent news..."}
//                       {progress >= 90 && "Generating insights..."}
//                     </p>
//                   </div>
//                 </div>
//                 <Progress value={progress} />
//               </div>
//             )}

//             <div className="bg-muted/50 rounded-lg p-4 space-y-2">
//               <p className="text-sm font-medium">What AI will research:</p>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li>• Company website and recent blog posts</li>
//                 <li>• LinkedIn profile and experience</li>
//                 <li>• Recent news and press releases</li>
//                 <li>• Competitor tools and technologies</li>
//                 <li>• Potential pain points and talking points</li>
//               </ul>
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
//                     Start Research
//                   </>
//                 )}
//               </Button>
//               <Button variant="outline" onClick={handleClose} disabled={researching}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
//               <div>
//                 <h3 className="text-lg font-semibold">Research Complete!</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Quality Score:{" "}
//                   <span className="font-semibold text-green-600 dark:text-green-400">{result.qualityScore}/100</span>
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Company Overview</h4>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{result.companyInfo}</p>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Recent News</h4>
//                 <ul className="space-y-1">
//                   {result.recentNews.map((news: string, index: number) => (
//                     <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
//                       <span className="text-primary">•</span>
//                       {news}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Talking Points</h4>
//                 <ul className="space-y-1">
//                   {result.talkingPoints.map((point: string, index: number) => (
//                     <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
//                       <span className="text-primary">•</span>
//                       {point}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="text-sm font-semibold mb-2">Current Tools</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {result.competitorTools.map((tool: string, index: number) => (
//                     <Badge key={index} variant="secondary">
//                       {tool}
//                     </Badge>
//                   ))}
//                 </div>
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
import { Badge } from "@/components/ui/badge"

interface ResearchProspectDialogProps {
  prospectId: string
  prospectEmail: string
}

export function ResearchProspectDialog({ prospectId, prospectEmail }: ResearchProspectDialogProps) {
  const [open, setOpen] = useState(false)
  const [depth, setDepth] = useState("STANDARD")
  const [researching, setResearching] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleResearch = async () => {
    setResearching(true)
    setProgress(0)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 300)

    try {
      const response = await fetch("/api/research/prospect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId,
          depth,
        }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Failed to research prospect")
      }

      const data = await response.json()

      setProgress(100)
      setResult(data.research)
      setComplete(true)
    } catch (error) {
      console.error("[v0] Research failed:", error)
      clearInterval(progressInterval)
    } finally {
      setResearching(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setDepth("STANDARD")
    setResearching(false)
    setProgress(0)
    setComplete(false)
    setResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          AI Research
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Research Assistant</DialogTitle>
          <DialogDescription>
            Let AI research this prospect to find personalized talking points and insights.
          </DialogDescription>
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
                  <SelectItem value="BASIC">
                    <div>
                      <div className="font-medium">Basic (Fast)</div>
                      <div className="text-xs text-muted-foreground">Company name and website only - Uses APIs</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="STANDARD">
                    <div>
                      <div className="font-medium">Standard (Balanced)</div>
                      <div className="text-xs text-muted-foreground">Company info + recent news - Uses APIs</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="DEEP">
                    <div>
                      <div className="font-medium">Deep (Comprehensive)</div>
                      <div className="text-xs text-muted-foreground">
                        Full research with AI extraction - Uses Python scraper
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Researching {prospectEmail}...</p>
                  <p className="text-xs text-muted-foreground">
                    {progress < 30 && "Scraping company website..."}
                    {progress >= 30 && progress < 60 && "Analyzing LinkedIn profile..."}
                    {progress >= 60 && progress < 90 && "Searching recent news..."}
                    {progress >= 90 && "Generating insights..."}
                  </p>
                </div>
              </div>
              <Progress value={progress} />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">What AI will research:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Company website and recent blog posts</li>
                <li>• LinkedIn profile and experience</li>
                <li>• Recent news and press releases</li>
                <li>• Competitor tools and technologies</li>
                <li>• Potential pain points and talking points</li>
                {depth === "DEEP" && (
                  <>
                    <li className="text-primary font-medium">• Products and pricing (Deep mode)</li>
                    <li className="text-primary font-medium">• Team size and hiring signals (Deep mode)</li>
                    <li className="text-primary font-medium">• Recent LinkedIn activity (Deep mode)</li>
                    <li className="text-primary font-medium">• News sentiment analysis (Deep mode)</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleResearch} disabled={researching} className="flex-1">
                {researching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Start Research
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClose} disabled={researching}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-semibold">Research Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Quality Score:{" "}
                  <span className="font-semibold text-green-600 dark:text-green-400">{result.qualityScore}/100</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Company Overview</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.companyInfo}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Recent News</h4>
                <ul className="space-y-1">
                  {result.recentNews.map((news: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {news}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Talking Points</h4>
                <ul className="space-y-1">
                  {result.talkingPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Current Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {result.competitorTools.map((tool: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              {result.linkedInInsights && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">LinkedIn Insights</h4>
                  <div className="space-y-2 text-sm">
                    {result.linkedInInsights.certifications?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Certifications: </span>
                        <span>{result.linkedInInsights.certifications.join(", ")}</span>
                      </div>
                    )}
                    {result.linkedInInsights.connections > 0 && (
                      <div>
                        <span className="text-muted-foreground">Connections: </span>
                        <span className="font-semibold">{result.linkedInInsights.connections}+</span>
                      </div>
                    )}
                    {result.linkedInInsights.recentActivity?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Recent Activity: </span>
                        <ul className="mt-1 space-y-1">
                          {result.linkedInInsights.recentActivity.map((activity: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.companyInsights && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Company Insights</h4>
                  <div className="space-y-2 text-sm">
                    {result.companyInsights.products?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Products: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.companyInsights.products.map((product: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.companyInsights.teamSize && (
                      <div>
                        <span className="text-muted-foreground">Team Size: </span>
                        <span className="font-semibold">{result.companyInsights.teamSize}</span>
                      </div>
                    )}
                    {result.companyInsights.hiringSignals?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Hiring Signals: </span>
                        <ul className="mt-1 space-y-1">
                          {result.companyInsights.hiringSignals.map((signal: string, i: number) => (
                            <li key={i} className="text-xs text-green-600 dark:text-green-400">
                              • {signal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.newsInsights && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">News Insights</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Sentiment: </span>
                      <Badge
                        variant={
                          result.newsInsights.sentiment === "positive"
                            ? "default"
                            : result.newsInsights.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {result.newsInsights.sentiment}
                      </Badge>
                    </div>
                    {result.newsInsights.personalizationHooks?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Personalization Hooks: </span>
                        <ul className="mt-1 space-y-1">
                          {result.newsInsights.personalizationHooks.map((hook: string, i: number) => (
                            <li key={i} className="text-xs text-primary">
                              • {hook}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
