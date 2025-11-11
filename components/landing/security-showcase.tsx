"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, Lock, CheckCircle2 } from "lucide-react"

export function SecurityShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true)
          // Show content 1.5 seconds after main image
          setTimeout(() => {
            setShowContent(true)
          }, 1500)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[3rem] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 sm:p-12 lg:p-16 shadow-2xl border border-green-100 overflow-hidden">
          {/* Main Image Container with staggered side images */}
          <div className="relative">
            {/* Main Hero Image - Scrolls in first */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
            >
              <div className="aspect-[21/9] bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 relative">
                <img
                  src="/email-security-dashboard-with-shield-and-protectio.jpg"
                  alt="Email Security Protection"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-50/80 via-transparent to-transparent" />
              </div>
            </div>

            {/* Left Floating Card - Appears after delay */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-8 lg:-translate-x-12 w-48 sm:w-64 lg:w-80 transition-all duration-1000 delay-300 ${
                showContent ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
            >
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-green-200 p-4 sm:p-6 shadow-2xl">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 overflow-hidden mb-4">
                  <img
                    src="/email-authentication-checkmark-success-green-theme.jpg"
                    alt="Email Authentication"
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Domain Protected</span>
                </div>
              </div>
            </div>

            {/* Right Floating Card - Appears after delay */}
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-8 lg:translate-x-12 w-48 sm:w-64 lg:w-80 transition-all duration-1000 delay-500 ${
                showContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
              }`}
            >
              <div className="rounded-2xl bg-white/90 backdrop-blur-xl border border-green-200 p-4 sm:p-6 shadow-2xl">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 overflow-hidden mb-4">
                  <img
                    src="/real-time-monitoring-alerts-dashboard-blue-theme.jpg"
                    alt="Real-time Monitoring"
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Lock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">24/7 Monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content - Fades in after images */}
          <div
            className={`mt-12 text-center transition-all duration-1000 delay-700 ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Sleep peacefully knowing your sending domain is protected
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Advanced monitoring, real-time alerts, and proactive protection keep your email reputation pristine. We
              detect threats before they impact your deliverability.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                "Spam Score Monitoring",
                "Blacklist Detection",
                "Reputation Tracking",
                "Instant Alerts",
                "Auto-Recovery",
              ].map((feature, index) => (
                <div
                  key={feature}
                  className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 text-sm text-gray-700 font-medium transition-all duration-300 hover:bg-white hover:border-green-300"
                  style={{
                    transitionDelay: `${800 + index * 100}ms`,
                    opacity: showContent ? 1 : 0,
                    transform: showContent ? "translateY(0)" : "translateY(10px)",
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
