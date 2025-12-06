"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, TrendingUp, Users, Mail, Calendar } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"

const industries = [
  { id: "all", name: "All Industries" },
  { id: "agency", name: "Agencies" },
  { id: "saas", name: "SaaS" },
  { id: "recruiting", name: "Recruiting" },
  { id: "consulting", name: "Consulting" },
]

const caseStudies = [
  {
    id: 1,
    slug: "techscale-agency",
    company: "TechScale Agency",
    logo: "/images/case-studies/techscale-logo.jpg",
    industry: "agency",
    headline: "847 meetings booked in 90 days",
    description:
      "How a B2B marketing agency transformed their lead generation with automated cold outreach and scaled to 7 figures.",
    image: "/images/case-studies/techscale-hero.jpg",
    stats: [
      { label: "Meetings Booked", value: "847", change: "+312%" },
      { label: "Reply Rate", value: "18.4%", change: "+156%" },
      { label: "Revenue Generated", value: "$2.1M", change: "+428%" },
    ],
    quote:
      "Mailfra completely transformed our outbound motion. We went from struggling to book 10 meetings a month to consistently hitting 200+.",
    quotePerson: "Marcus Chen",
    quoteRole: "Founder & CEO",
    quoteAvatar: "/images/case-studies/marcus-chen.jpg",
    featured: true,
    readTime: "8 min read",
  },
  {
    id: 2,
    slug: "velocity-saas",
    company: "Velocity",
    logo: "/images/case-studies/velocity-logo.jpg",
    industry: "saas",
    headline: "4.2x increase in qualified demos",
    description:
      "A B2B SaaS startup used cold email to build a predictable pipeline and achieve product-market fit faster.",
    image: "/images/case-studies/velocity-hero.jpg",
    stats: [
      { label: "Demo Requests", value: "420%", change: "+320%" },
      { label: "Email Deliverability", value: "98.7%", change: "+12%" },
      { label: "Sales Cycle", value: "-34%", change: "Faster" },
    ],
    quote:
      "We were spending $50k/month on paid ads with diminishing returns. Mailfra helped us build a channel that costs a fraction and converts better.",
    quotePerson: "Sarah Patel",
    quoteRole: "VP of Growth",
    quoteAvatar: "/images/case-studies/sarah-patel.jpg",
    featured: false,
    readTime: "6 min read",
  },
  {
    id: 3,
    slug: "recruitpro-staffing",
    company: "RecruitPro",
    logo: "/images/case-studies/recruitpro-logo.jpg",
    industry: "recruiting",
    headline: "Placed 156 candidates in Q1",
    description: "A recruiting firm used personalized cold outreach to connect top talent with opportunities at scale.",
    image: "/images/case-studies/recruitpro-hero.jpg",
    stats: [
      { label: "Placements", value: "156", change: "+89%" },
      { label: "Response Rate", value: "24%", change: "+180%" },
      { label: "Time to Fill", value: "-45%", change: "Faster" },
    ],
    quote:
      "The personalization features are incredible. Candidates actually respond because our emails don't feel like spam.",
    quotePerson: "Jennifer Wu",
    quoteRole: "Managing Director",
    quoteAvatar: "/images/case-studies/jennifer-wu.jpg",
    featured: false,
    readTime: "5 min read",
  },
  {
    id: 4,
    slug: "stratex-consulting",
    company: "Stratex Consulting",
    logo: "/images/case-studies/stratex-logo.jpg",
    industry: "consulting",
    headline: "$890K in new engagements",
    description: "A boutique consulting firm landed enterprise clients through targeted executive outreach campaigns.",
    image: "/images/case-studies/stratex-hero.jpg",
    stats: [
      { label: "New Revenue", value: "$890K", change: "+267%" },
      { label: "Enterprise Deals", value: "12", change: "+400%" },
      { label: "Avg Deal Size", value: "$74K", change: "+45%" },
    ],
    quote:
      "We're now landing the Fortune 500 clients we always dreamed of. The inbox rotation keeps our deliverability perfect.",
    quotePerson: "David Kim",
    quoteRole: "Partner",
    quoteAvatar: "/images/case-studies/david-kim.jpg",
    featured: false,
    readTime: "7 min read",
  },
  {
    id: 5,
    slug: "growthlab-agency",
    company: "GrowthLab",
    logo: "/images/case-studies/growthlab-logo.jpg",
    industry: "agency",
    headline: "Scaled to 50 clients in 6 months",
    description: "A growth marketing agency used cold email as their primary client acquisition channel from day one.",
    image: "/images/case-studies/growthlab-hero.jpg",
    stats: [
      { label: "New Clients", value: "50", change: "From 0" },
      { label: "MRR", value: "$127K", change: "+100%" },
      { label: "Client Churn", value: "4%", change: "-67%" },
    ],
    quote: "We built our entire agency on the back of Mailfra. It's the most reliable channel we have.",
    quotePerson: "Alex Rivera",
    quoteRole: "Co-founder",
    quoteAvatar: "/images/case-studies/alex-rivera.jpg",
    featured: false,
    readTime: "6 min read",
  },
  {
    id: 6,
    slug: "nexgen-saas",
    company: "NexGen Analytics",
    logo: "/images/case-studies/nexgen-logo.jpg",
    industry: "saas",
    headline: "Series A raised with cold outreach pipeline",
    description: "A data analytics startup used their Mailfra-powered pipeline as proof of traction to raise $8M.",
    image: "/images/case-studies/nexgen-hero.jpg",
    stats: [
      { label: "Pipeline Built", value: "$4.2M", change: "6 months" },
      { label: "Investor Meetings", value: "34", change: "Via cold email" },
      { label: "Series A", value: "$8M", change: "Raised" },
    ],
    quote: "Investors wanted to see repeatable growth. Our Mailfra metrics showed exactly that.",
    quotePerson: "Priya Sharma",
    quoteRole: "CEO & Founder",
    quoteAvatar: "/images/case-studies/priya-sharma.jpg",
    featured: false,
    readTime: "9 min read",
  },
]

