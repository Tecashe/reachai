"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, Copy, Check, Search, X, Star, Download, Eye } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"

const categories = [
  { id: "all", name: "All Templates" },
  { id: "cold-intro", name: "Cold Intro" },
  { id: "follow-up", name: "Follow-Up" },
  { id: "breakup", name: "Breakup" },
  { id: "meeting", name: "Meeting Request" },
  { id: "referral", name: "Referral Ask" },
]

const templates = [
  {
    id: 1,
    name: "The Value-First Intro",
    category: "cold-intro",
    description: "Lead with immediate value before asking for anything. High conversion for B2B SaaS.",
    subject: "Quick question about {{company}}'s {{pain_point}}",
    body: `Hi {{first_name}},

I noticed {{company}} recently {{recent_trigger}} – congrats on the momentum.

We've helped similar companies like {{social_proof}} reduce their {{pain_point}} by {{percentage}}% in just {{timeframe}}.

Would a quick 15-minute call this week make sense to explore if we could do the same for {{company}}?

Best,
{{sender_name}}`,
    stats: { openRate: 67, replyRate: 12 },
    uses: 12847,
    rating: 4.9,
    premium: false,
  },
  {
    id: 2,
    name: "The Curiosity Hook",
    category: "cold-intro",
    description: "Creates intrigue without being salesy. Perfect for executive outreach.",
    subject: "{{first_name}}, quick thought on {{topic}}",
    body: `{{first_name}},

Came across something interesting while researching {{industry}} trends that made me think of {{company}}.

It's about how {{competitor}} is approaching {{challenge}} differently – and the results are surprising.

Worth a 10-minute conversation to share what I found?

{{sender_name}}`,
    stats: { openRate: 72, replyRate: 9 },
    uses: 8934,
    rating: 4.7,
    premium: false,
  },
  {
    id: 3,
    name: "The Gentle Nudge",
    category: "follow-up",
    description: "Perfect second touch that doesn't feel pushy. Adds new value.",
    subject: "Re: {{previous_subject}}",
    body: `Hi {{first_name}},

Wanted to follow up on my note from last week – I know things get busy.

Since then, I put together a quick analysis of how {{company}} could potentially {{benefit}}. Happy to share if helpful.

Either way, no pressure – just didn't want this to slip through the cracks if it's relevant.

{{sender_name}}`,
    stats: { openRate: 58, replyRate: 15 },
    uses: 15632,
    rating: 4.8,
    premium: false,
  },
  {
    id: 4,
    name: "The Final Goodbye",
    category: "breakup",
    description: "The last email in a sequence. Often gets the highest response.",
    subject: "Should I close your file?",
    body: `{{first_name}},

I've reached out a few times and haven't heard back, which tells me one of three things:

1. You're too busy right now (totally get it)
2. You're not the right person to talk to
3. This isn't a priority for {{company}}

If it's #1 or #2, just hit reply and let me know – I'm happy to reconnect later or reach out to someone else.

If it's #3, no hard feelings. I'll close out your file and won't bother you again.

Either way, wishing you well.

{{sender_name}}`,
    stats: { openRate: 45, replyRate: 22 },
    uses: 21456,
    rating: 4.9,
    premium: false,
  },
  {
    id: 5,
    name: "The Warm Referral",
    category: "referral",
    description: "Leverage mutual connections without being awkward.",
    subject: "{{mutual_connection}} suggested I reach out",
    body: `Hi {{first_name}},

{{mutual_connection}} mentioned you'd be the right person to talk to about {{topic}} at {{company}}.

We recently helped {{mutual_connection}}'s team {{achievement}}, and they thought we might be able to do something similar for you.

Would you be open to a quick intro call this week?

Best,
{{sender_name}}`,
    stats: { openRate: 78, replyRate: 28 },
    uses: 7823,
    rating: 4.9,
    premium: true,
  },
  {
    id: 6,
    name: "The Calendar Drop",
    category: "meeting",
    description: "Direct meeting request with flexibility. Works best after engagement.",
    subject: "15 min this week?",
    body: `{{first_name}},

Based on what I've seen, I think there's a real opportunity for {{company}} to {{benefit}}.

I have availability Thursday at 2pm or Friday at 10am – would either work for a quick call?

If not, feel free to grab a time that works better: {{calendar_link}}

Looking forward to it.

{{sender_name}}`,
    stats: { openRate: 52, replyRate: 18 },
    uses: 9245,
    rating: 4.6,
    premium: false,
  },
  {
    id: 7,
    name: "The Case Study Tease",
    category: "cold-intro",
    description: "Use social proof to build credibility and create FOMO.",
    subject: "How {{similar_company}} solved {{problem}}",
    body: `Hi {{first_name}},

Thought you might find this interesting – we recently helped {{similar_company}} tackle their {{problem}}.

The results:
• {{result_1}}
• {{result_2}}
• {{result_3}}

I put together a quick breakdown of how they did it. Want me to send it over?

{{sender_name}}`,
    stats: { openRate: 64, replyRate: 14 },
    uses: 11234,
    rating: 4.8,
    premium: true,
  },
  {
    id: 8,
    name: "The Quick Question",
    category: "follow-up",
    description: "Short and sweet follow-up that demands a response.",
    subject: "Quick question",
    body: `{{first_name}} – 

Is {{solving_problem}} still a priority for {{company}} this quarter?

{{sender_name}}`,
    stats: { openRate: 71, replyRate: 19 },
    uses: 18976,
    rating: 4.7,
    premium: false,
  },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = (template: (typeof templates)[0]) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => [...new Set([...prev, index])])
            }
          },
          { threshold: 0.1 },
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [filteredTemplates])

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">Template Library</span>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Proven Email Templates
              <br />
              <span className="text-neutral-400">That Convert</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Battle-tested cold email templates with real performance data. Copy, customize, and start closing deals.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12 py-8 border-y border-neutral-100">
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900">50+</p>
              <p className="text-sm text-neutral-500">Templates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900">15%</p>
              <p className="text-sm text-neutral-500">Avg Reply Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-900">2M+</p>
              <p className="text-sm text-neutral-500">Emails Sent</p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">No templates found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-4 text-neutral-900 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template.id}
                  ref={(el) => {
                    cardRefs.current[index] = el
                  }}
                  className={`transition-all duration-700 ${
                    visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                >
                  <div className="group relative bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    {template.premium && (
                      <span className="absolute -top-2 -right-2 px-2 py-1 bg-neutral-900 text-white text-xs font-medium rounded-full">
                        Premium
                      </span>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900 mb-1">{template.name}</h3>
                        <span className="text-xs text-neutral-400 uppercase tracking-wider">
                          {categories.find((c) => c.id === template.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium text-neutral-900">{template.rating}</span>
                      </div>
                    </div>

                    <p className="text-neutral-500 text-sm mb-4 flex-grow">{template.description}</p>

                    {/* Preview */}
                    <div className="bg-neutral-50 rounded-xl p-4 mb-4">
                      <p className="text-xs text-neutral-400 mb-1">Subject:</p>
                      <p className="text-sm text-neutral-700 font-medium mb-3 truncate">{template.subject}</p>
                      <p className="text-xs text-neutral-400 mb-1">Preview:</p>
                      <p className="text-sm text-neutral-600 line-clamp-2">{template.body.split("\n")[0]}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-neutral-600">{template.stats.openRate}% opens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-neutral-600">{template.stats.replyRate}% replies</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => copyToClipboard(template)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                      >
                        {copiedId === template.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-neutral-900">{selectedTemplate.name}</h3>
                <p className="text-sm text-neutral-500">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <label className="text-sm font-medium text-neutral-500 mb-2 block">Subject Line</label>
                <div className="p-4 bg-neutral-50 rounded-xl font-mono text-sm">{selectedTemplate.subject}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500 mb-2 block">Email Body</label>
                <div className="p-4 bg-neutral-50 rounded-xl font-mono text-sm whitespace-pre-wrap">
                  {selectedTemplate.body}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100 flex gap-3">
              <button
                onClick={() => {
                  copyToClipboard(selectedTemplate)
                  setSelectedTemplate(null)
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy Template
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-200 rounded-xl font-medium hover:bg-neutral-50 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to start sending?</h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            Get access to all premium templates plus AI-powered personalization to make them even more effective.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors">
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
