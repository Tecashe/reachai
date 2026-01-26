"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ExternalLink,
  Copy,
  Check,
  Key,
  Shield,
  Gauge,
  Code2,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getApiKeys } from "@/lib/actions/api-keys"

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mailfra.com"

const ENDPOINTS = [
  // Campaigns
  { method: "GET", path: "/api/v1/campaigns", desc: "List all campaigns", scope: "campaigns:read" },
  { method: "POST", path: "/api/v1/campaigns", desc: "Create a new campaign", scope: "campaigns:write" },
  { method: "GET", path: "/api/v1/campaigns/:id", desc: "Get campaign details", scope: "campaigns:read" },
  { method: "PUT", path: "/api/v1/campaigns/:id", desc: "Update a campaign", scope: "campaigns:write" },
  // Prospects
  { method: "GET", path: "/api/v1/prospects", desc: "List all prospects", scope: "prospects:read" },
  { method: "POST", path: "/api/v1/prospects", desc: "Create a prospect", scope: "prospects:write" },
  { method: "POST", path: "/api/v1/prospects/bulk", desc: "Bulk import prospects", scope: "prospects:write" },
  { method: "GET", path: "/api/v1/prospects/:id", desc: "Get prospect details", scope: "prospects:read" },
  // Sequences
  { method: "GET", path: "/api/v1/sequences", desc: "List all sequences", scope: "sequences:read" },
  { method: "POST", path: "/api/v1/sequences", desc: "Create a sequence", scope: "sequences:write" },
  // Templates
  { method: "GET", path: "/api/v1/templates", desc: "List email templates", scope: "templates:read" },
  { method: "POST", path: "/api/v1/templates", desc: "Create a template", scope: "templates:write" },
  // AI
  { method: "POST", path: "/api/v1/ai/generate", desc: "Generate AI email", scope: "ai:write" },
  { method: "POST", path: "/api/v1/ai/research", desc: "Research a prospect", scope: "ai:write" },
  // Analytics
  { method: "GET", path: "/api/v1/analytics", desc: "Get analytics overview", scope: "analytics:read" },
  // Webhooks
  { method: "GET", path: "/api/v1/webhooks", desc: "List webhooks", scope: "webhooks:read" },
  { method: "POST", path: "/api/v1/webhooks", desc: "Create a webhook", scope: "webhooks:write" },
  // Sending Accounts
  { method: "GET", path: "/api/v1/sending-accounts", desc: "List sending accounts", scope: "accounts:read" },
]

const ERROR_CODES = [
  { code: 400, name: "Bad Request", desc: "Invalid request body or parameters" },
  { code: 401, name: "Unauthorized", desc: "Missing or invalid API key" },
  { code: 403, name: "Forbidden", desc: "API key lacks required scope or is inactive" },
  { code: 404, name: "Not Found", desc: "Resource does not exist" },
  { code: 429, name: "Too Many Requests", desc: "Rate limit exceeded" },
  { code: 500, name: "Internal Server Error", desc: "Something went wrong on our end" },
]

const RATE_LIMIT_TIERS = [
  { name: "Free", limit: 100, period: "hour", color: "text-muted-foreground" },
  { name: "Pro", limit: 1000, period: "hour", color: "text-primary" },
  { name: "Enterprise", limit: 10000, period: "hour", color: "text-amber-500" },
]

