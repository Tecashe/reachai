"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const stats = [
  { value: 98.7, suffix: "%", label: "Average deliverability rate" },
  { value: 47, suffix: "M+", label: "Emails sent this month" },
  { value: 12, suffix: "K+", label: "Active users worldwide" },
  { value: 3.2, suffix: "x", label: "Higher reply rates" },
]

function AnimatedNumber({ value, suffix, progress }: { value: number; suffix: string; progress: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (progress < 0.3) {
      setDisplayValue(0)
      return
    }

    const targetProgress = Math.min(1, (progress - 0.3) / 0.4)
    const eased = 1 - Math.pow(1 - targetProgress, 3)
    setDisplayValue(value * eased)
  }, [progress, value])

  const formattedValue = value % 1 === 0 ? Math.round(displayValue) : displayValue.toFixed(1)

  return (
    <span className="tabular-nums">
      {formattedValue}
      {suffix}
    </span>
  )
}

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const start = rect.top - windowHeight
      const end = rect.bottom
      const total = end - start
      const current = -start
      const progress = Math.max(0, Math.min(1, current / total))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Background image that scales with scroll */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.4 + scrollProgress * 0.2,
          transform: `scale(${1 + scrollProgress * 0.15})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image src="/images/stats-bg.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div
            className="text-center mb-16 md:mb-24"
            style={{
              opacity: Math.min(1, scrollProgress * 4),
              transform: `translateY(${(1 - Math.min(1, scrollProgress * 4)) * 30}px)`,
            }}
          >
            <p className="text-neutral-500 text-sm uppercase tracking-widest mb-4">By the numbers</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
              Trusted by outbound teams
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-500">
                everywhere
              </span>
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => {
              const delay = 0.15 + index * 0.08
              const itemProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 3))

              return (
                <div
                  key={index}
                  className="text-center"
                  style={{
                    opacity: itemProgress,
                    transform: `translateY(${(1 - itemProgress) * 40}px)`,
                    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 leading-none">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} progress={scrollProgress} />
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base">{stat.label}</p>
                </div>
              )
            })}
          </div>

          {/* Bottom tagline */}
          <div
            className="text-center mt-16 md:mt-24"
            style={{
              opacity: Math.max(0, Math.min(1, (scrollProgress - 0.5) * 3)),
              transform: `translateY(${(1 - Math.max(0, Math.min(1, (scrollProgress - 0.5) * 3))) * 20}px)`,
            }}
          >
            <p className="text-lg md:text-xl text-neutral-400">Join thousands of sales teams scaling their outreach</p>
          </div>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollProgress * -80}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollProgress * 60}px)` }}
      />
    </section>
  )
}
