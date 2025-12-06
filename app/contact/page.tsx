"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const contactMethods = [
  {
    icon: MessageSquare,
    title: "Sales",
    description: "Talk to our sales team about enterprise plans",
    email: "sales@mailfra.com",
    response: "< 2 hours",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Get help with technical issues",
    email: "support@mailfra.com",
    response: "< 4 hours",
  },
  {
    icon: Building,
    title: "Partnerships",
    description: "Explore partnership opportunities",
    email: "partners@mailfra.com",
    response: "< 24 hours",
  },
]

const offices = [
  {
    city: "San Francisco",
    address: "548 Market Street, Suite 42",
    zip: "San Francisco, CA 94104",
    image: "/images/offices/sf.jpg",
    timezone: "PST (UTC-8)",
  },
  {
    city: "London",
    address: "1 Canada Square, Level 39",
    zip: "London, E14 5AB",
    image: "/images/offices/london.jpg",
    timezone: "GMT (UTC+0)",
  },
  {
    city: "Singapore",
    address: "1 Raffles Place, Tower 2",
    zip: "Singapore 048616",
    image: "/images/offices/singapore.jpg",
    timezone: "SGT (UTC+8)",
  },
]

const faq = [
  {
    question: "How quickly can I expect a response?",
    answer:
      "Our sales team typically responds within 2 hours during business hours. Support queries are answered within 4 hours, and we offer 24/7 support for enterprise customers.",
  },
  {
    question: "Do you offer demos?",
    answer:
      "Yes! We'd love to show you around. Book a demo through our contact form or email sales@mailfra.com directly.",
  },
  {
    question: "What's included in a demo?",
    answer:
      "A personalized 30-minute walkthrough of the platform, Q&A session, and discussion of your specific use case and requirements.",
  },
]

export default function ContactPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader />

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1
              id="hero-title"
              data-animate
              className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${
                visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Get in Touch
            </h1>
            <p
              id="hero-subtitle"
              data-animate
              className={`text-xl md:text-2xl text-white/60 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
                visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Have questions? We&apos;d love to hear from you. Our team is ready to help you succeed with cold email.
            </p>
          </div>

          {/* Contact Methods */}
          <div
            id="methods-grid"
            data-animate
            className={`grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${
              visibleSections.has("methods-grid") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <a
                  key={method.title}
                  href={`mailto:${method.email}`}
                  className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-white/60 mb-4">{method.description}</p>
                  <div className="text-white/80 font-medium mb-2">{method.email}</div>
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Clock className="w-4 h-4" />
                    Response time: {method.response}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2
                id="form-title"
                data-animate
                className={`text-4xl font-bold mb-6 transition-all duration-700 ${
                  visibleSections.has("form-title") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                Send us a Message
              </h2>
              <p
                id="form-subtitle"
                data-animate
                className={`text-white/60 mb-8 transition-all duration-700 delay-100 ${
                  visibleSections.has("form-subtitle") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              {formSubmitted ? (
                <div
                  id="form-success"
                  className="p-8 bg-white/10 border border-white/20 rounded-2xl text-center animate-fade-in"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">Message Sent!</h3>
                  <p className="text-white/60">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  id="form-container"
                  data-animate
                  className={`space-y-6 transition-all duration-700 delay-200 ${
                    visibleSections.has("form-container") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales inquiry</option>
                      <option value="support">Technical support</option>
                      <option value="demo">Request a demo</option>
                      <option value="partnership">Partnership opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-white text-black hover:bg-white/90">
                    Send Message <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2
                id="faq-title"
                data-animate
                className={`text-4xl font-bold mb-8 transition-all duration-700 ${
                  visibleSections.has("faq-title") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                Common Questions
              </h2>

              <div className="space-y-6">
                {faq.map((item, index) => (
                  <div
                    key={item.question}
                    id={`faq-${index}`}
                    data-animate
                    className={`p-6 bg-white/5 border border-white/10 rounded-xl transition-all duration-500 ${
                      visibleSections.has(`faq-${index}`) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                    <p className="text-white/60">{item.answer}</p>
                  </div>
                ))}
              </div>

              {/* Direct contact info */}
              <div
                id="direct-contact"
                data-animate
                className={`mt-12 p-8 border border-white/10 rounded-2xl transition-all duration-700 delay-300 ${
                  visibleSections.has("direct-contact") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
              >
                <h3 className="text-xl font-semibold mb-6">Prefer to reach out directly?</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:hello@mailfra.com"
                    className="flex items-center gap-4 text-white/70 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    hello@mailfra.com
                  </a>
                  <a
                    href="tel:+14155551234"
                    className="flex items-center gap-4 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +1 (415) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="offices-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("offices-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our Offices
          </h2>
          <p
            id="offices-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("offices-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Visit us at one of our global locations
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div
                key={office.city}
                id={`office-${index}`}
                data-animate
                className={`group overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 ${
                  visibleSections.has(`office-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={office.image || "/placeholder.svg"}
                    alt={office.city}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold">{office.city}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 mt-0.5 text-white/50 flex-shrink-0" />
                    <div>
                      <p className="text-white/80">{office.address}</p>
                      <p className="text-white/50">{office.zip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-white/50" />
                    <span className="text-white/60">{office.timezone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
