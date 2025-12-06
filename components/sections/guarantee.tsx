"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function Guarantee() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Full bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/guarantee-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
          style={{
            transform: `scale(1.1) translate(${(mousePosition.x - 0.5) * -20}px, ${(mousePosition.y - 0.5) * -20}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Animated ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-[600px] h-[600px] rounded-full border border-white/5 transition-all duration-1000 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute w-[400px] h-[400px] rounded-full border border-white/10 transition-all duration-1000 delay-200 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute w-[200px] h-[200px] rounded-full border border-white/20 transition-all duration-1000 delay-400 ${
            isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium">Risk-Free Guarantee</span>
        </div>

        {/* Main heading */}
        <h2
          className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          30 days.
          <br />
          <span className="text-neutral-500">No questions asked.</span>
        </h2>

        {/* Description */}
        <p
          className={`text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          We&apos;re so confident Mailfra will transform your outbound that we offer a full 30-day money-back guarantee.
          If you&apos;re not seeing results, we&apos;ll refund every penny.
        </p>

        {/* Guarantee points */}
        <div
          className={`flex flex-wrap justify-center gap-6 mb-12 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {["Full refund, no hassle", "Keep all your data", "Cancel anytime"].map((point, index) => (
            <div
              key={point}
              className="flex items-center gap-2 text-neutral-300"
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <button className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-105">
            <span className="relative z-10">Start Your Risk-Free Trial</span>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <p className="text-neutral-500 text-sm mt-4">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
