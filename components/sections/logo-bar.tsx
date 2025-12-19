
"use client"

import { useEffect, useRef, useState } from "react"

const logos = [
  { name: "Stripe", width: 80, filename: "stripe.png" },
  { name: "Notion", width: 90, filename: "notion.png" },
  { name: "Slack", width: 80, filename: "slack.png" },
  { name: "Linear", width: 75, filename: "linear.png" },
  { name: "Vercel", width: 85, filename: "vercel.png" },
  { name: "Figma", width: 70, filename: "figma.png" },
  { name: "Webflow", width: 95, filename: "webflow.png" },
  { name: "Framer", width: 85, filename: "framer.png" },
]

export function LogoBar() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  return (
    <>
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative py-20 sm:py-28 overflow-hidden bg-background border-y border-border/50"
      >
        {/* Section header with fade-in */}
        <div
          className="text-center mb-12 sm:mb-16 px-4 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="text-sm sm:text-base text-muted-foreground tracking-wide uppercase font-medium">
            Trusted by 10,000+ revenue teams at
          </p>
        </div>

        {/* Infinite scrolling logos - Row 1 */}
        <div className="relative mb-8">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-12 sm:gap-20 transition-opacity duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              animation: isVisible ? "marquee-left 30s linear infinite" : "none",
            }}
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
                style={{ minWidth: logo.width }}
              >
                <img
                  src={`/${logo.filename}`}
                  alt={`${logo.name} logo`}
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infinite scrolling logos - Row 2 (reverse direction) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-12 sm:gap-20 transition-opacity duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              animation: isVisible ? "marquee-right 35s linear infinite" : "none",
            }}
          >
            {[...logos.slice().reverse(), ...logos.slice().reverse(), ...logos.slice().reverse()].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
                style={{ minWidth: logo.width }}
              >
                <img
                  src={`/${logo.filename}`}
                  alt={`${logo.name} logo`}
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar with staggered reveal */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "50M+", label: "Emails sent monthly" },
              { value: "98.7%", label: "Deliverability rate" },
              { value: "3.2x", label: "Reply rate increase" },
              { value: "14 days", label: "Avg. time to first deal" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transitionDelay: `${400 + i * 100}ms`,
                }}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}