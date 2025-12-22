"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, TrendingUp, Zap, CheckCircle2 } from "lucide-react"

export default function ApiAnalyticsPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [selectedKeyId, setSelectedKeyId] = useState<string>("")
  const [analytics, setAnalytics] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("30")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadApiKeys()
  }, [])

  useEffect(() => {
    if (selectedKeyId) {
      loadAnalytics()
    }
  }, [selectedKeyId, timeRange])

  async function loadApiKeys() {
    try {
      const res = await fetch("/api/settings/api-keys")
      const data = await res.json()
      if (data.keys) {
        setApiKeys(data.keys)
        if (data.keys.length > 0) {
          setSelectedKeyId(data.keys[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to load API keys:", error)
    }
  }

  async function loadAnalytics() {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/api-keys/${selectedKeyId}/analytics?days=${timeRange}`)
      const data = await res.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Analytics</h1>
          <p className="text-muted-foreground">Monitor your API usage and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedKeyId} onValueChange={setSelectedKeyId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select API Key" />
            </SelectTrigger>
            <SelectContent>
              {apiKeys.map((key) => (
                <SelectItem key={key.id} value={key.id}>
                  {key.name} ({key.keyPrefix})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading analytics...</div>
      ) : analytics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.successRate}%</div>
                <Badge
                  variant={Number.parseFloat(analytics.successRate) > 95 ? "default" : "destructive"}
                  className="mt-1"
                >
                  {Number.parseFloat(analytics.successRate) > 95 ? "Healthy" : "Needs Attention"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(analytics.avgResponseTime)}ms</div>
                <p className="text-xs text-muted-foreground">Per request</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Top Endpoint</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold truncate">
                  {analytics.requestsByEndpoint[0]?.endpoint || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">{analytics.requestsByEndpoint[0]?.count || 0} requests</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Requests Over Time</CardTitle>
                <CardDescription>Daily request volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.requestsByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
                <CardDescription>Most frequently accessed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.requestsByEndpoint.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status Code Distribution</CardTitle>
              <CardDescription>Response status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.requestsByStatus.map((status: any) => {
                  const percentage = (status.count / analytics.totalRequests) * 100
                  const isSuccess = status.statusCode >= 200 && status.statusCode < 300
                  const isError = status.statusCode >= 400

                  return (
                    <div key={status.statusCode} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={isSuccess ? "default" : isError ? "destructive" : "secondary"}>
                          {status.statusCode}
                        </Badge>
                        <span className="text-sm">{status.count.toLocaleString()} requests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isSuccess ? "bg-green-500" : isError ? "bg-red-500" : "bg-yellow-500"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">Select an API key to view analytics</div>
      )}
    </div>
  )
}
