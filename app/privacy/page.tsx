// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Shield, Calendar } from "lucide-react"
// import PageHeader from "@/components/shared/page-header"
// import PageFooter from "@/components/shared/page-footer"

// const sections = [
//   { id: "introduction", title: "Introduction" },
//   { id: "information-we-collect", title: "Information We Collect" },
//   { id: "how-we-use", title: "How We Use Your Information" },
//   { id: "data-sharing", title: "Data Sharing" },
//   { id: "data-retention", title: "Data Retention" },
//   { id: "your-rights", title: "Your Rights" },
//   { id: "security", title: "Security" },
//   { id: "cookies", title: "Cookies" },
//   { id: "changes", title: "Changes to This Policy" },
//   { id: "contact", title: "Contact Us" },
// ]

// export default function PrivacyPage() {
//   const [activeSection, setActiveSection] = useState("introduction")
//   const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setVisibleSections((prev) => new Set([...prev, entry.target.id]))
//             setActiveSection(entry.target.id)
//           }
//         })
//       },
//       { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
//     )

//     sections.forEach((section) => {
//       const el = document.getElementById(section.id)
//       if (el) observer.observe(el)
//     })

//     return () => observer.disconnect()
//   }, [])

//   return (
//     <main className="min-h-screen bg-black text-white">
//       <PageHeader />

//       {/* Hero */}
//       <section className="py-20 px-6 border-b border-white/10">
//         <div className="max-w-4xl mx-auto">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back to Home
//           </Link>

//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
//               <Shield className="w-7 h-7" />
//             </div>
//             <div>
//               <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 text-white/50">
//             <Calendar className="w-4 h-4" />
//             <span>Last updated: December 1, 2024</span>
//           </div>
//         </div>
//       </section>

//       {/* Content */}
//       <section className="py-16 px-6">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid lg:grid-cols-[250px_1fr] gap-16">
//             {/* Sidebar Navigation */}
//             <nav className="hidden lg:block">
//               <div className="sticky top-32">
//                 <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">On this page</h3>
//                 <ul className="space-y-2">
//                   {sections.map((section) => (
//                     <li key={section.id}>
//                       <a
//                         href={`#${section.id}`}
//                         className={`block py-2 text-sm transition-colors ${
//                           activeSection === section.id ? "text-white font-medium" : "text-white/50 hover:text-white"
//                         }`}
//                       >
//                         {section.title}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </nav>

//             {/* Main Content */}
//             <div className="prose prose-invert prose-lg max-w-none">
//               <section id="introduction" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Introduction</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
//                   privacy and ensuring the security of your personal information. This Privacy Policy explains how we
//                   collect, use, disclose, and safeguard your information when you use our cold email platform and
//                   related services.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   By using Mailfra, you agree to the collection and use of information in accordance with this policy.
//                   If you do not agree with our policies and practices, please do not use our services.
//                 </p>
//               </section>

//               <section id="information-we-collect" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We collect several types of information to provide and improve our services:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Name and email address</li>
//                   <li>Company name and job title</li>
//                   <li>Billing information and payment details</li>
//                   <li>Phone number (optional)</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email campaign performance metrics</li>
//                   <li>Login and access times</li>
//                   <li>Features used and actions taken</li>
//                   <li>Device and browser information</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Email Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>Email content and templates you create</li>
//                   <li>Recipient email addresses and contact information</li>
//                   <li>Email engagement data (opens, clicks, replies)</li>
//                 </ul>
//               </section>

//               <section id="how-we-use" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">We use the information we collect to:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>Provide, operate, and maintain our services</li>
//                   <li>Process transactions and send related information</li>
//                   <li>Send you technical notices, updates, and support messages</li>
//                   <li>Respond to your comments, questions, and customer service requests</li>
//                   <li>Monitor and analyze usage patterns and trends</li>
//                   <li>Detect, prevent, and address technical issues and fraud</li>
//                   <li>Improve and personalize our services</li>
//                   <li>Comply with legal obligations</li>
//                 </ul>
//               </section>

//               <section id="data-sharing" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Data Sharing</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We do not sell your personal information. We may share your information in the following
//                   circumstances:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>
//                     <strong>Service Providers:</strong> We share data with third-party vendors who perform services on
//                     our behalf (e.g., payment processing, analytics, email delivery).
//                   </li>
//                   <li>
//                     <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets,
//                     your information may be transferred.
//                   </li>
//                   <li>
//                     <strong>Legal Requirements:</strong> We may disclose information if required by law or in response
//                     to valid legal requests.
//                   </li>
//                   <li>
//                     <strong>With Your Consent:</strong> We may share information with your explicit consent.
//                   </li>
//                 </ul>
//               </section>

