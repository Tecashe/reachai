"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function GetStarted() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      number: "01",
      title: "Connect your inboxes",
      description: "Link your Google Workspace or Microsoft 365 accounts in seconds. No technical setup required.",
      image: "connect-accounts.png",
    },
    {
      number: "02",
      title: "Import your leads",
      description: "Upload a CSV, connect your CRM, or use our built-in lead finder to build your prospect list.",
      image: "import-leads.png",
    },
    {
      number: "03",
      title: "Launch campaigns",
      description: "Write your sequence, set your schedule, and let our AI optimize deliverability automatically.",
      image: "launch-optimize.png",
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40 bg-neutral-950 overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: "-100%",
              right: "-100%",
              transform: `translateX(${scrollProgress * 100 - 50}%)`,
              opacity: 0.1 + i * 0.05,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6 transition-all duration-700"
            style={{
              opacity: scrollProgress > 0.1 ? 1 : 0,
              transform: scrollProgress > 0.1 ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Get Started
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 transition-all duration-700 delay-100"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Up and running in
            <span className="block font-medium">under 5 minutes</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800 hidden lg:block" />
          <div
            className="absolute left-1/2 top-0 w-px bg-white hidden lg:block transition-all duration-1000"
            style={{
              height: `${Math.min(100, scrollProgress * 150)}%`,
            }}
          />

          <div className="space-y-24 lg:space-y-32">
            {steps.map((step, index) => {
              const stepProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2 - index * 0.15) * 3))
              const isEven = index % 2 === 0

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col lg:flex-row items-center gap-12 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${isEven ? "lg:text-right lg:pr-20" : "lg:text-left lg:pl-20"}`}
                    style={{
                      opacity: stepProgress,
                      transform: `translateX(${isEven ? -1 : 1}${(1 - stepProgress) * 40}px)`,
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <span className="text-8xl md:text-9xl font-extralight text-neutral-800 block mb-4">
                      {step.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-medium text-white mb-4">{step.title}</h3>
                    <p className="text-neutral-400 text-lg max-w-md mx-auto lg:mx-0">{step.description}</p>
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white hidden lg:block transition-all duration-500"
                    style={{
                      transform: `translateX(-50%) scale(${stepProgress})`,
                      boxShadow: stepProgress > 0.5 ? "0 0 30px rgba(255,255,255,0.5)" : "none",
                    }}
                  />

                  {/* Image */}
                  <div
                    className="flex-1"
                    style={{
                      opacity: stepProgress,
                      transform: `translateX(${isEven ? 1 : -1}${(1 - stepProgress) * 40}px)`,
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900">
                      <img
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center mt-24 transition-all duration-700"
          style={{
            opacity: scrollProgress > 0.7 ? 1 : 0,
            transform: scrollProgress > 0.7 ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <Button size="lg" className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 py-6 text-lg group">
            Start your free trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-neutral-500 mt-4 text-sm">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
