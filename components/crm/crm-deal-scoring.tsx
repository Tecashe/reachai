

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target,
  MessageSquare,
  Building2,
  Signal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from "lucide-react"

interface ScoreBreakdown {
  prospect: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    company: string | null
    dealScore: number | null
  }
  breakdown: {
    engagement: { score: number; max: number; factors: Array<{ name: string; value: string; impact: string }> }
    profile: { score: number; max: number; factors: Array<{ name: string; value: string; impact: string }> }
    activity: { score: number; max: number; factors: Array<{ name: string; value: string; impact: string }> }
    timing: { score: number; max: number; factors: Array<{ name: string; value: string; impact: string }> }
  }
  totalScore: number
  recommendation: string
}

const scoringFactorMeta = {
  engagement: {
    name: "Engagement Level",
    icon: MessageSquare,
    weight: 30,
    description: "Email opens, clicks, and reply rate",
  },
  profile: { name: "Company Fit", icon: Building2, weight: 25, description: "Company and title completeness" },
  activity: { name: "Activity Level", icon: Signal, weight: 25, description: "Email interactions and status" },
  timing: { name: "Recency", icon: Clock, weight: 20, description: "How recently they engaged" },
}

const defaultRecommendations = [
  {
    priority: "high",
    title: "Connect your CRM",
    description: "Import leads to see AI-powered scoring",
    icon: CheckCircle2,
  },
  {
    priority: "medium",
    title: "Sync contacts",
    description: "Use the sync button to pull latest data",
    icon: AlertCircle,
  },
  { priority: "info", title: "Review hot leads", description: "Focus on leads with scores above 70", icon: Lightbulb },
]

export function CrmDealScoring() {
  const [loading, setLoading] = useState(true)
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null)
  const [scoreData, setScoreData] = useState<ScoreBreakdown | null>(null)
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch("/api/crm/deals?limit=1")
        const result = await response.json()

        if (result.success && result.data && result.data.length > 0) {
          const topDeal = result.data[0]
          setSelectedProspectId(topDeal.id)
          setOverallScore(topDeal.dealScore || 0)
        }
      } catch (error) {
        console.error("[Deal Scoring] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    async function loadBreakdown() {
      if (!selectedProspectId) return

      try {
        const response = await fetch(`/api/crm/scoring?prospectId=${selectedProspectId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setScoreData(result.data)
          setOverallScore(result.data.totalScore)
        }
      } catch (error) {
        console.error("[Deal Scoring] Error loading breakdown:", error)
      }
    }

    loadBreakdown()
  }, [selectedProspectId])

  const scoringFactors = scoreData
    ? Object.entries(scoreData.breakdown).map(([key, value]) => {
        const meta = scoringFactorMeta[key as keyof typeof scoringFactorMeta]
        const avgImpact = value.factors.reduce((acc, f) => {
          if (f.impact === "positive") return acc + 1
          if (f.impact === "negative") return acc - 1
          return acc
        }, 0)

        return {
          key,
          name: meta.name,
          icon: meta.icon,
          weight: meta.weight,
          description: meta.description,
          score: Math.round((value.score / value.max) * 100),
          trend: avgImpact > 0 ? "up" : avgImpact < 0 ? "down" : "neutral",
        }
      })
    : []

  const recommendations = scoreData
    ? [
        {
          priority: "high",
          title: scoreData.recommendation.split(" - ")[0] || "Take action",
          description: scoreData.recommendation.split(" - ")[1] || scoreData.recommendation,
          icon: CheckCircle2,
        },
        {
          priority: "medium",
          title: "Review engagement",
          description: "Check email open and click rates",
          icon: AlertCircle,
        },
        {
          priority: "info",
          title: "Complete profile",
          description: "Ensure company and title are filled",
          icon: Lightbulb,
        },
      ]
    : defaultRecommendations

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48 lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Score Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 rounded-full blur-3xl" />

          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-foreground/70" />
              <CardTitle>AI Deal Score</CardTitle>
            </div>
            <CardDescription>
              {scoreData
                ? `Scoring for ${scoreData.prospect.firstName || ""} ${scoreData.prospect.lastName || scoreData.prospect.email}`
                : "Predictive scoring based on engagement, fit, and buying signals"}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative">
                  <motion.div
                    className="text-7xl font-bold"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {overallScore}
                  </motion.div>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                </div>
              </div>
              <Badge
                className={`text-base px-4 py-2 ${
                  overallScore >= 70
                    ? "bg-foreground/10 text-foreground border-foreground/20"
                    : overallScore >= 40
                      ? "bg-foreground/10 text-foreground border-foreground/20"
                      : "bg-foreground/5 text-muted-foreground border-foreground/10"
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                {overallScore >= 70
                  ? "High Probability"
                  : overallScore >= 40
                    ? "Medium Probability"
                    : "Low Probability"}
              </Badge>
            </div>

            <div className="relative h-4 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-foreground/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="h-full bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-foreground/70" />
              Next Steps
            </CardTitle>
            <CardDescription>AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/30"
                >
                  <rec.icon className="w-5 h-5 mt-0.5 text-foreground/70" />
                  <div>
                    <p className="font-medium text-sm">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scoring Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-3"
      >
        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Scoring Breakdown</CardTitle>
            <CardDescription>How we calculate the AI deal score</CardDescription>
          </CardHeader>
          <CardContent>
            {scoringFactors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select a lead to see their scoring breakdown</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {scoringFactors.map((factor, index) => {
                  const FactorIcon = factor.icon
                  return (
                    <motion.div
                      key={factor.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="group p-4 rounded-xl bg-background/50 border border-border/30 hover:border-border/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-foreground/5">
                            <FactorIcon className="w-4 h-4 text-foreground/70" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{factor.name}</p>
                            <p className="text-xs text-muted-foreground">{factor.weight}% weight</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {factor.trend === "up" && <TrendingUp className="h-4 w-4 text-foreground/70" />}
                          {factor.trend === "down" && <TrendingDown className="h-4 w-4 text-foreground/50" />}
                          {factor.trend === "neutral" && <Minus className="h-4 w-4 text-foreground/50" />}
                          <Badge variant="secondary" className="font-semibold">
                            {factor.score}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={factor.score} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">{factor.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
