"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, PlayCircle } from "lucide-react"

const cronJobs = [
  { name: "Send Emails", path: "/api/cron/send-emails", description: "Process and send scheduled emails" },
  { name: "Sync Replies", path: "/api/cron/sync-replies", description: "Sync incoming email replies" },
  { name: "Process Subsequences", path: "/api/cron/process-subsequences", description: "Send follow-up sequences" },
  { name: "Monitor Performance", path: "/api/cron/monitor-performance", description: "Auto-pause poor campaigns" },
  { name: "Process Warmup Emails", path: "/api/cron/process-warmup-emails", description: "Send warmup emails" },
  { name: "Warmup Progression", path: "/api/cron/warmup-progression", description: "Advance warmup stages" },
]

type TestResult = {
  status: "idle" | "loading" | "success" | "error"
  message?: string
  statusCode?: number
  duration?: number
}

export default function CronTestPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({})

  const testCronJob = async (path: string) => {
    setResults((prev) => ({ ...prev, [path]: { status: "loading" } }))

    const startTime = Date.now()

    try {
      const response = await fetch(path, {
        method: "GET",
      })

      const duration = Date.now() - startTime
      const data = await response.json()

      if (response.ok) {
        setResults((prev) => ({
          ...prev,
          [path]: {
            status: "success",
            statusCode: response.status,
            message: JSON.stringify(data, null, 2),
            duration,
          },
        }))
      } else {
        setResults((prev) => ({
          ...prev,
          [path]: {
            status: "error",
            statusCode: response.status,
            message: data.error || "Request failed",
            duration,
          },
        }))
      }
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [path]: {
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      }))
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cron Job Testing</h1>
        <p className="text-muted-foreground mt-2">
          Test your cron job endpoints to ensure they're working correctly before setting up external scheduling.
        </p>
      </div>

      <div className="grid gap-4">
        {cronJobs.map((job) => {
          const result = results[job.path] || { status: "idle" }

          return (
            <Card key={job.path}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.name}</CardTitle>
                    <CardDescription className="mt-1">{job.description}</CardDescription>
                    <code className="text-xs text-muted-foreground mt-2 block">{job.path}</code>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.status === "success" && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {result.statusCode}
                      </Badge>
                    )}
                    {result.status === "error" && (
                      <Badge variant="outline" className="text-red-600 border-red-600">
                        <XCircle className="w-3 h-3 mr-1" />
                        {result.statusCode || "Error"}
                      </Badge>
                    )}
                    {result.duration && <span className="text-xs text-muted-foreground">{result.duration}ms</span>}
                    <Button size="sm" onClick={() => testCronJob(job.path)} disabled={result.status === "loading"}>
                      {result.status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {result.message && (
                <CardContent>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto max-h-40">{result.message}</pre>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