//               <section id="data-retention" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   We retain your personal information for as long as your account is active or as needed to provide you
//                   services. We will retain and use your information as necessary to comply with our legal obligations,
//                   resolve disputes, and enforce our agreements. Campaign and email data is retained for 24 months after
//                   your last activity, after which it is automatically deleted or anonymized.
//                 </p>
//               </section>

//               <section id="your-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Depending on your location, you may have the following rights regarding your personal data:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>
//                     <strong>Access:</strong> Request a copy of your personal data
//                   </li>
//                   <li>
//                     <strong>Rectification:</strong> Request correction of inaccurate data
//                   </li>
//                   <li>
//                     <strong>Erasure:</strong> Request deletion of your personal data
//                   </li>
//                   <li>
//                     <strong>Portability:</strong> Request a machine-readable copy of your data
//                   </li>
//                   <li>
//                     <strong>Objection:</strong> Object to processing of your personal data
//                   </li>
//                   <li>
//                     <strong>Restriction:</strong> Request restriction of processing
//                   </li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed mt-4">
//                   To exercise these rights, please contact us at privacy@mailfra.com.
//                 </p>
//               </section>

//               <section id="security" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Security</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   We implement industry-standard security measures to protect your data, including encryption in transit
//                   (TLS 1.3) and at rest (AES-256), regular security audits, and access controls. However, no method of
//                   transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
//                 </p>
//               </section>

//               <section id="cookies" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Cookies</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We use cookies and similar tracking technologies to track activity on our service and hold certain
//                   information. Cookies are files with a small amount of data which may include an anonymous unique
//                   identifier.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
//                   However, if you do not accept cookies, you may not be able to use some portions of our service.
//                 </p>
//               </section>

//               <section id="changes" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
//                   new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to
//                   review this Privacy Policy periodically for any changes.
//                 </p>
//               </section>

//               <section id="contact" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If you have any questions about this Privacy Policy, please contact us:
//                 </p>
//                 <ul className="list-none text-white/70 space-y-2">
//                   <li>Email: privacy@mailfra.com</li>
//                   <li>Address: 548 Market Street, Suite 42, San Francisco, CA 94104</li>
//                 </ul>
//               </section>
//             </div>
//           </div>
//         </div>
//       </section>

