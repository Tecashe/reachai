"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const useCases = [
  {
    id: "agencies",
    label: "For Agencies",
    title: "Scale client campaigns without the chaos",
    description:
      "Manage unlimited client accounts from one dashboard. White-label reporting, team permissions, and automated workflows built for agency scale.",
    features: ["Unlimited client workspaces", "White-label reports", "Team collaboration", "Bulk campaign management"],
    image: "/images/use-cases/agencies.jpg",
    stat: "47%",
    statLabel: "more clients managed",
  },
  {
    id: "startups",
    label: "For Startups",
    title: "Turn cold leads into your first customers",
    description:
      "Perfect for founder-led sales. Start with one inbox, scale to hundreds. No technical setup required - just write, send, and close.",
    features: ["5-minute setup", "Built-in templates", "AI personalization", "Startup-friendly pricing"],
    image: "/images/use-cases/startups.jpg",
    stat: "3x",
    statLabel: "faster pipeline growth",
  },
  {
    id: "sales",
    label: "For Sales Teams",
    title: "Hit quota consistently with predictable pipeline",
    description:
      "Give your SDRs superpowers. Automated sequences, smart follow-ups, and real-time analytics to optimize every touchpoint.",
    features: ["CRM sync", "Lead scoring", "Team analytics", "Automated follow-ups"],
    image: "/images/use-cases/sales.jpg",
    stat: "89%",
    statLabel: "quota attainment",
  },
  {
    id: "recruiters",
    label: "For Recruiters",
    title: "Fill roles faster with personalized outreach",
    description:
      "Reach passive candidates at scale without sounding like a robot. ATS integrations and candidate tracking built-in.",
    features: ["ATS integrations", "Candidate tracking", "Template library", "Response management"],
    image: "/images/use-cases/recruiters.jpg",
    stat: "5x",
    statLabel: "more responses",
  },
]

export function UseCases() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionHeight = rect.height
      const start = rect.top
      const progress = Math.max(0, Math.min(1, -start / (sectionHeight - windowHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-neutral-50" style={{ height: `${100 + useCases.length * 100}vh` }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Use case cards stack */}
        {useCases.map((useCase, index) => {
          const itemProgress = scrollProgress * useCases.length
          const cardProgress = itemProgress - index

          // Card transforms based on its progress
          const isVisible = cardProgress > -1 && cardProgress < 1.5
          const yOffset = Math.max(0, (1 - cardProgress) * 100)
          const scale = cardProgress < 0 ? 0.9 : 1 - Math.max(0, cardProgress - 0.5) * 0.1
          const opacity = cardProgress < 0 ? 0 : cardProgress > 1 ? 1 - (cardProgress - 1) * 2 : 1
          const zIndex = useCases.length - index

          if (!isVisible) return null

          return (
            <div
              key={useCase.id}
              className="absolute inset-0 flex items-center justify-center px-4 md:px-6 lg:px-8 py-8 md:py-12"
              style={{
                zIndex,
                opacity,
                transform: `translateY(${yOffset}%) scale(${scale})`,
                transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
              }}
            >
              <div className="w-full max-w-6xl mx-auto">
                <div className="relative bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
                  {/* Image side */}
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto lg:min-h-[450px] overflow-hidden">
                    <Image
                      src={useCase.image || "/placeholder.svg"}
                      alt={useCase.title}
                      fill
                      className="object-cover"
                    />
                    {/* Stat overlay */}
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-black/80 backdrop-blur-sm text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{useCase.stat}</div>
                      <div className="text-xs md:text-sm text-neutral-300">{useCase.statLabel}</div>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="p-5 sm:p-6 md:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-neutral-100 rounded-full text-xs md:text-sm font-medium text-neutral-600 mb-4 md:mb-6 w-fit">
                      {useCase.label}
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 md:mb-6 leading-tight">
                      {useCase.title}
                    </h3>

                    <p className="text-sm md:text-base lg:text-lg text-neutral-600 mb-5 md:mb-8 leading-relaxed">
                      {useCase.description}
                    </p>

                    <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                      {useCase.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-neutral-700"
                        >
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                            <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-black" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className="px-6 py-3 md:px-8 md:py-4 bg-black text-white rounded-full text-sm md:text-base font-medium hover:bg-neutral-800 transition-colors w-fit">
                      Get started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
