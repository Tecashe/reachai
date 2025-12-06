"use client"

import { useEffect, useRef, useState } from "react"

const testimonials = [
  {
    quote:
      "We went from 50 meetings a month to 200+ after switching to mailfra. The AI personalization is genuinely impressive - prospects think we spent hours researching them.",
    author: "Sarah Chen",
    role: "Head of Sales",
    company: "TechFlow",
    image: "professional headshot asian woman executive dark hair",
    metric: "4x more meetings",
  },
  {
    quote:
      "Our deliverability was struggling at 65%. Within 3 weeks of using the warmup feature, we hit 98%. Game changer for our outbound team.",
    author: "Marcus Johnson",
    role: "Revenue Operations",
    company: "ScaleUp Labs",
    image: "professional headshot black man business casual",
    metric: "98% deliverability",
  },
  {
    quote:
      "I've used Instantly, Smartlead, and Apollo. mailfra is the first tool that actually delivers on the promise of 'set it and forget it'. The AI optimization is unreal.",
    author: "Elena Rodriguez",
    role: "Founder",
    company: "GrowthHQ",
    image: "professional headshot latina woman entrepreneur",
    metric: "$2.4M pipeline",
  },
  {
    quote:
      "The inbox rotation alone saved us from burning through domains. We're sending 3x the volume with better results than before.",
    author: "David Park",
    role: "SDR Manager",
    company: "CloudBase",
    image: "professional headshot korean man tech startup",
    metric: "3x send volume",
  },
  {
    quote:
      "Finally, a cold email tool built for 2024. The lead enrichment catches details that even ZoomInfo misses. Our reply rates doubled.",
    author: "Amanda Foster",
    role: "VP of Growth",
    company: "Nexus AI",
    image: "professional headshot woman blonde executive suit",
    metric: "2x reply rates",
  },
  {
    quote:
      "We onboarded 15 SDRs in a week. The UX is so intuitive that training took 30 minutes instead of our usual 2-day bootcamp.",
    author: "James Wright",
    role: "Sales Enablement",
    company: "DataSync",
    image: "professional headshot man glasses business",
    metric: "30min onboarding",
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Calculate how far we've scrolled through this section
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
      setScrollProgress(progress)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
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
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center mb-16 sm:mb-20 transition-all duration-1000"
          style={{
            opacity: scrollProgress > 0.05 ? 1 : 0,
            transform: scrollProgress > 0.05 ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <p className="text-sm sm:text-base text-muted-foreground tracking-wide uppercase font-medium mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Loved by revenue teams worldwide
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 10,000+ sales professionals crushing their quota
          </p>
        </div>

        {/* Testimonials grid with parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => {
            // Different parallax speeds for each row
            const row = Math.floor(index / 3)
            const parallaxSpeed = row === 0 ? 0.1 : row === 1 ? 0.05 : 0
            const parallaxOffset = (scrollProgress - 0.3) * 100 * parallaxSpeed

            // Stagger entrance animation
            const delay = index * 80
            const isVisible = scrollProgress > 0.1 + index * 0.03

            return (
              <div
                key={testimonial.author}
                className="group relative transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: `
                    translateY(${isVisible ? parallaxOffset : 40}px)
                    translateX(${mousePosition.x * (index % 2 === 0 ? 3 : -3)}px)
                    rotateX(${mousePosition.y * -1}deg)
                    rotateY(${mousePosition.x * 1}deg)
                  `,
                  transitionDelay: `${delay}ms`,
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <div
                  className="relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-card border border-border transition-all duration-500 group-hover:border-foreground/10"
                  style={{
                    boxShadow: "0 10px 40px -15px rgba(0,0,0,0.1)",
                    transform: "translateZ(0)",
                  }}
                >
                  {/* Metric badge */}
                  <div
                    className="absolute -top-3 right-6 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full transition-transform duration-500 group-hover:scale-110"
                    style={{
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {testimonial.metric}
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-6">
                    <p className="text-base sm:text-lg text-foreground leading-relaxed">{`"${testimonial.quote}"`}</p>
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-foreground/20 transition-all duration-300">
                      <img
                        src={`/.jpg?height=48&width=48&query=${testimonial.image}`}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 40%)",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 sm:mt-20 text-center transition-all duration-1000"
          style={{
            opacity: scrollProgress > 0.6 ? 1 : 0,
            transform: scrollProgress > 0.6 ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="text-muted-foreground mb-4">Ready to see similar results?</p>
          <div className="inline-flex items-center gap-2 text-foreground font-medium hover:gap-3 transition-all duration-300 cursor-pointer">
            Read more customer stories
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
