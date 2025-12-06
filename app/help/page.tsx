"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Search,
  X,
  BookOpen,
  Settings,
  CreditCard,
  Mail,
  Shield,
  Zap,
  Users,
  BarChart3,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: BookOpen,
    description: "New to Mailfra? Start here.",
    color: "bg-blue-50 text-blue-600",
    articles: [
      { title: "Quick Start Guide", slug: "quick-start", popular: true },
      { title: "Setting Up Your First Campaign", slug: "first-campaign", popular: true },
      { title: "Connecting Your Email Accounts", slug: "connect-email" },
      { title: "Understanding the Dashboard", slug: "dashboard-overview" },
      { title: "Importing Your Prospects", slug: "import-prospects" },
    ],
  },
  {
    id: "email-setup",
    name: "Email Setup",
    icon: Mail,
    description: "Configure email accounts and authentication.",
    color: "bg-purple-50 text-purple-600",
    articles: [
      { title: "SPF, DKIM, DMARC Setup Guide", slug: "email-authentication", popular: true },
      { title: "Google Workspace Integration", slug: "google-workspace" },
      { title: "Microsoft 365 Integration", slug: "microsoft-365" },
      { title: "Custom SMTP Configuration", slug: "custom-smtp" },
      { title: "Inbox Rotation Setup", slug: "inbox-rotation" },
    ],
  },
  {
    id: "deliverability",
    name: "Deliverability",
    icon: Zap,
    description: "Maximize your inbox placement rates.",
    color: "bg-yellow-50 text-yellow-600",
    articles: [
      { title: "Email Warmup Best Practices", slug: "email-warmup", popular: true },
      { title: "Improving Sender Reputation", slug: "sender-reputation" },
      { title: "Avoiding Spam Filters", slug: "avoid-spam" },
      { title: "Deliverability Troubleshooting", slug: "deliverability-issues" },
      { title: "Domain Health Monitoring", slug: "domain-health" },
    ],
  },
  {
    id: "campaigns",
    name: "Campaigns",
    icon: BarChart3,
    description: "Create and manage your outreach campaigns.",
    color: "bg-green-50 text-green-600",
    articles: [
      { title: "Creating Effective Sequences", slug: "sequences" },
      { title: "A/B Testing Your Emails", slug: "ab-testing", popular: true },
      { title: "Personalization Variables", slug: "personalization" },
      { title: "Scheduling and Timing", slug: "scheduling" },
      { title: "Campaign Analytics", slug: "analytics" },
    ],
  },
  {
    id: "team",
    name: "Team & Workspaces",
    icon: Users,
    description: "Collaborate with your team effectively.",
    color: "bg-indigo-50 text-indigo-600",
    articles: [
      { title: "Inviting Team Members", slug: "invite-team" },
      { title: "Roles and Permissions", slug: "permissions" },
      { title: "Creating Workspaces", slug: "workspaces" },
      { title: "Shared Templates", slug: "shared-templates" },
      { title: "Activity Logs", slug: "activity-logs" },
    ],
  },
  {
    id: "billing",
    name: "Billing & Plans",
    icon: CreditCard,
    description: "Manage your subscription and payments.",
    color: "bg-pink-50 text-pink-600",
    articles: [
      { title: "Understanding Our Plans", slug: "plans" },
      { title: "Upgrading Your Account", slug: "upgrade" },
      { title: "Managing Payment Methods", slug: "payment-methods" },
      { title: "Invoices and Receipts", slug: "invoices" },
      { title: "Cancellation Policy", slug: "cancellation" },
    ],
  },
  {
    id: "integrations",
    name: "Integrations",
    icon: Settings,
    description: "Connect with your favorite tools.",
    color: "bg-orange-50 text-orange-600",
    articles: [
      { title: "CRM Integrations Overview", slug: "crm-overview" },
      { title: "Salesforce Integration", slug: "salesforce" },
      { title: "HubSpot Integration", slug: "hubspot" },
      { title: "Zapier Automations", slug: "zapier" },
      { title: "API Documentation", slug: "api-docs" },
    ],
  },
  {
    id: "security",
    name: "Security & Privacy",
    icon: Shield,
    description: "Keep your data safe and compliant.",
    color: "bg-red-50 text-red-600",
    articles: [
      { title: "Security Overview", slug: "security-overview" },
      { title: "Two-Factor Authentication", slug: "2fa" },
      { title: "GDPR Compliance", slug: "gdpr" },
      { title: "Data Export", slug: "data-export" },
      { title: "Deleting Your Account", slug: "delete-account" },
    ],
  },
]

