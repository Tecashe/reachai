"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AI_MODELS, MODEL_PRESETS, type ModelPreset, type ModelPreferences } from "@/lib/ai-models"
import { Sparkles, Zap, Crown, Settings2 } from "lucide-react"
import { toast } from "sonner"

export function AIModelSettings() {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<ModelPreferences>({
    preset: "balanced",
    ...MODEL_PRESETS.balanced,
  })

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const response = await fetch("/api/settings/ai-models")
      if (response.ok) {
        const data = await response.json()
        if (data.preferences) {
          setPreferences(data.preferences)
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load AI model preferences:", error)
    }
  }

  const savePreferences = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      })

      if (response.ok) {
        toast.success("AI model preferences saved")
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (error) {
      console.error("[v0] Failed to save AI model preferences:", error)
      toast.error("Failed to save preferences")
    } finally {
      setLoading(false)
    }
  }

  const handlePresetChange = (preset: ModelPreset) => {
    if (preset === "custom") {
      setPreferences({ ...preferences, preset })
    } else {
      setPreferences({
        preset,
        ...MODEL_PRESETS[preset],
      })
    }
  }

  const handleModelChange = (task: keyof Omit<ModelPreferences, "preset">, modelId: string) => {
    setPreferences({
      ...preferences,
      preset: "custom",
      [task]: modelId,
    })
  }

  const getPresetIcon = (preset: ModelPreset) => {
    switch (preset) {
      case "budget":
        return <Zap className="h-4 w-4" />
      case "balanced":
        return <Sparkles className="h-4 w-4" />
      case "quality":
        return <Crown className="h-4 w-4" />
      case "custom":
        return <Settings2 className="h-4 w-4" />
    }
  }

  const getPresetDescription = (preset: ModelPreset) => {
    switch (preset) {
      case "budget":
        return "Fastest and most cost-effective models (~50% cheaper)"
      case "balanced":
        return "Optimal mix of speed, quality, and cost (recommended)"
      case "quality":
        return "Highest quality models for best results (~2x cost)"
      case "custom":
        return "Choose specific models for each feature"
    }
  }

//   const estimateMonthlyCost = () => {
//     // Rough estimate based on typical usage
//     const avgResearchTokens = 2000
//     const avgEmailTokens = 1500
//     const avgOptimizationTokens = 3000
//     const avgReplyTokens = 500
//     const avgAnalyticsTokens = 2500

//     const researchModel = AI_MODELS[preferences.research]
//     const emailModel = AI_MODELS[preferences.emailGeneration]
//     const optimizationModel = AI_MODELS[preferences.emailOptimization]
//     const replyModel = AI_MODELS[preferences.replyDetection]
//     const analyticsModel = AI_MODELS[preferences.analytics]

//     // Assume 100 prospects, 200 emails, 50 optimizations, 100 replies, 20 analytics per month
//     const monthlyCost =
//       (avgResearchTokens / 1000) * researchModel.costPer1kTokens * 100 +
//       (avgEmailTokens / 1000) * emailModel.costPer1kTokens * 200 +
//       (avgOptimizationTokens / 1000) * optimizationModel.costPer1kTokens * 50 +
//       (avgReplyTokens / 1000) * replyModel.costPer1kTokens * 100 +
//       (avgAnalyticsTokens / 1000) * analyticsModel.costPer1kTokens * 20

