"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Check, X, ArrowLeft, Zap, Shield, DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const comparisonData = [
  { category: "Email Accounts", mailfra: "Unlimited", instantly: "Based on plan", winner: "mailfra" },
  { category: "Warmup Emails/Day", mailfra: "Unlimited", instantly: "200/account", winner: "mailfra" },
  { category: "AI Subject Lines", mailfra: true, instantly: true, winner: "tie" },
  { category: "Smart Inbox Rotation", mailfra: true, instantly: "Manual only", winner: "mailfra" },
  { category: "Native CRM", mailfra: true, instantly: false, winner: "mailfra" },
  { category: "API Access", mailfra: "Full REST API", instantly: "Limited", winner: "mailfra" },
  { category: "Team Workspaces", mailfra: "Unlimited", instantly: "Extra cost", winner: "mailfra" },
  { category: "A/B Testing", mailfra: "Advanced", instantly: "Basic", winner: "mailfra" },
  { category: "Analytics Dashboard", mailfra: "Real-time", instantly: "Delayed", winner: "mailfra" },
  { category: "Deliverability Monitoring", mailfra: true, instantly: "Partial", winner: "mailfra" },
  { category: "Custom Tracking Domain", mailfra: true, instantly: true, winner: "tie" },
  { category: "Webhooks", mailfra: true, instantly: "Limited", winner: "mailfra" },
  { category: "Priority Support", mailfra: "24/7", instantly: "Business hours", winner: "mailfra" },
  { category: "Onboarding", mailfra: "White-glove", instantly: "Self-serve", winner: "mailfra" },
]

const pricingComparison = [
  {
    tier: "Starter",
    mailfra: "$49/mo",
    instantly: "$37/mo",
    mailfraFeatures: "3 accounts, 5K emails",
    instantlyFeatures: "1 account, 1K emails",
  },
  {
    tier: "Growth",
    mailfra: "$99/mo",
    instantly: "$97/mo",
    mailfraFeatures: "Unlimited accounts, 50K emails",
    instantlyFeatures: "5 accounts, 10K emails",
  },
  {
    tier: "Scale",
    mailfra: "$199/mo",
    instantly: "$297/mo",
    mailfraFeatures: "Unlimited everything + API",
    instantlyFeatures: "25 accounts, 100K emails",
  },
]

const switchReasons = [
  {
    icon: Zap,
    title: "Better Deliverability",
    description:
      "Our AI-powered warmup and smart rotation keeps you out of spam folders where Instantly users often end up.",
    stat: "47%",
    statLabel: "higher inbox placement",
  },
  {
    icon: DollarSign,
    title: "More Value",
    description:
      "Unlimited email accounts and warmup included in every plan. No nickel-and-diming for essential features.",
    stat: "60%",
    statLabel: "cost savings at scale",
  },
  {
    icon: Shield,
    title: "Native CRM",
    description: "Unlike Instantly, we have a built-in CRM to manage your leads without juggling multiple tools.",
    stat: "3x",
    statLabel: "faster deal management",
  },
  {
    icon: Users,
    title: "Real Support",
    description: "24/7 human support from cold email experts, not chatbots. Get help when you need it.",
    stat: "< 2hr",
    statLabel: "average response time",
  },
]

export default function VsInstantlyPage() {
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

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
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="pt-32 pb-20 px-4 bg-black text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-neutral-800/50 to-transparent rounded-full blur-3xl" />
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
                    src="/images/compare/instantly-logo.jpg"
                    alt="Instantly"
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
                Mailfra vs Instantly
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-400 mb-8 max-w-lg"
              >
                Instantly is popular, but it's not the best choice for serious cold emailers. See why top sales teams
                are switching to Mailfra.
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
                  See pricing
                </Button>
              </motion.div>
            </div>

            {/* Quick wins */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Why teams switch from Instantly</h3>
              <ul className="space-y-3">
                {[
                  "Unlimited email accounts included",
                  "Native CRM - no integrations needed",
                  "47% better inbox placement",
                  "Real 24/7 human support",
                  "More features for less money",
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
      </motion.section>

      {/* Why Switch Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why switch from Instantly?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Instantly helped popularize cold email software, but it's showing its limitations. Here's why growth teams
              are moving to Mailfra.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {switchReasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-neutral-200 hover:border-black transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <reason.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">{reason.stat}</div>
                    <div className="text-xs text-neutral-500">{reason.statLabel}</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{reason.title}</h3>
                <p className="text-neutral-600">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Feature-by-feature comparison</h2>
            <p className="text-neutral-600">A detailed look at how Mailfra stacks up against Instantly</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200">
            {/* Header */}
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-semibold">Feature</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800">
                <span className="text-white">Mailfra</span>
              </div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800">
                <span className="text-neutral-400">Instantly</span>
              </div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, i) => (
              <div
                key={i}
                data-row={i}
                className={`grid grid-cols-3 border-b border-neutral-200 last:border-b-0 transition-all duration-500 ${
                  visibleRows.includes(i) ? "opacity-100" : "opacity-0"
                } ${row.winner === "mailfra" ? "bg-white" : "bg-neutral-50"}`}
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
                  {row.instantly === true ? (
                    <div className="w-6 h-6 bg-neutral-300 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-neutral-600" />
                    </div>
                  ) : row.instantly === false ? (
                    <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-400" />
                    </div>
                  ) : (
                    <span className="text-neutral-500">{row.instantly}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">Comparison data updated January 2025. Features may have changed.</p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Pricing comparison</h2>
            <p className="text-neutral-600">More features, better value - see how pricing compares</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingComparison.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden"
              >
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold text-black mb-4">{plan.tier}</h3>

                  <div className="space-y-4">
                    <div className="bg-black text-white rounded-xl p-4">
                      <div className="text-xs text-neutral-400 mb-1">Mailfra</div>
                      <div className="text-2xl font-bold">{plan.mailfra}</div>
                      <div className="text-xs text-neutral-400 mt-1">{plan.mailfraFeatures}</div>
                    </div>

                    <div className="bg-neutral-100 rounded-xl p-4">
                      <div className="text-xs text-neutral-500 mb-1">Instantly</div>
                      <div className="text-2xl font-bold text-neutral-600">{plan.instantly}</div>
                      <div className="text-xs text-neutral-500 mt-1">{plan.instantlyFeatures}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Value winner</span>
                    <span className="font-semibold text-black">Mailfra</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Migration CTA */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="text-sm">Limited offer</span>
              <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">3 MONTHS FREE</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">Switch from Instantly today</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              We'll migrate your campaigns, contacts, and settings for free. Get 3 months free when you switch from
              Instantly.
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
                Schedule demo
              </Button>
            </div>

            <p className="text-sm text-neutral-500 mt-6">No credit card required. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
