// "use client"

// import { PageHeader } from "@/components/shared/page-header"
// import { PageFooter } from "@/components/shared/page-footer"
// import { useEffect, useRef, useState } from "react"
// import { Copy, Check, ChevronRight, ExternalLink, ArrowRight, Terminal, Zap, Shield, Clock } from "lucide-react"
// import Link from "next/link"

// const endpoints = [
//   {
//     category: "Campaigns",
//     items: [
//       { method: "GET", path: "/campaigns", description: "List all campaigns" },
//       { method: "POST", path: "/campaigns", description: "Create a new campaign" },
//       { method: "GET", path: "/campaigns/:id", description: "Get campaign details" },
//       { method: "PUT", path: "/campaigns/:id", description: "Update a campaign" },
//       { method: "DELETE", path: "/campaigns/:id", description: "Delete a campaign" },
//       { method: "POST", path: "/campaigns/:id/start", description: "Start a campaign" },
//       { method: "POST", path: "/campaigns/:id/pause", description: "Pause a campaign" },
//     ],
//   },
//   {
//     category: "Leads",
//     items: [
//       { method: "GET", path: "/leads", description: "List all leads" },
//       { method: "POST", path: "/leads", description: "Create a new lead" },
//       { method: "POST", path: "/leads/bulk", description: "Bulk import leads" },
//       { method: "GET", path: "/leads/:id", description: "Get lead details" },
//       { method: "PUT", path: "/leads/:id", description: "Update a lead" },
//       { method: "DELETE", path: "/leads/:id", description: "Delete a lead" },
//     ],
//   },
//   {
//     category: "Email Accounts",
//     items: [
//       { method: "GET", path: "/accounts", description: "List email accounts" },
//       { method: "POST", path: "/accounts", description: "Connect an account" },
//       { method: "GET", path: "/accounts/:id", description: "Get account details" },
//       { method: "DELETE", path: "/accounts/:id", description: "Disconnect account" },
//       { method: "GET", path: "/accounts/:id/health", description: "Get account health" },
//     ],
//   },
//   {
//     category: "Analytics",
//     items: [
//       { method: "GET", path: "/analytics/overview", description: "Get overview stats" },
//       { method: "GET", path: "/analytics/campaigns/:id", description: "Campaign analytics" },
//       { method: "GET", path: "/analytics/accounts/:id", description: "Account analytics" },
//       { method: "GET", path: "/analytics/deliverability", description: "Deliverability report" },
//     ],
//   },
//   {
//     category: "Webhooks",
//     items: [
//       { method: "GET", path: "/webhooks", description: "List webhooks" },
//       { method: "POST", path: "/webhooks", description: "Create a webhook" },
//       { method: "DELETE", path: "/webhooks/:id", description: "Delete a webhook" },
//     ],
//   },
// ]

// const codeExamples = {
//   curl: `curl -X POST https://api.mailfra.com/v1/campaigns \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "name": "Q4 Outreach",
//     "subject": "Quick question about {{company}}",
//     "body": "Hi {{firstName}},\\n\\nI noticed...",
//     "leads_list_id": "lst_abc123",
//     "account_ids": ["acc_xyz789"]
//   }'`,
//   javascript: `import { Mailfra } from '@mailfra/sdk';

// const client = new Mailfra('YOUR_API_KEY');

// const campaign = await client.campaigns.create({
//   name: 'Q4 Outreach',
//   subject: 'Quick question about {{company}}',
//   body: 'Hi {{firstName}},\\n\\nI noticed...',
//   leadsListId: 'lst_abc123',
//   accountIds: ['acc_xyz789']
// });

// console.log(campaign.id);`,
//   python: `from mailfra import Mailfra

// client = Mailfra("YOUR_API_KEY")

// campaign = client.campaigns.create(
//     name="Q4 Outreach",
//     subject="Quick question about {{company}}",
//     body="Hi {{firstName}},\\n\\nI noticed...",
//     leads_list_id="lst_abc123",
//     account_ids=["acc_xyz789"]
// )

// print(campaign.id)`,
// }

