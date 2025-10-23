"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Target, Zap, AlertCircle } from "lucide-react"

interface PredictiveInsight {
  metric: string
  prediction: number
  confidence: number
  trend: "up" | "down" | "stable"
  recommendation: string
}

interface CohortData {
  cohort: string
  size: number
  openRate: number
  clickRate: number
  replyRate: number
  conversionRate: number
}

export function AdvancedAnalyticsTab() {
  // Mock data - in production, this would come from the advanced-analytics service
  const predictions: PredictiveInsight[] = [
    {
      metric: "Open Rate",
      prediction: 42.5,
      confidence: 87,
      trend: "up",
      recommendation: "Current subject lines are performing well. Continue A/B testing.",
    },
    {
      metric: "Reply Rate",
      prediction: 8.2,
      confidence: 92,
      trend: "up",
      recommendation: "Personalization tokens are driving engagement. Expand usage.",
    },
    {
      metric: "Bounce Rate",
      prediction: 2.1,
      confidence: 95,
      trend: "down",
      recommendation: "Email validation is working. Maintain current practices.",
    },
  ]

  const cohorts: CohortData[] = [
    {
      cohort: "Tech Executives",
      size: 245,
      openRate: 45.2,
      clickRate: 12.8,
      replyRate: 9.4,
      conversionRate: 4.2,
    },
    {
      cohort: "Marketing Directors",
      size: 189,
      openRate: 38.7,
      clickRate: 10.2,
      replyRate: 7.1,
      conversionRate: 3.1,
    },
    {
      cohort: "Sales Leaders",
      size: 156,
      openRate: 52.3,
      clickRate: 15.6,
      replyRate: 11.2,
      conversionRate: 5.8,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Predictive Insights
          </CardTitle>
          <CardDescription>AI-powered predictions for your next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((insight, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {insight.trend === "up" ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : insight.trend === "down" ? (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  ) : (
                    <Target className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{insight.metric}</h4>
                    <Badge variant="outline">{insight.confidence}% confidence</Badge>
                  </div>
                  <p className="text-2xl font-bold">{insight.prediction}%</p>
                  <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cohort Analysis
          </CardTitle>
          <CardDescription>Performance breakdown by prospect segment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cohorts.map((cohort, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{cohort.cohort}</h4>
                  <Badge variant="secondary">{cohort.size} prospects</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                    <p className="text-lg font-bold">{cohort.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                    <p className="text-lg font-bold">{cohort.clickRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reply Rate</p>
                    <p className="text-lg font-bold">{cohort.replyRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                    <p className="text-lg font-bold text-green-600">{cohort.conversionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Optimization Opportunities
          </CardTitle>
          <CardDescription>Actionable recommendations to improve performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Increase personalization</p>
                <p className="text-sm text-muted-foreground">
                  Emails with 3+ personalization tokens have 2.3x higher reply rates
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Optimal send time detected</p>
                <p className="text-sm text-muted-foreground">
                  Tuesday 10 AM shows 34% higher open rates for your audience
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Subject line length</p>
                <p className="text-sm text-muted-foreground">
                  Shorter subjects (4-7 words) perform 18% better in your campaigns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
