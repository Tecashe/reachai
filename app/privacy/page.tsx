"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Calendar } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "security", title: "Security" },
  { id: "cookies", title: "Cookies" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact Us" },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
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
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
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
              <section id="introduction" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-white/70 leading-relaxed">
                  At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
                  privacy and ensuring the security of your personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when you use our cold email platform and
                  related services.
                </p>
                <p className="text-white/70 leading-relaxed">
                  By using Mailfra, you agree to the collection and use of information in accordance with this policy.
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <section id="information-we-collect" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We collect several types of information to provide and improve our services:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
                  <li>Name and email address</li>
                  <li>Company name and job title</li>
                  <li>Billing information and payment details</li>
                  <li>Phone number (optional)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
                  <li>Email campaign performance metrics</li>
                  <li>Login and access times</li>
                  <li>Features used and actions taken</li>
                  <li>Device and browser information</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Email Data</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>Email content and templates you create</li>
                  <li>Recipient email addresses and contact information</li>
                  <li>Email engagement data (opens, clicks, replies)</li>
                </ul>
              </section>

              <section id="how-we-use" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-white/70 leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>Provide, operate, and maintain our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and fraud</li>
                  <li>Improve and personalize our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section id="data-sharing" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information in the following
                  circumstances:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We share data with third-party vendors who perform services on
                    our behalf (e.g., payment processing, analytics, email delivery).
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets,
                    your information may be transferred.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose information if required by law or in response
                    to valid legal requests.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may share information with your explicit consent.
                  </li>
                </ul>
              </section>

              <section id="data-retention" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                <p className="text-white/70 leading-relaxed">
                  We retain your personal information for as long as your account is active or as needed to provide you
                  services. We will retain and use your information as necessary to comply with our legal obligations,
                  resolve disputes, and enforce our agreements. Campaign and email data is retained for 24 months after
                  your last activity, after which it is automatically deleted or anonymized.
                </p>
              </section>

              <section id="your-rights" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    <strong>Rectification:</strong> Request correction of inaccurate data
                  </li>
                  <li>
                    <strong>Erasure:</strong> Request deletion of your personal data
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a machine-readable copy of your data
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to processing of your personal data
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing
                  </li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  To exercise these rights, please contact us at privacy@mailfra.io.
                </p>
              </section>

              <section id="security" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Security</h2>
                <p className="text-white/70 leading-relaxed">
                  We implement industry-standard security measures to protect your data, including encryption in transit
                  (TLS 1.3) and at rest (AES-256), regular security audits, and access controls. However, no method of
                  transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section id="cookies" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain
                  information. Cookies are files with a small amount of data which may include an anonymous unique
                  identifier.
                </p>
                <p className="text-white/70 leading-relaxed">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                  However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </section>

              <section id="changes" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                <p className="text-white/70 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to
                  review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section id="contact" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none text-white/70 space-y-2">
                  <li>Email: privacy@mailfra.io</li>
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
