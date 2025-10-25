// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Badge } from "@/components/ui/badge"
// import { Zap, Brain, CheckCircle2, AlertCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"

// export function ResearchSettings() {
//   const [scrapingMode, setScrapingMode] = useState<"FAST" | "DEEP">("FAST")
//   const [saving, setSaving] = useState(false)
//   const { toast } = useToast()

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       // Save to user preferences
//       await fetch("/api/settings/research", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scrapingMode }),
//       })

//       toast({
//         title: "Settings saved",
//         description: "Your research preferences have been updated.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save settings. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const isPythonScraperAvailable = typeof window !== "undefined" && process.env.NEXT_PUBLIC_PYTHON_SCRAPER_URL

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>AI Research Mode</CardTitle>
//           <CardDescription>
//             Choose how deeply AI should research your prospects. Deep mode provides richer insights but takes longer.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <RadioGroup value={scrapingMode} onValueChange={(value: any) => setScrapingMode(value)}>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
//                 <RadioGroupItem value="FAST" id="fast" className="mt-1" />
//                 <div className="flex-1">
//                   <Label htmlFor="fast" className="cursor-pointer">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                       <span className="font-semibold">Fast Mode (Recommended)</span>
//                       <Badge variant="secondary">API-based</Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       Uses third-party APIs (Firecrawl, Apify, NewsAPI) for quick data gathering. Best for high-volume
//                       research where speed matters.
//                     </p>
//                     <div className="mt-3 space-y-1">
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Company website scraping</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>LinkedIn profile data</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Recent news articles</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Technology detection</span>
//                       </div>
//                     </div>
//                     <div className="mt-3 flex items-center gap-4 text-xs">
//                       <span className="text-muted-foreground">Speed: ~5-10 seconds</span>
//                       <span className="text-muted-foreground">Cost: Low</span>
//                     </div>
//                   </Label>
//                 </div>
//               </div>

//               <div
//                 className={`flex items-start space-x-3 rounded-lg border p-4 ${
//                   isPythonScraperAvailable
//                     ? "cursor-pointer hover:bg-muted/50 transition-colors"
//                     : "opacity-50 cursor-not-allowed"
//                 }`}
//               >
//                 <RadioGroupItem value="DEEP" id="deep" disabled={!isPythonScraperAvailable} className="mt-1" />
//                 <div className="flex-1">
//                   <Label htmlFor="deep" className={isPythonScraperAvailable ? "cursor-pointer" : "cursor-not-allowed"}>
//                     <div className="flex items-center gap-2 mb-1">
//                       <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                       <span className="font-semibold">Deep Mode (Advanced)</span>
//                       <Badge variant="default">Python + AI</Badge>
//                       {!isPythonScraperAvailable && (
//                         <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
//                           Setup Required
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       Uses advanced Python scraper with Playwright for JavaScript rendering and AI-powered extraction.
//                       Provides deeper insights and more data points.
//                     </p>
//                     <div className="mt-3 space-y-1">
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Everything in Fast Mode, plus:</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>Products and pricing information</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>Team size and hiring signals</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>LinkedIn certifications and activity</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>News sentiment analysis</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>AI-powered personalization hooks</span>
//                       </div>
//                     </div>
//                     <div className="mt-3 flex items-center gap-4 text-xs">
//                       <span className="text-muted-foreground">Speed: ~30-60 seconds</span>
//                       <span className="text-muted-foreground">Cost: Medium</span>
//                     </div>
//                   </Label>
//                 </div>
//               </div>
//             </div>
//           </RadioGroup>

//           {!isPythonScraperAvailable && (
//             <div className="flex items-start gap-3 rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 p-4">
//               <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
//                   Python Scraper Not Configured
//                 </p>
//                 <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
//                   To enable Deep Mode, you need to set up the Python scraper service. Follow the instructions in{" "}
//                   <code className="bg-orange-100 dark:bg-orange-900 px-1 py-0.5 rounded">PYTHON_SCRAPER_SETUP.md</code>{" "}
//                   to deploy the scraper service and add the <code>PYTHON_SCRAPER_URL</code> environment variable.
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end">
//             <Button onClick={handleSave} disabled={saving}>
//               {saving ? "Saving..." : "Save Preferences"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Research Credits</CardTitle>
//           <CardDescription>Monitor your AI research usage and credits.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Fast Mode Research</span>
//               <span className="text-sm font-semibold">1 credit per prospect</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-muted-foreground">Deep Mode Research</span>
//               <span className="text-sm font-semibold">3 credits per prospect</span>
//             </div>
//             <div className="pt-4 border-t">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Available Credits</span>
//                 <span className="text-2xl font-bold text-primary">Unlimited</span>
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Your current plan includes unlimited research credits
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Badge } from "@/components/ui/badge"
// import { Zap, Brain, CheckCircle2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { CREDIT_COSTS } from "@/lib/constants"

