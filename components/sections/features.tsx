
"use client"

import { useEffect, useRef, useState } from "react"

const features = [
  {
    title: "Unlimited Email Accounts",
    description:
      "Connect as many email accounts as you need. Rotate sending across multiple accounts to maximize deliverability and scale your outreach.",
    image: "email-accounts.png", // or .png, .webp - whatever format you use
  },
  {
    title: "AI-Powered Warmup",
    description:
      "Automatically warm up new email accounts with realistic conversations. Our AI mimics natural email patterns to build sender reputation fast.",
    image: "email-warmup.jpg",
  },
  {
    title: "Smart Inbox Rotation",
    description:
      "Distribute sends across your accounts intelligently. Avoid spam triggers by spreading volume and maintaining healthy sending limits.",
    image: "inbox-rotation.jpg",
  },
  {
    title: "Deliverability Monitoring",
    description:
      "Real-time insights into your email health. Track inbox placement, bounce rates, and spam scores across all campaigns.",
    image: "deliverability-monitoring.jpg",
  },
  {
    title: "AI Personalization",
    description:
      "Generate hyper-personalized email content at scale. Our AI researches prospects and crafts messages that feel genuinely human.",
    image: "ai-personalization.jpg",
  },
  {
    title: "Advanced Analytics",
    description:
      "Deep insights into campaign performance. Track opens, replies, conversions, and revenue attribution across your entire pipeline.",
    image: "advanced-analytics.jpg",
  },
]

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const [smoothProgress, setSmoothProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      const viewportHeight = window.innerHeight

      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)))
      setScrollProgress(progress)

      const featureIndex = Math.min(features.length - 1, Math.floor(progress * features.length))
      setActiveFeature(featureIndex)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let animationFrame: number
    const smoothing = 0.08

    const animate = () => {
      setSmoothProgress((prev) => {
        const diff = scrollProgress - prev
        if (Math.abs(diff) < 0.0001) return scrollProgress
        return prev + diff * smoothing
      })
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [scrollProgress])

  return (
    <section ref={sectionRef} className="relative bg-foreground text-background" style={{ minHeight: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 overflow-hidden py-6 sm:py-8 border-b border-background/10">
          <div
            className="flex whitespace-nowrap"
            style={{
              transform: `translateX(${-smoothProgress * 400}px)`,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <h2
                key={i}
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold mx-4 sm:mx-8 flex items-center gap-4 sm:gap-8"
                style={{
                  opacity: 0.15 + smoothProgress * 0.85,
                }}
              >
                <span>Everything you need to scale</span>
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-background/40" />
              </h2>
            ))}
          </div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center pt-24 sm:pt-32 lg:pt-40">
          {/* Left side - Feature text with staggered reveal */}
          <div className="w-full lg:w-1/2 py-8 lg:py-0 lg:pr-12">
            <div
              className="mb-8 sm:mb-12"
              style={{
                opacity: smoothProgress > 0.02 ? 1 : 0,
                transform: `translateY(${smoothProgress > 0.02 ? 0 : 30}px)`,
                transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <p className="text-sm sm:text-base text-background/60 tracking-wide uppercase font-medium">Features</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => {
                const isActive = activeFeature === index
                const featureProgress = Math.max(0, Math.min(1, (smoothProgress * features.length - index) * 2))

                return (
                  <div
                    key={feature.title}
                    className="relative cursor-pointer"
                    style={{
                      opacity: featureProgress > 0 ? 0.4 + (isActive ? 0.6 : 0) : 0,
                      transform: `translateX(${featureProgress > 0 ? 0 : -30}px)`,
                      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                    {/* Active indicator */}
                    <div
                      className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-1 bg-background rounded-full origin-top"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: `scaleY(${isActive ? 1 : 0})`,
                        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />

                    <div
                      style={{
                        paddingLeft: isActive ? "8px" : "0px",
                        transition: "padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <h3
                        className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2"
                        style={{
                          color: isActive ? "var(--background)" : "rgba(var(--background-rgb, 255,255,255), 0.5)",
                          transition: "color 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        {feature.title}
                      </h3>
                      <div
                        className="overflow-hidden"
                        style={{
                          maxHeight: isActive ? "100px" : "0px",
                          opacity: isActive ? 1 : 0,
                          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <p className="text-sm sm:text-base leading-relaxed text-background/70">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 sm:mt-12 flex items-center gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className="h-1 rounded-full bg-current"
                  style={{
                    width: activeFeature === index ? "32px" : "8px",
                    opacity: activeFeature === index ? 1 : 0.3,
                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[40vh] lg:h-[70%] flex items-center justify-center">
            <div
              className="relative w-full max-w-xl aspect-[4/3] rounded-2xl overflow-hidden"
              style={{
                transform: `
                  perspective(1000px)
                  rotateY(${-5 + smoothProgress * 10}deg)
                  rotateX(${5 - smoothProgress * 5}deg)
                  scale(${0.95 + smoothProgress * 0.05})
                `,
                boxShadow: `
                  0 25px 50px -12px rgba(0,0,0,0.5),
                  0 0 0 1px rgba(255,255,255,0.1)
                `,
                transition: "transform 0.1s linear",
              }}
            >
              {/* Feature images with crossfade */}
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="absolute inset-0"
                  style={{
                    opacity: activeFeature === index ? 1 : 0,
                    transform: `scale(${activeFeature === index ? 1 : 1.1})`,
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <img
                    src={`/${feature.image}`}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              ))}

              {/* Floating UI elements */}
              <div
                className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
                style={{
                  transform: `translateY(${20 - smoothProgress * 20}px)`,
                  opacity: smoothProgress > 0.1 ? 1 : 0,
                  transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60 mb-1">
                      Feature {activeFeature + 1} of {features.length}
                    </p>
                    <p className="text-sm font-medium text-white">{features[activeFeature].title}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{activeFeature + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}