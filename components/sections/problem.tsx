"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const problems = [
  {
    title: "Emails landing in spam",
    description: "Your perfectly crafted messages never reach the inbox",
  },
  {
    title: "Accounts getting burned",
    description: "Domains blacklisted after just a few campaigns",
  },
  {
    title: "Manual inbox rotation",
    description: "Hours wasted switching between email accounts",
  },
  {
    title: "No visibility into deliverability",
    description: "Flying blind without knowing what's working",
  },
]

export function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionHeight = rect.height

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
    <section ref={sectionRef} className="relative min-h-screen bg-black py-24 md:py-32 overflow-hidden">
      {/* Large background image that bleeds into the section */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: `scale(${1 + scrollProgress * 0.1})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image src="/images/problem-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Oversized text that reveals on scroll */}
        <div className="mb-20 md:mb-32">
          <p
            className="text-neutral-500 text-sm md:text-base uppercase tracking-widest mb-4"
            style={{
              opacity: Math.min(1, scrollProgress * 3),
              transform: `translateY(${(1 - Math.min(1, scrollProgress * 3)) * 20}px)`,
            }}
          >
            The problem
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-8xl font-bold text-white leading-none"
            style={{
              opacity: Math.min(1, scrollProgress * 2.5),
              transform: `translateY(${(1 - Math.min(1, scrollProgress * 2.5)) * 40}px)`,
            }}
          >
            Cold email is
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600"
              style={{
                opacity: Math.min(1, (scrollProgress - 0.1) * 3),
              }}
            >
              broken.
            </span>
          </h2>
        </div>

        {/* Problems grid with staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
          {problems.map((problem, index) => {
            const delay = 0.2 + index * 0.1
            const itemProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 4))

            return (
              <div
                key={index}
                className="group relative"
                style={{
                  opacity: itemProgress,
                  transform: `translateY(${(1 - itemProgress) * 30}px)`,
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-2 h-2 mt-3 rounded-full bg-white/40 group-hover:bg-white transition-colors duration-300"
                    style={{
                      transform: `scale(${itemProgress})`,
                    }}
                  />
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 group-hover:text-neutral-300 transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-neutral-500 text-base md:text-lg">{problem.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Transition statement */}
        <div
          className="text-center max-w-3xl mx-auto"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.6) * 4)),
            transform: `translateY(${(1 - Math.max(0, Math.min(1, (scrollProgress - 0.6) * 4))) * 30}px)`,
          }}
        >
          <p className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed">
            We built something{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              different.
            </span>
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div
        className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        style={{
          transform: `translateY(${scrollProgress * -50}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl"
        style={{
          transform: `translateY(${scrollProgress * 50}px)`,
        }}
      />
    </section>
  )
}
