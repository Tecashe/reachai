"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const plans = [
  {
    name: "Starter",
    description: "Perfect for testing the waters",
    price: { monthly: 37, yearly: 29 },
    features: [
      "3 email accounts",
      "1,000 emails/month",
      "Basic email warmup",
      "Lead finder (500 credits)",
      "Email templates",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Growth",
    description: "For teams scaling outreach",
    price: { monthly: 97, yearly: 79 },
    features: [
      "Unlimited email accounts",
      "10,000 emails/month",
      "Advanced AI warmup",
      "Lead finder (5,000 credits)",
      "AI personalization",
      "A/B testing",
      "CRM integrations",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Scale",
    description: "For high-volume senders",
    price: { monthly: 297, yearly: 249 },
    features: [
      "Unlimited everything",
      "100,000 emails/month",
      "Enterprise warmup pools",
      "Unlimited lead credits",
      "Custom AI models",
      "Dedicated IP addresses",
      "White-label options",
      "Dedicated success manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-muted/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.02), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.02), transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center mb-12 sm:mb-16 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <p className="text-sm sm:text-base text-muted-foreground tracking-wide uppercase font-medium mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free for 14 days. No credit card required.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center gap-3 mt-8 p-1 bg-background rounded-full border border-border transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "200ms",
            }}
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                billingPeriod === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                billingPeriod === "yearly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-foreground text-background text-xs px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => {
            const isHovered = hoveredCard === index
            const delay = index * 150

            return (
              <div
                key={plan.name}
                className="relative transition-all duration-700"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? `translateY(0) scale(${isHovered ? 1.02 : 1})`
                    : "translateY(60px) scale(0.95)",
                  transitionDelay: `${delay}ms`,
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-foreground text-background text-xs font-semibold px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-500 ${
                    plan.highlighted
                      ? "bg-foreground text-background"
                      : "bg-background border border-border hover:border-foreground/20"
                  }`}
                  style={{
                    boxShadow: plan.highlighted
                      ? isHovered
                        ? "0 40px 80px -20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
                        : "0 25px 50px -12px rgba(0,0,0,0.25)"
                      : isHovered
                        ? "0 25px 50px -12px rgba(0,0,0,0.15)"
                        : "0 10px 40px -15px rgba(0,0,0,0.1)",
                    transform: `perspective(1000px) rotateX(${isHovered ? -2 : 0}deg)`,
                  }}
                >
                  {/* Plan header */}
                  <div className="mb-6 sm:mb-8">
                    <h3
                      className={`text-xl sm:text-2xl font-bold mb-2 ${
                        plan.highlighted ? "text-background" : "text-foreground"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-4xl sm:text-5xl font-bold ${
                          plan.highlighted ? "text-background" : "text-foreground"
                        }`}
                      >
                        ${plan.price[billingPeriod]}
                      </span>
                      <span className={plan.highlighted ? "text-background/60" : "text-muted-foreground"}>/month</span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p
                        className={`text-sm mt-1 ${plan.highlighted ? "text-background/60" : "text-muted-foreground"}`}
                      >
                        Billed annually (${plan.price.yearly * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 sm:space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            plan.highlighted ? "bg-background/20" : "bg-foreground/5"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${plan.highlighted ? "text-background" : "text-foreground"}`}
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          className={`text-sm sm:text-base ${
                            plan.highlighted ? "text-background/90" : "text-muted-foreground"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className={`w-full h-12 sm:h-14 rounded-xl text-base font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-background text-foreground hover:bg-background/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                    style={{
                      boxShadow: isHovered ? "0 10px 30px -10px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust badges */}
        <div
          className="mt-12 sm:mt-16 text-center transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "600ms",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-muted-foreground">
            <span className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
