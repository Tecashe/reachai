"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Calendar } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "account", title: "Account Registration" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "prohibited-activities", title: "Prohibited Activities" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "payment", title: "Payment Terms" },
  { id: "termination", title: "Termination" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "limitation", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact Information" },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
    )

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader />

      {/* Hero */}
      <section className="py-20 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/50">
            <Calendar className="w-4 h-4" />
            <span>Last updated: December 1, 2024</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[250px_1fr] gap-16">
            {/* Sidebar Navigation */}
            <nav className="hidden lg:block">
              <div className="sticky top-32">
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">On this page</h3>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`block py-2 text-sm transition-colors ${
                          activeSection === section.id ? "text-white font-medium" : "text-white/50 hover:text-white"
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Main Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <section id="acceptance" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-white/70 leading-relaxed">
                  By accessing or using Mailfra (&quot;Service&quot;), you agree to be bound by these Terms of Service
                  (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service. These
                  Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section id="description" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-white/70 leading-relaxed">
                  Mailfra provides a cold email outreach platform that includes email warmup, inbox rotation, campaign
                  management, analytics, and related features. We reserve the right to modify, suspend, or discontinue
                  any aspect of the Service at any time without notice.
                </p>
              </section>

              <section id="account" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
                <p className="text-white/70 leading-relaxed mb-4">To use our Service, you must:</p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>Be at least 18 years old</li>
                  <li>Provide accurate, complete, and current registration information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section id="acceptable-use" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You must:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>Comply with all applicable laws, including CAN-SPAM, GDPR, and CCPA</li>
                  <li>Obtain proper consent before sending emails to recipients</li>
                  <li>Include accurate sender information and valid physical address</li>
                  <li>Honor opt-out requests within 10 business days</li>
                  <li>Maintain accurate and up-to-date contact lists</li>
                </ul>
              </section>

              <section id="prohibited-activities" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
                <p className="text-white/70 leading-relaxed mb-4">You may not use our Service to:</p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>Send unsolicited bulk emails (spam)</li>
                  <li>Transmit malware, viruses, or harmful code</li>
                  <li>Engage in phishing or fraudulent activities</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Violate intellectual property rights</li>
                  <li>Attempt to circumvent security measures</li>
                  <li>Resell or redistribute the Service without authorization</li>
                  <li>Use the Service for any illegal purpose</li>
                </ul>
              </section>

              <section id="intellectual-property" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                <p className="text-white/70 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Mailfra and are
                  protected by international copyright, trademark, and other intellectual property laws. You retain
                  ownership of content you create using the Service, but grant us a license to use it for providing and
                  improving the Service.
                </p>
              </section>

              <section id="payment" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">7. Payment Terms</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize
                  us to charge your payment method. Prices are subject to change with 30 days notice. Refunds are
                  available within the first 30 days of a new subscription.
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>All fees are exclusive of taxes unless stated otherwise</li>
                  <li>Failed payments may result in service suspension</li>
                  <li>Downgrades take effect at the next billing cycle</li>
                </ul>
              </section>

              <section id="termination" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                <p className="text-white/70 leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we
                  believe violates these Terms or is harmful to other users, us, or third parties. Upon termination,
                  your right to use the Service will cease immediately. You may cancel your account at any time through
                  your account settings.
                </p>
              </section>

              <section id="disclaimers" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers</h2>
                <p className="text-white/70 leading-relaxed">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
                  ERROR-FREE. WE DO NOT GUARANTEE ANY SPECIFIC RESULTS FROM USING THE SERVICE, INCLUDING EMAIL
                  DELIVERABILITY OR RESPONSE RATES.
                </p>
              </section>

              <section id="limitation" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-white/70 leading-relaxed">
                  IN NO EVENT SHALL MAILFRA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT
                  PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section id="indemnification" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
                <p className="text-white/70 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless Mailfra and its officers, directors, employees, and
                  agents from any claims, damages, losses, or expenses arising from your use of the Service, your
                  violation of these Terms, or your violation of any third-party rights.
                </p>
              </section>

              <section id="governing-law" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
                <p className="text-white/70 leading-relaxed">
                  These Terms shall be governed by the laws of the State of California, without regard to its conflict
                  of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the state
                  or federal courts located in San Francisco County, California.
                </p>
              </section>

              <section id="contact" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="list-none text-white/70 space-y-2">
                  <li>Email: legal@mailfra.io</li>
                  <li>Address: 548 Market Street, Suite 42, San Francisco, CA 94104</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
