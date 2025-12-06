"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, Lock, Server, Eye, Key, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const securityFeatures = [
  {
    icon: Lock,
    title: "Encryption at Rest & Transit",
    description:
      "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Your emails and contact data are protected at every stage.",
  },
  {
    icon: Server,
    title: "SOC 2 Type II Certified",
    description:
      "We undergo annual audits to ensure our security controls meet the highest standards. Our SOC 2 report is available upon request.",
  },
  {
    icon: Eye,
    title: "24/7 Security Monitoring",
    description:
      "Our security team monitors for threats around the clock. Automated alerts and manual reviews ensure rapid incident response.",
  },
  {
    icon: Key,
    title: "Role-Based Access Control",
    description:
      "Fine-grained permissions let you control who can access what. Audit logs track every action for complete visibility.",
  },
]

const certifications = [
  { name: "SOC 2 Type II", image: "/images/security/soc2.jpg" },
  { name: "GDPR Compliant", image: "/images/security/gdpr.jpg" },
  { name: "CCPA Compliant", image: "/images/security/ccpa.jpg" },
  { name: "ISO 27001", image: "/images/security/iso27001.jpg" },
]

const practices = [
  {
    category: "Infrastructure",
    items: [
      "Hosted on AWS with multi-region redundancy",
      "Automatic daily backups with 30-day retention",
      "DDoS protection and Web Application Firewall",
      "Regular penetration testing by third parties",
      "Infrastructure as Code with version control",
    ],
  },
  {
    category: "Application Security",
    items: [
      "Secure software development lifecycle (SSDLC)",
      "Regular dependency vulnerability scanning",
      "Code reviews for all production changes",
      "Automated security testing in CI/CD pipeline",
      "Bug bounty program for responsible disclosure",
    ],
  },
  {
    category: "Data Protection",
    items: [
      "Data minimization and purpose limitation",
      "Automatic data retention policies",
      "Secure data deletion upon request",
      "Customer data isolation and segregation",
      "No third-party data sales, ever",
    ],
  },
  {
    category: "Access Control",
    items: [
      "Single Sign-On (SSO) support",
      "Multi-factor authentication (MFA)",
      "IP allowlisting for enterprise accounts",
      "Session management and timeout controls",
      "Comprehensive audit logging",
    ],
  },
]

const faqs = [
  {
    question: "How is my data protected?",
    answer:
      "All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. We use AWS infrastructure with strict access controls and regular security audits.",
  },
  {
    question: "Do you share data with third parties?",
    answer:
      "We never sell your data. We only share data with service providers who are contractually bound to protect it, and only as necessary to provide our services.",
  },
  {
    question: "Can I export or delete my data?",
    answer:
      "Yes, you can export all your data at any time through your account settings. We also honor data deletion requests within 30 days in compliance with GDPR and CCPA.",
  },
  {
    question: "Do you have a bug bounty program?",
    answer:
      "Yes, we maintain a responsible disclosure program. Security researchers can report vulnerabilities to security@mailfra.io for review and potential reward.",
  },
]

export default function SecurityPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

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

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader />

      {/* Hero */}
      <section className="py-32 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>

              <h1
                id="hero-title"
                data-animate
                className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-1000 ${
                  visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Security at Mailfra
              </h1>
              <p
                id="hero-subtitle"
                data-animate
                className={`text-xl text-white/60 mb-8 transition-all duration-1000 delay-200 ${
                  visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Your data security is our top priority. We implement enterprise-grade security measures to protect your
                information at every level.
              </p>
              <div
                id="hero-cta"
                data-animate
                className={`flex flex-wrap gap-4 transition-all duration-1000 delay-300 ${
                  visibleSections.has("hero-cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Shield className="mr-2 w-4 h-4" /> Request Security Report
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
                  <AlertTriangle className="mr-2 w-4 h-4" /> Report Vulnerability
                </Button>
              </div>
            </div>

            <div
              id="hero-badges"
              data-animate
              className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-400 ${
                visibleSections.has("hero-badges") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-white/30 transition-colors"
                >
                  <div className="w-16 h-16 relative mb-4">
                    <Image
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.name}
                      fill
                      className="object-contain opacity-70"
                    />
                  </div>
                  <span className="text-sm text-white/60 text-center">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="features-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("features-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Enterprise-Grade Security
          </h2>
          <p
            id="features-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("features-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Built from the ground up with security in mind
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  id={`feature-${index}`}
                  data-animate
                  className={`p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 ${
                    visibleSections.has(`feature-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="practices-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("practices-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Security Practices
          </h2>
          <p
            id="practices-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("practices-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Comprehensive security across every layer
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {practices.map((practice, index) => (
              <div
                key={practice.category}
                id={`practice-${index}`}
                data-animate
                className={`p-8 border border-white/10 rounded-2xl transition-all duration-500 ${
                  visibleSections.has(`practice-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-6">{practice.category}</h3>
                <ul className="space-y-4">
                  {practice.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            id="faq-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-16 transition-all duration-700 ${
              visibleSections.has("faq-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Security FAQ
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                id={`faq-${index}`}
                data-animate
                className={`p-6 bg-white/5 border border-white/10 rounded-xl transition-all duration-500 ${
                  visibleSections.has(`faq-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-white/60">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-32 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Have Security Questions?</h2>
          <p className="text-xl text-black/60 mb-10">
            Our security team is here to help. Reach out for security assessments, compliance documentation, or to
            report vulnerabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-black text-white hover:bg-black/80">
              Contact Security Team
            </Button>
            <Button size="lg" variant="outline" className="border-black/20 bg-transparent">
              Download Security Whitepaper
            </Button>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