// const features = [
//   {
//     icon: Zap,
//     title: "RESTful API",
//     description: "Clean, predictable REST endpoints following industry best practices.",
//   },
//   {
//     icon: Shield,
//     title: "Secure by Default",
//     description: "API key authentication with scoped permissions and rate limiting.",
//   },
//   {
//     icon: Clock,
//     title: "99.9% Uptime",
//     description: "Enterprise-grade infrastructure with automatic failover.",
//   },
//   {
//     icon: Terminal,
//     title: "SDK Support",
//     description: "Official SDKs for JavaScript, Python, Ruby, and Go.",
//   },
// ]

// export default function ApiDocsPage() {
//   const [activeTab, setActiveTab] = useState<"curl" | "javascript" | "python">("curl")
//   const [copied, setCopied] = useState(false)
//   const [expandedCategory, setExpandedCategory] = useState<string | null>("Campaigns")
//   const [isVisible, setIsVisible] = useState(false)
//   const heroRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     setIsVisible(true)
//   }, [])

//   const copyCode = () => {
//     navigator.clipboard.writeText(codeExamples[activeTab])
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const methodColors: Record<string, string> = {
//     GET: "bg-emerald-500/10 text-emerald-600",
//     POST: "bg-blue-500/10 text-blue-600",
//     PUT: "bg-amber-500/10 text-amber-600",
//     DELETE: "bg-red-500/10 text-red-600",
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <PageHeader />

//       {/* Hero Section */}
//       <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//             {/* Text content */}
//             <div
//               className="transition-all duration-1000"
//               style={{
//                 opacity: isVisible ? 1 : 0,
//                 transform: isVisible ? "translateX(0)" : "translateX(-30px)",
//               }}
//             >
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
//                 <Terminal className="w-4 h-4" />
//                 Developer API
//               </div>
//               <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
//                 Build with the
//                 <span className="block text-muted-foreground">mailfra API</span>
//               </h1>
//               <p className="text-lg text-muted-foreground leading-relaxed mb-8">
//                 Integrate cold email infrastructure directly into your product. Full access to campaigns, leads,
//                 accounts, analytics, and more.
//               </p>

//               <div className="flex flex-wrap gap-4 mb-12">
//                 <Link
//                   href="/signup"
//                   className="h-14 px-8 bg-foreground text-background font-medium rounded-full flex items-center gap-2 hover:bg-foreground/90 transition-all"
//                 >
//                   Get API Key
//                   <ArrowRight className="w-4 h-4" />
//                 </Link>
//                 <a
//                   href="https://docs.mailfra.com"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="h-14 px-8 border border-border font-medium rounded-full flex items-center gap-2 hover:bg-muted transition-all"
//                 >
//                   Full Documentation
//                   <ExternalLink className="w-4 h-4" />
//                 </a>
//               </div>

//               {/* Feature grid */}
//               <div className="grid grid-cols-2 gap-4">
//                 {features.map((feature) => (
//                   <div key={feature.title} className="flex items-start gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
//                       <feature.icon className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
//                       <p className="text-xs text-muted-foreground">{feature.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Code example */}
//             <div
//               className="transition-all duration-1000 delay-200"
//               style={{
//                 opacity: isVisible ? 1 : 0,
//                 transform: isVisible ? "translateX(0)" : "translateX(30px)",
//               }}
//             >
//               <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10">
//                 {/* Tab bar */}
//                 <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//                   <div className="flex gap-1">
//                     {(["curl", "javascript", "python"] as const).map((tab) => (
//                       <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                           activeTab === tab ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
//                         }`}
//                       >
//                         {tab === "curl" ? "cURL" : tab.charAt(0).toUpperCase() + tab.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                   <button
//                     onClick={copyCode}
//                     className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all"
//                   >
//                     {copied ? (
//                       <>
//                         <Check className="w-4 h-4" />
//                         Copied
//                       </>
//                     ) : (
//                       <>
//                         <Copy className="w-4 h-4" />
//                         Copy
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 {/* Code content */}
//                 <div className="p-6 overflow-x-auto">
//                   <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre">
//                     {codeExamples[activeTab]}
//                   </pre>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* API Reference */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">API Reference</h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Explore all available endpoints. Click a category to expand.
//             </p>
//           </div>

//           <div className="max-w-4xl mx-auto space-y-4">
//             {endpoints.map((category) => (
//               <div
//                 key={category.category}
//                 className="bg-background rounded-2xl border border-border overflow-hidden transition-all"
//               >
//                 {/* Category header */}
//                 <button
//                   onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
//                   className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-lg font-semibold text-foreground">{category.category}</span>
//                     <span className="text-sm text-muted-foreground">{category.items.length} endpoints</span>
//                   </div>
//                   <ChevronRight
//                     className={`w-5 h-5 text-muted-foreground transition-transform ${
//                       expandedCategory === category.category ? "rotate-90" : ""
//                     }`}
//                   />
//                 </button>

//                 {/* Endpoints list */}
//                 {expandedCategory === category.category && (
//                   <div className="border-t border-border">
//                     {category.items.map((endpoint, index) => (
//                       <div
//                         key={endpoint.path}
//                         className={`flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${
//                           index !== category.items.length - 1 ? "border-b border-border" : ""
//                         }`}
//                         style={{
//                           animation: `fadeIn 0.3s ease forwards`,
//                           animationDelay: `${index * 50}ms`,
//                           opacity: 0,
//                         }}
//                       >
//                         <span
//                           className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${methodColors[endpoint.method]}`}
//                         >
//                           {endpoint.method}
//                         </span>
//                         <code className="text-sm font-mono text-foreground flex-1">{endpoint.path}</code>
//                         <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SDKs Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Official SDKs</h2>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Get started quickly with our official client libraries.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
//             {[
//               { name: "JavaScript", version: "v2.1.0", icon: "JS" },
//               { name: "Python", version: "v1.8.0", icon: "PY" },
//               { name: "Ruby", version: "v1.4.0", icon: "RB" },
//               { name: "Go", version: "v1.2.0", icon: "GO" },
//             ].map((sdk) => (
//               <a
//                 key={sdk.name}
//                 href="#"
//                 className="group bg-background rounded-2xl border border-border p-6 hover:border-foreground/20 transition-all"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 font-mono font-bold text-lg group-hover:bg-foreground group-hover:text-background transition-colors">
//                   {sdk.icon}
//                 </div>
//                 <h3 className="font-semibold text-foreground mb-1">{sdk.name}</h3>
//                 <p className="text-sm text-muted-foreground">{sdk.version}</p>
//               </a>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-background mb-6">Ready to integrate?</h2>
//           <p className="text-lg text-background/70 mb-10 max-w-xl mx-auto">
//             Sign up for free and get your API key in seconds. No credit card required.
//           </p>
//           <Link
//             href="/signup"
//             className="inline-flex h-14 px-8 bg-background text-foreground font-medium rounded-full items-center gap-2 hover:bg-background/90 transition-all"
//           >
//             Get Started Free
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>
//       </section>

//       <PageFooter />

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   )
// }


