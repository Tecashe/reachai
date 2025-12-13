"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Eye, MousePointerClick, Mail, Star, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EmailTemplate } from "@prisma/client"

interface TemplateWithStats extends EmailTemplate {
  user?: { name: string | null } | null
}

interface TemplateAnalyticsDashboardProps {
  templates: TemplateWithStats[]
}

export function TemplateAnalyticsDashboard({ templates }: TemplateAnalyticsDashboardProps) {
  // Calculate overall stats
  const totalTemplates = templates.length
  const userTemplates = templates.filter((t) => !t.isSystemTemplate).length
  const favoriteTemplates = templates.filter((t) => t.isFavorite).length
  const totalUsage = templates.reduce((sum, t) => sum + (t.timesUsed || 0), 0)

  const avgOpenRate =
    templates.filter((t) => t.avgOpenRate).reduce((sum, t) => sum + (t.avgOpenRate || 0), 0) /
      templates.filter((t) => t.avgOpenRate).length || 0

  const avgReplyRate =
    templates.filter((t) => t.avgReplyRate).reduce((sum, t) => sum + (t.avgReplyRate || 0), 0) /
      templates.filter((t) => t.avgReplyRate).length || 0

  // Top performing templates
  const topByUsage = [...templates].sort((a, b) => (b.timesUsed || 0) - (a.timesUsed || 0)).slice(0, 5)

  const topByOpenRate = [...templates]
    .filter((t) => t.avgOpenRate && t.avgOpenRate > 0)
    .sort((a, b) => (b.avgOpenRate || 0) - (a.avgOpenRate || 0))
    .slice(0, 5)

  const topByReplyRate = [...templates]
    .filter((t) => t.avgReplyRate && t.avgReplyRate > 0)
    .sort((a, b) => (b.avgReplyRate || 0) - (a.avgReplyRate || 0))
    .slice(0, 5)

  // Category breakdown
  const categoryStats = templates.reduce(
    (acc, template) => {
      const category = template.category || "Uncategorized"
      if (!acc[category]) {
        acc[category] = { count: 0, usage: 0, avgOpen: 0, avgReply: 0, templates: [] }
      }
      acc[category].count++
      acc[category].usage += template.timesUsed || 0
      acc[category].templates.push(template)
      return acc
    },
    {} as Record<string, { count: number; usage: number; avgOpen: number; avgReply: number; templates: any[] }>,
  )

  // Calculate averages for categories
  Object.keys(categoryStats).forEach((cat) => {
    const temps = categoryStats[cat].templates
    categoryStats[cat].avgOpen =
      temps.filter((t) => t.avgOpenRate).reduce((sum, t) => sum + (t.avgOpenRate || 0), 0) /
        temps.filter((t) => t.avgOpenRate).length || 0
    categoryStats[cat].avgReply =
      temps.filter((t) => t.avgReplyRate).reduce((sum, t) => sum + (t.avgReplyRate || 0), 0) /
        temps.filter((t) => t.avgReplyRate).length || 0
  })

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">{userTemplates} custom templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {avgOpenRate > 30 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Above average
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Room for improvement
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reply Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgReplyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {avgReplyRate > 5 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Excellent performance
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Room for improvement
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Tabs defaultValue="usage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usage">Most Used</TabsTrigger>
          <TabsTrigger value="opens">Best Open Rate</TabsTrigger>
          <TabsTrigger value="replies">Best Reply Rate</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Used Templates</CardTitle>
              <CardDescription>Your go-to templates for outreach campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topByUsage.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No usage data available yet</p>
                ) : (
                  topByUsage.map((template, index) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{template.name}</p>
                            {template.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{template.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{template.timesUsed}x</p>
                          <p className="text-xs text-muted-foreground">uses</p>
                        </div>
                        {template.avgOpenRate && (
                          <Badge variant="outline">{template.avgOpenRate.toFixed(1)}% opens</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Highest Open Rates</CardTitle>
              <CardDescription>Templates that get the most engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topByOpenRate.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No open rate data available yet</p>
                ) : (
                  topByOpenRate.map((template, index) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm",
                            index === 0
                              ? "bg-yellow-500/10 text-yellow-600"
                              : index === 1
                                ? "bg-gray-500/10 text-gray-600"
                                : "bg-orange-500/10 text-orange-600",
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{template.name}</p>
                            {template.category && (
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{template.timesUsed} uses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{template.avgOpenRate?.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">open rate</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="replies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Highest Reply Rates</CardTitle>
              <CardDescription>Templates that generate the most responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topByReplyRate.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No reply rate data available yet</p>
                ) : (
                  topByReplyRate.map((template, index) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm",
                            index === 0
                              ? "bg-yellow-500/10 text-yellow-600"
                              : index === 1
                                ? "bg-gray-500/10 text-gray-600"
                                : "bg-orange-500/10 text-orange-600",
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{template.name}</p>
                            {template.category && (
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{template.timesUsed} uses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">{template.avgReplyRate?.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">reply rate</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
              <CardDescription>Compare template categories and their effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.keys(categoryStats).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No category data available</p>
                ) : (
                  Object.entries(categoryStats)
                    .sort(([, a], [, b]) => b.usage - a.usage)
                    .map(([category, stats]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{category}</h4>
                          <Badge variant="outline">{stats.count} templates</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Total Uses</p>
                            <p className="font-medium text-lg">{stats.usage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Avg Open Rate</p>
                            <p className="font-medium text-lg">
                              {stats.avgOpen > 0 ? `${stats.avgOpen.toFixed(1)}%` : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Avg Reply Rate</p>
                            <p className="font-medium text-lg">
                              {stats.avgReply > 0 ? `${stats.avgReply.toFixed(1)}%` : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
