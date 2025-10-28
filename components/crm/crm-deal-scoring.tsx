"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const scoringFactors = [
  {
    name: "Engagement Level",
    score: 92,
    weight: 30,
    trend: "up",
    description: "Email opens, clicks, and reply rate",
  },
  {
    name: "Company Fit",
    score: 88,
    weight: 25,
    trend: "up",
    description: "Industry, size, and revenue match",
  },
  {
    name: "Buying Signals",
    score: 76,
    weight: 20,
    trend: "neutral",
    description: "Recent funding, hiring, and news",
  },
  {
    name: "Decision Maker Access",
    score: 85,
    weight: 15,
    trend: "up",
    description: "Contact level and influence",
  },
  {
    name: "Timeline Urgency",
    score: 65,
    weight: 10,
    trend: "down",
    description: "Expressed need and timeline",
  },
]

export function CrmDealScoring() {
  const overallScore = Math.round(scoringFactors.reduce((acc, factor) => acc + (factor.score * factor.weight) / 100, 0))

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <CardTitle>AI Deal Score</CardTitle>
          <CardDescription>Predictive scoring based on engagement, fit, and buying signals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-5xl font-bold">{overallScore}</div>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
            <Badge variant="default" className="bg-green-500 text-lg px-4 py-2">
              <TrendingUp className="h-5 w-5 mr-2" />
              High Probability
            </Badge>
          </div>
          <Progress value={overallScore} className="h-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring Breakdown</CardTitle>
          <CardDescription>How we calculate the AI deal score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {scoringFactors.map((factor) => (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{factor.name}</span>
                    {factor.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {factor.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {factor.trend === "neutral" && <Minus className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{factor.weight}% weight</span>
                    <Badge variant="outline">{factor.score}</Badge>
                  </div>
                </div>
                <Progress value={factor.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>AI-powered next steps to increase deal probability</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Schedule a demo call</p>
                <p className="text-sm text-muted-foreground">High engagement suggests they're ready for next step</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
              <div>
                <p className="font-medium">Create urgency with timeline</p>
                <p className="text-sm text-muted-foreground">
                  Timeline urgency score is low - emphasize time-sensitive value
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="font-medium">Share relevant case study</p>
                <p className="text-sm text-muted-foreground">Company fit is strong - show similar success stories</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
