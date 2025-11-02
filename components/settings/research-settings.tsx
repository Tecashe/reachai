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


// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Badge } from "@/components/ui/badge"
// import { Zap, Brain, CheckCircle2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { CREDIT_COSTS } from "@/lib/constants"
// import { updateResearchSettings, getResearchSettings } from "@/lib/actions/settings"

// export function ResearchSettings() {
//   const [scrapingMode, setScrapingMode] = useState<"FAST" | "DEEP">("FAST")
//   const [saving, setSaving] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     const loadSettings = async () => {
//       try {
//         const settings = await getResearchSettings()
//         setScrapingMode(settings.scrapingMode)
//       } catch (error) {
//         console.error("[v0] Failed to load research settings:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadSettings()
//   }, [])

//   const handleSave = async () => {
//     setSaving(true)
//     try {
//       await updateResearchSettings(scrapingMode)

//       toast({
//         title: "Settings saved",
//         description: "Your research preferences have been updated.",
//       })
//     } catch (error) {
//       console.error("[v0] Failed to save research settings:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save settings. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>AI Research Mode</CardTitle>
//           <CardDescription>Loading your preferences...</CardDescription>
//         </CardHeader>
//       </Card>
//     )
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CREDIT_COSTS } from "@/lib/constants"
import { updateResearchSettings, getResearchSettings } from "@/lib/actions/settings"

export function PremiumResearchSettings() {
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
        title: "⚡ Settings saved",
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-foreground/80">Loading your preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float-delayed" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              AI Research Mode
            </h1>
          </div>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Choose your research depth. Fast mode for volume, Deep mode for precision. Both powered by cutting-edge AI.
          </p>
        </div>

        {/* Mode Selection */}
        <RadioGroup value={scrapingMode} onValueChange={(value: any) => setScrapingMode(value)}>
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            {/* Fast Mode Card */}
            <div
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer flex-1 ${
                scrapingMode === "FAST"
                  ? "ring-2 ring-primary/50 bg-gradient-to-br from-card via-card to-card/50"
                  : "bg-card/50 hover:bg-card/80 hover:ring-1 hover:ring-primary/30"
              }`}
            >
              {scrapingMode === "FAST" && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative p-6 md:p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-amber-500/30 rounded-lg blur-lg" />
                      <RadioGroupItem value="FAST" id="fast" className="mt-1 relative" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                          <span className="font-semibold text-sm text-amber-400">Lightning Speed</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0">
                          {CREDIT_COSTS.RESEARCH_FAST} credit/prospect
                        </Badge>
                      </div>

                      <Label htmlFor="fast" className="cursor-pointer">
                        <h3 className="text-xl font-bold text-foreground mb-2">Fast Mode</h3>
                        <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                          Quick research using multiple data sources. Perfect for high-volume prospecting.
                        </p>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 ml-10 flex-1">
                  {[
                    "Company website & LinkedIn data",
                    "Recent news & technology stack",
                    "AI-generated talking points",
                    "Speed: ~5-10 seconds",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-xs text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deep Mode Card */}
            <div
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer flex-1 ${
                scrapingMode === "DEEP"
                  ? "ring-2 ring-primary/50 bg-gradient-to-br from-card via-card to-card/50"
                  : "bg-card/50 hover:bg-card/80 hover:ring-1 hover:ring-primary/30"
              }`}
            >
              {scrapingMode === "DEEP" && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative p-6 md:p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-lg blur-lg" />
                      <RadioGroupItem value="DEEP" id="deep" className="mt-1 relative" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                          <span className="font-semibold text-sm text-primary">Advanced AI</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                          {CREDIT_COSTS.RESEARCH_DEEP} credits/prospect
                        </Badge>
                      </div>

                      <Label htmlFor="deep" className="cursor-pointer">
                        <h3 className="text-xl font-bold text-foreground mb-2">Deep Mode</h3>
                        <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                          Comprehensive research with advanced AI extraction. Best for high-value prospects.
                        </p>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Features List with Enhanced Styling */}
                <div className="space-y-2 ml-10 flex-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-xs text-foreground/80">Everything in Fast Mode, plus:</span>
                  </div>
                  {[
                    "Products, pricing & team insights",
                    "Hiring signals & growth indicators",
                    "News sentiment & personalization hooks",
                    "Speed: ~30-60 seconds",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-xs text-primary/90 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="group relative px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full bg-primary-foreground/80" />
                  Save Preferences
                </>
              )}
            </span>
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  )
}
