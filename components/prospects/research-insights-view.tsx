"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, TrendingUp, Zap, Target, Lightbulb, Code, Copy, Eye, Download } from "lucide-react"

interface ResearchData {
  companyInfo?: string
  recentNews?: string[]
  painPoints?: string[]
  competitorTools?: string[]
  talkingPoints?: string[]
  qualityScore?: number
  personalizationTokens?: Record<string, string>
  linkedInInsights?: {
    certifications?: string[]
    recentActivity?: string[]
    connections?: number
  }
  companyInsights?: {
    products?: string[]
    pricing?: string
    teamSize?: string
    hiringSignals?: string[]
    techStack?: string[]
  }
  newsInsights?: {
    sentiment?: string
    personalizationHooks?: string[]
  }
}

export function ResearchInsightsView({ data }: { data: ResearchData }) {
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const qualityScore = data.qualityScore || 0
  const scoreColor =
    qualityScore >= 80
      ? "text-green-600 dark:text-green-400"
      : qualityScore >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (showJson) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Research Data (JSON)</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowJson(false)}>
              <Eye className="h-4 w-4 mr-1" />
              Visual View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Research Intelligence</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowJson(true)}>
            <Code className="h-4 w-4 mr-1" />
            JSON View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Quality Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Research Quality Score</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>{qualityScore}/100</p>
              <p className="text-xs text-muted-foreground mt-2">
                {qualityScore >= 80
                  ? "Excellent - Ready for targeted outreach"
                  : qualityScore >= 60
                    ? "Good - Suitable for outreach"
                    : "Fair - Additional research recommended"}
              </p>
            </div>
            <div className="w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted-foreground opacity-20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${(qualityScore / 100) * 283} 283`}
                  className={scoreColor}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
                <text x="50" y="55" textAnchor="middle" className="text-lg font-bold fill-current">
                  {qualityScore}%
                </text>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Overview */}
      {data.companyInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{data.companyInfo}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for detailed insights */}
      <Tabs defaultValue="painpoints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="painpoints">Pain Points</TabsTrigger>
          <TabsTrigger value="news">Recent News</TabsTrigger>
          <TabsTrigger value="talking">Talking Points</TabsTrigger>
          <TabsTrigger value="company">Company Details</TabsTrigger>
        </TabsList>

        {/* Pain Points */}
        <TabsContent value="painpoints" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Identified Pain Points
              </CardTitle>
              <p className="text-sm text-muted-foreground">Common challenges this prospect likely faces</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.painPoints && data.painPoints.length > 0 ? (
                data.painPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{point}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No pain points identified</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent News */}
        <TabsContent value="news" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent News & Developments
              </CardTitle>
              <p className="text-sm text-muted-foreground">Latest updates about the company</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recentNews && data.recentNews.length > 0 ? (
                data.recentNews.map((news, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Badge variant="secondary" className="mt-0.5 flex-shrink-0">
                      News
                    </Badge>
                    <p className="text-sm text-foreground">{news}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No news found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Talking Points */}
        <TabsContent value="talking" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Personalized Talking Points
              </CardTitle>
              <p className="text-sm text-muted-foreground">Use these for your email subject and body</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.talkingPoints && data.talkingPoints.length > 0 ? (
                data.talkingPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors cursor-pointer group"
                    onClick={() => copyToClipboard(point)}
                  >
                    <p className="text-sm text-foreground flex-1">{point}</p>
                    <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No talking points generated</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Details */}
        <TabsContent value="company" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {/* Hiring Signals */}
            {data.companyInsights?.hiringSignals && data.companyInsights.hiringSignals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Hiring Signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {data.companyInsights.hiringSignals.map((signal, idx) => (
                    <p key={idx} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      {signal}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tech Stack */}
            {data.companyInsights?.techStack && data.companyInsights.techStack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1">
                  {data.companyInsights.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* LinkedIn Details */}
            {data.linkedInInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">LinkedIn Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.linkedInInsights.connections && (
                    <p className="text-sm">
                      <span className="font-medium">Connections:</span> {data.linkedInInsights.connections}+
                    </p>
                  )}
                  {data.linkedInInsights.certifications && data.linkedInInsights.certifications.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-1">Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {data.linkedInInsights.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Company Insights */}
            {data.companyInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Company Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.companyInsights.teamSize && (
                    <p className="text-sm">
                      <span className="font-medium">Team Size:</span> {data.companyInsights.teamSize}
                    </p>
                  )}
                  {data.companyInsights.pricing && (
                    <p className="text-sm">
                      <span className="font-medium">Pricing Model:</span> {data.companyInsights.pricing}
                    </p>
                  )}
                  {data.companyInsights.products && data.companyInsights.products.length > 0 && (
                    <div>
                      <p className="font-medium text-sm mb-1">Products:</p>
                      <div className="space-y-1">
                        {data.companyInsights.products.map((product, idx) => (
                          <p key={idx} className="text-xs text-foreground">
                            • {product}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Personalization Tokens for Template Building */}
      {data.personalizationTokens && Object.keys(data.personalizationTokens).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Template Tokens</CardTitle>
            <p className="text-sm text-muted-foreground">Use these in your email templates for personalization</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {Object.entries(data.personalizationTokens).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-muted rounded hover:bg-muted/80 cursor-pointer transition-colors"
                  onClick={() => copyToClipboard(`{{${key}}}`)}
                >
                  <code className="text-xs font-mono">
                    {"{{"} {key} {"}}"}
                  </code>
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
