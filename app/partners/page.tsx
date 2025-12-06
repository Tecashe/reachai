"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, Check, Star, Award, Zap, Users, DollarSign, BookOpen, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const tiers = [
  {
    name: "Affiliate",
    icon: Star,
    description: "Perfect for content creators and influencers",
    commission: "20%",
    color: "from-gray-500 to-gray-700",
    benefits: [
      "20% recurring commission",
      "Unique referral link",
      "Marketing materials",
      "Monthly payouts",
      "Partner dashboard",
    ],
    requirements: ["500+ social followers", "Active content creator"],
  },
  {
    name: "Agency",
    icon: Award,
    featured: true,
    description: "For agencies managing multiple client accounts",
    commission: "30%",
    color: "from-white to-gray-300",
    benefits: [
      "30% recurring commission",
      "White-label dashboard",
      "Bulk account management",
      "Priority support",
      "Co-marketing opportunities",
      "Dedicated partner manager",
      "Custom integrations",
    ],
    requirements: ["5+ active client accounts", "Proven agency track record"],
  },
  {
    name: "Technology",
    icon: Zap,
    description: "For SaaS products looking to integrate",
    commission: "Revenue share",
    color: "from-gray-600 to-gray-800",
    benefits: [
      "API access",
      "Technical documentation",
      "Integration support",
      "Co-development opportunities",
      "Joint marketing",
      "Featured in marketplace",
    ],
    requirements: ["Complementary product", "Technical integration capability"],
  },
]

const partners = [
  { name: "LeadGen Pro", logo: "/images/partners/leadgen.jpg", type: "Technology" },
  { name: "SalesForce Consulting", logo: "/images/partners/salesforce-consulting.jpg", type: "Agency" },
  { name: "Growth Hackers Inc", logo: "/images/partners/growth-hackers.jpg", type: "Agency" },
  { name: "CRM Connect", logo: "/images/partners/crm-connect.jpg", type: "Technology" },
  { name: "Outbound Academy", logo: "/images/partners/outbound-academy.jpg", type: "Affiliate" },
  { name: "Pipeline Partners", logo: "/images/partners/pipeline.jpg", type: "Agency" },
]

const benefits = [
  {
    icon: DollarSign,
    title: "Generous Commissions",
    description: "Earn up to 30% recurring revenue on every customer you refer. Paid monthly, forever.",
  },
  {
    icon: BookOpen,
    title: "Marketing Resources",
    description: "Access to co-branded materials, case studies, and sales enablement content.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Direct line to our partner team for technical help and deal support.",
  },
  {
    icon: Users,
    title: "Partner Community",
    description: "Join a network of successful partners. Learn, share, and grow together.",
  },
]

const stats = [
  { value: "$2M+", label: "Paid to Partners" },
  { value: "500+", label: "Active Partners" },
  { value: "30%", label: "Max Commission" },
  { value: "24hr", label: "Support Response" },
]

export default function PartnersPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    tier: "",
    message: "",
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-32 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1
            id="hero-title"
            data-animate
            className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${
              visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Partner with
            <br />
            Mailfra
          </h1>
          <p
            id="hero-subtitle"
            data-animate
            className={`text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-200 ${
              visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Join our partner ecosystem and grow your business while helping sales teams succeed. Earn generous
            commissions and access exclusive resources.
          </p>

          <div
            id="hero-stats"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
              visibleSections.has("hero-stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="benefits-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("benefits-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Why Partner With Us?
          </h2>
          <p
            id="benefits-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("benefits-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            We invest in our partners&apos; success
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  id={`benefit-${index}`}
                  data-animate
                  className={`text-center transition-all duration-500 ${
                    visibleSections.has(`benefit-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-white/60">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="tiers-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("tiers-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Partnership Tiers
          </h2>
          <p
            id="tiers-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("tiers-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Choose the partnership level that fits your business
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier, index) => {
              const Icon = tier.icon
              return (
                <div
                  key={tier.name}
                  id={`tier-${index}`}
                  data-animate
                  className={`relative group transition-all duration-500 ${
                    visibleSections.has(`tier-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div
                    className={`h-full p-8 rounded-2xl border transition-all duration-300 ${
                      tier.featured
                        ? "bg-white text-black border-white"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                        tier.featured ? "bg-black/10" : "bg-white/10"
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className={`mb-4 ${tier.featured ? "text-black/60" : "text-white/60"}`}>{tier.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">{tier.commission}</span>
                      {tier.commission !== "Revenue share" && (
                        <span className={tier.featured ? "text-black/60" : "text-white/60"}> commission</span>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {tier.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 mt-0.5 ${tier.featured ? "text-black" : "text-white"}`} />
                          <span className={tier.featured ? "text-black/80" : "text-white/80"}>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`pt-6 border-t ${tier.featured ? "border-black/10" : "border-white/10"}`}>
                      <p className={`text-sm mb-3 ${tier.featured ? "text-black/50" : "text-white/50"}`}>
                        Requirements:
                      </p>
                      <ul className={`text-sm space-y-1 ${tier.featured ? "text-black/70" : "text-white/70"}`}>
                        {tier.requirements.map((req) => (
                          <li key={req}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={`w-full mt-6 ${
                        tier.featured
                          ? "bg-black text-white hover:bg-black/80"
                          : "bg-white text-black hover:bg-white/90"
                      }`}
                    >
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="partners-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("partners-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our Partners
          </h2>
          <p
            id="partners-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("partners-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Join these successful companies in our partner network
          </p>

          <div
            id="partners-grid"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 transition-all duration-700 delay-200 ${
              visibleSections.has("partners-grid") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group aspect-square bg-white/5 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div className="w-16 h-16 relative mb-4">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    fill
                    className="object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-xs text-white/40">{partner.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto">
          <h2
            id="form-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("form-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Apply to Partner
          </h2>
          <p
            id="form-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center mb-12 transition-all duration-700 delay-100 ${
              visibleSections.has("form-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Fill out the form below and we&apos;ll be in touch within 24 hours
          </p>

          <form
            onSubmit={handleSubmit}
            id="form-container"
            data-animate
            className={`space-y-6 transition-all duration-700 delay-200 ${
              visibleSections.has("form-container") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Partnership Type</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                required
              >
                <option value="">Select a tier</option>
                <option value="affiliate">Affiliate Partner</option>
                <option value="agency">Agency Partner</option>
                <option value="technology">Technology Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tell us about your business</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="What do you do and how would you like to partner with us?"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-white/90">
              Submit Application <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
