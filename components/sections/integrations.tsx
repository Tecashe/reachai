"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const integrations = [
  { name: "Salesforce", logo: "/images/integrations/salesforce.jpg", x: 15, y: 20 },
  { name: "HubSpot", logo: "/images/integrations/hubspot.jpg", x: 75, y: 15 },
  { name: "Pipedrive", logo: "/images/integrations/pipedrive.jpg", x: 25, y: 55 },
  { name: "Zapier", logo: "/images/integrations/zapier.jpg", x: 70, y: 50 },
  { name: "Slack", logo: "/images/integrations/slack.jpg", x: 10, y: 80 },
  { name: "Google", logo: "/images/integrations/google.jpg", x: 50, y: 30 },
  { name: "Outlook", logo: "/images/integrations/outlook.jpg", x: 85, y: 75 },
  { name: "Webhooks", logo: "/images/integrations/webhooks.jpg", x: 40, y: 70 },
]

export function Integrations() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

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

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (e.clientY < rect.top || e.clientY > rect.bottom) return
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: (e.clientY - rect.top) / rect.height,
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-white py-24 md:py-32 overflow-hidden">
      {/* Central content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p
          className="text-neutral-400 text-sm uppercase tracking-widest mb-6"
          style={{
            opacity: Math.min(1, scrollProgress * 4),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 4)) * 20}px)`,
          }}
        >
          Integrations
        </p>
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight"
          style={{
            opacity: Math.min(1, scrollProgress * 3),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 3)) * 30}px)`,
          }}
        >
          Connects with your
          <br />
          entire stack
        </h2>
        <p
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-12"
          style={{
            opacity: Math.min(1, (scrollProgress - 0.1) * 3),
            transform: `translateY(${(1 - Math.min(1, (scrollProgress - 0.1) * 3)) * 20}px)`,
          }}
        >
          Two-click integrations with your CRM, email providers, and automation tools. No code required.
        </p>

        {/* Central dashboard image */}
        <div
          className="relative w-full max-w-3xl mx-auto"
          style={{
            opacity: Math.min(1, (scrollProgress - 0.15) * 3),
            transform: `translateY(${(1 - Math.min(1, (scrollProgress - 0.15) * 3)) * 40}px) scale(${0.95 + Math.min(1, (scrollProgress - 0.15) * 3) * 0.05})`,
          }}
        >
          <Image
            src="/images/integrations-dashboard.jpg"
            alt="Integration dashboard"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Floating integration logos */}
      {integrations.map((integration, index) => {
        const delay = 0.2 + index * 0.05
        const itemProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 3))
        const floatOffset = Math.sin(Date.now() / 1000 + index) * 5
        const mouseOffsetX = (mousePos.x - 0.5) * (index % 2 === 0 ? 20 : -20)
        const mouseOffsetY = (mousePos.y - 0.5) * (index % 2 === 0 ? 15 : -15)

        return (
          <div
            key={integration.name}
            className="absolute hidden md:flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-neutral-100"
            style={{
              left: `${integration.x}%`,
              top: `${integration.y}%`,
              opacity: itemProgress,
              transform: `translate(${mouseOffsetX}px, ${mouseOffsetY + floatOffset}px) scale(${0.8 + itemProgress * 0.2})`,
              transition: "transform 0.3s ease-out, opacity 0.6s ease-out",
            }}
          >
            <Image
              src={integration.logo || "/placeholder.svg"}
              alt={integration.name}
              width={40}
              height={40}
              className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
            />
          </div>
        )
      })}

      {/* Connection lines (decorative) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
        style={{ opacity: scrollProgress * 0.3 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        {integrations.slice(0, 4).map((integration, index) => (
          <line
            key={index}
            x1="50%"
            y1="50%"
            x2={`${integration.x}%`}
            y2={`${integration.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
      </svg>
    </section>
  )
}
