"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useRef, useState } from "react"
import { Copy, Check, ChevronRight, ExternalLink, ArrowRight, Terminal, Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"

const endpoints = [
  {
    category: "Campaigns",
    items: [
      { method: "GET", path: "/campaigns", description: "List all campaigns" },
      { method: "POST", path: "/campaigns", description: "Create a new campaign" },
      { method: "GET", path: "/campaigns/:id", description: "Get campaign details" },
      { method: "PUT", path: "/campaigns/:id", description: "Update a campaign" },
      { method: "DELETE", path: "/campaigns/:id", description: "Delete a campaign" },
      { method: "POST", path: "/campaigns/:id/start", description: "Start a campaign" },
      { method: "POST", path: "/campaigns/:id/pause", description: "Pause a campaign" },
    ],
  },
  {
    category: "Leads",
    items: [
      { method: "GET", path: "/leads", description: "List all leads" },
      { method: "POST", path: "/leads", description: "Create a new lead" },
      { method: "POST", path: "/leads/bulk", description: "Bulk import leads" },
      { method: "GET", path: "/leads/:id", description: "Get lead details" },
      { method: "PUT", path: "/leads/:id", description: "Update a lead" },
      { method: "DELETE", path: "/leads/:id", description: "Delete a lead" },
    ],
  },
  {
    category: "Email Accounts",
    items: [
      { method: "GET", path: "/accounts", description: "List email accounts" },
      { method: "POST", path: "/accounts", description: "Connect an account" },
      { method: "GET", path: "/accounts/:id", description: "Get account details" },
      { method: "DELETE", path: "/accounts/:id", description: "Disconnect account" },
      { method: "GET", path: "/accounts/:id/health", description: "Get account health" },
    ],
  },
  {
    category: "Analytics",
    items: [
      { method: "GET", path: "/analytics/overview", description: "Get overview stats" },
      { method: "GET", path: "/analytics/campaigns/:id", description: "Campaign analytics" },
      { method: "GET", path: "/analytics/accounts/:id", description: "Account analytics" },
      { method: "GET", path: "/analytics/deliverability", description: "Deliverability report" },
    ],
  },
  {
    category: "Webhooks",
    items: [
      { method: "GET", path: "/webhooks", description: "List webhooks" },
      { method: "POST", path: "/webhooks", description: "Create a webhook" },
      { method: "DELETE", path: "/webhooks/:id", description: "Delete a webhook" },
    ],
  },
]

const codeExamples = {
  curl: `curl -X POST https://api.mailfra.com/v1/campaigns \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Q4 Outreach",
    "subject": "Quick question about {{company}}",
    "body": "Hi {{firstName}},\\n\\nI noticed...",
    "leads_list_id": "lst_abc123",
    "account_ids": ["acc_xyz789"]
  }'`,
  javascript: `import { Mailfra } from '@mailfra/sdk';

const client = new Mailfra('YOUR_API_KEY');

const campaign = await client.campaigns.create({
  name: 'Q4 Outreach',
  subject: 'Quick question about {{company}}',
  body: 'Hi {{firstName}},\\n\\nI noticed...',
  leadsListId: 'lst_abc123',
  accountIds: ['acc_xyz789']
});

console.log(campaign.id);`,
  python: `from mailfra import Mailfra

client = Mailfra("YOUR_API_KEY")

campaign = client.campaigns.create(
    name="Q4 Outreach",
    subject="Quick question about {{company}}",
    body="Hi {{firstName}},\\n\\nI noticed...",
    leads_list_id="lst_abc123",
    account_ids=["acc_xyz789"]
)

print(campaign.id)`,
}

const features = [
  {
    icon: Zap,
    title: "RESTful API",
    description: "Clean, predictable REST endpoints following industry best practices.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "API key authentication with scoped permissions and rate limiting.",
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description: "Enterprise-grade infrastructure with automatic failover.",
  },
  {
    icon: Terminal,
    title: "SDK Support",
    description: "Official SDKs for JavaScript, Python, Ruby, and Go.",
  },
]

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "javascript" | "python">("curl")
  const [copied, setCopied] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Campaigns")
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-600",
    POST: "bg-blue-500/10 text-blue-600",
    PUT: "bg-amber-500/10 text-amber-600",
    DELETE: "bg-red-500/10 text-red-600",
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text content */}
            <div
              className="transition-all duration-1000"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-30px)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
                <Terminal className="w-4 h-4" />
                Developer API
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                Build with the
                <span className="block text-muted-foreground">mailfra API</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Integrate cold email infrastructure directly into your product. Full access to campaigns, leads,
                accounts, analytics, and more.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/signup"
                  className="h-14 px-8 bg-foreground text-background font-medium rounded-full flex items-center gap-2 hover:bg-foreground/90 transition-all"
                >
                  Get API Key
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://docs.mailfra.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-14 px-8 border border-border font-medium rounded-full flex items-center gap-2 hover:bg-muted transition-all"
                >
                  Full Documentation
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Feature grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code example */}
            <div
              className="transition-all duration-1000 delay-200"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(30px)",
              }}
            >
              <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10">
                {/* Tab bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <div className="flex gap-1">
                    {(["curl", "javascript", "python"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {tab === "curl" ? "cURL" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Code content */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre">
                    {codeExamples[activeTab]}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">API Reference</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all available endpoints. Click a category to expand.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {endpoints.map((category) => (
              <div
                key={category.category}
                className="bg-background rounded-2xl border border-border overflow-hidden transition-all"
              >
                {/* Category header */}
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.items.length} endpoints</span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedCategory === category.category ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Endpoints list */}
                {expandedCategory === category.category && (
                  <div className="border-t border-border">
                    {category.items.map((endpoint, index) => (
                      <div
                        key={endpoint.path}
                        className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${
                          index !== category.items.length - 1 ? "border-b border-border" : ""
                        }`}
                        style={{
                          animation: `fadeIn 0.3s ease forwards`,
                          animationDelay: `${index * 50}ms`,
                          opacity: 0,
                        }}
                      >
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${methodColors[endpoint.method]}`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Official SDKs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started quickly with our official client libraries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "JavaScript", version: "v2.1.0", icon: "JS" },
              { name: "Python", version: "v1.8.0", icon: "PY" },
              { name: "Ruby", version: "v1.4.0", icon: "RB" },
              { name: "Go", version: "v1.2.0", icon: "GO" },
            ].map((sdk) => (
              <a
                key={sdk.name}
                href="#"
                className="group bg-background rounded-2xl border border-border p-6 hover:border-foreground/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 font-mono font-bold text-lg group-hover:bg-foreground group-hover:text-background transition-colors">
                  {sdk.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{sdk.name}</h3>
                <p className="text-sm text-muted-foreground">{sdk.version}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-background mb-6">Ready to integrate?</h2>
          <p className="text-lg text-background/70 mb-10 max-w-xl mx-auto">
            Sign up for free and get your API key in seconds. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-14 px-8 bg-background text-foreground font-medium rounded-full items-center gap-2 hover:bg-background/90 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PageFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
