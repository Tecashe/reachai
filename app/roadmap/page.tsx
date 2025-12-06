"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useRef, useState } from "react"
import { Check, Clock, Sparkles, ChevronUp, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

type Status = "completed" | "in-progress" | "planned" | "considering"

interface RoadmapItem {
  id: string
  title: string
  description: string
  status: Status
  votes: number
  comments: number
  category: string
  eta?: string
}

const roadmapItems: RoadmapItem[] = [
  {
    id: "1",
    title: "AI Email Writer",
    description: "Generate entire email sequences with AI. Just describe your target audience and goals.",
    status: "in-progress",
    votes: 847,
    comments: 124,
    category: "AI Features",
    eta: "December 2024",
  },
  {
    id: "2",
    title: "CRM Auto-Sync",
    description: "Real-time bidirectional sync with Salesforce, HubSpot, and Pipedrive. No manual imports.",
    status: "in-progress",
    votes: 623,
    comments: 89,
    category: "Integrations",
    eta: "December 2024",
  },
  {
    id: "3",
    title: "Mobile App",
    description: "Native iOS and Android apps for managing campaigns and responding to leads on the go.",
    status: "planned",
    votes: 1243,
    comments: 203,
    category: "Platform",
    eta: "Q1 2025",
  },
  {
    id: "4",
    title: "Video Prospecting",
    description: "Record and send personalized video messages within your email sequences.",
    status: "planned",
    votes: 456,
    comments: 67,
    category: "Features",
    eta: "Q1 2025",
  },
  {
    id: "5",
    title: "Intent Data Integration",
    description: "Integrate with Bombora and 6sense to prioritize leads showing buying intent.",
    status: "planned",
    votes: 389,
    comments: 45,
    category: "Integrations",
    eta: "Q1 2025",
  },
  {
    id: "6",
    title: "WhatsApp Integration",
    description: "Add WhatsApp messages as a touchpoint in your multi-channel sequences.",
    status: "considering",
    votes: 567,
    comments: 78,
    category: "Integrations",
  },
  {
    id: "7",
    title: "Custom Domains for Tracking",
    description: "Use your own domains for link tracking to improve deliverability.",
    status: "completed",
    votes: 234,
    comments: 34,
    category: "Deliverability",
  },
  {
    id: "8",
    title: "Team Analytics Dashboard",
    description: "Performance metrics across your entire team with individual breakdowns.",
    status: "completed",
    votes: 445,
    comments: 56,
    category: "Analytics",
  },
  {
    id: "9",
    title: "Bounce Shield",
    description: "AI-powered email verification that prevents bounces before they happen.",
    status: "considering",
    votes: 678,
    comments: 92,
    category: "Deliverability",
  },
  {
    id: "10",
    title: "Zapier Triggers",
    description: "More Zapier triggers including reply received, lead converted, and more.",
    status: "completed",
    votes: 312,
    comments: 41,
    category: "Integrations",
  },
]

const statusConfig: Record<Status, { label: string; color: string; bgColor: string; icon: typeof Check }> = {
  completed: { label: "Shipped", color: "text-emerald-600", bgColor: "bg-emerald-500/10", icon: Check },
  "in-progress": { label: "In Progress", color: "text-blue-600", bgColor: "bg-blue-500/10", icon: Clock },
  planned: { label: "Planned", color: "text-amber-600", bgColor: "bg-amber-500/10", icon: Sparkles },
  considering: { label: "Under Review", color: "text-muted-foreground", bgColor: "bg-muted", icon: MessageSquare },
}

const statusOrder: Status[] = ["in-progress", "planned", "considering", "completed"]

export default function RoadmapPage() {
  const [votedItems, setVotedItems] = useState<string[]>([])
  const [filter, setFilter] = useState<Status | "all">("all")
  const [visibleCards, setVisibleCards] = useState<string[]>([])
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const filteredItems = roadmapItems.filter((item) => filter === "all" || item.status === filter)

  const groupedItems = statusOrder.reduce(
    (acc, status) => {
      acc[status] = filteredItems.filter((item) => item.status === status)
      return acc
    },
    {} as Record<Status, RoadmapItem[]>,
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, entry.target.id])])
          }
        })
      },
      { threshold: 0.1 },
    )

    cardRefs.current.forEach((ref) => observer.observe(ref))

    return () => observer.disconnect()
  }, [filter])

  const handleVote = (itemId: string) => {
    setVotedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
            <Sparkles className="w-4 h-4" />
            Public Roadmap
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            What we're building
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            See what's coming next and vote on the features you want most. Your feedback shapes our product.
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`h-10 px-5 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {statusOrder.map((status) => {
              const config = statusConfig[status]
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`h-10 px-5 rounded-full text-sm font-medium transition-all ${
                    filter === status
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filter === "all" ? (
            // Kanban-style view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statusOrder.map((status) => {
                const config = statusConfig[status]
                const items = groupedItems[status]

                return (
                  <div key={status} className="space-y-4">
                    {/* Column header */}
                    <div className="flex items-center gap-2 px-2">
                      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <span className="font-semibold text-foreground">{config.label}</span>
                      <span className="text-sm text-muted-foreground">({items.length})</span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          id={item.id}
                          ref={(el) => {
                            if (el) cardRefs.current.set(item.id, el)
                          }}
                          className="group bg-background rounded-xl border border-border p-5 hover:border-foreground/20 transition-all duration-500"
                          style={{
                            opacity: visibleCards.includes(item.id) ? 1 : 0,
                            transform: visibleCards.includes(item.id) ? "translateY(0)" : "translateY(20px)",
                            transitionDelay: `${index * 50}ms`,
                          }}
                        >
                          {/* Category */}
                          <span className="text-xs text-muted-foreground mb-2 block">{item.category}</span>

                          {/* Title */}
                          <h3 className="font-semibold text-foreground mb-2 leading-snug">{item.title}</h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                          {/* ETA */}
                          {item.eta && (
                            <div className="text-xs text-muted-foreground mb-4">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {item.eta}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <button
                              onClick={() => handleVote(item.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                votedItems.includes(item.id)
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <ChevronUp className="w-4 h-4" />
                              {item.votes + (votedItems.includes(item.id) ? 1 : 0)}
                            </button>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              {item.comments}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // List view for filtered results
            <div className="max-w-3xl mx-auto space-y-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  id={item.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(item.id, el)
                  }}
                  className="group bg-background rounded-xl border border-border p-6 hover:border-foreground/20 transition-all duration-500"
                  style={{
                    opacity: visibleCards.includes(item.id) ? 1 : 0,
                    transform: visibleCards.includes(item.id) ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex gap-4">
                    {/* Vote button */}
                    <button
                      onClick={() => handleVote(item.id)}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all flex-shrink-0 ${
                        votedItems.includes(item.id)
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ChevronUp className="w-5 h-5" />
                      <span className="text-sm font-bold">{item.votes + (votedItems.includes(item.id) ? 1 : 0)}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                        {item.eta && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{item.eta}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Suggest Feature CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Have a feature in mind?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            We'd love to hear from you. Submit your ideas and help shape the future of mailfra.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-14 px-8 bg-foreground text-background font-medium rounded-full items-center gap-2 hover:bg-foreground/90 transition-all"
          >
            Submit Feature Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