"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { motion } from "framer-motion"
import {
  Book,
  Zap,
  Shield,
  Rocket,
  FileText,
  Webhook,
  Key,
  Database,
  Mail,
  Users,
  BarChart,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const quickStartCode = {
  install: `npm install @mailfra/sdk
# or
yarn add @mailfra/sdk`,
  init: `import { Mailfra } from '@mailfra/sdk'

const client = new Mailfra(process.env.MAILFRA_API_KEY)`,
  campaign: `// Create a campaign
const campaign = await client.campaigns.create({
  name: "Q1 2024 Outreach",
  subject: "Quick question about {{company}}",
  body: "Hi {{firstName}},\\n\\nI noticed your company...",
  sequenceId: "seq_abc123"
})

// Add prospects
await client.prospects.bulkCreate({
  campaignId: campaign.id,
  prospects: [
    { email: "john@company.com", firstName: "John", company: "Acme Inc" },
    { email: "jane@tech.com", firstName: "Jane", company: "TechCorp" }
  ]
})

// Launch campaign
await client.campaigns.launch(campaign.id)`,
}

const features = [
  {
    icon: Mail,
    title: "Campaign Management",
    description: "Create, schedule, and manage cold email campaigns with advanced sequencing",
    href: "#campaigns",
  },
  {
    icon: Users,
    title: "Prospect Management",
    description: "Import, organize, and enrich prospect data with AI-powered insights",
    href: "#prospects",
  },
  {
    icon: Zap,
    title: "Email Sequences",
    description: "Build automated follow-up sequences with conditional logic and triggers",
    href: "#sequences",
  },
  {
    icon: Sparkles,
    title: "AI Tools",
    description: "Generate personalized emails, predict performance, and auto-assign sequences",
    href: "#ai",
  },
  {
    icon: BarChart,
    title: "Analytics & Tracking",
    description: "Track opens, clicks, replies, and measure campaign performance in real-time",
    href: "#analytics",
  },
  {
    icon: Shield,
    title: "Deliverability",
    description: "Email warmup, domain health monitoring, and spam prevention tools",
    href: "#deliverability",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Real-time notifications for email events, replies, and bounces",
    href: "#webhooks",
  },
  {
    icon: Database,
    title: "CRM Integration",
    description: "Sync contacts with popular CRMs and manage your sales pipeline",
    href: "#integrations",
  },
]

const apiCategories = [
  {
    name: "Campaigns",
    icon: Mail,
    endpoints: [
      { method: "GET", path: "/api/campaigns", desc: "List all campaigns" },
      { method: "POST", path: "/api/campaigns", desc: "Create a campaign" },
      { method: "POST", path: "/api/campaigns/:id/launch", desc: "Launch campaign" },
      { method: "POST", path: "/api/campaigns/:id/pause", desc: "Pause campaign" },
      { method: "GET", path: "/api/campaigns/:id/stats", desc: "Get statistics" },
    ],
  },
  {
    name: "Prospects",
    icon: Users,
    endpoints: [
      { method: "POST", path: "/api/prospects/upload", desc: "Bulk upload prospects" },
      { method: "POST", path: "/api/research/prospect", desc: "Research a prospect" },
      { method: "POST", path: "/api/research/batch", desc: "Batch research" },
    ],
  },
  {
    name: "Sequences",
    icon: Zap,
    endpoints: [
      { method: "POST", path: "/api/sequences/create", desc: "Create sequence" },
      { method: "POST", path: "/api/campaigns/:id/sequence-triggers", desc: "Add triggers" },
      { method: "POST", path: "/api/campaigns/:id/automation-rules", desc: "Add automation" },
    ],
  },
  {
    name: "AI Tools",
    icon: Sparkles,
    endpoints: [
      { method: "POST", path: "/api/generate/email", desc: "Generate email content" },
      { method: "POST", path: "/api/predict/email-performance", desc: "Predict performance" },
      { method: "POST", path: "/api/ai/sequence-recommendations", desc: "Get sequence recommendations" },
    ],
  },
  {
    name: "Email Accounts",
    icon: Mail,
    endpoints: [
      { method: "GET", path: "/api/settings/sending-accounts", desc: "List email accounts" },
      { method: "POST", path: "/api/oauth/gmail", desc: "Connect Gmail" },
      { method: "POST", path: "/api/oauth/outlook", desc: "Connect Outlook" },
    ],
  },
  {
    name: "Domains",
    icon: Shield,
    endpoints: [
      { method: "GET", path: "/api/domains", desc: "List domains" },
      { method: "POST", path: "/api/domains", desc: "Add domain" },
      { method: "GET", path: "/api/domains/:id", desc: "Check domain health" },
    ],
  },
  {
    name: "Warmup",
    icon: Zap,
    endpoints: [
      { method: "GET", path: "/api/warmup/stats", desc: "Get warmup statistics" },
      { method: "GET", path: "/api/warmup/emails", desc: "List warmup emails" },
      { method: "POST", path: "/api/warmup/emails", desc: "Send warmup email" },
    ],
  },
  {
    name: "Analytics",
    icon: BarChart,
    endpoints: [
      { method: "GET", path: "/api/campaigns/:id/emails", desc: "Get campaign emails" },
      { method: "GET", path: "/api/crm/stats", desc: "Get CRM statistics" },
    ],
  },
]

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-[#0d0d0d] text-gray-100 p-6 rounded-xl overflow-x-auto border border-white/10">
        <code className="text-sm font-mono">{code}</code>
      </pre>
      <button
        onClick={copyCode}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-6">
              <Book className="w-4 h-4" />
              Documentation
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">Build with MailFra</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to integrate cold email infrastructure into your product. Comprehensive API reference,
              SDKs, and guides.
            </p>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Quick Start</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">1. Install the SDK</h3>
                  <CodeBlock code={quickStartCode.install} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">2. Initialize the client</h3>
                  <CodeBlock code={quickStartCode.init} language="javascript" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">3. Create your first campaign</h3>
                  <CodeBlock code={quickStartCode.campaign} language="javascript" />
                </div>

                <div className="pt-4 border-t border-border">
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Key className="w-4 h-4" />
                    Get your API key from settings
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.a
                  key={feature.title}
                  href={feature.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30" id="api-reference">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">API Reference</h2>
            <p className="text-lg text-muted-foreground">Complete reference for all MailFra API endpoints</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {apiCategories.map((category) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
                <div className="space-y-2">
                  {category.endpoints.map((endpoint) => (
                    <div
                      key={endpoint.path}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          endpoint.method === "GET"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : endpoint.method === "POST"
                              ? "bg-blue-500/10 text-blue-600"
                              : endpoint.method === "PUT"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        <p className="text-xs text-muted-foreground truncate">{endpoint.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/docs/api-reference">
              <Button size="lg" className="gap-2">
                View Full API Reference
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="authentication">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Authentication</h2>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                All API requests require authentication using an API key. Include your API key in the Authorization
                header.
              </p>

              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Example Request</h3>
                <CodeBlock
                  code={`curl https://api.mailfra.com/v1/campaigns \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-2">API Key Format</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    API keys start with <code className="text-xs bg-muted px-2 py-1 rounded">mf_live_</code> for
                    production or <code className="text-xs bg-muted px-2 py-1 rounded">mf_test_</code> for testing.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Security Best Practices</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Never expose API keys in client-side code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Rotate keys regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>Use environment variables</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Rate Limits</h2>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Rate limits are applied per API key to ensure fair usage and system stability.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Free Tier</h3>
                <p className="text-3xl font-bold mb-1">100</p>
                <p className="text-sm text-muted-foreground">requests/hour</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pro Tier</h3>
                <p className="text-3xl font-bold mb-1">1,000</p>
                <p className="text-sm text-muted-foreground">requests/hour</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Enterprise</h3>
                <p className="text-3xl font-bold mb-1">Custom</p>
                <p className="text-sm text-muted-foreground">Contact sales</p>
              </div>
            </div>

            <div className="mt-8 bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Rate Limit Headers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Every API response includes headers to help you track your rate limit status:
              </p>
              <CodeBlock
                code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1640995200`}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Webhooks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="webhooks">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Webhook className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Webhooks</h2>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              Receive real-time notifications when events happen in your account.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {[
                { event: "email.sent", desc: "Email successfully sent to prospect" },
                { event: "email.opened", desc: "Prospect opened your email" },
                { event: "email.clicked", desc: "Prospect clicked a link" },
                { event: "email.replied", desc: "Prospect replied to your email" },
                { event: "email.bounced", desc: "Email bounced or failed" },
                { event: "campaign.completed", desc: "Campaign finished sending" },
              ].map((event) => (
                <div key={event.event} className="bg-card border border-border rounded-lg p-4">
                  <code className="text-sm font-mono text-primary">{event.event}</code>
                  <p className="text-sm text-muted-foreground mt-1">{event.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-3">Webhook Payload Example</h3>
              <CodeBlock
                code={`{
                        "event": "email.opened",
                        "timestamp": "2024-01-15T10:30:00Z",
                        "data": {
                          "emailId": "eml_abc123",
                          "campaignId": "cmp_xyz789",
                          "prospectId": "prs_def456",
                          "prospectEmail": "john@company.com",
                          "openedAt": "2024-01-15T10:30:00Z",
                          "userAgent": "Mozilla/5.0...",
                          "ipAddress": "203.0.113.0"
                        }
                      }`}
                language="json"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Official SDKs</h2>
            <p className="text-lg text-muted-foreground">Get started quickly with our official client libraries</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "JavaScript/TypeScript", pkg: "@mailfra/sdk", version: "2.1.0", icon: "JS" },
              { name: "Python", pkg: "mailfra", version: "1.8.0", icon: "PY" },
              { name: "Ruby", pkg: "mailfra-ruby", version: "1.4.0", icon: "RB" },
              { name: "Go", pkg: "github.com/mailfra/go-sdk", version: "1.2.0", icon: "GO" },
            ].map((sdk) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 font-mono font-bold text-xl">
                  {sdk.icon}
                </div>
                <h3 className="font-semibold mb-1">{sdk.name}</h3>
                <code className="text-xs text-muted-foreground block mb-2">{sdk.pkg}</code>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 rounded bg-muted text-muted-foreground">v{sdk.version}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up for free and get your API key in seconds. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get API Key
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/docs/api-reference">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <FileText className="w-4 h-4" />
                Full API Reference
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <PageFooter />
    </div>
  )
}