const popularArticles = [
  { title: "Quick Start Guide", category: "Getting Started", slug: "quick-start" },
  { title: "SPF, DKIM, DMARC Setup Guide", category: "Email Setup", slug: "email-authentication" },
  { title: "Email Warmup Best Practices", category: "Deliverability", slug: "email-warmup" },
  { title: "A/B Testing Your Emails", category: "Campaigns", slug: "ab-testing" },
  { title: "Setting Up Your First Campaign", category: "Getting Started", slug: "first-campaign" },
  { title: "Improving Sender Reputation", category: "Deliverability", slug: "sender-reputation" },
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ title: string; category: string; slug: string }[]>([])
  const [visibleCategories, setVisibleCategories] = useState<number[]>([])
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      const results: { title: string; category: string; slug: string }[] = []
      categories.forEach((category) => {
        category.articles.forEach((article) => {
          if (article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({ title: article.title, category: category.name, slug: article.slug })
          }
        })
      })
      setSearchResults(results.slice(0, 8))
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    categoryRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCategories((prev) => [...new Set([...prev, index])])
            }
          },
          { threshold: 0.1 },
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-neutral-900 to-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">How can we help?</h1>
          <p className="text-lg text-neutral-400 mb-10">Search our knowledge base or browse categories below.</p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search for articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-5 bg-white rounded-2xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
                {searchResults.map((result, i) => (
                  <Link
                    key={i}
                    href={`/help/${result.slug}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">{result.title}</p>
                      <p className="text-sm text-neutral-500">{result.category}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-6 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article, i) => (
              <Link
                key={i}
                href={`/help/${article.slug}`}
                className="group flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <BookOpen className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {article.title}
                  </p>
                  <p className="text-sm text-neutral-500">{article.category}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-neutral-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[index] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCategories.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index % 4) * 100}ms` }}
              >
                <div className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.articles.slice(0, 4).map((article, i) => (
                      <li key={i}>
                        <Link
                          href={`/help/${article.slug}`}
                          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          <ChevronRight className="w-3 h-3 text-neutral-300" />
                          {article.title}
                          {article.popular && (
                            <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded">
                              Popular
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/help/category/${category.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 hover:gap-2 transition-all"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-neutral-200">
              <div className="w-12 h-12 flex items-center justify-center bg-neutral-900 text-white rounded-xl mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Still need help?</h3>
              <p className="text-neutral-500 mb-6">
                Our support team is available 24/7 to help you with any questions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
                >
                  Contact Support
                </Link>
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-full font-medium hover:bg-neutral-50 transition-colors">
                  Start Live Chat
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-neutral-200">
              <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 rounded-xl mb-4">
                <ExternalLink className="w-6 h-6 text-neutral-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Developer Resources</h3>
              <p className="text-neutral-500 mb-6">Building with our API? Check out our developer documentation.</p>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 text-neutral-900 font-medium hover:gap-3 transition-all"
              >
                View API Docs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Was this helpful?</h2>
          <p className="text-neutral-500 mb-6">Help us improve our documentation by sharing your feedback.</p>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-full font-medium hover:bg-green-100 transition-colors">
              <ThumbsUp className="w-5 h-5" />
              Yes, it helped
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 rounded-full font-medium hover:bg-red-100 transition-colors">
              <ThumbsDown className="w-5 h-5" />
              No, I need more help
            </button>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
