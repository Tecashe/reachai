"use client"

import { useEffect, useRef, useState } from "react"

export function EmailWarmup() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveDay((prev) => (prev < 13 ? prev + 1 : prev))
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const warmupData = [
    { day: 1, sent: 5, reputation: 10 },
    { day: 2, sent: 8, reputation: 15 },
    { day: 3, sent: 12, reputation: 22 },
    { day: 4, sent: 18, reputation: 30 },
    { day: 5, sent: 25, reputation: 38 },
    { day: 6, sent: 35, reputation: 47 },
    { day: 7, sent: 45, reputation: 55 },
    { day: 8, sent: 60, reputation: 63 },
    { day: 9, sent: 80, reputation: 72 },
    { day: 10, sent: 100, reputation: 80 },
    { day: 11, sent: 125, reputation: 87 },
    { day: 12, sent: 150, reputation: 92 },
    { day: 13, sent: 180, reputation: 96 },
    { day: 14, sent: 200, reputation: 99 },
  ]

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40 bg-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-6 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Automated Warmup
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-6 transition-all duration-700 delay-100"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Watch your reputation
            <span className="block font-medium">grow automatically</span>
          </h2>
          <p
            className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto transition-all duration-700 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Our AI-powered warmup system gradually increases your sending volume while building genuine engagement
            signals.
          </p>
        </div>

        {/* Warmup Visualization */}
        <div
          className="relative transition-all duration-1000 delay-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          {/* Main visualization card */}
          <div className="bg-neutral-950 rounded-3xl p-8 md:p-12">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <p className="text-neutral-500 text-sm mb-2">Day</p>
                <p className="text-4xl md:text-5xl font-light text-white">{warmupData[activeDay]?.day || 1}</p>
              </div>
              <div className="text-center">
                <p className="text-neutral-500 text-sm mb-2">Emails/Day</p>
                <p className="text-4xl md:text-5xl font-light text-white">{warmupData[activeDay]?.sent || 5}</p>
              </div>
              <div className="text-center">
                <p className="text-neutral-500 text-sm mb-2">Reputation</p>
                <p className="text-4xl md:text-5xl font-light text-white">{warmupData[activeDay]?.reputation || 10}%</p>
              </div>
            </div>

            {/* Graph visualization */}
            <div className="relative h-48 md:h-64 mb-8">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-600 pr-4">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Graph area */}
              <div className="ml-12 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-neutral-800 w-full" />
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between gap-1 md:gap-2 px-2">
                  {warmupData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                      {/* Reputation bar */}
                      <div
                        className="w-full bg-white/90 rounded-t transition-all duration-500 ease-out"
                        style={{
                          height: index <= activeDay ? `${data.reputation}%` : "0%",
                          transitionDelay: `${index * 50}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="ml-12 flex justify-between text-xs text-neutral-600">
              {warmupData.map((data) => (
                <span key={data.day} className="flex-1 text-center">
                  D{data.day}
                </span>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-sm" />
                <span className="text-neutral-400">Sender Reputation</span>
              </div>
            </div>
          </div>

          {/* Floating info cards */}
          <div
            className="absolute -right-4 top-1/4 bg-white rounded-2xl p-4 shadow-2xl border border-neutral-100 transition-all duration-700 delay-500 hidden lg:block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <p className="text-xs text-neutral-500 mb-1">Auto-replies</p>
            <p className="text-2xl font-medium text-black">Enabled</p>
          </div>

          <div
            className="absolute -left-4 bottom-1/4 bg-white rounded-2xl p-4 shadow-2xl border border-neutral-100 transition-all duration-700 delay-700 hidden lg:block"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            <p className="text-xs text-neutral-500 mb-1">Spam Rate</p>
            <p className="text-2xl font-medium text-black">0.01%</p>
          </div>
        </div>
      </div>
    </section>
  )
}
