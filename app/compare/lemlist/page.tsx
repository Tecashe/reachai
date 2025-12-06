"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Check, X, ArrowLeft, Users, Mail, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const comparisonData = [
  { category: "Pricing Model", mailfra: "Flat rate", lemlist: "Per seat", winner: "mailfra" },
  { category: "Email Accounts", mailfra: "Unlimited", lemlist: "1 per seat", winner: "mailfra" },
  { category: "Daily Sending Limit", mailfra: "Unlimited", lemlist: "Limited", winner: "mailfra" },
  { category: "Inbox Rotation", mailfra: true, lemlist: false, winner: "mailfra" },
  { category: "AI Warmup", mailfra: true, lemlist: "Extra cost", winner: "mailfra" },
  { category: "Image Personalization", mailfra: true, lemlist: true, winner: "tie" },
  { category: "Video Personalization", mailfra: true, lemlist: true, winner: "tie" },
  { category: "Multi-channel Sequences", mailfra: true, lemlist: true, winner: "tie" },
  { category: "LinkedIn Automation", mailfra: true, lemlist: true, winner: "tie" },
  { category: "A/B Testing", mailfra: "Advanced", lemlist: "Basic", winner: "mailfra" },
  { category: "CRM Integration", mailfra: "Native", lemlist: "Third-party", winner: "mailfra" },
  { category: "API Access", mailfra: "All plans", lemlist: "Enterprise", winner: "mailfra" },
]

const pricingScenarios = [
  {
    teamSize: "Solo",
    seats: 1,
    mailfra: 49,
    lemlist: 59,
    savings: 17,
  },
  {
    teamSize: "Small Team",
    seats: 5,
    mailfra: 99,
    lemlist: 295,
    savings: 66,
  },
  {
    teamSize: "Growing Team",
    seats: 10,
    mailfra: 199,
    lemlist: 590,
    savings: 66,
  },
  {
    teamSize: "Agency",
    seats: 25,
    mailfra: 199,
    lemlist: 1475,
    savings: 86,
  },
]

export default function VsLemlistPage() {
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [selectedScenario, setSelectedScenario] = useState(1)

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
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-neutral-700 to-transparent rounded-full blur-3xl" />
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
                    src="/images/compare/lemlist-logo.jpg"
                    alt="Lemlist"
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
                Mailfra vs Lemlist
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-400 mb-8 max-w-lg"
              >
                Lemlist's per-seat pricing makes scaling expensive. See how Mailfra gives you unlimited power at a flat
                rate.
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
                  Calculate savings
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Why teams ditch Lemlist</h3>
              <ul className="space-y-3">
                {[
                  "No more per-seat pricing traps",
                  "Unlimited email accounts for everyone",
                  "True inbox rotation (Lemlist lacks this)",
                  "Same personalization features, lower cost",
                  "Scale your team without scaling your bill",
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

      {/* Pricing Calculator */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">The true cost of Lemlist</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Lemlist's per-seat model sounds affordable until you add your team. See how much you'd save with Mailfra.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            {/* Scenario selector */}
            <div className="flex overflow-x-auto border-b border-neutral-200">
              {pricingScenarios.map((scenario, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedScenario(i)}
                  className={`flex-1 min-w-[120px] px-6 py-4 text-center transition-colors ${
                    selectedScenario === i ? "bg-black text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <div className="font-semibold">{scenario.teamSize}</div>
                  <div className="text-sm opacity-70">
                    {scenario.seats} seat{scenario.seats > 1 ? "s" : ""}
                  </div>
                </button>
              ))}
            </div>

            {/* Comparison display */}
            <div className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  key={`mailfra-${selectedScenario}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black text-white rounded-2xl p-6"
                >
                  <div className="text-sm text-neutral-400 mb-2">Mailfra</div>
                  <div className="text-4xl font-bold mb-2">${pricingScenarios[selectedScenario].mailfra}</div>
                  <div className="text-sm text-neutral-400">/month for whole team</div>
                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Unlimited seats
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Unlimited accounts
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        All features included
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  key={`lemlist-${selectedScenario}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-neutral-100 rounded-2xl p-6"
                >
                  <div className="text-sm text-neutral-500 mb-2">Lemlist</div>
                  <div className="text-4xl font-bold text-neutral-600 mb-2">
                    ${pricingScenarios[selectedScenario].lemlist}
                  </div>
                  <div className="text-sm text-neutral-500">
                    /month ({pricingScenarios[selectedScenario].seats} × $59)
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <ul className="space-y-2 text-sm text-neutral-500">
                      <li className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        Billed per seat
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500" />1 account per seat
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        Features vary by plan
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  key={`savings-${selectedScenario}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col justify-center"
                >
                  <div className="text-sm text-green-700 mb-2">Your savings</div>
                  <div className="text-4xl font-bold text-green-700 mb-2">
                    {pricingScenarios[selectedScenario].savings}%
                  </div>
                  <div className="text-sm text-green-600">
                    Save $
                    {(pricingScenarios[selectedScenario].lemlist - pricingScenarios[selectedScenario].mailfra) * 12}
                    /year
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Key differences</h2>
            <p className="text-neutral-600">Beyond pricing, here's what separates Mailfra from Lemlist</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Team Pricing",
                mailfra: "Flat rate - add unlimited team members at no extra cost",
                lemlist: "Per-seat pricing that scales linearly with your team size",
              },
              {
                icon: Mail,
                title: "Inbox Rotation",
                mailfra: "AI-powered rotation across unlimited accounts for maximum deliverability",
                lemlist: "No inbox rotation - each seat limited to one email account",
              },
              {
                icon: TrendingUp,
                title: "Scalability",
                mailfra: "Scale to 100K+ emails/month without pricing changes",
                lemlist: "Volume limits per seat force you to buy more seats to scale",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-neutral-50 rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{item.title}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-black mb-1">
                      <Check className="w-4 h-4" />
                      Mailfra
                    </div>
                    <p className="text-neutral-600 text-sm">{item.mailfra}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 mb-1">
                      <X className="w-4 h-4 text-red-500" />
                      Lemlist
                    </div>
                    <p className="text-neutral-500 text-sm">{item.lemlist}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Full feature comparison</h2>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-semibold">Feature</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800">Mailfra</div>
              <div className="p-4 font-semibold text-center border-l border-neutral-800 text-neutral-400">Lemlist</div>
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
                  {row.lemlist === true ? (
                    <div className="w-6 h-6 bg-neutral-300 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-neutral-600" />
                    </div>
                  ) : row.lemlist === false ? (
                    <div className="w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-neutral-400" />
                    </div>
                  ) : (
                    <span className="text-neutral-500">{row.lemlist}</span>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop paying per seat</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Switch to Mailfra and give your whole team access for one flat price. Free migration included.
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
