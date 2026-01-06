"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const competitors = [
  {
    name: "Instantly",
    slug: "instantly",
    logo: "/images/compare/instantly-logo.jpg",
    tagline: "Popular but limited",
    weaknesses: ["No native CRM", "Basic analytics", "Limited API"],
  },
  {
    name: "Smartlead",
    slug: "smartlead",
    logo: "/images/compare/smartlead-logo.jpg",
    tagline: "Complex pricing",
    weaknesses: ["Steep learning curve", "Extra costs for features", "Slow support"],
  },
  {
    name: "Lemlist",
    slug: "lemlist",
    logo: "/images/compare/lemlist-logo.jpg",
    tagline: "Expensive at scale",
    weaknesses: ["Per-seat pricing", "Limited sending volume", "No inbox rotation"],
  },
  {
    name: "Apollo",
    slug: "apollo",
    logo: "/images/compare/apollo-logo.jpg",
    tagline: "Jack of all trades",
    weaknesses: ["Deliverability issues", "Data quality concerns", "Feature bloat"],
  },
]

const comparisonFeatures = [
  { feature: "Unlimited Email Accounts", mailfra: true, others: "Limited" },
  { feature: "AI-Powered Warmup", mailfra: true, others: "Basic" },
  { feature: "Smart Inbox Rotation", mailfra: true, others: "Manual" },
  { feature: "Advanced Analytics", mailfra: true, others: "Basic" },
  { feature: "Native CRM Integration", mailfra: true, others: "Partial" },
  { feature: "API Access", mailfra: "Full", others: "Limited" },
  { feature: "24/7 Support", mailfra: true, others: "Business hours" },
  { feature: "Custom Sending Limits", mailfra: true, others: false },
]

export default function ComparePage() {
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")
            setVisibleRows((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        })
      },
      { threshold: 0.3 },
    )

    const rows = document.querySelectorAll("[data-index]")
    rows.forEach((row) => observer.observe(row))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-black text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-neutral-400 text-sm uppercase tracking-widest mb-4"
          >
            Comparison
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
          >
            See how Mailfra
            <br />
            <span className="text-neutral-400">stacks up</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12"
          >
            We believe in transparency. Compare Mailfra against the leading cold email platforms and see why thousands
            are making the switch.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: "47%", label: "Higher deliverability" },
              { value: "3x", label: "Faster campaign setup" },
              { value: "60%", label: "Cost savings vs competitors" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Competitor Cards */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Choose your comparison</h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Select a competitor to see a detailed feature-by-feature breakdown
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitors.map((competitor, i) => (
              <motion.div
                key={competitor.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/compare/${competitor.slug}`}>
                  <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-black hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                      <Image
                        src={competitor.logo || "/placeholder.svg"}
                        alt={competitor.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-1">vs {competitor.name}</h3>
                    <p className="text-sm text-neutral-500 mb-4">{competitor.tagline}</p>
                    <ul className="space-y-2 mb-6">
                      {competitor.weaknesses.map((weakness, j) => (
                        <li key={j} className="text-sm text-neutral-600 flex items-center gap-2">
                          <X className="w-4 h-4 text-red-500" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center text-black font-medium group-hover:gap-3 gap-2 transition-all">
                      See full comparison <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-20 px-4 bg-white" ref={tableRef}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">At a glance</h2>
            <p className="text-neutral-600">How Mailfra compares across key features</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
            {/* Header */}
            <div className="grid grid-cols-3 bg-black text-white p-4">
              <div className="font-semibold">Feature</div>
              <div className="font-semibold text-center">Mailfra</div>
              <div className="font-semibold text-center">Others</div>
            </div>

            {/* Rows */}
            {comparisonFeatures.map((row, i) => (
              <div
                key={i}
                data-index={i}
                className={`grid grid-cols-3 p-4 border-b border-neutral-200 last:border-b-0 transition-all duration-500 ${
                  visibleRows.includes(i) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="text-neutral-800 font-medium">{row.feature}</div>
                <div className="flex justify-center">
                  {row.mailfra === true ? (
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-black font-medium">{row.mailfra}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.others === false ? (
                    <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-500" />
                    </div>
                  ) : (
                    <span className="text-neutral-500">{row.others}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration CTA */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to switch?</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              We make migration painless. Import your campaigns, contacts, and settings in minutes. Plus, get 3 months
              free when you switch from a competitor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-200">
                Start free migration
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 text-white hover:bg-neutral-800 bg-transparent"
              >
                Talk to sales
              </Button>
            </div>
            <p className="text-sm text-neutral-500 mt-6">No credit card required. Free 14-day trial.</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials from switchers */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why they switched</h2>
            <p className="text-neutral-600">Hear from customers who made the move to Mailfra</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "We were paying 3x more with Instantly for half the features. Mailfra paid for itself in the first week.",
                author: "Michael Torres",
                role: "Sales Director, TechCorp",
                from: "Instantly",
                image: "/images/compare/testimonial-1.jpg",
              },
              {
                quote:
                  "The inbox rotation alone increased our reply rates by 40%. Should have switched from Smartlead months ago.",
                author: "Simon M",
                role: "Founder, GrowthLab",
                from: "Smartlead",
                image: "/images/compare/testimonial-2.jpg",
              },
              {
                quote:
                  "Lemlist's per-seat pricing was killing us. With Mailfra, our whole team has access for a flat rate.",
                author: "James Wilson",
                role: "Head of Sales, ScaleUp",
                from: "Lemlist",
                image: "/images/compare/testimonial-3.jpg",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-neutral-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-neutral-500">Switched from</span>
                  <span className="text-xs font-medium text-black bg-neutral-100 px-2 py-1 rounded">
                    {testimonial.from}
                  </span>
                </div>
                <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-black text-sm">{testimonial.author}</div>
                    <div className="text-xs text-neutral-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
