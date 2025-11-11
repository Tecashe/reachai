"use client"

import { useEffect, useRef } from "react"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "Reachai completely transformed our sales process. We scaled from 200 to 3,000 qualified conversations per month. The AI personalization is genuinely mind-blowing.",
      author: "Marcus Chen",
      role: "VP of Sales",
      company: "CloudScale",
      metric: "1,400% increase in qualified leads",
      color: "from-violet-500 to-purple-600",
    },
    {
      quote:
        "I was skeptical about another email tool, but Reachai proved me wrong in week one. Our response rates jumped from 3% to 23%. The deliverability monitoring saved our domain twice.",
      author: "Rachel Morrison",
      role: "Director of Growth",
      company: "Quantum Labs",
      metric: "23% response rate",
      color: "from-blue-500 to-cyan-600",
    },
    {
      quote:
        "The email warmup and rotation features are game-changers. We send 50,000 emails monthly without a single bounce issue. Support team responds in under 10 minutes.",
      author: "James Patterson",
      role: "Head of Outbound",
      company: "TechVentures",
      metric: "Zero bounce rate",
      color: "from-emerald-500 to-teal-600",
    },
    {
      quote:
        "Best investment we made this year. The Apollo integration alone saved us 20 hours per week. ROI was positive within 14 days of launching our first campaign.",
      author: "Sofia Rodriguez",
      role: "Founder & CEO",
      company: "GrowthStack",
      metric: "14-day ROI",
      color: "from-orange-500 to-amber-600",
    },
    {
      quote:
        "We tested 7 different platforms. Reachai was the only one that didn't compromise on personalization OR deliverability. The DKIM setup wizard is brilliantly simple.",
      author: "David Kim",
      role: "Chief Marketing Officer",
      company: "ScaleUp Inc",
      metric: "98.7% deliverability",
      color: "from-pink-500 to-rose-600",
    },
    {
      quote:
        "The health monitoring alerts prevented our domain from getting blacklisted twice. Reachai essentially pays for itself by protecting our sender reputation.",
      author: "Amanda Foster",
      role: "Email Marketing Lead",
      company: "Innovate Co",
      metric: "Domain protection: priceless",
      color: "from-indigo-500 to-purple-600",
    },
  ]

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll(".testimonial-card")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in")
            }, index * 100)
          }
        })
      },
      { threshold: 0.1 },
    )

    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-6">
            <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-violet-600 font-medium text-sm">Trusted by 10,000+ growth teams</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-violet-900 to-purple-900 bg-clip-text text-transparent">
            Real results from real teams
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how companies are transforming their outreach with Reachai
          </p>
        </div>

        {/* Masonry-style testimonial grid */}
        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card opacity-0 translate-y-8 transition-all duration-700 ${
                index % 3 === 0 ? "lg:mt-0" : index % 3 === 1 ? "lg:mt-12" : "lg:mt-24"
              }`}
            >
              <div className="group relative h-full">
                {/* Gradient border effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${testimonial.color} rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`}
                />

                <div className="relative h-full glass-strong rounded-3xl p-8 hover:shadow-2xl transition-all duration-500">
                  {/* Quote icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center mb-6`}
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Quote */}
                  <p className="text-base leading-relaxed mb-6 text-balance">{testimonial.quote}</p>

                  {/* Metric badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${testimonial.color} mb-6`}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-white font-semibold text-sm">{testimonial.metric}</span>
                  </div>

                  {/* Author info with gradient accent */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3">
                      {/* Initial avatar with gradient */}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white font-bold text-lg">{testimonial.author.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        <div className="text-sm font-medium text-gray-700 mt-1">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>

                  {/* 5-star rating */}
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg text-muted-foreground mb-6">Join thousands of teams already using Reachai</p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
          >
            Start your free trial
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