// export function ResearchSettings() {
//   const [scrapingMode, setScrapingMode] = useState<"FAST" | "DEEP">("FAST")
//   const [saving, setSaving] = useState(false)
//   const { toast } = useToast()

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       await fetch("/api/settings/research", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ scrapingMode }),
//       })

//       toast({
//         title: "Settings saved",
//         description: "Your research preferences have been updated.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save settings. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>AI Research Mode</CardTitle>
//           <CardDescription>
//             Choose how deeply AI should research your prospects. Deep mode provides richer insights but uses more
//             credits.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <RadioGroup value={scrapingMode} onValueChange={(value: any) => setScrapingMode(value)}>
//             <div className="space-y-4">
//               <div className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
//                 <RadioGroupItem value="FAST" id="fast" className="mt-1" />
//                 <div className="flex-1">
//                   <Label htmlFor="fast" className="cursor-pointer">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                       <span className="font-semibold">Fast Mode</span>
//                       <Badge variant="secondary">{CREDIT_COSTS.RESEARCH_FAST} credit/prospect</Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       Quick research using multiple data sources. Perfect for high-volume prospecting.
//                     </p>
//                     <div className="mt-3 space-y-1">
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Company website & LinkedIn data</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Recent news & technology stack</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>AI-generated talking points</span>
//                       </div>
//                     </div>
//                     <div className="mt-3 flex items-center gap-4 text-xs">
//                       <span className="text-muted-foreground">Speed: ~5-10 seconds</span>
//                     </div>
//                   </Label>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
//                 <RadioGroupItem value="DEEP" id="deep" className="mt-1" />
//                 <div className="flex-1">
//                   <Label htmlFor="deep" className="cursor-pointer">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                       <span className="font-semibold">Deep Mode</span>
//                       <Badge variant="default">{CREDIT_COSTS.RESEARCH_DEEP} credits/prospect</Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground leading-relaxed">
//                       Comprehensive research with advanced AI extraction. Best for high-value prospects.
//                     </p>
//                     <div className="mt-3 space-y-1">
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
//                         <span>Everything in Fast Mode, plus:</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>Products, pricing & team insights</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>Hiring signals & growth indicators</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
//                         <CheckCircle2 className="h-3 w-3" />
//                         <span>News sentiment & personalization hooks</span>
//                       </div>
//                     </div>
//                     <div className="mt-3 flex items-center gap-4 text-xs">
//                       <span className="text-muted-foreground">Speed: ~30-60 seconds</span>
//                     </div>
//                   </Label>
//                 </div>
//               </div>
//             </div>
//           </RadioGroup>

//           <div className="flex justify-end">
//             <Button onClick={handleSave} disabled={saving}>
//               {saving ? "Saving..." : "Save Preferences"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CREDIT_COSTS } from "@/lib/constants"
import { updateResearchSettings, getResearchSettings } from "@/lib/actions/settings"

export function ResearchSettings() {
  const [scrapingMode, setScrapingMode] = useState<"FAST" | "DEEP">("FAST")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getResearchSettings()
        setScrapingMode(settings.scrapingMode)
      } catch (error) {
        console.error("[v0] Failed to load research settings:", error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateResearchSettings(scrapingMode)

      toast({
        title: "Settings saved",
        description: "Your research preferences have been updated.",
      })
    } catch (error) {
      console.error("[v0] Failed to save research settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Research Mode</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Research Mode</CardTitle>
          <CardDescription>
            Choose how deeply AI should research your prospects. Deep mode provides richer insights but uses more
            credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={scrapingMode} onValueChange={(value: any) => setScrapingMode(value)}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="FAST" id="fast" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="fast" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-semibold">Fast Mode</span>
                      <Badge variant="secondary">{CREDIT_COSTS.RESEARCH_FAST} credit/prospect</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Quick research using multiple data sources. Perfect for high-volume prospecting.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span>Company website & LinkedIn data</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span>Recent news & technology stack</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span>AI-generated talking points</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">Speed: ~5-10 seconds</span>
                    </div>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="DEEP" id="deep" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="deep" className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold">Deep Mode</span>
                      <Badge variant="default">{CREDIT_COSTS.RESEARCH_DEEP} credits/prospect</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Comprehensive research with advanced AI extraction. Best for high-value prospects.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span>Everything in Fast Mode, plus:</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Products, pricing & team insights</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Hiring signals & growth indicators</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>News sentiment & personalization hooks</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">Speed: ~30-60 seconds</span>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
