"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useRef, useState } from "react"
import { Search, ArrowRight, ExternalLink, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const categories = ["All", "CRM", "Email", "Automation", "Analytics", "Communication", "Data"]

const integrations = [
  {
    name: "Salesforce",
    category: "CRM",
    description: "Sync contacts, leads, and activities bidirectionally with Salesforce CRM.",
    logo: "/images/integrations/salesforce.jpg",
    features: ["Bi-directional sync", "Custom field mapping", "Activity logging"],
    popular: true,
  },
  {
    name: "HubSpot",
    category: "CRM",
    description: "Connect your HubSpot CRM for seamless contact and deal management.",
    logo: "/images/integrations/hubspot.jpg",
    features: ["Contact sync", "Deal tracking", "Workflow triggers"],
    popular: true,
  },
  {
    name: "Pipedrive",
    category: "CRM",
    description: "Push leads and activities directly to your Pipedrive pipeline.",
    logo: "/images/integrations/pipedrive.jpg",
    features: ["Lead creation", "Activity sync", "Pipeline updates"],
    popular: false,
  },
  {
    name: "Gmail",
    category: "Email",
    description: "Connect unlimited Gmail accounts for sending and warm-up.",
    logo: "/images/integrations/google.jpg",
    features: ["OAuth connection", "Unlimited accounts", "Auto warm-up"],
    popular: true,
  },
  {
    name: "Outlook",
    category: "Email",
    description: "Connect Microsoft 365 and Outlook accounts for enterprise sending.",
    logo: "/images/integrations/outlook.jpg",
    features: ["Office 365 support", "Shared mailboxes", "Calendar sync"],
    popular: true,
  },
  {
    name: "Zapier",
    category: "Automation",
    description: "Connect to 5,000+ apps and automate your entire workflow.",
    logo: "/images/integrations/zapier.jpg",
    features: ["5,000+ apps", "Multi-step zaps", "Webhook triggers"],
    popular: true,
  },
  {
    name: "Slack",
    category: "Communication",
    description: "Get real-time notifications for replies, opens, and campaign updates.",
    logo: "/images/integrations/slack.jpg",
    features: ["Reply notifications", "Daily digests", "Channel routing"],
    popular: false,
  },
  {
    name: "Webhooks",
    category: "Automation",
    description: "Build custom integrations with outbound and inbound webhooks.",
    logo: "/images/integrations/webhooks.jpg",
    features: ["Custom payloads", "Event filtering", "Retry logic"],
    popular: false,
  },
  {
    name: "Google Analytics",
    category: "Analytics",
    description: "Track email-driven website visits and conversions.",
    logo: "/images/integrations/google.jpg",
    features: ["UTM tracking", "Goal tracking", "Conversion attribution"],
    popular: false,
  },
  {
    name: "Clearbit",
    category: "Data",
    description: "Enrich leads with company and contact data automatically.",
    logo: "/clearbit-logo.jpg",
    features: ["Lead enrichment", "Company data", "Real-time updates"],
    popular: false,
  },
  {
    name: "Apollo.io",
    category: "Data",
    description: "Import leads directly from Apollo.io into your campaigns.",
    logo: "/apollo-io-logo.jpg",
    features: ["Lead import", "List sync", "Filter mapping"],
    popular: false,
  },
  {
    name: "LinkedIn",
    category: "Communication",
    description: "Add LinkedIn touchpoints to your multi-channel sequences.",
    logo: "/linkedin-logo.png",
    features: ["Connection requests", "InMail", "Profile visits"],
    popular: true,
  },
]

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = activeCategory === "All" || integration.category === activeCategory
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    setVisibleCards([])
    const timeout = setTimeout(() => {
      filteredIntegrations.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, index])
        }, index * 50)
      })
    }, 100)
    return () => clearTimeout(timeout)
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-foreground" />
              {integrations.length}+ Integrations
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
              Connect your
              <span className="block text-muted-foreground">entire stack</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              mailfra integrates with all the tools you already use. Sync your CRM, automate workflows, and keep
              everything in sync.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`h-10 px-5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration, index) => (
              <div
                key={integration.name}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className="group relative bg-background rounded-2xl border border-border hover:border-foreground/20 overflow-hidden transition-all duration-500"
                style={{
                  opacity: visibleCards.includes(index) ? 1 : 0,
                  transform: visibleCards.includes(index) ? "translateY(0)" : "translateY(20px)",
                }}
              >
                {/* Popular badge */}
                {integration.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                    Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Logo and name */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={integration.logo || "/placeholder.svg"}
                        alt={integration.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{integration.name}</h3>
                      <span className="text-sm text-muted-foreground">{integration.category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">{integration.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {integration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-foreground" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/integrations/${integration.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:gap-3 transition-all"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredIntegrations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground mb-4">No integrations found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("All")
                }}
                className="text-foreground font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Request Integration */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Don't see what you need?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            We're constantly adding new integrations. Let us know what you need and we'll prioritize it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="h-14 px-8 bg-foreground text-background font-medium rounded-full flex items-center gap-2 hover:bg-foreground/90 transition-all"
            >
              Request Integration
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/api"
              className="h-14 px-8 border border-border font-medium rounded-full flex items-center gap-2 hover:bg-muted transition-all"
            >
              Build with our API
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