//     return monthlyCost.toFixed(2)
//   }

    const estimateMonthlyCost = () => {
    const avgResearchTokens = 2000
    const avgEmailTokens = 1500
    const avgOptimizationTokens = 3000
    const avgReplyTokens = 500
    const avgAnalyticsTokens = 2500

    // Add safety checks
    const researchModel = AI_MODELS[preferences.research]
    const emailModel = AI_MODELS[preferences.emailGeneration]
    const optimizationModel = AI_MODELS[preferences.emailOptimization]
    const replyModel = AI_MODELS[preferences.replyDetection]
    const analyticsModel = AI_MODELS[preferences.analytics]

    // Return 0 if any model is undefined
    if (!researchModel || !emailModel || !optimizationModel || !replyModel || !analyticsModel) {
        return "0.00"
    }

    const monthlyCost =
        (avgResearchTokens / 1000) * researchModel.costPer1kTokens * 100 +
        (avgEmailTokens / 1000) * emailModel.costPer1kTokens * 200 +
        (avgOptimizationTokens / 1000) * optimizationModel.costPer1kTokens * 50 +
        (avgReplyTokens / 1000) * replyModel.costPer1kTokens * 100 +
        (avgAnalyticsTokens / 1000) * analyticsModel.costPer1kTokens * 20

    return monthlyCost.toFixed(2)
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Selection</CardTitle>
          <CardDescription>
            Choose which AI models to use for different features. Higher quality models cost more but produce better
            results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Selection */}
          <div className="space-y-4">
            <Label>Model Preset</Label>
            <Tabs value={preferences.preset} onValueChange={(v) => handlePresetChange(v as ModelPreset)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="budget" className="flex items-center gap-2">
                  {getPresetIcon("budget")}
                  Budget
                </TabsTrigger>
                <TabsTrigger value="balanced" className="flex items-center gap-2">
                  {getPresetIcon("balanced")}
                  Balanced
                </TabsTrigger>
                <TabsTrigger value="quality" className="flex items-center gap-2">
                  {getPresetIcon("quality")}
                  Quality
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex items-center gap-2">
                  {getPresetIcon("custom")}
                  Custom
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{getPresetDescription(preferences.preset)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Estimated monthly AI cost: <span className="font-semibold">${estimateMonthlyCost()}</span>
                  <span className="text-xs ml-1">(based on typical usage)</span>
                </p>
              </div>
            </Tabs>
          </div>

          {/* Custom Model Selection */}
          {preferences.preset === "custom" && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Custom Model Configuration</h3>

              <div className="grid gap-4">
                {/* Research Model */}
                <div className="space-y-2">
                  <Label>Prospect Research</Label>
                  <Select value={preferences.research} onValueChange={(v) => handleModelChange("research", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AI_MODELS).map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{AI_MODELS[preferences.research]?.description}</p>
                </div>

                {/* Email Generation Model */}
                <div className="space-y-2">
                  <Label>Email Generation</Label>
                  <Select
                    value={preferences.emailGeneration}
                    onValueChange={(v) => handleModelChange("emailGeneration", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AI_MODELS).map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{AI_MODELS[preferences.emailGeneration]?.description}</p>
                  
                </div>

                {/* Email Optimization Model */}
                <div className="space-y-2">
                  <Label>Email Optimization</Label>
                  <Select
                    value={preferences.emailOptimization}
                    onValueChange={(v) => handleModelChange("emailOptimization", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AI_MODELS).map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {AI_MODELS[preferences.emailOptimization]?.description}
                  </p>
                </div>

                {/* Reply Detection Model */}
                <div className="space-y-2">
                  <Label>Reply Detection</Label>
                  <Select
                    value={preferences.replyDetection}
                    onValueChange={(v) => handleModelChange("replyDetection", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AI_MODELS).map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{AI_MODELS[preferences.replyDetection]?.description}</p>
                </div>

                {/* Analytics Model */}
                <div className="space-y-2">
                  <Label>Advanced Analytics</Label>
                  <Select value={preferences.analytics} onValueChange={(v) => handleModelChange("analytics", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AI_MODELS).map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {model.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{AI_MODELS[preferences.analytics]?.description}</p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={savePreferences} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* Model Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
          <CardDescription>Compare different AI models and their capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(AI_MODELS).map((model) => (
              <div key={model.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{model.name}</h4>
                    <Badge variant="outline">{model.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.bestFor.map((use) => (
                      <Badge key={use} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${model.costPer1kTokens.toFixed(5)}</p>
                  <p className="text-xs text-muted-foreground">per 1K tokens</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
