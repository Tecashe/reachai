"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function ApiDocumentationPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground mt-2">Integrate MailFra with your applications using our REST API</p>
      </div>

      {/* Quick Start Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Get started with the MailFra API in minutes</CardDescription>
            </div>
            <Link href="/docs/api-reference" target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Documentation
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <h3 className="font-semibold">Create API Key</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-10">Generate a new API key with the required scopes</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <h3 className="font-semibold">Make Request</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-10">Include your API key in the Authorization header</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <h3 className="font-semibold">Build Features</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-10">Automate campaigns, manage prospects, and more</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Card */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>All API requests require authentication using API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-2">// Include in all requests</div>
            <div className="text-foreground">
              Authorization: Bearer <span className="text-primary">sk_live_xxxxxxxxxxxxxxxx</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Security Best Practices</h4>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Store API keys in environment variables, never in code</li>
              <li>Use different keys for development and production</li>
              <li>Rotate keys every 90 days</li>
              <li>Delete unused keys immediately</li>
              <li>Use scoped keys with minimum required permissions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Example Request Card */}
      <Card>
        <CardHeader>
          <CardTitle>Example Request</CardTitle>
          <CardDescription>Create a new campaign via the API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
            <pre>{`curl -X POST https://mailfra.com/api/campaigns \\
  -H "Authorization: Bearer $MAILFRA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Q2 Outreach Campaign",
    "sequenceId": "seq_123"
  }'`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Common Endpoints Card */}
      <Card>
        <CardHeader>
          <CardTitle>Common Endpoints</CardTitle>
          <CardDescription>Most frequently used API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { method: "GET", path: "/api/campaigns", desc: "List all campaigns" },
              { method: "POST", path: "/api/campaigns", desc: "Create a new campaign" },
              { method: "POST", path: "/api/prospects/upload", desc: "Upload prospects" },
              { method: "POST", path: "/api/sequences/create", desc: "Create email sequence" },
              { method: "POST", path: "/api/generate/email", desc: "Generate AI email" },
              { method: "GET", path: "/api/campaigns/:id/stats", desc: "Get campaign analytics" },
            ].map((endpoint, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="font-mono">
                  {endpoint.method}
                </Badge>
                <code className="flex-1 text-sm">{endpoint.path}</code>
                <span className="text-sm text-muted-foreground">{endpoint.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>API request limits by subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Free Tier</h4>
              <div className="text-3xl font-bold text-muted-foreground">100</div>
              <div className="text-sm text-muted-foreground">requests/hour</div>
            </div>
            <div className="p-4 rounded-lg border border-primary bg-primary/5">
              <h4 className="font-semibold mb-2">Pro Tier</h4>
              <div className="text-3xl font-bold text-primary">1,000</div>
              <div className="text-sm text-muted-foreground">requests/hour</div>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Enterprise</h4>
              <div className="text-3xl font-bold">10,000</div>
              <div className="text-sm text-muted-foreground">requests/hour</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Get support and learn more about the API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <div className="font-semibold">Full Documentation</div>
              <div className="text-sm text-muted-foreground">Complete API reference with examples</div>
            </div>
            <Link href="/docs/API-DOCUMENTATION.md" target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <div className="font-semibold">Support</div>
              <div className="text-sm text-muted-foreground">Get help from our team</div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="mailto:support@mailfra.com">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
