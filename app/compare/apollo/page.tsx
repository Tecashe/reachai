"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, X, ArrowLeft, Target, Database, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const comparisonData = [
  { category: "Core Focus", mailfra: "Cold email mastery", apollo: "All-in-one sales", winner: "mailfra" },
  { category: "Deliverability", mailfra: "Industry-leading", apollo: "Known issues", winner: "mailfra" },
  { category: "Email Warmup", mailfra: "AI-powered, included", apollo: "Basic", winner: "mailfra" },
  { category: "Inbox Rotation", mailfra: true, apollo: false, winner: "mailfra" },
  { category: "Sending Infrastructure", mailfra: "Dedicated", apollo: "Shared", winner: "mailfra" },
  { category: "Contact Database", mailfra: "Integrations", apollo: "275M+ contacts", winner: "apollo" },
  { category: "Data Enrichment", mailfra: "Via integrations", apollo: "Built-in", winner: "apollo" },
  { category: "Sequence Builder", mailfra: "Advanced", apollo: "Advanced", winner: "tie" },
  { category: "A/B Testing", mailfra: "Multi-variant", apollo: "Basic", winner: "mailfra" },
  { category: "Analytics", mailfra: "Real-time", apollo: "Delayed", winner: "mailfra" },
  { category: "UI Simplicity", mailfra: "Clean, focused", apollo: "Complex", winner: "mailfra" },
  { category: "Onboarding Time", mailfra: "< 1 hour", apollo: "Days/weeks", winner: "mailfra" },
]

const focusAreas = [
  {
    icon: Target,
    title: "Specialized vs Generalized",
    description:
      "Apollo tries to be everything - prospecting, CRM, calling, and email. We focus exclusively on cold email, which means every feature is optimized for deliverability and conversions.",
  },
  {
    icon: Shield,
    title: "Deliverability First",
    description:
      "Apollo's shared sending infrastructure leads to deliverability issues. Our dedicated infrastructure and AI warmup keeps you in the primary inbox.",
  },
  {
    icon: Database,
    title: "Quality Over Quantity",
    description:
      "Apollo's massive database sounds impressive, but data quality issues are common. We integrate with best-in-class data providers so you get accurate contacts.",
  },
  {
    icon: Zap,
    title: "Speed to Value",
    description:
      "Apollo's feature bloat means weeks of onboarding. Mailfra gets you sending quality campaigns in under an hour.",
  },
]

export default function VsApolloPage() {
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-row") || "0")
            setVisibleRows((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        })
      },
      { threshold: 0.2 },
    )

    const rows = document.querySelectorAll("[data-row]")
    rows.forEach((row) => observer.observe(row))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-neutral-700 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All comparisons
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-black font-bold text-lg">M</span>
                </div>
                <span className="text-neutral-500">vs</span>
                <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden">
                  <Image
                    src="/images/compare/apollo-logo.jpg"
                    alt="Apollo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Mailfra vs Apollo
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-400 mb-8 max-w-lg"
              >
                Apollo is a jack of all trades, master of none. If cold email is your focus, you need a specialist.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="bg-white text-black hover:bg-neutral-200">
                  Start free trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-neutral-800 bg-transparent"
                >
                  See deliverability data
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Apollo's cold email weaknesses</h3>
              <ul className="space-y-3">
                {[
                  "Shared infrastructure hurts deliverability",
                  "Feature bloat creates confusion",
                  "Basic warmup capabilities",
                  "No smart inbox rotation",
                  "Complex UI slows you down",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialist vs Generalist */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Specialist beats generalist</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Apollo tries to be your prospecting tool, CRM, dialer, and email platform. We do one thing exceptionally
              well.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {focusAreas.map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-neutral-200"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                  <area.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{area.title}</h3>
                <p className="text-neutral-600">{area.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverability Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">The deliverability difference</h2>
            <p className="text-neutral-600">
              Apollo's shared infrastructure is a known weak point. Here's how our approaches differ.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black text-white rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Mailfra</h3>
              <ul className="space-y-4">
                {[
                  { label: "Sending Infrastructure", value: "Dedicated IPs per account" },
                  { label: "Warmup Method", value: "AI-powered, real interactions" },
                  { label: "Inbox Rotation", value: "Smart, automatic" },
                  { label: "Avg. Inbox Placement", value: "94.7%" },
                  { label: "Spam Rate", value: "< 0.1%" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-b-0"
                  >
                    <span className="text-neutral-400">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-neutral-100 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-neutral-600 mb-6">Apollo</h3>
              <ul className="space-y-4">
                {[
                  { label: "Sending Infrastructure", value: "Shared pools" },
                  { label: "Warmup Method", value: "Basic, limited" },
                  { label: "Inbox Rotation", value: "Not available" },
                  { label: "Avg. Inbox Placement", value: "~70%" },
                  { label: "Spam Rate", value: "Variable" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0"
                  >
                    <span className="text-neutral-500">{item.label}</span>
                    <span className="font-semibold text-neutral-600">{item.value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* When to use which */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Choose the right tool</h2>
            <p className="text-neutral-600">Be honest about what you need</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="flex border-b border-neutral-200">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 0 ? "bg-black text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Choose Mailfra if...
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 1 ? "bg-black text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                Consider Apollo if...
              </button>
            </div>

            <div className="p-8">
              {activeTab === 0 ? (
                <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {[
                    "Cold email is your primary outreach channel",
                    "Deliverability is critical to your success",
                    "You want a focused tool that does one thing well",
                    "You already have a prospecting tool and need dedicated email",
                    "You're sending at scale and need reliability",
                    "You value speed and simplicity over feature count",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {[
                    "You need an all-in-one sales platform",
                    "Contact database access is more important than deliverability",
                    "You're starting from scratch with no existing tools",
                    "Cold email is just one small part of your outreach",
                    "You don't mind complexity in exchange for features",
                    "Volume matters more than inbox placement rates",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-neutral-300 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-neutral-600" />
                      </div>
                      <span className="text-neutral-600">{item}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Full comparison</h2>
          </div>

          <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-semibold">Feature</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800">Mailfra</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800 text-neutral-400">Apollo</div>
            </div>

            {comparisonData.map((row, i) => (
              <div
                key={i}
                data-row={i}
                className={`grid grid-cols-3 border-b border-neutral-200 last:border-b-0 transition-all duration-500 ${
                  visibleRows.includes(i) ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <div className="p-4 text-neutral-800 font-medium">{row.category}</div>
                <div className="p-4 flex justify-center items-center border-l border-neutral-200">
                  {row.mailfra === true ? (
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className={`font-medium ${row.winner === "mailfra" ? "text-black" : "text-neutral-600"}`}>
                      {row.mailfra}
                    </span>
                  )}
                </div>
                <div className="p-4 flex justify-center items-center border-l border-neutral-200">
                  {row.apollo === true ? (
                    <div className="w-6 h-6 bg-neutral-300 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-neutral-600" />
                    </div>
                  ) : row.apollo === false ? (
                    <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-400" />
                    </div>
                  ) : (
                    <span className={`${row.winner === "apollo" ? "font-medium text-black" : "text-neutral-500"}`}>
                      {row.apollo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Focus on what matters</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              If cold email is your growth engine, you need a platform built specifically for deliverability and
              conversions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-200">
                Start free trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 text-white hover:bg-neutral-800 bg-transparent"
              >
                See deliverability report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
