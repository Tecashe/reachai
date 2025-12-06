"use client"

import { useState, useEffect, useRef } from "react"

export function ROICalculator() {
  const [emailsPerMonth, setEmailsPerMonth] = useState(10000)
  const [currentReplyRate, setCurrentReplyRate] = useState(2)
  const [dealValue, setDealValue] = useState(5000)
  const [isVisible, setIsVisible] = useState(false)
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  const improvedReplyRate = currentReplyRate * 2.5
  const currentMeetings = Math.round(((emailsPerMonth * currentReplyRate) / 100) * 0.3)
  const improvedMeetings = Math.round(((emailsPerMonth * improvedReplyRate) / 100) * 0.3)
  const currentRevenue = currentMeetings * dealValue * 0.2
  const improvedRevenue = improvedMeetings * dealValue * 0.2
  const additionalRevenue = improvedRevenue - currentRevenue

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

  useEffect(() => {
    if (isVisible) {
      const duration = 1500
      const steps = 60
      const increment = additionalRevenue / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= additionalRevenue) {
          setAnimatedRevenue(additionalRevenue)
          clearInterval(timer)
        } else {
          setAnimatedRevenue(current)
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, additionalRevenue])

  return (
    <section ref={sectionRef} className="relative py-32 bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4 block">ROI Calculator</span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">See Your Revenue Potential</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calculate how much additional revenue you could generate with improved deliverability
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Sliders */}
          <div
            className="space-y-10 transition-all duration-1000 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">Emails per month</label>
                <span className="text-2xl font-bold">{emailsPerMonth.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={emailsPerMonth}
                onChange={(e) => setEmailsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1,000</span>
                <span>100,000</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">Current reply rate</label>
                <span className="text-2xl font-bold">{currentReplyRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={currentReplyRate}
                onChange={(e) => setCurrentReplyRate(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0.5%</span>
                <span>10%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">Average deal value</label>
                <span className="text-2xl font-bold">${dealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 
                          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full 
                          [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$500</span>
                <span>$50,000</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div
            className="transition-all duration-1000 delay-400"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <div className="bg-foreground text-background rounded-3xl p-10 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-background/5" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-background/5" />

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <span className="text-background/60 text-sm uppercase tracking-wider">
                    Additional Monthly Revenue
                  </span>
                  <div className="text-6xl md:text-7xl font-bold mt-2">
                    ${Math.round(animatedRevenue).toLocaleString()}
                  </div>
                </div>

                <div className="h-px bg-background/20 my-8" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-background/60 text-sm mb-1">Current</div>
                    <div className="text-2xl font-semibold">{currentMeetings}</div>
                    <div className="text-background/60 text-xs">meetings/mo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-background/60 text-sm mb-1">With Mailfra</div>
                    <div className="text-2xl font-semibold text-green-400">{improvedMeetings}</div>
                    <div className="text-background/60 text-xs">meetings/mo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-background/60 text-sm mb-1">Reply Rate</div>
                    <div className="text-2xl font-semibold">{currentReplyRate}%</div>
                    <div className="text-background/60 text-xs">current</div>
                  </div>
                  <div className="text-center">
                    <div className="text-background/60 text-sm mb-1">Reply Rate</div>
                    <div className="text-2xl font-semibold text-green-400">{improvedReplyRate.toFixed(1)}%</div>
                    <div className="text-background/60 text-xs">projected</div>
                  </div>
                </div>

                <div className="mt-8">
                  <button className="w-full py-4 bg-background text-foreground rounded-full font-medium hover:bg-background/90 transition-colors">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
