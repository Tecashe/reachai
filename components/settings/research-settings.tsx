
"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, CheckCircle2, Gauge } from "lucide-react"
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
        console.error("[builtbycashe] Failed to load research settings:", error)
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
      console.error("[builtbycashe] Failed to save research settings:", error)
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
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Research Mode</h2>
        <p className="text-muted-foreground">
          Select your preferred AI research depth. Choose between speed and comprehensive insights.
        </p>
      </div>

      <RadioGroup value={scrapingMode} onValueChange={(value: any) => setScrapingMode(value)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fast Mode Card */}
          <div
            className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
              scrapingMode === "FAST"
                ? "border-yellow-500/50 bg-yellow-50/30 dark:bg-yellow-950/20"
                : "border-border hover:border-yellow-300/30"
            }`}
          >
            <div className="p-6 space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="fast" className="text-base font-semibold cursor-pointer block">
                      Fast Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">Quick and efficient research</p>
                  </div>
                </div>
                <RadioGroupItem value="FAST" id="fast" className="mt-1" />
              </div>

              {/* Cost Section */}
              <div className="space-y-2 py-4 border-y border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cost per prospect</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {CREDIT_COSTS.RESEARCH_FAST}
                  </span>
                  <span className="text-sm text-muted-foreground">credit</span>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">What you get</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Company website & LinkedIn data</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Recent news & tech stack</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">AI-generated talking points</span>
                  </div>
                </div>
              </div>

              {/* Speed Section */}
              <div className="flex items-center gap-2 pt-2 px-3 py-2 bg-muted/40 rounded-lg">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">~5-10 seconds per prospect</span>
              </div>
            </div>
          </div>

          {/* Deep Mode Card */}
          <div
            className={`relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
              scrapingMode === "DEEP"
                ? "border-purple-500/50 bg-purple-50/30 dark:bg-purple-950/20"
                : "border-border hover:border-purple-300/30"
            }`}
          >
            <div className="p-6 space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="deep" className="text-base font-semibold cursor-pointer">
                        Deep Mode
                      </Label>
                      <Badge className="bg-purple-600 hover:bg-purple-700 text-xs">Advanced</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Comprehensive intelligence</p>
                  </div>
                </div>
                <RadioGroupItem value="DEEP" id="deep" className="mt-1" />
              </div>

              {/* Cost Section */}
              <div className="space-y-2 py-4 border-y border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cost per prospect</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {CREDIT_COSTS.RESEARCH_DEEP}
                  </span>
                  <span className="text-sm text-muted-foreground">credits</span>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Everything in Fast Mode, plus
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Products, pricing & team insights</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">Hiring signals & growth indicators</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">News sentiment & personalization hooks</span>
                  </div>
                </div>
              </div>

              {/* Speed Section */}
              <div className="flex items-center gap-2 pt-2 px-3 py-2 bg-muted/40 rounded-lg">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">~30-60 seconds per prospect</span>
              </div>
            </div>
          </div>
        </div>
      </RadioGroup>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={saving} size="lg" className="font-medium">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