export default function ApiDocumentationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [activeCodeTab, setActiveCodeTab] = useState("curl")

  useEffect(() => {
    const loadKeys = async () => {
      const result = await getApiKeys()
      if (result.success) {
        setApiKeys(result.apiKeys || [])
      }
    }
    loadKeys()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    curl: `curl -X GET "${API_BASE_URL}/api/v1/campaigns" \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,

    nodejs: `const response = await fetch("${API_BASE_URL}/api/v1/campaigns", {
  method: "GET",
  headers: {
    "Authorization": "Bearer sk_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  }
});

const data = await response.json();
console.log(data);`,

    python: `import requests

response = requests.get(
    "${API_BASE_URL}/api/v1/campaigns",
    headers={
        "Authorization": "Bearer sk_live_YOUR_API_KEY",
        "Content-Type": "application/json"
    }
)

data = response.json()
print(data)`,

    createCampaign: `curl -X POST "${API_BASE_URL}/api/v1/campaigns" \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: unique-request-id-123" \\
  -d '{
    "name": "Q2 Outreach Campaign",
    "description": "Follow up with leads",
    "sequenceId": "clx123..."
  }'`,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Enterprise-grade REST API for automating your outreach
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{ENDPOINTS.length}</div>
                <div className="text-xs text-muted-foreground">Endpoints</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{apiKeys.length}</div>
                <div className="text-xs text-muted-foreground">Active Keys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Gauge className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">1,000</div>
                <div className="text-xs text-muted-foreground">Req/hour (Pro)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">SHA-256</div>
                <div className="text-xs text-muted-foreground">Key Hashing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentication
          </CardTitle>
          <CardDescription>
            All API requests require a Bearer token in the Authorization header
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-1">// Header format</div>
            <div>
              Authorization: Bearer <span className="text-primary">sk_live_xxxxxxxxxxxxxxxx</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings">
              <Button size="sm">
                <Key className="h-4 w-4 mr-2" />
                Manage API Keys
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Quick Start Examples
          </CardTitle>
          <CardDescription>Copy-paste code to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="nodejs">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="createCampaign">Create Campaign</TabsTrigger>
            </TabsList>
            {Object.entries(codeExamples).map(([key, code]) => (
              <TabsContent key={key} value={key}>
                <div className="relative">
                  <pre className="rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto">
                    {code}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => copyToClipboard(code, key)}
                  >
                    {copiedCode === key ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>All available v1 endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {ENDPOINTS.map((endpoint, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Badge
                    variant={endpoint.method === "GET" ? "secondary" : "default"}
                    className="font-mono w-16 justify-center"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="flex-1 text-sm font-mono">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden md:block">
                    {endpoint.desc}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {endpoint.scope}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Rate Limits & Error Codes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rate Limits
            </CardTitle>
            <CardDescription>Requests per hour by subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {RATE_LIMIT_TIERS.map((tier) => (
              <div key={tier.name} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="font-medium">{tier.name}</span>
                <span className={`font-mono text-lg ${tier.color}`}>
                  {tier.limit.toLocaleString()}/{tier.period}
                </span>
              </div>
            ))}
            <Separator />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Rate Limit Headers:</p>
              <code className="block text-xs bg-muted p-2 rounded">X-RateLimit-Limit: 1000</code>
              <code className="block text-xs bg-muted p-2 rounded">X-RateLimit-Remaining: 999</code>
              <code className="block text-xs bg-muted p-2 rounded">X-RateLimit-Reset: 1706300400</code>
            </div>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Codes
            </CardTitle>
            <CardDescription>Standard HTTP response codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ERROR_CODES.map((error) => (
                <div key={error.code} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge
                    variant={error.code >= 500 ? "destructive" : error.code >= 400 ? "secondary" : "default"}
                    className="font-mono"
                  >
                    {error.code}
                  </Badge>
                  <span className="font-medium text-sm">{error.name}</span>
                  <span className="text-xs text-muted-foreground hidden md:block">{error.desc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Idempotency */}
      <Card>
        <CardHeader>
          <CardTitle>Idempotency</CardTitle>
          <CardDescription>Safely retry requests without duplicating operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Include an <code className="bg-muted px-1.5 py-0.5 rounded">Idempotency-Key</code> header
            with POST/PUT requests. If the same key is sent again within 24 hours, we'll return
            the cached response instead of executing the operation again.
          </p>
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <span className="text-muted-foreground">// Example header</span>
            <br />
            Idempotency-Key: <span className="text-primary">unique-request-uuid-12345</span>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <a href="mailto:support@mailfra.com">
              Contact Support
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">
              <Key className="h-4 w-4 mr-2" />
              Manage API Keys
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
