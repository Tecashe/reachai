"use client"

import { useState, useRef, useEffect } from "react"
import { X, Sparkles, Zap, Gift, ArrowRight } from "lucide-react"

export function ExpandingButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [buttonRect, setButtonRect] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (buttonRef.current && !isExpanded) {
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }
  }, [isExpanded])

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isExpanded])

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full font-medium shadow-lg transition-all duration-500 ${
          isExpanded ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
          color: "#000",
          boxShadow: "0 10px 40px rgba(234, 179, 8, 0.4)",
        }}
      >
        <Gift className="w-5 h-5" />
        <span>Special Offer</span>
      </button>

      {/* Expanded Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "linear-gradient(135deg, #facc15 0%, #fde047 50%, #eab308 100%)",
          clipPath: isExpanded
            ? "circle(150% at calc(100% - 48px) calc(100% - 48px))"
            : "circle(0% at calc(100% - 48px) calc(100% - 48px))",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6 text-black" />
        </button>

        {/* Content */}
        <div
          className={`h-full flex flex-col items-center justify-center px-6 text-center transition-all duration-500 delay-200 ${
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-2xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 text-black text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Get 3 Months Free
            </h2>

            <p className="text-lg sm:text-xl text-black/70 mb-10 max-w-lg mx-auto leading-relaxed">
              Start your cold email journey with Mailfra today and get your first 3 months completely free. No credit
              card required.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {["Unlimited emails", "AI warmup included", "24/7 support", "Free migration"].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/10 text-black text-sm"
                >
                  <Zap className="w-4 h-4" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white font-semibold text-lg hover:bg-black/90 transition-colors">
                Claim Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-6 py-4 text-black/70 hover:text-black font-medium transition-colors"
              >
                Maybe later
              </button>
            </div>

            {/* Urgency */}
            <p className="mt-10 text-sm text-black/50">Offer expires in 48 hours. Only 127 spots remaining.</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-20 right-40 w-48 h-48 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-yellow-200/40 blur-2xl" />
      </div>
    </>
  )
}
