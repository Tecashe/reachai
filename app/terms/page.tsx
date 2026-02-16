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
    <main className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero */}
      <section className="py-12 md:py-20 px-4 md:px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 md:mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-12 md:w-14 h-12 md:h-14 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center">
              <FileText className="w-6 md:w-7 h-6 md:h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">Terms of Service</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm md:text-base">Last updated: December 1, 2024</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[200px_1fr] gap-8 md:gap-12 lg:gap-16">
            {/* Sidebar Navigation */}
            <nav className="hidden lg:block">
              <div className="sticky top-32">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</h3>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`block py-2 text-sm transition-colors ${activeSection === section.id
                            ? "text-foreground font-medium border-l-2 border-primary pl-3"
                            : "text-muted-foreground hover:text-foreground pl-3"
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
            <div className="space-y-10 md:space-y-12 max-w-none">
              <section id="acceptance" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  By accessing or using Mailfra (&quot;Service&quot;), you agree to be bound by these Terms of Service
                  (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service. These
                  Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </section>

              <section id="description" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Mailfra provides a cold email outreach platform that includes email warmup, inbox rotation, campaign
                  management, analytics, and related features. We reserve the right to modify, suspend, or discontinue
                  any aspect of the Service at any time without notice.
                </p>
              </section>

              <section id="account" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">3. Account Registration</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">To use our Service, you must:</p>
                <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Be at least 18 years old</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Provide accurate, complete, and current registration information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Maintain the security of your password and account</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Accept responsibility for all activities under your account</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Notify us immediately of any unauthorized use</span>
                  </li>
                </ul>
              </section>

              <section id="acceptable-use" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You must:
                </p>
                <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Comply with all applicable laws, including CAN-SPAM, GDPR, and CCPA</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Obtain proper consent before sending emails to recipients</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Include accurate sender information and valid physical address</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Honor opt-out requests within 10 business days</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Maintain accurate and up-to-date contact lists</span>
                  </li>
                </ul>
              </section>

              <section id="prohibited-activities" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">5. Prohibited Activities</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">You may not use our Service to:</p>
                <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Send unsolicited bulk emails (spam)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Transmit malware, viruses, or harmful code</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Engage in phishing or fraudulent activities</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Harass, abuse, or harm others</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Violate intellectual property rights</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Attempt to circumvent security measures</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Resell or redistribute the Service without authorization</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Use the Service for any illegal purpose</span>
                  </li>
                </ul>
              </section>

              <section id="intellectual-property" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  The Service and its original content, features, and functionality are owned by Mailfra and are
                  protected by international copyright, trademark, and other intellectual property laws. You retain
                  ownership of content you create using the Service, but grant us a license to use it for providing and
                  improving the Service.
                </p>
              </section>

              <section id="payment" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">7. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                  Paid subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize
                  us to charge your payment method. Prices are subject to change with 30 days notice. Refunds are
                  available within the first 30 days of a new subscription.
                </p>
                <ul className="space-y-2 text-muted-foreground text-base md:text-lg">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>All fees are exclusive of taxes unless stated otherwise</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Failed payments may result in service suspension</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Downgrades take effect at the next billing cycle</span>
                  </li>
                </ul>
              </section>

              <section id="termination" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we
                  believe violates these Terms or is harmful to other users, us, or third parties. Upon termination,
                  your right to use the Service will cease immediately. You may cancel your account at any time through
                  your account settings.
                </p>
              </section>

              <section id="disclaimers" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">9. Disclaimers</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
                  ERROR-FREE. WE DO NOT GUARANTEE ANY SPECIFIC RESULTS FROM USING THE SERVICE, INCLUDING EMAIL
                  DELIVERABILITY OR RESPONSE RATES.
                </p>
              </section>

              <section id="limitation" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  IN NO EVENT SHALL MAILFRA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT
                  PAID BY YOU IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section id="indemnification" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">11. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  You agree to defend, indemnify, and hold harmless Mailfra and its officers, directors, employees, and
                  agents from any claims, damages, losses, or expenses arising from your use of the Service, your
                  violation of these Terms, or your violation of any third-party rights.
                </p>
              </section>

              <section id="governing-law" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  These Terms shall be governed by the laws of the State of California, without regard to its conflict
                  of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the state
                  or federal courts located in San Francisco County, California.
                </p>
              </section>

              <section id="contact" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">13. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground text-base md:text-lg">
                  <p className="flex gap-3">
                    <span className="font-medium text-foreground min-w-fit">Email:</span>
                    <span>legal@mailfra.com</span>
                  </p>
                  <p className="flex gap-3">
                    <span className="font-medium text-foreground min-w-fit">Address:</span>
                    <span>548 Market Street, Suite 42, San Francisco, CA 94104</span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
