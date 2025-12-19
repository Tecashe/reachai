
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
    <section ref={sectionRef} className="relative py-32 md:py-40 bg-background overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 transition-all duration-700"
            style={{
              opacity: scrollProgress > 0.1 ? 1 : 0,
              transform: scrollProgress > 0.1 ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Get Started
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 transition-all duration-700 delay-100"
            style={{
              opacity: scrollProgress > 0.15 ? 1 : 0,
              transform: scrollProgress > 0.15 ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Up and running in
            <span className="block font-semibold mt-2">under 5 minutes</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - subtle */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden lg:block" />
          <div
            className="absolute left-1/2 top-0 w-px bg-foreground hidden lg:block transition-all duration-1000"
            style={{
              height: `${Math.min(100, scrollProgress * 150)}%`,
            }}
          />

          <div className="space-y-32 lg:space-y-40">
            {steps.map((step, index) => {
              const stepProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2 - index * 0.15) * 3))
              const isEven = index % 2 === 0

              return (
                <div
                  key={step.number}
                  className={`relative flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${isEven ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}
                    style={{
                      opacity: stepProgress,
                      transform: `translateX(${isEven ? -1 : 1}${(1 - stepProgress) * 40}px)`,
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* Step number - large and subtle */}
                    <span className="text-[8rem] md:text-[10rem] font-extralight text-muted/30 block leading-none -mb-8 md:-mb-12">
                      {step.number}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-medium text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center"
                    style={{
                      transform: `translateX(-50%) scale(${stepProgress})`,
                      transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="w-4 h-4 rounded-full bg-foreground" />
                    <div
                      className="absolute w-8 h-8 rounded-full border border-foreground/30"
                      style={{
                        opacity: stepProgress > 0.5 ? 1 : 0,
                        transform: `scale(${stepProgress > 0.5 ? 1 : 0.5})`,
                        transition: "all 0.4s ease-out 0.2s",
                      }}
                    />
                  </div>

                  {/* Image Container - Liquid Glass Style */}
                  <div
                    className="flex-1 w-full"
                    style={{
                      opacity: stepProgress,
                      transform: `translateX(${isEven ? 1 : -1}${(1 - stepProgress) * 40}px)`,
                      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="relative group">
                      {/* Outer glow effect */}
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Glass frame */}
                      <div className="relative rounded-2xl p-1 bg-gradient-to-br from-border/80 via-border/40 to-border/80">
                        {/* Inner container with glass effect */}
                        <div className="relative rounded-xl overflow-hidden bg-card shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]">
                          {/* Image - full opacity, no darkening overlay */}
                          <div className="aspect-[4/3] relative">
                            <img
                              src={step.image || "/placeholder.svg"}
                              alt={step.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                            />
                            {/* Subtle inner shadow for depth - not darkening the image */}
                            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none rounded-xl" />
                          </div>

                          {/* Bottom info bar - glass style */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 via-background/60 to-transparent backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                Step {step.number}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative corner accents */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-foreground/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-foreground/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center mt-32 transition-all duration-700"
          style={{
            opacity: scrollProgress > 0.7 ? 1 : 0,
            transform: scrollProgress > 0.7 ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-10 py-7 text-lg font-medium group shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Start your free trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-muted-foreground mt-6 text-sm">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
