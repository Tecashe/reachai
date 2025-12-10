"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  Mail,
  MousePointerClick,
  MessageSquare,
  Shield,
  BookOpen,
  Heart,
  Clock,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { WaveLoader } from "../loader/wave-loader"

interface EmailAnalysis {
  predictedOpenRate: number
  predictedClickRate: number
  predictedReplyRate: number
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: Array<{
    category: string
    issue: string
    fix: string
    impact: "high" | "medium" | "low"
  }>
  spamScore: number
  readabilityScore: number
  sentimentScore: number
  estimatedReadTime: number
}

export function EmailPerformancePredictor() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!subject || !body) {
      alert("Please enter both subject and body")
      return
    }

    setAnalyzing(true)

    try {
      const response = await fetch("/api/predict/email-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      alert("Failed to analyze email. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-blue-600 dark:text-blue-400"
    if (score >= 40) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "destructive"
    if (impact === "medium") return "default"
    return "secondary"
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Email Performance Predictor
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Get real-time predictions and suggestions before sending your email
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject Line</label>
            <Input
              placeholder="Enter your email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Body</label>
            <Textarea
              placeholder="Paste your email content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="text-base font-mono"
            />
          </div>

          <Button onClick={handleAnalyze} disabled={analyzing || !subject || !body} className="w-full" size="lg">
            {analyzing ? (
              <>
                {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
                <WaveLoader size="sm" bars={8} gap="tight" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Predict Performance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Overall Score</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {analysis.overallScore >= 80
                        ? "Excellent Email!"
                        : analysis.overallScore >= 60
                          ? "Good Email"
                          : analysis.overallScore >= 40
                            ? "Needs Improvement"
                            : "Major Issues Detected"}
                    </h3>
                    <p className="text-muted-foreground">
                      {analysis.overallScore >= 80
                        ? "This email is highly optimized and ready to send!"
                        : analysis.overallScore >= 60
                          ? "Good foundation, but there's room for improvement."
                          : analysis.overallScore >= 40
                            ? "Significant improvements needed before sending."
                            : "Please revise this email before sending."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predicted Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <Badge variant="outline">Predicted</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">{analysis.predictedOpenRate}%</div>
                    <div className="text-sm text-muted-foreground">Open Rate</div>
                    <Progress value={analysis.predictedOpenRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MousePointerClick className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <Badge variant="outline">Predicted</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">{analysis.predictedClickRate}%</div>
                    <div className="text-sm text-muted-foreground">Click Rate</div>
                    <Progress value={analysis.predictedClickRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <Badge variant="outline">Predicted</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">{analysis.predictedReplyRate}%</div>
                    <div className="text-sm text-muted-foreground">Reply Rate</div>
                    <Progress value={analysis.predictedReplyRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-bold">{analysis.spamScore}%</div>
                      <div className="text-xs text-muted-foreground">Spam Risk</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-bold">{analysis.readabilityScore}</div>
                      <div className="text-xs text-muted-foreground">Readability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-bold">{analysis.sentimentScore}</div>
                      <div className="text-xs text-muted-foreground">Sentiment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-bold">{analysis.estimatedReadTime}m</div>
                      <div className="text-xs text-muted-foreground">Read Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Actionable Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={getImpactColor(suggestion.impact)} className="capitalize">
                            {suggestion.impact} Impact
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm">Issue:</div>
                              <div className="text-sm text-muted-foreground">{suggestion.issue}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm">Fix:</div>
                              <div className="text-sm text-muted-foreground">{suggestion.fix}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="strengths" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      What's Working Well
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{strength}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weaknesses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                      >
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{weakness}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