export default function CaseStudiesPage() {
  const [activeIndustry, setActiveIndustry] = useState("all")
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const featuredStudy = caseStudies.find((s) => s.featured)
  const filteredStudies = caseStudies.filter(
    (s) => !s.featured && (activeIndustry === "all" || s.industry === activeIndustry),
  )

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
  }, [filteredStudies])

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">Success Stories</span>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              Real Results from
              <br />
              <span className="text-neutral-400">Real Companies</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              See how teams like yours are using Mailfra to scale their outbound and drive predictable revenue growth.
            </p>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Mail, value: "47M+", label: "Emails Sent" },
              { icon: Users, value: "12,500+", label: "Happy Customers" },
              { icon: TrendingUp, value: "98.7%", label: "Avg Deliverability" },
              { icon: Calendar, value: "2.1M", label: "Meetings Booked" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 text-center">
                <stat.icon className="w-6 h-6 text-neutral-400 mx-auto mb-3" />
                <p className="text-3xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Featured Case Study */}
          {featuredStudy && (
            <Link href={`/case-studies/${featuredStudy.slug}`} className="group block mb-16">
              <div className="relative rounded-3xl overflow-hidden bg-neutral-900">
                <div className="absolute inset-0">
                  <Image
                    src={featuredStudy.image || "/placeholder.svg"}
                    alt={featuredStudy.company}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent" />
                </div>

                <div className="relative z-10 grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={featuredStudy.logo || "/placeholder.svg"}
                        alt={featuredStudy.company}
                        width={48}
                        height={48}
                        className="rounded-xl"
                      />
                      <div>
                        <p className="text-white font-semibold">{featuredStudy.company}</p>
                        <p className="text-neutral-500 text-sm">
                          {industries.find((i) => i.id === featuredStudy.industry)?.name}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredStudy.headline}</h2>
                    <p className="text-neutral-400 text-lg mb-8">{featuredStudy.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {featuredStudy.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-4">
                          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-xs text-neutral-500">{stat.label}</p>
                          <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all">
                      Read Full Story
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col justify-center">
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                      <p className="text-white text-lg italic mb-6">&ldquo;{featuredStudy.quote}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        <Image
                          src={featuredStudy.quoteAvatar || "/placeholder.svg"}
                          alt={featuredStudy.quotePerson}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{featuredStudy.quotePerson}</p>
                          <p className="text-neutral-500 text-sm">
                            {featuredStudy.quoteRole}, {featuredStudy.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Other Case Studies */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setActiveIndustry(industry.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeIndustry === industry.id
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study, index) => (
              <div
                key={study.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${(index % 3) * 100}ms` }}
              >
                <Link href={`/case-studies/${study.slug}`} className="group block h-full">
                  <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={study.image || "/placeholder.svg"}
                        alt={study.company}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={study.logo || "/placeholder.svg"}
                            alt={study.company}
                            width={36}
                            height={36}
                            className="rounded-lg"
                          />
                          <span className="text-white font-medium">{study.company}</span>
                        </div>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white">
                          {industries.find((i) => i.id === study.industry)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">
                        {study.headline}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-4 line-clamp-2 flex-grow">{study.description}</p>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {study.stats.slice(0, 3).map((stat, i) => (
                          <div key={i} className="bg-neutral-50 rounded-lg p-2 text-center">
                            <p className="font-bold text-neutral-900 text-sm">{stat.value}</p>
                            <p className="text-xs text-neutral-400 truncate">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-400">{study.readTime}</span>
                        <span className="flex items-center gap-1 text-neutral-900 font-medium group-hover:gap-2 transition-all">
                          Read More
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to write your success story?</h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of companies using Mailfra to scale their outbound and grow revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
