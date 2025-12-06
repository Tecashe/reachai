"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, Lock, Server, Eye } from "lucide-react"

const certifications = [
  {
    name: "SOC 2 Type II",
    description: "Certified compliant",
    icon: Shield,
  },
  {
    name: "GDPR",
    description: "Fully compliant",
    icon: Lock,
  },
  {
    name: "CAN-SPAM",
    description: "100% compliant",
    icon: Server,
  },
  {
    name: "CCPA",
    description: "Privacy protected",
    icon: Eye,
  },
]

const securityFeatures = [
  "256-bit AES encryption at rest",
  "TLS 1.3 encryption in transit",
  "Regular penetration testing",
  "99.99% uptime SLA",
  "Daily automated backups",
  "Role-based access control",
]

export function Security() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 bg-neutral-950 overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: "-100%",
              right: "-100%",
              animation: isVisible ? `slideRight ${3 + i * 0.5}s ease-in-out infinite` : "none",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0%,
          100% {
            transform: translateX(-50%);
          }
          50% {
            transform: translateX(50%);
          }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <span
              className={`text-neutral-500 text-sm tracking-widest uppercase mb-4 block transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              Security & Compliance
            </span>
            <h2
              className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              Enterprise-grade security you can trust
            </h2>
            <p
              className={`text-neutral-400 text-lg mb-8 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              Your data is protected by the same security standards used by Fortune 500 companies. We take compliance
              seriously so you can focus on growing your business.
            </p>

            {/* Security features list */}
            <div className="grid grid-cols-2 gap-3">
              {securityFeatures.map((feature, index) => (
                <div
                  key={feature}
                  className={`flex items-center gap-2 text-neutral-300 text-sm transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: `${300 + index * 50}ms` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Certification cards */}
          <div className="grid grid-cols-2 gap-4">
            {certifications.map((cert, index) => {
              const Icon = cert.icon
              return (
                <div
                  key={cert.name}
                  className={`relative p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-500 cursor-pointer ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  } ${hoveredIndex === index ? "border-white/30 bg-neutral-800/50 -translate-y-1" : ""}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-white/5 transition-opacity duration-300 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                        hoveredIndex === index ? "bg-white" : "bg-neutral-800"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors duration-300 ${
                          hoveredIndex === index ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-1">{cert.name}</h3>
                    <p className="text-neutral-500 text-sm">{cert.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
