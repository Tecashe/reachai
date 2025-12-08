"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const caseStudies = [
  {
    company: "TechScale Agency",
    industry: "Marketing Agency",
    image: "/images/case-studies/techscale.jpeg",
    logo: "/images/case-studies/techscale-logo.jpg",
    quote: "We went from 5% reply rates to 28% in just 3 weeks. Mailfra changed everything for our outbound.",
    person: "Marcus Chen",
    role: "Founder & CEO",
    metrics: [
      { label: "Reply Rate", before: "5%", after: "28%", change: "+460%" },
      { label: "Meetings Booked", before: "12/mo", after: "89/mo", change: "+642%" },
      { label: "Revenue", before: "$45K", after: "$312K", change: "+593%" },
    ],
  },
  {
    company: "Velocity SaaS",
    industry: "B2B Software",
    image: "/images/case-studies/velocity.png",
    logo: "/images/case-studies/velocity-logo.jpg",
    quote: "The inbox rotation alone saved us from burning through 50+ domains. Our deliverability is now bulletproof.",
    person: "Sarah Mitchell",
    role: "VP of Sales",
    metrics: [
      { label: "Deliverability", before: "67%", after: "98.7%", change: "+47%" },
      { label: "Domains Saved", before: "0", after: "47", change: "Saved" },
      { label: "Pipeline", before: "$1.2M", after: "$4.8M", change: "+300%" },
    ],
  },
  {
    company: "RecruitPro",
    industry: "Talent Acquisition",
    image: "/images/case-studies/recruitpro.png",
    logo: "/images/case-studies/recruitpro-logo.jpg",
    quote: "We placed 3x more candidates in Q1 than all of last year. The AI personalization is insane.",
    person: "James Wilson",
    role: "Head of Recruiting",
    metrics: [
      { label: "Response Rate", before: "8%", after: "34%", change: "+325%" },
      { label: "Placements", before: "23/yr", after: "71/qtr", change: "+309%" },
      { label: "Time to Hire", before: "45 days", after: "18 days", change: "-60%" },
    ],
  },
]

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeStudy, setActiveStudy] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
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

  const handleStudyChange = (index: number) => {
    if (index === activeStudy || isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setActiveStudy(index)
      setTimeout(() => setIsAnimating(false), 500)
    }, 300)
  }

  const currentStudy = caseStudies[activeStudy]

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className={`text-neutral-500 text-sm tracking-widest uppercase mb-4 block transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Case Studies
          </span>
          <h2
            className={`text-4xl md:text-6xl font-bold text-black mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Real results from real teams
          </h2>
        </div>

        {/* Case study selector */}
        <div
          className={`flex justify-center gap-4 mb-12 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {caseStudies.map((study, index) => (
            <button
              key={study.company}
              onClick={() => handleStudyChange(index)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeStudy === index ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {study.company}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-500 ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <Image
                src={currentStudy.image || "/placeholder.svg"}
                alt={currentStudy.company}
                fill
                className="object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Company info overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={currentStudy.logo || "/placeholder.svg"}
                      alt={`${currentStudy.company} logo`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{currentStudy.company}</div>
                    <div className="text-white/70 text-sm">{currentStudy.industry}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            {/* Quote */}
            <blockquote
              className={`text-2xl md:text-3xl font-medium text-black mb-8 leading-relaxed transition-all duration-500 ${
                isAnimating ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
              }`}
            >
              &ldquo;{currentStudy.quote}&rdquo;
            </blockquote>

            {/* Person */}
            <div className={`mb-10 transition-all duration-500 delay-100 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              <div className="text-black font-semibold">{currentStudy.person}</div>
              <div className="text-neutral-500">{currentStudy.role}</div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6">
              {currentStudy.metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`transition-all duration-500 ${
                    isAnimating ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0"
                  }`}
                  style={{ transitionDelay: `${150 + index * 50}ms` }}
                >
                  <div className="text-neutral-500 text-sm mb-2">{metric.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-neutral-400 text-sm line-through">{metric.before}</span>
                    <span className="text-black text-2xl font-bold">{metric.after}</span>
                  </div>
                  <div className="text-green-600 text-sm font-medium mt-1">{metric.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
