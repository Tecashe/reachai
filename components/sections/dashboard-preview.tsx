"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const features = [
  {
    id: "campaigns",
    label: "Campaigns",
    description: "Create and manage unlimited email campaigns with smart sequencing",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Track opens, clicks, replies, and conversions in real-time",
  },
  {
    id: "inbox",
    label: "Unified Inbox",
    description: "Manage all your replies from one powerful inbox",
  },
  {
    id: "warmup",
    label: "Warmup",
    description: "Automatically warm up your email accounts for maximum deliverability",
  },
]

export function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      const scrolled = viewportHeight - rect.top
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + viewportHeight * 0.5)))
      setScrollProgress(progress)

      // Change active feature based on scroll
      const featureIndex = Math.min(Math.floor(progress * features.length), features.length - 1)
      setActiveFeature(featureIndex)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] bg-black overflow-hidden">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950"
          style={{
            opacity: 0.5 + scrollProgress * 0.5,
          }}
        />

        {/* Radial glow behind dashboard */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.3})`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left side - Feature navigation */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <span
                className={`text-neutral-500 text-sm tracking-widest uppercase mb-4 block transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                Product Tour
              </span>
              <h2
                className={`text-3xl md:text-4xl font-bold text-white mb-8 transition-all duration-700 delay-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                Everything in one place
              </h2>

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                    } ${
                      activeFeature === index
                        ? "bg-white text-black"
                        : "bg-transparent text-neutral-400 hover:bg-neutral-900 hover:text-white"
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="font-medium mb-1">{feature.label}</div>
                    <div
                      className={`text-sm transition-colors duration-300 ${
                        activeFeature === index ? "text-neutral-600" : "text-neutral-500"
                      }`}
                    >
                      {feature.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Dashboard mockup */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div
                className={`relative transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
                }`}
                style={{
                  transform: `perspective(1000px) rotateY(${-5 + scrollProgress * 5}deg) rotateX(${2 - scrollProgress * 2}deg)`,
                }}
              >
                {/* Browser chrome */}
                <div className="bg-neutral-900 rounded-t-xl p-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-neutral-700" />
                    <div className="w-3 h-3 rounded-full bg-neutral-700" />
                    <div className="w-3 h-3 rounded-full bg-neutral-700" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-neutral-800 rounded-md px-3 py-1.5 text-neutral-500 text-xs">
                      app.mailfra.io/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard image */}
                <div className="relative aspect-[16/10] bg-neutral-900 rounded-b-xl overflow-hidden">
                  <Image src="/images/dashboard-preview.jpg" alt="Mailfra Dashboard" fill className="object-cover" />

                  {/* Overlay indicators based on active feature */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Highlight boxes that appear based on feature */}
                    <div
                      className={`absolute transition-all duration-500 ${
                        activeFeature === 0 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        top: "15%",
                        left: "5%",
                        width: "25%",
                        height: "70%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                      }}
                    />
                    <div
                      className={`absolute transition-all duration-500 ${
                        activeFeature === 1 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        top: "15%",
                        right: "5%",
                        width: "65%",
                        height: "40%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                      }}
                    />
                    <div
                      className={`absolute transition-all duration-500 ${
                        activeFeature === 2 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        bottom: "10%",
                        left: "32%",
                        width: "65%",
                        height: "35%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                      }}
                    />
                    <div
                      className={`absolute transition-all duration-500 ${
                        activeFeature === 3 ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        top: "5%",
                        left: "5%",
                        width: "90%",
                        height: "10%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </div>

                {/* Floating stats */}
                <div
                  className={`absolute -right-4 top-1/4 bg-black border border-neutral-800 rounded-lg p-3 shadow-2xl transition-all duration-700 delay-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
                >
                  <div className="text-xs text-neutral-500 mb-1">Reply Rate</div>
                  <div className="text-xl font-bold text-white">23.4%</div>
                  <div className="text-xs text-green-400">+12% this week</div>
                </div>

                <div
                  className={`absolute -left-4 bottom-1/4 bg-black border border-neutral-800 rounded-lg p-3 shadow-2xl transition-all duration-700 delay-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  }`}
                >
                  <div className="text-xs text-neutral-500 mb-1">Emails Sent</div>
                  <div className="text-xl font-bold text-white">12,847</div>
                  <div className="text-xs text-neutral-400">Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
