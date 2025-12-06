"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does inbox warmup work?",
    answer:
      "Our AI-powered warmup gradually increases your sending volume over 2-3 weeks, automatically engaging with emails to build sender reputation. We simulate real human interactions - opens, replies, and removals from spam - to establish trust with email providers.",
  },
  {
    question: "Can I connect my existing email accounts?",
    answer:
      "Yes, we support Gmail, Google Workspace, Outlook, Office 365, and any SMTP/IMAP provider. Most accounts connect in under 2 minutes with OAuth, and we never store your passwords.",
  },
  {
    question: "What makes your deliverability better than competitors?",
    answer:
      "We use intelligent inbox rotation across multiple sending accounts, real-time deliverability monitoring, and automatic throttling when we detect potential issues. Our average users see 98%+ inbox placement rates.",
  },
  {
    question: "Is there a limit on how many emails I can send?",
    answer:
      "Limits depend on your plan, but we focus on healthy sending patterns rather than arbitrary caps. We'll guide you on optimal daily volumes based on your account age and reputation to maximize deliverability.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes, we offer a 14-day free trial with full access to all features. No credit card required. You can warm up accounts and run campaigns to see real results before committing.",
  },
  {
    question: "How do I migrate from Instantly or Smartlead?",
    answer:
      "We have one-click import tools for both platforms. Your campaigns, templates, and contact lists transfer in minutes. Our team also offers free migration support for larger accounts.",
  },
]

export function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const start = rect.top - windowHeight
      const end = rect.bottom
      const total = end - start
      const current = -start
      const progress = Math.max(0, Math.min(1, current / total))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: Math.min(1, scrollProgress * 4),
            transform: `translateY(${(1 - Math.min(1, scrollProgress * 4)) * 30}px)`,
          }}
        >
          <p className="text-neutral-400 text-sm uppercase tracking-widest mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">Common questions</h2>
          <p className="text-lg text-neutral-500">Everything you need to know before getting started</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const delay = 0.1 + index * 0.05
            const itemProgress = Math.max(0, Math.min(1, (scrollProgress - delay) * 4))
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="border border-neutral-200 rounded-2xl overflow-hidden bg-white"
                style={{
                  opacity: itemProgress,
                  transform: `translateY(${(1 - itemProgress) * 20}px)`,
                  transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-lg font-medium text-black pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96" : "max-h-0"}`}
                >
                  <p className="px-6 pb-6 text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-12"
          style={{
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.5) * 3)),
            transform: `translateY(${(1 - Math.max(0, Math.min(1, (scrollProgress - 0.5) * 3))) * 20}px)`,
          }}
        >
          <p className="text-neutral-500 mb-4">Still have questions?</p>
          <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
            Contact support
          </button>
        </div>
      </div>
    </section>
  )
}
