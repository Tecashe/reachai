"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, X, ArrowLeft, Clock, CreditCard, HeadphonesIcon, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const comparisonData = [
  { category: "Email Accounts", mailfra: "Unlimited", smartlead: "Based on plan", winner: "mailfra" },
  { category: "Setup Time", mailfra: "5 minutes", smartlead: "30+ minutes", winner: "mailfra" },
  { category: "Learning Curve", mailfra: "Intuitive", smartlead: "Steep", winner: "mailfra" },
  { category: "Warmup Included", mailfra: true, smartlead: "Extra cost", winner: "mailfra" },
  { category: "API Access", mailfra: "Full", smartlead: "Limited tiers", winner: "mailfra" },
  { category: "White-label", mailfra: true, smartlead: "Enterprise only", winner: "mailfra" },
  { category: "Inbox Rotation", mailfra: "AI-powered", smartlead: "Manual", winner: "mailfra" },
  { category: "Lead Scoring", mailfra: true, smartlead: true, winner: "tie" },
  { category: "Unified Inbox", mailfra: true, smartlead: true, winner: "tie" },
  { category: "Custom Webhooks", mailfra: true, smartlead: "Extra cost", winner: "mailfra" },
  { category: "Support Response", mailfra: "< 2 hours", smartlead: "24-48 hours", winner: "mailfra" },
  { category: "Transparent Pricing", mailfra: true, smartlead: false, winner: "mailfra" },
]

const painPoints = [
  {
    icon: Clock,
    title: "Complex Setup",
    problem:
      "Smartlead's interface is notoriously confusing. Users report spending hours just to set up their first campaign.",
    solution: "Mailfra gets you sending in 5 minutes with our guided setup wizard.",
  },
  {
    icon: CreditCard,
    title: "Hidden Costs",
    problem: "Warmup, API access, and advanced features all cost extra. Your bill can quickly double.",
    solution: "Everything included in one transparent price. No surprises on your invoice.",
  },
  {
    icon: HeadphonesIcon,
    title: "Slow Support",
    problem: "Support tickets take days to get responses. Critical issues during campaigns go unresolved.",
    solution: "24/7 human support with < 2 hour response time. Real experts, not chatbots.",
  },
  {
    icon: Gauge,
    title: "Performance Issues",
    problem: "Users report slow dashboard loading, buggy analytics, and unreliable deliverability tracking.",
    solution: "Lightning-fast platform built for scale. Real-time analytics that actually work.",
  },
]

export default function VsSmartleadPage() {
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [activePain, setActivePain] = useState(0)

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
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-neutral-700 to-transparent rounded-full blur-3xl" />
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
                    src="/images/compare/smartlead-logo.jpg"
                    alt="Smartlead"
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
                Mailfra vs Smartlead
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-400 mb-8 max-w-lg"
              >
                Tired of Smartlead's complexity and hidden costs? Mailfra offers the same power with a fraction of the
                friction.
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
                  Watch demo
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Smartlead frustrations we solve</h3>
              <ul className="space-y-3">
                {[
                  "No more confusing UI - intuitive from day one",
                  "Transparent pricing - no hidden add-ons",
                  "Fast, responsive support when you need it",
                  "Reliable performance at any scale",
                  "All features included in every plan",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-300">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Common Smartlead frustrations</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We've heard these complaints from hundreds of Smartlead switchers. Here's how Mailfra solves each one.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pain point selector */}
            <div className="space-y-4">
              {painPoints.map((point, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActivePain(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-full text-left p-6 rounded-xl border transition-all ${
                    activePain === i
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activePain === i ? "bg-white/20" : "bg-neutral-100"
                      }`}
                    >
                      <point.icon className={`w-5 h-5 ${activePain === i ? "text-white" : "text-black"}`} />
                    </div>
                    <span className="font-semibold">{point.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Pain point detail */}
            <motion.div
              key={activePain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-neutral-200 p-8"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-2">
                    <X className="w-4 h-4" />
                    The Problem with Smartlead
                  </div>
                  <p className="text-neutral-700 text-lg">{painPoints[activePain].problem}</p>
                </div>
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
                    <Check className="w-4 h-4" />
                    The Mailfra Solution
                  </div>
                  <p className="text-neutral-700 text-lg">{painPoints[activePain].solution}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Feature comparison</h2>
            <p className="text-neutral-600">Everything Smartlead does, we do better - and more</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-semibold">Feature</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800">Mailfra</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800 text-neutral-400">
                Smartlead
              </div>
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
                    <span className="text-black font-medium">{row.mailfra}</span>
                  )}
                </div>
                <div className="p-4 flex justify-center items-center border-l border-neutral-200">
                  {row.smartlead === true ? (
                    <div className="w-6 h-6 bg-neutral-300 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-neutral-600" />
                    </div>
                  ) : row.smartlead === false ? (
                    <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-400" />
                    </div>
                  ) : (
                    <span className="text-neutral-500">{row.smartlead}</span>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Escape Smartlead complexity</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of teams who've switched from Smartlead to Mailfra. We'll migrate everything for free.
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
          </motion.div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
