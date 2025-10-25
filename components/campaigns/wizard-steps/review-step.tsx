"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ReviewStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function ReviewStep({ campaign, onNext, onBack }: ReviewStepProps) {
  const [stats, setStats] = useState({
    totalProspects: 0,
    avgQualityScore: 0,
    highQuality: 0,
    mediumQuality: 0,
    lowQuality: 0,
  })

  useEffect(() => {
    // Fetch campaign stats
    fetch(`/api/campaigns/${campaign.id}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
  }, [campaign.id])

  const overallScore = stats.avgQualityScore
  const scoreColor = overallScore >= 80 ? "text-green-600" : overallScore >= 60 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Campaign Quality Score</h3>
          <p className="text-muted-foreground mt-2">Based on personalization, deliverability, and content quality</p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className={`text-6xl font-bold ${scoreColor}`}>{Math.round(overallScore)}</span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>

        <Progress value={overallScore} className="h-3 max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-semibold text-green-900 dark:text-green-100">High Quality</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.highQuality}</div>
          <div className="text-xs text-green-700 dark:text-green-300">Score 80+</div>
        </Card>

        <Card className="p-4 text-center border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-semibold text-yellow-900 dark:text-yellow-100">Medium Quality</span>
          </div>
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumQuality}</div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300">Score 60-79</div>
        </Card>

        <Card className="p-4 text-center border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="font-semibold text-red-900 dark:text-red-100">Low Quality</span>
          </div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.lowQuality}</div>
          <div className="text-xs text-red-700 dark:text-red-300">Score below 60</div>
        </Card>
      </div>

      {overallScore < 70 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">Recommendations</p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 list-disc list-inside">
                <li>Add more personalization using prospect research data</li>
                <li>Remove spam trigger words from your emails</li>
                <li>Ensure each email has a clear, specific call-to-action</li>
                <li>Review low-quality prospects and improve their data</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue to Launch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
