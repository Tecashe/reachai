"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useState } from "react"
import { Check, ArrowRight, Minus } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "For individuals getting started with cold email",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      { text: "3 email accounts", included: true },
      { text: "1,000 leads", included: true },
      { text: "Basic warmup", included: true },
      { text: "Email sequences", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Team collaboration", included: false },
      { text: "API access", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    description: "For growing teams scaling their outreach",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      { text: "Unlimited email accounts", included: true },
      { text: "10,000 leads", included: true },
      { text: "AI-powered warmup", included: true },
      { text: "Advanced sequences", included: true },
      { text: "Full analytics suite", included: true },
      { text: "Priority support", included: true },
      { text: "5 team members", included: true },
      { text: "API access", included: true },
      { text: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Scale",
    description: "For agencies and enterprises at scale",
    monthlyPrice: 249,
    yearlyPrice: 199,
    features: [
      { text: "Unlimited everything", included: true },
      { text: "Unlimited leads", included: true },
      { text: "Priority AI warmup", included: true },
      { text: "Multi-channel sequences", included: true },
      { text: "Custom reports", included: true },
      { text: "Dedicated support", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Full API access", included: true },
      { text: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "Start with a 14-day free trial on any plan. No credit card required. You get full access to all features during the trial period.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate accordingly.",
  },
  {
    question: "What counts as an email account?",
    answer:
      "Any Gmail, Outlook, or SMTP account you connect for sending emails. Warmup accounts are included and don't count toward your limit.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full, no questions asked.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No contracts or long-term commitments. Pay month-to-month and cancel anytime. Annual plans are paid upfront but can be cancelled.",
  },
  {
    question: "Do you offer discounts for startups or non-profits?",
    answer:
      "Yes! We offer 50% off for verified startups and non-profits. Contact our sales team with your details to apply.",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Start free, scale as you grow. No hidden fees, no per-email charges.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-muted rounded-full">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-foreground text-background text-xs font-bold rounded-full">-20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border ${
                  plan.popular ? "border-foreground bg-foreground" : "border-border bg-background"
                } transition-all duration-700`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-background text-foreground text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <h3
                      className={`text-xl font-semibold mb-2 ${plan.popular ? "text-background" : "text-foreground"}`}
                    >
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-bold ${plan.popular ? "text-background" : "text-foreground"}`}>
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className={plan.popular ? "text-background/70" : "text-muted-foreground"}>/month</span>
                    </div>
                    {isYearly && (
                      <p className={`text-sm mt-2 ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                        Billed annually (${(isYearly ? plan.yearlyPrice : plan.monthlyPrice) * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.cta === "Contact Sales" ? "/contact" : "/sign-up"}
                    className={`w-full h-12 flex items-center justify-center gap-2 rounded-full font-medium transition-all ${
                      plan.popular
                        ? "bg-background text-foreground hover:bg-background/90"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Features */}
                  <div className="mt-8 pt-8 border-t border-border/20 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature.text} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check
                            className={`w-5 h-5 flex-shrink-0 ${plan.popular ? "text-background" : "text-foreground"}`}
                          />
                        ) : (
                          <Minus className="w-5 h-5 flex-shrink-0 text-muted-foreground/50" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? plan.popular
                                ? "text-background"
                                : "text-foreground"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently asked questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about pricing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-background rounded-xl border border-border overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <div
                    className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Still have questions?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Our team is here to help. Book a demo and we'll walk you through everything.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-14 px-8 bg-foreground text-background font-medium rounded-full items-center gap-2 hover:bg-foreground/90 transition-all"
          >
            Book a Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