//       <PageFooter />
//     </main>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Shield, Calendar } from "lucide-react"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "gmail-api-usage", title: "Gmail API Data Usage" },
  { id: "how-we-use", title: "How We Use Your Information" },
  { id: "data-sharing", title: "Data Sharing" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights" },
  { id: "security", title: "Security" },
  { id: "cookies", title: "Cookies" },
  { id: "international-transfers", title: "International Data Transfers" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "california-rights", title: "California Privacy Rights" },
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
            <span>Last updated: December 24, 2024</span>
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
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              {/* Introduction */}
              <section id="introduction" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                <p className="text-white/70 leading-relaxed">
                  At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
                  privacy and ensuring the security of your personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when you use our cold email platform and
                  related services (collectively, the &quot;Services&quot;).
                </p>
                <p className="text-white/70 leading-relaxed">
                  By using Mailfra, you agree to the collection and use of information in accordance with this policy.
                  If you do not agree with our policies and practices, please do not use our Services. We operate in
                  compliance with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA),
                  and other applicable privacy regulations worldwide.
                </p>
              </section>

              {/* Information We Collect */}
              <section id="information-we-collect" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We collect several types of information to provide and improve our Services:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information You Provide</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Full name, email address, and phone number</li>
                  <li>Company name, job title, and business information</li>
                  <li>Billing address and payment information</li>
                  <li>Account credentials and profile information</li>
                  <li>Communication preferences and support inquiries</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data Collected Automatically</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>IP address, browser type, operating system, and device information</li>
                  <li>Access times, session duration, and pages viewed</li>
                  <li>Features used and actions taken within the platform</li>
                  <li>Email campaign metrics including sends, opens, clicks, and replies</li>
                  <li>Error logs, diagnostic data, and performance information</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Email Campaign Data</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Email content, subject lines, and templates you create</li>
                  <li>Recipient email addresses and contact information</li>
                  <li>Email engagement metrics (opens, clicks, bounces, replies)</li>
                  <li>Campaign schedules, automation rules, and sequences</li>
                  <li>Custom segments, tags, and organizational metadata</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Authentication Data</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>OAuth tokens and access credentials from connected services</li>
                  <li>Account identifiers and profile information from third parties</li>
                  <li>Permission scopes granted to our application</li>
                </ul>
              </section>

              {/* Gmail API Usage */}
              <section id="gmail-api-usage" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Gmail API Data Usage and Disclosure</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  When you connect your Gmail account to Mailfra, we access specific data through the Google Gmail API
                  to provide email outreach automation. We handle your Gmail data with the highest level of security and
                  transparency.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold mb-3">Gmail Data Access</h4>
                  <p className="text-white/70 leading-relaxed">
                    By connecting your Gmail account, you authorize Mailfra to access your Gmail data as described. Your
                    use is also subject to{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline"
                    >
                      Google&apos;s Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://policies.google.com/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline"
                    >
                      Terms of Service
                    </a>
                    .
                  </p>
                </div>

                <h3 className="text-xl font-semibold mb-3 mt-6">How We Use Gmail Data</h3>
                <ul className="list-disc list-inside text-white/70 space-y-3 mb-6">
                  <li>Sending personalized outreach emails on your behalf</li>
                  <li>Detecting and tracking replies from prospects</li>
                  <li>Organizing emails with labels and metadata</li>
                  <li>Providing engagement analytics and performance metrics</li>
                  <li>Managing email drafts and campaign scheduling</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data Security</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>No full email content is stored on our servers</li>
                  <li>Access tokens are encrypted with AES-256 encryption</li>
                  <li>All communication uses TLS/SSL encryption</li>
                  <li>We never store your Gmail password</li>
                  <li>Gmail data is never sold or used for advertising</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section id="how-we-use" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We use the information we collect for the following purposes:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Service Delivery and Operations</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Provide, operate, and maintain our platform</li>
                  <li>Process transactions and billing</li>
                  <li>Send technical notices and support communications</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Manage your account and user preferences</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Product Development and Improvement</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Conduct research and development to improve our platform</li>
                  <li>Develop new features, products, and services</li>
                  <li>Optimize user experience and interface design</li>
                  <li>Generate aggregate statistics and analytics reports</li>
                  <li>Identify and fix technical issues and bugs</li>
                  <li>Analyze usage patterns to enhance functionality</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Personalization and Communication</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Customize your experience based on preferences</li>
                  <li>Provide personalized recommendations and suggestions</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Send product updates and feature announcements</li>
                  <li>Tailor content to your specific needs</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Security and Compliance</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Detect, prevent, and address fraud and abuse</li>
                  <li>Monitor for suspicious activity and policy violations</li>
                  <li>Protect against security threats and vulnerabilities</li>
                  <li>Comply with applicable laws and regulations</li>
                  <li>Enforce our Terms of Service and legal agreements</li>
                  <li>Respond to legal requests and law enforcement inquiries</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Business planning and forecasting</li>
                  <li>Manage relationships with service providers and partners</li>
                  <li>Facilitate mergers, acquisitions, or business transfers</li>
                  <li>Maintain business records and documentation</li>
                  <li>Perform accounting, auditing, and financial reporting</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Data Sharing and Disclosure</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We do not sell your personal information to third parties. We may share your information only in these
                  specific circumstances:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  We share data with third-party vendors who perform services on our behalf:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Payment processors for billing and fraud detection</li>
                  <li>Cloud infrastructure providers for data hosting</li>
                  <li>Analytics services for usage insights</li>
                  <li>Email delivery services for transactional messages</li>
                  <li>Customer support platforms for assistance</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  We may disclose information when required by law or in response to valid legal processes:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Compliance with applicable laws and regulations</li>
                  <li>Response to valid legal requests and subpoenas</li>
                  <li>Enforcement of our Terms of Service</li>
                  <li>Protection of rights, property, and safety</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Business Transfers</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  In connection with mergers, acquisitions, or sale of assets, your information may be transferred to
                  the successor entity.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Aggregated and De-identified Data</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  We may share aggregated or anonymized data that cannot identify you for research, analytics, and
                  product improvement.
                </p>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We retain your information for as long as necessary to provide services and comply with legal
                  obligations:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Retention Periods</h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Profile information: Retained during active account lifetime</li>
                  <li>Campaign data: Retained for 24 months after last activity</li>
                  <li>Email metadata: Retained for 24 months for analytics</li>
                  <li>Billing records: Retained for 7 years for tax compliance</li>
                  <li>Usage logs: Retained for 18 months for security</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">Account Deletion</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  When you delete your account, personal information is permanently deleted within 30 days. Some data
                  may be retained longer if required by law, for fraud prevention, or to resolve disputes. Backup
                  systems may retain data for up to 90 days.
                </p>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Your Privacy Rights</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Depending on your location, you have certain rights regarding your personal data:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request a copy of your personal data and information about how we process it.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Rectification</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request correction of inaccurate or incomplete data through your account settings or by
                  contacting us.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Erasure</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request deletion of your data when it is no longer necessary, you withdraw consent, or
                  processing is unlawful.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can receive your data in a structured, machine-readable format and request transfer to another
                  service.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can object to processing for marketing purposes or based on legitimate interests.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restriction</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request limitation of processing while we verify your request or resolve disputes.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">How to Exercise Your Rights</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  To exercise any of these rights, contact us at privacy@mailfra.com with your request. We will respond
                  within 30 days or notify you if we need more time.
                </p>
              </section>

              {/* Security */}
              <section id="security" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Security</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>TLS/SSL encryption for all data in transit</li>
                  <li>AES-256 encryption for sensitive data at rest</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and role-based permissions</li>
                  <li>Secure authentication and session management</li>
                  <li>Automated threat detection and monitoring</li>
                  <li>Incident response and data breach protocols</li>
                </ul>
                <p className="text-white/70 leading-relaxed">
                  While we maintain comprehensive security measures, no method is 100% secure. We cannot guarantee
                  absolute security of your data.
                </p>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We use cookies and similar technologies to track activity and remember your preferences:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                  <li>Essential cookies for platform functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for campaigns and retargeting</li>
                </ul>
                <p className="text-white/70 leading-relaxed">
                  You can control cookies through your browser settings. Disabling cookies may limit your ability to use
                  certain features of our platform.
                </p>
              </section>

              {/* International Transfers */}
              <section id="international-transfers" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">International Data Transfers</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Your information may be transferred to, stored in, and processed in countries other than your country
                  of residence. These countries may have different data protection laws than your home country. By using
                  our Services, you consent to the transfer of your information to countries outside your country of
                  residence.
                </p>
                <p className="text-white/70 leading-relaxed">
                  We implement safeguards to ensure adequate data protection, including Standard Contractual Clauses and
                  Privacy Shield frameworks where applicable.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="children-privacy" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Our Services are not intended for children under the age of 13 (or the applicable age in your
                  jurisdiction). We do not knowingly collect personal information from children. If we become aware that
                  a child has provided us with personal information, we will delete such information and terminate the
                  child's account.
                </p>
                <p className="text-white/70 leading-relaxed">
                  Parents or guardians who believe their child has provided information to us should contact us
                  immediately at privacy@mailfra.com.
                </p>
              </section>

              {/* California Rights */}
              <section id="california-rights" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">California Consumer Privacy Act (CCPA) Rights</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  If you are a California resident, you have additional rights under the CCPA:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Know</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request to know what personal information we collect, use, share, and sell.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Delete</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  You can request deletion of personal information we have collected, subject to certain exceptions.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Opt-Out</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  We do not sell personal information. You have the right to opt-out of any potential future sales.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">Right to Non-Discrimination</h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  We will not discriminate against you for exercising your CCPA rights.
                </p>

                <p className="text-white/70 leading-relaxed">
                  To submit a CCPA request, contact us at privacy@mailfra.com. We will verify your identity and respond
                  within 45 days.
                </p>
              </section>

              {/* Changes to Policy */}
              <section id="changes" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We may update this Privacy Policy periodically. We will notify you of material changes by posting the
                  new policy on this page and updating the "Last updated" date. Continued use of our Services after such
                  modifications constitutes your acceptance of the updated Privacy Policy.
                </p>
                <p className="text-white/70 leading-relaxed">
                  We encourage you to review this Privacy Policy regularly to stay informed about how we protect your
                  information.
                </p>
              </section>

              {/* Contact */}
              <section id="contact" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-white/50 text-sm uppercase tracking-wider">Email</p>
                    <p className="text-white">privacy@mailfra.com</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm uppercase tracking-wider">Mailing Address</p>
                    <p className="text-white">
                      Mailfra Privacy Team
                      <br />
                      548 Market Street, Suite 42
                      <br />
                      San Francisco, CA 94104
                      <br />
                      United States
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm uppercase tracking-wider">Data Protection Officer</p>
                    <p className="text-white">dpo@mailfra.com</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm uppercase tracking-wider">Response Time</p>
                    <p className="text-white">
                      We typically respond to privacy inquiries within 30 days. For CCPA requests, we respond within 45
                      days as required by law.
                    </p>
                  </div>
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
