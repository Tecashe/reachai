"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import {
  Book,
  Key,
  Zap,
  CheckCircle2,
  Copy,
  Mail,
  Users,
  ListTree,
  Sparkles,
  BarChart3,
  Shield,
  Globe,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function APIDocumentationPage() {
  const [activeTab, setActiveTab] = useState("getting-started")
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    })
  }

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Book },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "campaigns", label: "Campaigns", icon: Mail },
    { id: "prospects", label: "Prospects", icon: Users },
    { id: "sequences", label: "Sequences", icon: ListTree },
    { id: "email-accounts", label: "Email Accounts", icon: Globe },
    { id: "domains", label: "Domains", icon: Shield },
    { id: "warmup", label: "Warmup", icon: Flame },
    { id: "ai", label: "AI Features", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  const CodeBlock = ({ code, language = "javascript" }: { code: string; language?: string }) => (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <div className="container mx-auto px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge className="mb-4" variant="outline">
            API v1.0
          </Badge>
          <h1 className="text-5xl font-bold mb-6">MailFra API Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete reference for integrating MailFra's cold email automation platform into your applications
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="col-span-3">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-9">
            <div className="space-y-12">
              {/* Getting Started */}
              {activeTab === "getting-started" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Getting Started with MailFra API</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      The MailFra API allows you to programmatically manage campaigns, prospects, email sequences, and
                      more. All endpoints are RESTful and return JSON responses.
                    </p>
                  </div>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Base URL</h3>
                    <CodeBlock code="https://your-domain.com/api/v1" />
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Generate an API Key</p>
                          <p className="text-sm text-muted-foreground">
                            Go to{" "}
                            <a href="/dashboard/settings?tab=api" className="text-primary hover:underline">
                              Settings → API Keys
                            </a>{" "}
                            to create your key
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Install SDK or HTTP Client</p>
                          <CodeBlock code="npm install axios" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Make Your First Request</p>
                          <CodeBlock
                            code={`const axios = require('axios');

const response = await axios.get('https://your-domain.com/api/v1/campaigns', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

console.log(response.data);`}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-yellow-500/50 bg-yellow-500/5">
                    <div className="flex gap-3">
                      <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Rate Limits</h4>
                        <p className="text-sm text-muted-foreground">
                          Rate limits vary by subscription tier. Headers include X-RateLimit-Limit,
                          X-RateLimit-Remaining, and X-RateLimit-Reset. See Authentication section for details.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Authentication */}
              {activeTab === "authentication" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Authentication</h2>
                    <p className="text-lg text-muted-foreground">
                      MailFra API uses API keys for authentication. Include your API key in the Authorization header of
                      every request.
                    </p>
                  </div>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">API Key Format</h3>
                    <CodeBlock code="Authorization: Bearer YOUR_API_KEY" />
                    <p className="text-sm text-muted-foreground mt-4">
                      API keys are prefixed with <code className="px-1.5 py-0.5 bg-muted rounded">sk_live_</code> for
                      production or <code className="px-1.5 py-0.5 bg-muted rounded">sk_test_</code> for testing.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Scopes</h3>
                    <p className="text-muted-foreground mb-4">
                      API keys can be scoped to limit access to specific resources:
                    </p>
                    <div className="grid gap-3">
                      {[
                        { scope: "campaigns:read", desc: "Read campaign data" },
                        { scope: "campaigns:write", desc: "Create and modify campaigns" },
                        { scope: "prospects:read", desc: "Read prospect data" },
                        { scope: "prospects:write", desc: "Add and modify prospects" },
                        { scope: "sequences:read", desc: "Read email sequences" },
                        { scope: "sequences:write", desc: "Create and modify sequences" },
                        { scope: "email:read", desc: "Read email account and domain data" },
                        { scope: "email:write", desc: "Manage email accounts and domains" },
                        { scope: "ai:use", desc: "Use AI features (research, generation)" },
                        { scope: "analytics:read", desc: "Access analytics data" },
                        { scope: "*", desc: "Full access to all resources" },
                      ].map((item) => (
                        <div key={item.scope} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <code className="font-mono text-sm font-semibold">{item.scope}</code>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Rate Limits by Tier</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { tier: "FREE", limit: "100 requests/hour", color: "bg-gray-100 text-gray-900" },
                        { tier: "STARTER", limit: "1,000 requests/hour", color: "bg-blue-100 text-blue-900" },
                        { tier: "PRO", limit: "10,000 requests/hour", color: "bg-purple-100 text-purple-900" },
                        { tier: "AGENCY", limit: "100,000 requests/hour", color: "bg-green-100 text-green-900" },
                      ].map((item) => (
                        <div key={item.tier} className={`p-4 rounded-lg ${item.color}`}>
                          <p className="font-semibold text-lg">{item.tier}</p>
                          <p className="text-sm">{item.limit}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Error Responses</h3>
                    <CodeBlock
                      code={`{
  "success": false,
  "error": "Invalid API key",
  "status": 401
}`}
                    />
                  </Card>
                </div>
              )}

              {/* Campaigns */}
              {activeTab === "campaigns" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Mail className="w-8 h-8" />
                      Campaigns API
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Manage cold email campaigns with full CRUD operations.
                    </p>
                  </div>

                  {/* List Campaigns */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">List Campaigns</h3>
                      <Badge>GET</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/campaigns</code>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Query Parameters</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3 text-sm">
                            <code className="px-2 py-1 bg-muted rounded">status</code>
                            <span className="text-muted-foreground">
                              Filter by status (DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED)
                            </span>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <code className="px-2 py-1 bg-muted rounded">limit</code>
                            <span className="text-muted-foreground">Number of results (max 100, default 50)</span>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <code className="px-2 py-1 bg-muted rounded">offset</code>
                            <span className="text-muted-foreground">Pagination offset (default 0)</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Request</h4>
                        <CodeBlock
                          code={`const response = await fetch('https://your-domain.com/api/v1/campaigns?status=ACTIVE&limit=10', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const data = await response.json();`}
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "cm123abc",
        "name": "Q4 Outreach Campaign",
        "description": "Targeting SaaS founders",
        "status": "ACTIVE",
        "dailySendLimit": 50,
        "totalProspects": 250,
        "emailsSent": 180,
        "emailsOpened": 95,
        "emailsReplied": 12,
        "emailsBounced": 3,
        "createdAt": "2025-01-15T10:00:00Z",
        "launchedAt": "2025-01-16T09:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Create Campaign */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Create Campaign</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/campaigns</code>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Request Body</h4>
                        <CodeBlock
                          code={`{
  "name": "Q1 2025 Outreach",
  "description": "Target enterprise SaaS companies",
  "dailySendLimit": 50,
  "researchDepth": "STANDARD",
  "personalizationLevel": "HIGH",
  "toneOfVoice": "professional"
}`}
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "id": "cm456def",
    "name": "Q1 2025 Outreach",
    "status": "DRAFT",
    ...
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Get, Update, Delete - Condensed */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Additional Operations</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge>GET</Badge>
                          <code className="text-sm">/api/v1/campaigns/[id]</code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Get single campaign with prospects and sequences
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">PATCH</Badge>
                          <code className="text-sm">/api/v1/campaigns/[id]</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Update campaign fields (name, status, limits)</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="destructive">DELETE</Badge>
                          <code className="text-sm">/api/v1/campaigns/[id]</code>
                        </div>
                        <p className="text-sm text-muted-foreground">Delete campaign and all associated data</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Prospects */}
              {activeTab === "prospects" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Users className="w-8 h-8" />
                      Prospects API
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Add and manage prospects with support for bulk imports.
                    </p>
                  </div>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">List Prospects</h3>
                      <Badge>GET</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/prospects</code>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Query Parameters</h4>
                        <div className="grid gap-2">
                          {[
                            { param: "campaignId", desc: "Filter by campaign" },
                            { param: "folderId", desc: "Filter by folder" },
                            { param: "status", desc: "Filter by status" },
                            { param: "search", desc: "Search by name, email, or company" },
                            { param: "limit", desc: "Results per page (max 100)" },
                            { param: "offset", desc: "Pagination offset" },
                          ].map((item) => (
                            <div key={item.param} className="flex items-start gap-3 text-sm">
                              <code className="px-2 py-1 bg-muted rounded">{item.param}</code>
                              <span className="text-muted-foreground">{item.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "prospects": [
      {
        "id": "pr789xyz",
        "email": "john@company.com",
        "firstName": "John",
        "lastName": "Doe",
        "company": "TechCorp",
        "jobTitle": "VP of Sales",
        "status": "ACTIVE",
        "qualityScore": 85,
        "replied": false,
        "bounced": false,
        "unsubscribed": false,
        "emailsReceived": 2,
        "emailsOpened": 1,
        "emailsReplied": 0,
        "createdAt": "2025-01-20T14:30:00Z",
        "lastContactedAt": "2025-01-22T09:15:00Z"
      }
    ],
    "pagination": { ... }
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Create Prospect (Single)</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/prospects</code>

                    <div className="mt-6">
                      <CodeBlock
                        code={`{
  "email": "jane@startup.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "company": "StartupCo",
  "jobTitle": "Founder & CEO",
  "linkedinUrl": "https://linkedin.com/in/janesmith",
  "websiteUrl": "https://startup.com",
  "campaignId": "cm123abc",  // Optional
  "folderId": "fl456def"      // Optional
}`}
                      />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Bulk Import Prospects</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/prospects</code>

                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Import up to 1,000 prospects in a single request. Duplicates are automatically skipped.
                      </p>
                      <CodeBlock
                        code={`{
  "prospects": [
    {
      "email": "contact1@company.com",
      "firstName": "Alice",
      "company": "Company A",
      "campaignId": "cm123abc"
    },
    {
      "email": "contact2@company.com",
      "firstName": "Bob",
      "company": "Company B",
      "campaignId": "cm123abc"
    }
    // ... up to 1,000 prospects
  ]
}`}
                      />
                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "created": 247  // Number of prospects created
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Sequences */}
              {activeTab === "sequences" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <ListTree className="w-8 h-8" />
                      Sequences API
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Create multi-step email sequences with conditional logic.
                    </p>
                  </div>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Get Sequence Steps</h3>
                      <Badge>GET</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/sequences?campaignId=[id]</code>

                    <div className="mt-6">
                      <CodeBlock
                        code={`{
  "success": true,
  "data": [
    {
      "id": "seq123",
      "campaignId": "cm123abc",
      "stepNumber": 1,
      "delayDays": 0,
      "sendOnlyIfNotReplied": true,
      "sendOnlyIfNotOpened": false,
      "template": {
        "id": "tpl456",
        "name": "Initial Outreach",
        "subject": "Quick question about {{company}}",
        "body": "Hi {{firstName}}, ...",
        "category": "cold_outreach"
      }
    },
    {
      "stepNumber": 2,
      "delayDays": 3,
      ...
    }
  ]
}`}
                      />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Create Sequence</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/sequences</code>

                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Replace all sequence steps for a campaign. Supports up to 10 steps.
                      </p>
                      <CodeBlock
                        code={`{
  "campaignId": "cm123abc",
  "steps": [
    {
      "templateId": "tpl456",
      "stepNumber": 1,
      "delayDays": 0,
      "sendOnlyIfNotReplied": true,
      "sendOnlyIfNotOpened": false
    },
    {
      "templateId": "tpl789",
      "stepNumber": 2,
      "delayDays": 3,
      "sendOnlyIfNotReplied": true,
      "sendOnlyIfNotOpened": true
    },
    {
      "templateId": "tpl012",
      "stepNumber": 3,
      "delayDays": 7,
      "sendOnlyIfNotReplied": true
    }
  ]
}`}
                      />
                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "created": 3
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Other sections would follow similar patterns... */}
              {/* For brevity, I'll create condensed versions */}

              {activeTab === "email-accounts" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Globe className="w-8 h-8" />
                      Email Accounts API
                    </h2>
                    <p className="text-lg text-muted-foreground">Manage sending accounts with health monitoring.</p>
                  </div>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Endpoints</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge>GET</Badge>
                        <code>/api/v1/sending-accounts</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">POST</Badge>
                        <code>/api/v1/sending-accounts</code>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "domains" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Shield className="w-8 h-8" />
                      Domains API
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Manage domains with DNS verification and deliverability tracking.
                    </p>
                  </div>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Endpoints</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge>GET</Badge>
                        <code>/api/v1/domains</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">POST</Badge>
                        <code>/api/v1/domains</code>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "warmup" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Flame className="w-8 h-8" />
                      Warmup API
                    </h2>
                    <p className="text-lg text-muted-foreground">Track email warmup progress and inbox placement.</p>
                  </div>
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Get Warmup Stats</h3>
                    <Badge>GET</Badge>
                    <code className="text-sm text-muted-foreground ml-2">
                      /api/v1/warmup/stats?sendingAccountId=[id]
                    </code>
                    <div className="mt-4">
                      <CodeBlock
                        code={`{
  "success": true,
  "data": {
    "sendingAccount": {
      "id": "sa123",
      "email": "outreach@company.com",
      "warmupStage": "ACTIVE",
      "warmupProgress": 25,
      "warmupDailyLimit": 80
    },
    "overall": {
      "totalEmailsSent": 420,
      "totalEmailsReceived": 385,
      "inboxPlacementRate": 94.5,
      "spamRate": 1.2,
      "openRate": 78.3,
      "replyRate": 45.2
    },
    "sessions": [...],
    "recentActivity": [...]
  }
}`}
                      />
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <Sparkles className="w-8 h-8" />
                      AI Features API
                    </h2>
                    <p className="text-lg text-muted-foreground">AI-powered prospect research and email generation.</p>
                  </div>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">AI Prospect Research</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/ai/research</code>
                    <div className="mt-4 space-y-4">
                      <CodeBlock
                        code={`{
  "prospectId": "pr789",
  "linkedinUrl": "https://linkedin.com/in/prospect",
  "websiteUrl": "https://company.com",
  "depth": "STANDARD"  // BASIC, STANDARD, DEEP
}`}
                      />
                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "prospectId": "pr789",
    "insights": [
      "Company recently raised Series B funding",
      "Actively hiring for sales positions",
      "Using competing product X"
    ],
    "qualityScore": 85,
    "personalizationTokens": {
      "recent_achievement": "Series B funding round",
      "pain_point": "Scaling sales team",
      "product_fit_reason": "Need for better outreach automation"
    },
    "completedAt": "2025-01-22T10:30:00Z"
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Generate Email</h3>
                      <Badge variant="secondary">POST</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/ai/generate-email</code>
                    <div className="mt-4 space-y-4">
                      <CodeBlock
                        code={`{
  "prospectId": "pr789",
  "templateId": "tpl456",  // Optional
  "tone": "professional",
  "personalizationLevel": "HIGH"  // LOW, MEDIUM, HIGH, ULTRA
}`}
                      />
                      <div>
                        <h4 className="font-semibold mb-2">Response</h4>
                        <CodeBlock
                          code={`{
  "success": true,
  "data": {
    "subject": "Quick question about scaling your sales team",
    "body": "Hi {{firstName}},\\n\\nI noticed you're actively hiring...",
    "qualityScore": 92,
    "personalizationScore": 88,
    "generatedAt": "2025-01-22T10:35:00Z"
  }
}`}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <BarChart3 className="w-8 h-8" />
                      Analytics API
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Detailed campaign performance analytics with daily breakdowns.
                    </p>
                  </div>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Campaign Analytics</h3>
                      <Badge>GET</Badge>
                    </div>
                    <code className="text-sm text-muted-foreground">/api/v1/analytics/campaigns/[id]?days=30</code>
                    <div className="mt-4">
                      <CodeBlock
                        code={`{
  "success": true,
  "data": {
    "campaign": {
      "id": "cm123",
      "name": "Q4 Outreach",
      "status": "ACTIVE"
    },
    "totals": {
      "emailsSent": 450,
      "emailsDelivered": 442,
      "emailsOpened": 235,
      "emailsClicked": 89,
      "emailsReplied": 34,
      "emailsBounced": 8,
      "deliveryRate": 98.2,
      "openRate": 53.2,
      "clickRate": 37.9,
      "replyRate": 7.7,
      "bounceRate": 1.8
    },
    "daily": [
      {
        "date": "2025-01-22",
        "emailsSent": 45,
        "emailsOpened": 24,
        "openRate": 53.3,
        ...
      }
    ]
  }
}`}
                      />
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <PageFooter />
    </div>
  )
}
