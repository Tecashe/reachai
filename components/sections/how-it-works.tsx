
"use client"

import { useEffect, useRef, useState } from "react"

const steps = [
  {
    number: "01",
    title: "Connect Your Accounts",
    description:
      "Link unlimited email accounts from Gmail, Outlook, or any SMTP provider. Our one-click integration takes less than 2 minutes.",
    image: "connect-accounts.png", // or .png, .webp
  },
  {
    number: "02",
    title: "Import & Enrich Leads",
    description:
      "Upload your prospect list or use our built-in lead finder. We automatically enrich contacts with company data, social profiles, and buying signals.",
    image: "import-leads.png",
  },
  {
    number: "03",
    title: "Craft Your Sequence",
    description:
      "Build multi-step email sequences with our drag-and-drop editor. Let AI personalize each message or write your own templates.",
    image: "craft-sequence.png",
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "Hit send and watch the replies roll in. Our AI continuously optimizes send times, subject lines, and follow-up cadence.",
    image: "launch-optimize.png",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      const viewportHeight = window.innerHeight

      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate horizontal scroll position
  const horizontalScroll = scrollProgress * (steps.length - 1) * 100

  return (
    <section ref={sectionRef} className="relative bg-background" style={{ minHeight: "300vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section header */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div
              className="transition-all duration-700"
              style={{
                opacity: scrollProgress > 0.01 ? 1 : 0,
                transform: scrollProgress > 0.01 ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <p className="text-sm sm:text-base text-muted-foreground tracking-wide uppercase font-medium mb-3">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-xl text-balance">
                From zero to sending in under 5 minutes
              </h2>
            </div>
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <div className="absolute inset-0 flex items-center">
          <div
            ref={containerRef}
            className="flex gap-6 sm:gap-8 lg:gap-10 pl-4 sm:pl-8 lg:pl-16 transition-transform duration-100"
            style={{
              transform: `translateX(-${horizontalScroll}vw)`,
            }}
          >
            {steps.map((step, index) => {
              // Calculate individual card progress
              const cardStart = index / steps.length
              const cardEnd = (index + 1) / steps.length
              const cardProgress = Math.max(0, Math.min(1, (scrollProgress - cardStart) / (cardEnd - cardStart)))
              const isActive = scrollProgress >= cardStart && scrollProgress < cardEnd
              const isPast = scrollProgress >= cardEnd

              return (
                <div
                  key={step.number}
                  className="shrink-0 w-[85vw] sm:w-[75vw] lg:w-[60vw] max-w-4xl"
                  style={{
                    opacity: 0.4 + (isActive ? 0.6 : isPast ? 0.3 : 0),
                    transform: `
                      scale(${isActive ? 1 : 0.95})
                      rotateY(${isActive ? 0 : isPast ? 5 : -5}deg)
                    `,
                    transition: "all 0.5s ease-out",
                  }}
                >
                  <div
                    className="relative h-[60vh] sm:h-[65vh] rounded-2xl sm:rounded-3xl overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, rgba(250,250,250,1), rgba(245,245,245,1))",
                      boxShadow: isActive
                        ? "0 40px 80px -20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)"
                        : "0 20px 40px -20px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* Step number */}
                    <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-10">
                      <span
                        className="text-6xl sm:text-7xl lg:text-8xl font-bold transition-all duration-500"
                        style={{
                          color: isActive ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.04)",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 z-10 bg-gradient-to-t from-white via-white/90 to-transparent">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
                        {step.description}
                      </p>
                    </div>

                    {/* Image */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12 lg:p-16 pt-20 sm:pt-24">
                      <div
                        className="relative w-full h-full rounded-xl overflow-hidden transition-all duration-700"
                        style={{
                          transform: `
                            perspective(1000px)
                            rotateX(${isActive ? 5 : 10}deg)
                            translateY(${isActive ? 0 : 10}px)
                          `,
                          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
                        }}
                      >
                        <img
                          src={`/${step.image}`}
                          alt={step.title}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>

                    {/* Decorative corner accent */}
                    <div
                      className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 transition-all duration-500"
                      style={{
                        background: `radial-gradient(circle at top right, rgba(0,0,0,${isActive ? 0.03 : 0.01}), transparent 70%)`,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {/* End spacer */}
            <div className="shrink-0 w-[20vw]" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 lg:left-16 right-4 sm:right-8 lg:right-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-100"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground tabular-nums">
                {Math.min(steps.length, Math.floor(scrollProgress * steps.length) + 1)}/{steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}