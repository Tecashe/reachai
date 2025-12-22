"use client"

import { useEffect, useRef, useState } from "react"

export function LiquidMorph() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      setProgress(scrollProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const turbulence = 0.01 + progress * 0.05
  const displacement = progress < 0.5 ? progress * 200 : (1 - progress) * 200

  return (
    <section ref={sectionRef} className="relative h-[250vh] bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" style={{ display: "none" }}>
          <defs>
            <filter id="liquid-filter">
              <feTurbulence type="fractalNoise" baseFrequency={turbulence} numOctaves="3" seed="1" result="noise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={displacement}
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feGaussianBlur stdDeviation={progress < 0.3 || progress > 0.7 ? 0 : 2} />
            </filter>
          </defs>
        </svg>

        <div className="relative w-full h-full flex items-center justify-center">
          {/* First image - fades out */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: 1 - progress,
              filter: "url(#liquid-filter)",
              transform: `scale(${1 + progress * 0.1})`,
            }}
          >
            <img src="/images/transforms/liquid-before.png" alt="Before" className="w-full h-full object-cover" />
          </div>

          {/* Second image - fades in */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: progress,
              filter: "url(#liquid-filter)",
              transform: `scale(${1.1 - progress * 0.1})`,
            }}
          >
            <img src="/images/transforms/liquid-after.png" alt="After" className="w-full h-full object-cover" />
          </div>

          {/* Liquid overlay effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent ${60 - Math.abs(progress - 0.5) * 40}%, rgba(0,0,0,0.3) 100%)`,
            }}
          />

          {/* Ripple rings */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/10 pointer-events-none"
              style={{
                width: `${(progress * 150 + i * 20) % 100}%`,
                height: `${(progress * 150 + i * 20) % 100}%`,
                opacity: 0.3 - (((progress * 150 + i * 20) % 100) / 100) * 0.3,
                transform: `scale(${1 + Math.sin(progress * Math.PI * 2 + i) * 0.1})`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-8 z-10">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Transformation 02</p>
          <h3 className="text-white text-2xl md:text-4xl font-light">Fluid Reality</h3>
        </div>

        <div className="absolute bottom-8 right-8 z-10">
          <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
