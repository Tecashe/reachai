"use client"

import { useEffect, useRef, useState } from "react"
import { Check, X, Minus } from "lucide-react"

const competitors = [
  { name: "Mailfra", highlight: true },
  { name: "Instantly", highlight: false },
  { name: "Smartlead", highlight: false },
  { name: "Lemlist", highlight: false },
]

const features = [
  {
    name: "Unlimited email accounts",
    values: ["check", "check", "check", "x"],
  },
  // {
  //   name: "AI-powered warmup",
  //   values: ["check", "check", "check", "check"],
  // },
  {
    name: "Smart inbox rotation",
    values: ["check", "check", "check", "minus"],
  },
  // {
  //   name: "Advanced analytics dashboard",
  //   values: ["check", "minus", "check", "check"],
  // },
  {
    name: "A/B testing",
    values: ["check", "check", "minus", "check"],
  },
  {
    name: "CRM integrations",
    values: ["check", "check", "check", "check"],
  },
  {
    name: "Custom sending schedules",
    values: ["check", "check", "check", "check"],
  },
  {
    name: "Team collaboration",
    values: ["check", "minus", "check", "minus"],
  },
  {
    name: "API access",
    values: ["check", "check", "check", "check"],
  },
  {
    name: "Priority support",
    values: ["check", "minus", "minus", "check"],
  },
  {
    name: "White-label options",
    values: ["check", "x", "check", "x"],
  },
  {
    name: "Starting price",
    values: ["$37/mo", "$47/mo", "$39/mo", "$59/mo"],
    isPrice: true,
  },
]

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleRows, setVisibleRows] = useState<number[]>([])
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true)
            // Stagger row reveals
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleRows((prev) => [...prev, index])
              }, 100 * index)
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const renderValue = (value: string) => {
    if (value === "check") {
      return (
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <Check className="w-4 h-4 text-black" />
        </div>
      )
    }
    if (value === "x") {
      return (
        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
          <X className="w-4 h-4 text-neutral-500" />
        </div>
      )
    }
    if (value === "minus") {
      return (
        <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
          <Minus className="w-4 h-4 text-neutral-500" />
        </div>
      )
    }
    return <span className="text-sm font-medium">{value}</span>
  }

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-neutral-500 text-sm tracking-widest uppercase mb-4 block">Comparison</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">See how we stack up</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            We built Mailfra to be the most complete cold email platform. Here&apos;s how we compare to the
            alternatives.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div
              className={`grid grid-cols-5 gap-4 mb-4 transition-all duration-700 delay-300 ${
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <div className="text-neutral-500 text-sm font-medium">Features</div>
              {competitors.map((comp, index) => (
                <div key={comp.name} className={`text-center ${comp.highlight ? "text-white" : "text-neutral-500"}`}>
                  <div className={`text-sm font-medium ${comp.highlight ? "text-lg" : ""}`}>{comp.name}</div>
                  {comp.highlight && <div className="text-xs text-neutral-400 mt-1">(That&apos;s us)</div>}
                </div>
              ))}
            </div>

            {/* Highlight column background */}
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[20%] w-[20%] bg-white/[0.03] rounded-xl -my-2" />

              {/* Table Rows */}
              <div className="relative space-y-2">
                {features.map((feature, rowIndex) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-5 gap-4 py-4 border-b border-neutral-800/50 transition-all duration-500 ${
                      visibleRows.includes(rowIndex) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    }`}
                  >
                    <div className="text-neutral-300 text-sm flex items-center">{feature.name}</div>
                    {feature.values.map((value, colIndex) => (
                      <div
                        key={colIndex}
                        className={`flex items-center justify-center ${
                          colIndex === 0
                            ? feature.isPrice
                              ? "text-white font-bold"
                              : "text-white"
                            : "text-neutral-400"
                        }`}
                      >
                        {renderValue(value)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-1000 ${
            visibleRows.length === features.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-neutral-400 mb-6">Still not convinced? Try us free for 14 days.</p>
          <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
