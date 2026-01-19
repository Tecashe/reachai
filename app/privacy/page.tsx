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











// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Shield, Calendar } from "lucide-react"
// import PageHeader from "@/components/shared/page-header"
// import PageFooter from "@/components/shared/page-footer"

// const sections = [
//   { id: "introduction", title: "Introduction" },
//   { id: "information-we-collect", title: "Information We Collect" },
//   { id: "gmail-api-usage", title: "Gmail API Data Usage" },
//   { id: "how-we-use", title: "How We Use Your Information" },
//   { id: "data-sharing", title: "Data Sharing" },
//   { id: "data-retention", title: "Data Retention" },
//   { id: "your-rights", title: "Your Rights" },
//   { id: "security", title: "Security" },
//   { id: "cookies", title: "Cookies" },
//   { id: "international-transfers", title: "International Data Transfers" },
//   { id: "children-privacy", title: "Children's Privacy" },
//   { id: "california-rights", title: "California Privacy Rights" },
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
//             <span>Last updated: December 24, 2024</span>
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
//             <div className="prose prose-invert prose-lg max-w-none space-y-8">
//               {/* Introduction */}
//               <section id="introduction" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Introduction</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
//                   privacy and ensuring the security of your personal information. This Privacy Policy explains how we
//                   collect, use, disclose, and safeguard your information when you use our cold email platform and
//                   related services (collectively, the &quot;Services&quot;).
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   By using Mailfra, you agree to the collection and use of information in accordance with this policy.
//                   If you do not agree with our policies and practices, please do not use our Services. We operate in
//                   compliance with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA),
//                   and other applicable privacy regulations worldwide.
//                 </p>
//               </section>

//               {/* Information We Collect */}
//               <section id="information-we-collect" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We collect several types of information to provide and improve our Services:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information You Provide</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Full name, email address, and phone number</li>
//                   <li>Company name, job title, and business information</li>
//                   <li>Billing address and payment information</li>
//                   <li>Account credentials and profile information</li>
//                   <li>Communication preferences and support inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data Collected Automatically</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>IP address, browser type, operating system, and device information</li>
//                   <li>Access times, session duration, and pages viewed</li>
//                   <li>Features used and actions taken within the platform</li>
//                   <li>Email campaign metrics including sends, opens, clicks, and replies</li>
//                   <li>Error logs, diagnostic data, and performance information</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Email Campaign Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Email content, subject lines, and templates you create</li>
//                   <li>Recipient email addresses and contact information</li>
//                   <li>Email engagement metrics (opens, clicks, bounces, replies)</li>
//                   <li>Campaign schedules, automation rules, and sequences</li>
//                   <li>Custom segments, tags, and organizational metadata</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Authentication Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>OAuth tokens and access credentials from connected services</li>
//                   <li>Account identifiers and profile information from third parties</li>
//                   <li>Permission scopes granted to our application</li>
//                 </ul>
//               </section>

//               {/* Gmail API Usage */}
//               <section id="gmail-api-usage" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Gmail API Data Usage and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   When you connect your Gmail account to Mailfra, we access specific data through the Google Gmail API
//                   to provide email outreach automation. We handle your Gmail data with the highest level of security and
//                   transparency.
//                 </p>

//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//                   <h4 className="text-lg font-semibold mb-3">Gmail Data Access</h4>
//                   <p className="text-white/70 leading-relaxed">
//                     By connecting your Gmail account, you authorize Mailfra to access your Gmail data as described. Your
//                     use is also subject to{" "}
//                     <a
//                       href="https://policies.google.com/privacy"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline"
//                     >
//                       Google&apos;s Privacy Policy
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="https://policies.google.com/terms"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline"
//                     >
//                       Terms of Service
//                     </a>
//                     .
//                   </p>
//                 </div>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How We Use Gmail Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-6">
//                   <li>Sending personalized outreach emails on your behalf</li>
//                   <li>Detecting and tracking replies from prospects</li>
//                   <li>Organizing emails with labels and metadata</li>
//                   <li>Providing engagement analytics and performance metrics</li>
//                   <li>Managing email drafts and campaign scheduling</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data Security</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>No full email content is stored on our servers</li>
//                   <li>Access tokens are encrypted with AES-256 encryption</li>
//                   <li>All communication uses TLS/SSL encryption</li>
//                   <li>We never store your Gmail password</li>
//                   <li>Gmail data is never sold or used for advertising</li>
//                 </ul>
//               </section>

//               {/* How We Use Information */}
//               <section id="how-we-use" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We use the information we collect for the following purposes:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Delivery and Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Provide, operate, and maintain our platform</li>
//                   <li>Process transactions and billing</li>
//                   <li>Send technical notices and support communications</li>
//                   <li>Respond to your inquiries and support requests</li>
//                   <li>Manage your account and user preferences</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Product Development and Improvement</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Conduct research and development to improve our platform</li>
//                   <li>Develop new features, products, and services</li>
//                   <li>Optimize user experience and interface design</li>
//                   <li>Generate aggregate statistics and analytics reports</li>
//                   <li>Identify and fix technical issues and bugs</li>
//                   <li>Analyze usage patterns to enhance functionality</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personalization and Communication</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Customize your experience based on preferences</li>
//                   <li>Provide personalized recommendations and suggestions</li>
//                   <li>Send marketing communications (with your consent)</li>
//                   <li>Send product updates and feature announcements</li>
//                   <li>Tailor content to your specific needs</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security and Compliance</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Detect, prevent, and address fraud and abuse</li>
//                   <li>Monitor for suspicious activity and policy violations</li>
//                   <li>Protect against security threats and vulnerabilities</li>
//                   <li>Comply with applicable laws and regulations</li>
//                   <li>Enforce our Terms of Service and legal agreements</li>
//                   <li>Respond to legal requests and law enforcement inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Business planning and forecasting</li>
//                   <li>Manage relationships with service providers and partners</li>
//                   <li>Facilitate mergers, acquisitions, or business transfers</li>
//                   <li>Maintain business records and documentation</li>
//                   <li>Perform accounting, auditing, and financial reporting</li>
//                 </ul>
//               </section>

//               {/* Data Sharing */}
//               <section id="data-sharing" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Data Sharing and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We do not sell your personal information to third parties. We may share your information only in these
//                   specific circumstances:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We share data with third-party vendors who perform services on our behalf:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Payment processors for billing and fraud detection</li>
//                   <li>Cloud infrastructure providers for data hosting</li>
//                   <li>Analytics services for usage insights</li>
//                   <li>Email delivery services for transactional messages</li>
//                   <li>Customer support platforms for assistance</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We may disclose information when required by law or in response to valid legal processes:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Compliance with applicable laws and regulations</li>
//                   <li>Response to valid legal requests and subpoenas</li>
//                   <li>Enforcement of our Terms of Service</li>
//                   <li>Protection of rights, property, and safety</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Transfers</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   In connection with mergers, acquisitions, or sale of assets, your information may be transferred to
//                   the successor entity.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Aggregated and De-identified Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We may share aggregated or anonymized data that cannot identify you for research, analytics, and
//                   product improvement.
//                 </p>
//               </section>

//               {/* Data Retention */}
//               <section id="data-retention" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We retain your information for as long as necessary to provide services and comply with legal
//                   obligations:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Retention Periods</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Profile information: Retained during active account lifetime</li>
//                   <li>Campaign data: Retained for 24 months after last activity</li>
//                   <li>Email metadata: Retained for 24 months for analytics</li>
//                   <li>Billing records: Retained for 7 years for tax compliance</li>
//                   <li>Usage logs: Retained for 18 months for security</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Account Deletion</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   When you delete your account, personal information is permanently deleted within 30 days. Some data
//                   may be retained longer if required by law, for fraud prevention, or to resolve disputes. Backup
//                   systems may retain data for up to 90 days.
//                 </p>
//               </section>

//               {/* Your Rights */}
//               <section id="your-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Your Privacy Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Depending on your location, you have certain rights regarding your personal data:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request a copy of your personal data and information about how we process it.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Rectification</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request correction of inaccurate or incomplete data through your account settings or by
//                   contacting us.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Erasure</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request deletion of your data when it is no longer necessary, you withdraw consent, or
//                   processing is unlawful.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can receive your data in a structured, machine-readable format and request transfer to another
//                   service.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can object to processing for marketing purposes or based on legitimate interests.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restriction</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request limitation of processing while we verify your request or resolve disputes.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How to Exercise Your Rights</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   To exercise any of these rights, contact us at privacy@mailfra.com with your request. We will respond
//                   within 30 days or notify you if we need more time.
//                 </p>
//               </section>

//               {/* Security */}
//               <section id="security" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Security</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We implement industry-standard security measures to protect your information:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>TLS/SSL encryption for all data in transit</li>
//                   <li>AES-256 encryption for sensitive data at rest</li>
//                   <li>Regular security audits and penetration testing</li>
//                   <li>Access controls and role-based permissions</li>
//                   <li>Secure authentication and session management</li>
//                   <li>Automated threat detection and monitoring</li>
//                   <li>Incident response and data breach protocols</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   While we maintain comprehensive security measures, no method is 100% secure. We cannot guarantee
//                   absolute security of your data.
//                 </p>
//               </section>

//               {/* Cookies */}
//               <section id="cookies" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Cookies and Tracking Technologies</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We use cookies and similar technologies to track activity and remember your preferences:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Essential cookies for platform functionality</li>
//                   <li>Analytics cookies to understand usage patterns</li>
//                   <li>Preference cookies to remember your settings</li>
//                   <li>Marketing cookies for campaigns and retargeting</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   You can control cookies through your browser settings. Disabling cookies may limit your ability to use
//                   certain features of our platform.
//                 </p>
//               </section>

//               {/* International Transfers */}
//               <section id="international-transfers" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">International Data Transfers</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Your information may be transferred to, stored in, and processed in countries other than your country
//                   of residence. These countries may have different data protection laws than your home country. By using
//                   our Services, you consent to the transfer of your information to countries outside your country of
//                   residence.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We implement safeguards to ensure adequate data protection, including Standard Contractual Clauses and
//                   Privacy Shield frameworks where applicable.
//                 </p>
//               </section>

//               {/* Children's Privacy */}
//               <section id="children-privacy" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Our Services are not intended for children under the age of 13 (or the applicable age in your
//                   jurisdiction). We do not knowingly collect personal information from children. If we become aware that
//                   a child has provided us with personal information, we will delete such information and terminate the
//                   child's account.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   Parents or guardians who believe their child has provided information to us should contact us
//                   immediately at privacy@mailfra.com.
//                 </p>
//               </section>

//               {/* California Rights */}
//               <section id="california-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">California Consumer Privacy Act (CCPA) Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   If you are a California resident, you have additional rights under the CCPA:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Know</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request to know what personal information we collect, use, share, and sell.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Delete</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request deletion of personal information we have collected, subject to certain exceptions.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Opt-Out</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We do not sell personal information. You have the right to opt-out of any potential future sales.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Non-Discrimination</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We will not discriminate against you for exercising your CCPA rights.
//                 </p>

//                 <p className="text-white/70 leading-relaxed">
//                   To submit a CCPA request, contact us at privacy@mailfra.com. We will verify your identity and respond
//                   within 45 days.
//                 </p>
//               </section>

//               {/* Changes to Policy */}
//               <section id="changes" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We may update this Privacy Policy periodically. We will notify you of material changes by posting the
//                   new policy on this page and updating the "Last updated" date. Continued use of our Services after such
//                   modifications constitutes your acceptance of the updated Privacy Policy.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We encourage you to review this Privacy Policy regularly to stay informed about how we protect your
//                   information.
//                 </p>
//               </section>

//               {/* Contact */}
//               <section id="contact" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   If you have questions about this Privacy Policy or our privacy practices, please contact us:
//                 </p>
//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Email</p>
//                     <p className="text-white">privacy@mailfra.com</p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Mailing Address</p>
//                     <p className="text-white">
//                       Mailfra Privacy Team
//                       <br />
//                       548 Market Street, Suite 42
//                       <br />
//                       San Francisco, CA 94104
//                       <br />
//                       United States
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Data Protection Officer</p>
//                     <p className="text-white">dpo@mailfra.com</p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Response Time</p>
//                     <p className="text-white">
//                       We typically respond to privacy inquiries within 30 days. For CCPA requests, we respond within 45
//                       days as required by law.
//                     </p>
//                   </div>
//                 </div>
//               </section>
//             </div>
//           </div>
//         </div>
//       </section>

//       <PageFooter />
//     </main>
//   )
// }










// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Shield, Calendar } from "lucide-react"
// import PageHeader from "@/components/shared/page-header"
// import PageFooter from "@/components/shared/page-footer"

// const sections = [
//   { id: "introduction", title: "Introduction" },
//   { id: "information-we-collect", title: "Information We Collect" },
//   { id: "gmail-api-usage", title: "Gmail API Data Usage" },
//   { id: "how-we-use", title: "How We Use Your Information" },
//   { id: "data-sharing", title: "Data Sharing" },
//   { id: "data-retention", title: "Data Retention" },
//   { id: "your-rights", title: "Your Rights" },
//   { id: "security", title: "Security" },
//   { id: "cookies", title: "Cookies" },
//   { id: "international-transfers", title: "International Data Transfers" },
//   { id: "children-privacy", title: "Children's Privacy" },
//   { id: "california-rights", title: "California Privacy Rights" },
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
//             <span>Last updated: December 24, 2024</span>
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
//                   related services (collectively, the &quot;Services&quot;).
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   By using Mailfra, you agree to the collection and use of information in accordance with this policy.
//                   If you do not agree with our policies and practices, please do not use our Services. This policy
//                   applies to all users of our Services, including visitors, registered users, and subscribers.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We operate in compliance with applicable data protection laws, including the General Data Protection
//                   Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant privacy regulations.
//                   This Privacy Policy should be read in conjunction with our Terms of Service.
//                 </p>
//               </section>

//               <section id="information-we-collect" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We collect several types of information to provide and improve our Services. The information we
//                   collect falls into the following categories:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information that identifies you as an individual or relates to an identifiable individual:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Full name and email address</li>
//                   <li>Company name, job title, and business information</li>
//                   <li>Billing information including credit card details and billing address</li>
//                   <li>Phone number and other contact details (optional)</li>
//                   <li>Profile information including profile picture and bio</li>
//                   <li>Account credentials including username and encrypted password</li>
//                   <li>Communication preferences and notification settings</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information automatically collected about how you interact with our Services:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email campaign performance metrics including send rates, delivery rates, and bounce rates</li>
//                   <li>Login and access times, session duration, and frequency of use</li>
//                   <li>Features used, actions taken within the platform, and user preferences</li>
//                   <li>Device information including type, operating system, and unique device identifiers</li>
//                   <li>Browser type, version, language settings, and time zone</li>
//                   <li>IP address, location data, and network information</li>
//                   <li>Referring and exit pages, clickstream data, and navigation paths</li>
//                   <li>Error logs, diagnostic data, and performance metrics</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Email Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information related to your email campaigns and outreach activities:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email content, subject lines, and templates you create</li>
//                   <li>Recipient email addresses, names, and contact information</li>
//                   <li>Email engagement data including opens, clicks, replies, and bounces</li>
//                   <li>Email sending schedules, automation rules, and sequence configurations</li>
//                   <li>Custom fields, tags, and segments you create for organizing contacts</li>
//                   <li>
//                     Email metadata including timestamps, sender information, and delivery status
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Authentication Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   When you connect third-party services to Mailfra:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>OAuth tokens and refresh tokens for connected accounts</li>
//                   <li>Account identifiers from third-party services</li>
//                   <li>Permission scopes granted to our application</li>
//                   <li>Profile information shared by the third-party service</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Payment Information</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Financial information necessary to process your subscription:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Credit card number, expiration date, and CVV (processed securely by our payment processor)</li>
//                   <li>Billing address and payment method details</li>
//                   <li>Transaction history and payment receipts</li>
//                   <li>Tax identification numbers if required by law</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Communications</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">Information from your interactions with us:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>Customer support inquiries and correspondence</li>
//                   <li>Feedback, survey responses, and product reviews</li>
//                   <li>Marketing communications preferences</li>
//                   <li>Participation in contests, promotions, or events</li>
//                 </ul>
//               </section>

//               <section id="gmail-api-usage" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Gmail API Data Usage and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   When you connect your Gmail account to Mailfra, we access specific data through the Google Gmail API
//                   to provide our email outreach automation services. This section explains in detail how we handle your
//                   Gmail data.
//                 </p>

//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//                   <h4 className="text-lg font-semibold mb-3">Important Notice About Gmail Data</h4>
//                   <p className="text-white/70 leading-relaxed mb-3">
//                     By connecting your Gmail account, you authorize Mailfra to access your Gmail data as described in
//                     this section. Your use of Gmail through Mailfra is also subject to{" "}
                    
//                       href="https://policies.google.com/privacy"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Google&apos;s Privacy Policy
//                     </a>{" "}
//                     and{" "}
                    
//                       href="https://policies.google.com/terms"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Terms of Service
//                     </a>
//                     .
//                   </p>
//                 </div>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data We Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We request access to the following Gmail data through specific API scopes:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Email Sending Capabilities (gmail.send scope):</strong> Allows us to
//                     send emails on your behalf as part of your outreach campaigns. This is the core functionality that
//                     enables automated email sequences.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Composition and Drafts (gmail.compose scope):</strong> Enables
//                     us to create, edit, and manage email drafts in your account. This allows you to preview and modify
//                     emails before they are sent.
//                   </li>
//                   <li>
//                     <strong className="text-white">Read Access to Emails (gmail.readonly scope):</strong> Provides
//                     read-only access to your emails, which we use exclusively to monitor replies from prospects and
//                     track email engagement metrics for your campaigns.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Modification Capabilities (gmail.modify scope):</strong> Allows
//                     us to apply labels, organize campaign emails, and manage email metadata. This helps you track
//                     campaign performance and organize your inbox.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How We Use Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We use your Gmail data solely and exclusively to provide our email outreach automation services. 
//                   Specifically:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Sending Campaign Emails:</strong> We send personalized outreach
//                     emails to prospects you have added to your campaigns. Each email is sent from your Gmail account
//                     using your authenticated credentials, maintaining your sender reputation and email deliverability.
//                   </li>
//                   <li>
//                     <strong className="text-white">Reply Detection and Tracking:</strong> We monitor your inbox
//                     specifically for replies to campaign emails. When a prospect responds, we automatically detect the
//                     reply, notify you through our platform, update the campaign status, and pause any scheduled
//                     follow-up emails to that prospect.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Organization:</strong> We apply custom labels to sent campaign
//                     emails to help you organize and track your outreach efforts. This includes labels for campaign
//                     names, prospect status, and email sequence steps.
//                   </li>
//                   <li>
//                     <strong className="text-white">Draft Management:</strong> We create draft emails that you can
//                     review, edit, and approve before they are sent. This gives you full control over the content and
//                     timing of your outreach.
//                   </li>
//                   <li>
//                     <strong className="text-white">Engagement Analytics:</strong> We track email opens, clicks, and
//                     other engagement metrics to provide you with performance insights and help optimize your campaigns.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data Storage and Security</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We take the security and privacy of your Gmail data seriously:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">No Email Content Storage:</strong> We do not store the full content
//                     of emails from your Gmail account on our servers. We only store minimal metadata necessary for
//                     campaign tracking, such as sender, recipient, subject line, and timestamps.
//                   </li>
//                   <li>
//                     <strong className="text-white">Encrypted Token Storage:</strong> Your Gmail access tokens and
//                     refresh tokens are encrypted using AES-256 encryption and stored securely in our database. These
//                     tokens are never exposed to unauthorized parties.
//                   </li>
//                   <li>
//                     <strong className="text-white">Secure Data Transmission:</strong> All communication between Mailfra
//                     and Gmail API uses industry-standard TLS/SSL encryption to protect your data in transit.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Password Storage:</strong> We never store your Gmail password.
//                     Authentication is handled entirely through Google&apos;s secure OAuth 2.0 protocol.
//                   </li>
//                   <li>
//                     <strong className="text-white">Limited Access:</strong> Only authorized Mailfra systems and
//                     personnel with legitimate need have access to Gmail API credentials, and all access is logged and
//                     monitored.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Sharing and Third-Party Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Your Gmail data is treated with the highest level of confidentiality:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">No Selling or Renting:</strong> We will never sell, rent, or trade
//                     your Gmail data to third parties under any circumstances.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Advertising Use:</strong> We do not use your Gmail data for
//                     advertising purposes, either on our platform or for third-party advertising networks.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Third-Party Applications:</strong> We do not allow third-party
//                     applications or services to access your Gmail data through our platform.
//                   </li>
//                   <li>
//                     <strong className="text-white">Service Provider Access:</strong> The only exception is our
//                     infrastructure providers (e.g., cloud hosting, database services) who may have technical access to
//                     encrypted data as part of providing core infrastructure services. These providers are bound by
//                     strict confidentiality agreements and data protection obligations.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Retention for Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We retain Gmail-related data according to the following policies:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Active Account:</strong> Gmail access tokens are retained as long as
//                     your Mailfra account is active and you have not revoked Gmail access.
//                   </li>
//                   <li>
//                     <strong className="text-white">Campaign Metadata:</strong> Email metadata (sender, recipient,
//                     subject, timestamps, engagement metrics) is retained for up to 24 months after campaign completion
//                     for analytics and reporting purposes.
//                   </li>
//                   <li>
//                     <strong className="text-white">Upon Revocation:</strong> When you revoke Gmail access through
//                     Mailfra or Google Account settings, we immediately stop accessing your Gmail and delete all stored
//                     access tokens within 24 hours.
//                   </li>
//                   <li>
//                     <strong className="text-white">Account Deletion:</strong> When you delete your Mailfra account, all
//                     Gmail-related data including access tokens and campaign metadata is permanently deleted within 30
//                     days.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Your Control Over Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You maintain complete control over your Gmail data at all times:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Revoke Access Anytime:</strong> You can disconnect Gmail from
//                     Mailfra at any time through your account settings. Additionally, you can revoke access directly
//                     through your{" "}
                    
//                       href="https://myaccount.google.com/permissions"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Google Account Permissions
//                     </a>{" "}
//                     page.
//                   </li>
//                   <li>
//                     <strong className="text-white">Review Connected Apps:</strong> You can view all apps with access to
//                     your Gmail at any time through your Google Account settings.
//                   </li>
//                   <li>
//                     <strong className="text-white">Data Export:</strong> You can request an export of your campaign
//                     data, including metadata about emails sent through Mailfra, by contacting our support team.
//                   </li>
//                   <li>
//                     <strong className="text-white">Data Deletion:</strong> You can request deletion of all your
//                     Gmail-related data by contacting privacy@mailfra.com. We will process your request within 30 days.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Human Access to Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We strictly limit human access to your Gmail data. Mailfra employees will only access your Gmail data
//                   under the following specific circumstances:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">With Your Explicit Consent:</strong> When you specifically request
//                     support assistance that requires reviewing your email data.
//                   </li>
//                   <li>
//                     <strong className="text-white">Security Purposes:</strong> To investigate potential security
//                     incidents, fraud, or abuse of our Services.
//                   </li>
//                   <li>
//                     <strong className="text-white">Legal Compliance:</strong> When required by applicable law, legal
//                     process, or valid government requests.
//                   </li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   All human access to user data is logged, monitored, and subject to strict internal access controls
//                   and approval processes.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Compliance with Google API Services User Data Policy</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Mailfra&apos;s use and transfer of information received from Google APIs adheres to the{" "}
                  
//                     href="https://developers.google.com/terms/api-services-user-data-policy"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-white underline hover:text-white/80"
//                   >
//                     Google API Services User Data Policy
//                   </a>
//                   , including the Limited Use requirements. Specifically:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>We only request the minimum Gmail API scopes necessary to provide our email automation services</li>
//                   <li>We do not use Gmail API data for serving advertisements to you or others</li>
//                   <li>
//                     We do not allow humans to read Gmail API data unless explicitly permitted for security, compliance,
//                     or with your consent
//                   </li>
//                   <li>
//                     We do not transfer Gmail API data to others unless necessary to provide our Services, for security
//                     purposes, or to comply with applicable law
//                   </li>
//                   <li>All Gmail API data access is logged and auditable</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security Measures for Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We implement comprehensive security measures specifically for Gmail data protection:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">OAuth 2.0 Authentication:</strong> All Gmail API access uses
//                     industry-standard OAuth 2.0 protocol. We never request or store your Gmail password.
//                   </li>
//                   <li>
//                     <strong className="text-white">Encrypted Token Storage:</strong> Access tokens and refresh tokens
//                     are encrypted using AES-256 encryption before storage in our database.
//                   </li>
//                   <li>
//                     <strong className="text-white">TLS/SSL Encryption:</strong> All API communications with Gmail use
//                     TLS 1.3 encryption to protect data in transit.
//                   </li>
//                   <li>
//                     <strong className="text-white">Regular Security Audits:</strong> We conduct regular security audits
//                     and vulnerability assessments of our Gmail API integration.
//                   </li>
//                   <li>
//                     <strong className="text-white">Access Logging:</strong> All Gmail API requests are logged with
//                     timestamps, user IDs, and action types for security monitoring and audit purposes.
//                   </li>
//                   <li>
//                     <strong className="text-white">Employee Training:</strong> All employees with access to systems
//                     handling Gmail data undergo mandatory security and privacy training.
//                   </li>
//                   <li>
//                     <strong className="text-white">Least Privilege Access:</strong> Internal access to Gmail API
//                     credentials and user data is restricted to only those employees who require it for their job
//                     functions.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Breach Notification</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   In the unlikely event of a security breach affecting your Gmail data, we commit to:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Immediate Action:</strong> Contain and remediate the breach as
//                     quickly as possible
//                   </li>
//                   <li>
//                     <strong className="text-white">Timely Notification:</strong> Notify you within 72 hours of
//                     discovering the breach, or sooner if required by applicable law
//                   </li>
//                   <li>
//                     <strong className="text-white">Google Notification:</strong> Notify Google as required by the Gmail
//                     API Terms of Service
//                   </li>
//                   <li>
//                     <strong className="text-white">Detailed Information:</strong> Provide you with specific details
//                     about what data was affected, the nature of the breach, and steps we are taking to address it
//                   </li>
//                   <li>
//                     <strong className="text-white">Assistance:</strong> Offer guidance and assistance in securing your
//                     Gmail account if necessary
//                   </li>
//                   <li>
//                     <strong className="text-white">Regulatory Compliance:</strong> Notify relevant regulatory
//                     authorities as required by data protection laws
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Questions About Gmail Data Usage</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   If you have any questions or concerns about how we handle your Gmail data, please contact us at
//                   privacy@mailfra.com. We are committed to transparency and will respond to your inquiries within 48
//                   hours.
//                 </p>
//               </section>

//               <section id="how-we-use" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We use the information we collect for various purposes related to providing, maintaining, and
//                   improving our Services. Below is a comprehensive explanation of how we use your data:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Provision and Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Provide, operate, and maintain our email outreach automation platform</li>
//                   <li>Process and manage your email campaigns, sequences, and automation workflows</li>
//                   <li>Enable you to create, send, and track email communications</li>
//                   <li>Manage your account, profile, and preferences</li>
//                   <li>Authenticate your identity and maintain account security</li>
//                   <li>Provide customer support and respond to your inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Billing and Transactions</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Process subscription payments and manage billing cycles</li>
//                   <li>Send transaction confirmations, invoices, and payment receipts</li>
//                   <li>Manage subscription upgrades, downgrades, and cancellations</li>
//                   <li>Detect and prevent fraudulent transactions</li>
//                   <li>Calculate and collect applicable taxes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Communication and Notifications</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Send you technical notices, system alerts, and security notifications</li>
//                   <li>Provide updates about new features, improvements, and service changes</li>
//                   <li>Send administrative messages related to your account</li>
//                   <li>Respond to your comments, questions, and customer service requests</li>
//                   <li>Send marketing communications about our Services (with your consent)</li>
//                   <li>Notify you about campaign performance and important events</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Analytics and Improvement</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Monitor and analyze usage patterns, trends, and user behavior</li>
//                   <li>Measure the effectiveness of our Services and features</li>
//                   <li>Conduct research and development to improve our platform</li>
//                   <li>Develop new features, products, and services</li>
//                   <li>Optimize user experience and interface design</li>
//                   <li>Generate aggregate statistics and analytics reports</li>
//                 </ul>  

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personalization</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Customize your experience based on your preferences and usage</li>
//               <li>Provide personalized recommendations and suggestions</li>
//               <li>Remember your settings and preferences across sessions</li>
//               <li>Tailor content and features to your specific needs</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Security and Fraud Prevention</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Detect, prevent, and address technical issues and system errors</li>
//               <li>Identify and prevent fraud, abuse, and unauthorized access</li>
//               <li>Protect against security threats and vulnerabilities</li>
//               <li>Monitor for suspicious activity and policy violations</li>
//               <li>Enforce our Terms of Service and other policies</li>
//               <li>Maintain the security and integrity of our Services</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Legal Compliance</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Comply with applicable laws, regulations, and legal obligations</li>
//               <li>Respond to legal requests and prevent illegal activities</li>
//               <li>Enforce our legal rights and defend against legal claims</li>
//               <li>Maintain records as required by law</li>
//               <li>Cooperate with law enforcement and regulatory authorities</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2">
//               <li>Conduct business planning and forecasting</li>
//               <li>Manage relationships with service providers and partners</li>
//               <li>Facilitate mergers, acquisitions, or business transfers</li>
//               <li>Maintain business records and documentation</li>
//               <li>Perform accounting, auditing, and financial reporting</li>
//             </ul>
//           </section>

//           <section id="data-sharing" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We do not sell your personal information to third parties. We may share your information only in the
//               specific circumstances described below, and we require all recipients to protect your data and comply
//               with applicable privacy laws.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers and Business Partners</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               We share data with carefully selected third-party vendors who perform services on our behalf. These
//               service providers are contractually obligated to protect your information and may only use it for the
//               specific purposes we authorize:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Payment Processors:</strong> To process subscription payments,
//                 manage billing, and detect fraud (e.g., Stripe, PayPal)
//               </li>
//               <li>
//                 <strong className="text-white">Cloud Infrastructure:</strong> To host our platform and store data
//                 securely (e.g., AWS, Google Cloud)
//               </li>
//               <li>
//                 <strong className="text-white">Analytics Services:</strong> To understand usage patterns and improve
//                 our Services (e.g., Google Analytics, Mixpanel)
//               </li>
//               <li>
//                 <strong className="text-white">Email Delivery:</strong> To send transactional emails and
//                 notifications (e.g., SendGrid, Amazon SES)
//               </li>
//               <li>
//                 <strong className="text-white">Customer Support:</strong> To provide technical support and respond
//                 to inquiries (e.g., Intercom, Zendesk)
//               </li>
//               <li>
//                 <strong className="text-white">Security Services:</strong> To protect against fraud, abuse, and
//                 security threats
//               </li>
//               <li>
//                 <strong className="text-white">Database Services:</strong> To store and manage data efficiently
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Business Transfers</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               In connection with a corporate transaction, your information may be transferred:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>During negotiations of a merger, acquisition, or sale of company assets</li>
//               <li>In the event of a bankruptcy or insolvency proceeding</li>
//               <li>As part of a corporate reorganization or restructuring</li>
//               <li>To a successor entity that assumes our obligations under this Privacy Policy</li>
//             </ul>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We will notify you via email and/or prominent notice on our website before your information is
//               transferred and becomes subject to a different privacy policy.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements and Protection</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               We may disclose your information when we believe in good faith that disclosure is necessary to:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Comply with applicable laws, regulations, or legal processes</li>
//               <li>Respond to valid legal requests from government authorities or law enforcement</li>
//               <li>Enforce our Terms of Service and other agreements</li>
//               <li>Protect the rights, property, or safety of Mailfra, our users, or the public</li>
//               <li>Detect, prevent, or address fraud, security, or technical issues</li>
//               <li>Investigate potential violations of our policies</li>
//               <li>Defend against legal claims or litigation</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">With Your Consent</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We may share your information with third parties when you explicitly consent or direct us to do so.
//               For example:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>When you authorize integrations with third-party applications or services</li>
//               <li>When you participate in promotional activities with partners</li>
//               <li>When you request us to share information with specific third parties</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Aggregated and De-identified Data</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to
//               identify you. This data may be used for:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Industry research and analysis</li>
//               <li>Marketing and promotional purposes</li>
//               <li>Improving our Services and developing new features</li>
//               <li>Creating benchmarks and industry reports</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">API and Integration Partners</h3>
//             <p className="text-white/70 leading-relaxed">
//               When you connect third-party services (such as Gmail, CRM systems, or other tools) to Mailfra, you
//               authorize us to share relevant data with those services to enable the integration functionality. These
//               integrations are subject to both our Privacy Policy and the third party&apos;s privacy policy.
//             </p>
//           </section>

//           <section id="data-retention" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We retain your personal information for as long as necessary to fulfill the purposes outlined in this
//               Privacy Policy, unless a longer retention period is required or permitted by law. Our retention
//               periods are based on business needs and legal requirements.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Active Account Data</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               While your account remains active, we retain:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Profile Information:</strong> Retained for the lifetime of your
//                 account
//               </li>
//               <li>
//                 <strong className="text-white">Campaign Data:</strong> Retained for 24 months after last activity or
//                 campaign completion
//               </li>
//               <li>
//                 <strong className="text-white">Email Metadata:</strong> Retained for 24 months to support analytics
//                 and reporting
//               </li>
//               <li>
//                 <strong className="text-white">Usage Analytics:</strong> Retained for 18 months for platform
//                 improvement purposes
//               </li>
//               <li>
//                 <strong className="text-white">Authentication Tokens:</strong> Retained until revoked or account
//                 deletion
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Billing and Transaction Data</h3>
//             <p className="text-white/70 leading-relaxed mb-3">Financial and transaction records are retained to:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Comply with tax laws and financial regulations (typically 7 years)</li>
//               <li>Handle chargebacks, refunds, and billing disputes</li>
//               <li>Maintain accurate financial records for accounting purposes</li>
//               <li>Support audits and regulatory compliance</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Inactive Accounts</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               If your account becomes inactive (no login for 24 consecutive months):
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>We will send email notifications warning of potential account deletion</li>
//               <li>After 90 days of continued inactivity following the final notice, we may delete your account</li>
//               <li>Essential information may be retained for legal and security purposes</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Account Deletion</h3>
//             <p className="text-white/70 leading-relaxed mb-3">When you delete your account:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Immediate:</strong> Your account access is disabled and active
//                 campaigns are stopped
//               </li>
//               <li>
//                 <strong className="text-white">Within 30 days:</strong> Personal information, campaign data, and
//                 email metadata are permanently deleted
//               </li>
//               <li>
//                 <strong className="text-white">Exceptions:</strong> Some data may be retained longer if required by
//                 law, for fraud prevention, to resolve disputes, or to enforce our Terms of Service
//               </li>
//               <li>
//                 <strong className="text-white">Backups:</strong> Data in backup systems may persist for up to 90
//                 days before complete deletion
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Legal and Regulatory Requirements</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               We may retain certain information longer than standard retention periods when:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Required by applicable law or regulation</li>
//               <li>Necessary to comply with legal obligations</li>
//               <li>Needed to resolve disputes or enforce agreements</li>
//               <li>Required for legitimate business purposes (fraud prevention, security)</li>
//               <li>Subject to legal hold or ongoing litigation</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Anonymized Data</h3>
//             <p className="text-white/70 leading-relaxed">
//               We may convert personal data into anonymized, aggregated data that cannot be used to identify you.
//               This anonymized data may be retained indefinitely for analytics, research, and product improvement
//               purposes.
//             </p>
//           </section>

//           <section id="your-rights" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Depending on your location and applicable laws, you may have certain rights regarding your personal
//               data. We are committed to facilitating the exercise of these rights in accordance with applicable
//               privacy regulations.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to request access to the personal data we hold about you, including:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Confirmation of whether we process your personal data</li>
//               <li>Categories of personal data we collect and process</li>
//               <li>Purposes for which we use your personal data</li>
//               <li>Third parties with whom we share your data</li>
//               <li>How long we retain your data</li>
//               <li>A copy of your personal data in a structured format</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Rectification</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to request correction of inaccurate or incomplete personal data:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Update your account information directly through your account settings</li>
//               <li>Request correction of data you cannot update yourself</li>
//               <li>Add supplementary information to complete incomplete data</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Erasure (Right to be Forgotten)</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to request deletion of your personal data when:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>The data is no longer necessary for the purposes for which it was collected</li>
//               <li>You withdraw consent and there is no other legal basis for processing</li>
//               <li>You object to processing and there are no overriding legitimate grounds</li>
//               <li>The data has been unlawfully processed</li>
//               <li>Deletion is required to comply with a legal obligation</li>
//             </ul>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Please note that we may retain certain information when we have a legal obligation or legitimate
//               interest to do so.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to receive your personal data in a structured, commonly used, and machine-readable
//               format:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Export your campaign data, templates, and contact lists</li>
//               <li>Receive data in CSV, JSON, or other standard formats</li>
//               <li>Request that we transmit your data directly to another service provider where technically feasible</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
//             <p className="text-white/70 leading-relaxed mb-3">You have the right to object to:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Processing of your personal data for direct marketing purposes (including profiling)</li>
//               <li>Processing based on legitimate interests or performance of a task in the public interest</li>
//               <li>Automated decision-making and profiling that produces legal or similarly significant effects</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restriction of Processing</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to request that we limit the processing of your personal data when:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>You contest the accuracy of the data (during verification)</li>
//               <li>Processing is unlawful but you prefer restriction over deletion</li>
//               <li>We no longer need the data but you need it for legal claims</li>
//               <li>You have objected to processing pending verification of our legitimate grounds</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Withdraw Consent</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Where we process your data based on consent, you have the right to withdraw that consent at any time.
//               Withdrawal of consent does not affect the lawfulness of processing before withdrawal. You can withdraw
//               consent through your account settings or by contacting us.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Lodge a Complaint</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               If you believe we have not adequately addressed your privacy concerns, you have the right to lodge a
//               complaint with a supervisory authority in your jurisdiction. We would appreciate the opportunity to
//               address your concerns first, so please contact us at privacy@mailfra.com.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">How to Exercise Your Rights</h3>
//             <p className="text-white/70 leading-relaxed mb-3">To exercise any of these rights:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Email us at privacy@mailfra.com with your request</li>
//               <li>Use the data management tools in your account settings</li>
//               <li>Contact our Data Protection Officer (if applicable)</li>
//             </ul>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We will respond to your request within 30 days (or as required by applicable law). We may need to
//               verify your identity before processing certain requests. There is no fee for exercising your rights,
//               unless your request is clearly unfounded, repetitive, or excessive.
//             </p>
//           </section>

//           <section id="security" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Security Measures</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We implement comprehensive technical, administrative, and physical security measures to protect your
//               personal data against unauthorized access, alteration, disclosure, or destruction. While no system is
//               completely secure, we continuously work to maintain and improve our security practices.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Technical Security Measures</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Encryption in Transit:</strong> All data transmitted between your
//                 browser and our servers is encrypted using TLS 1.3 (Transport Layer Security) protocol
//               </li>
//               <li>
//                 <strong className="text-white">Encryption at Rest:</strong> Sensitive data stored in our databases
//                 is encrypted using AES-256 encryption
//               </li>
//               <li>
//                 <strong className="text-white">Password Protection:</strong> User passwords are hashed using
//                 industry-standard bcrypt algorithm with appropriate salt rounds
//               </li>
//               <li>
//                 <strong className="text-white">OAuth Token Security:</strong> Third-party authentication tokens are
//                 encrypted and stored securely with restricted access
//               </li>
//               <li>
//                 <strong className="text-white">Secure APIs:</strong> All API endpoints are protected with
//                 authentication and authorization mechanisms
//               </li>
//               <li>
//                 <strong className="text-white">Database Security:</strong> Databases are hosted in secure
//                 environments with network isolation and access controls
//               </li>
//               <li>
//                 <strong className="text-white">Regular Security Updates:</strong> We promptly apply security patches
//                 and updates to all systems and dependencies
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Administrative Security Measures</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Access Controls:</strong> Strict least-privilege access policies
//                 ensure employees only access data necessary for their roles
//               </li>
//               <li>
//                 <strong className="text-white">Employee Training:</strong> All employees undergo mandatory security
//                 awareness and privacy training
//               </li>
//               <li>
//                 <strong className="text-white">Background Checks:</strong> Employees with access to sensitive data
//                 undergo appropriate background screening
//               </li>
//               <li>
//                 <strong className="text-white">Confidentiality Agreements:</strong> All employees and contractors
//                 sign confidentiality and data protection agreements
//               </li>
//               <li>
//                 <strong className="text-white">Access Logging:</strong> All access to production systems and user
//                 data is logged and regularly audited
//               </li>
//               <li>
//                 <strong className="text-white">Incident Response:</strong> We maintain a documented incident
//                 response plan for security breaches
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Physical Security Measures</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Secure Data Centers:</strong> Our infrastructure is hosted in
//                 tier-3+ certified data centers with 24/7 monitoring
//               </li>
//               <li>
//                 <strong className="text-white">Environmental Controls:</strong> Data centers maintain appropriate
//                 temperature, humidity, and fire suppression systems
//               </li>
//               <li>
//                 <strong className="text-white">Access Control:</strong> Physical access to servers is restricted to
//                 authorized data center personnel
//               </li>
//               <li>
//                 <strong className="text-white">Redundancy:</strong> Critical systems have redundant power supplies,
//                 network connections, and backup systems
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Monitoring and Testing</h3>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>
//                 <strong className="text-white">Security Audits:</strong> Regular third-party security audits and
//                 penetration testing
//               </li>
//               <li>
//                 <strong className="text-white">Vulnerability Scanning:</strong> Automated vulnerability scans of our
//                 infrastructure and applications
//               </li>
//               <li>
//                 <strong className="text-white">Security Monitoring:</strong> 24/7 monitoring for suspicious
//                 activities and security incidents
//               </li>
//               <li>
//                 <strong className="text-white">Intrusion Detection:</strong> Automated systems detect and alert on
//                 potential security threats
//               </li>
//               <li>
//                 <strong className="text-white">Code Reviews:</strong> All code changes undergo security-focused peer
//                 review before deployment
//               </li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Account Security Features</h3>
//             <p className="text-white/70 leading-relaxed mb-3">We provide you with tools to protect your account:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Strong password requirements with minimum complexity standards</li>
//               <li>Two-factor authentication (2FA) option for enhanced account security</li>
//               <li>Session management with automatic timeout after periods of inactivity</li>
//               <li>Login notifications for new devices or suspicious activity</li>
//               <li>Ability to review active sessions and revoke access from specific devices</li>
//               <li>Security alerts for important account changes</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Security</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We carefully vet all third-party service providers and require them to implement appropriate security
//               measures. Our agreements with service providers include:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Contractual obligations to protect your data</li>
//               <li>Compliance with applicable data protection laws</li>
//               <li>Regular security assessments and certifications</li>
//               <li>Breach notification requirements</li>
//               <li>Data processing agreements compliant with GDPR and other regulations</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Security Best Practices for Users</h3>
//             <p className="text-white/70 leading-relaxed mb-3">We recommend you take these steps to protect your account:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Use a strong, unique password for your Mailfra account</li>
//               <li>Enable two-factor authentication (2FA)</li>
//               <li>Never share your password with others</li>
//               <li>Log out when using shared or public computers</li>
//               <li>Keep your contact information up to date for security notifications</li>
//               <li>Regularly review your account activity and connected integrations</li>
//               <li>Report any suspicious activity or security concerns immediately</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Security Incident Response</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               In the event of a data breach or security incident:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>We will investigate and contain the incident immediately</li>
//               <li>Affected users will be notified within 72 hours (or as required by law)</li>
//               <li>We will provide specific information about what data was affected</li>
//               <li>We will offer guidance on steps you can take to protect yourself</li>
//               <li>We will notify relevant regulatory authorities as required</li>
//               <li>We will conduct a post-incident review and implement preventive measures</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Limitations</h3>
//             <p className="text-white/70 leading-relaxed">
//               While we implement strong security measures, no method of transmission over the Internet or electronic
//               storage is 100% secure. We cannot guarantee absolute security, but we continuously work to protect
//               your data using industry-leading practices. You use our Services at your own risk, and we encourage
//               you to take appropriate precautions to protect your own data.
//             </p>
//           </section>

//           <section id="cookies" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We use cookies and similar tracking technologies to track activity on our Services, store certain
//               information, and improve your user experience. This section explains what cookies are, how we use
//               them, and how you can control them.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">What Are Cookies</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Cookies are small text files that are placed on your device when you visit a website. They are widely
//               used to make websites work more efficiently and provide information to website owners. Cookies can be
//               &quot;persistent&quot; (remain on your device until deleted or expired) or &quot;session&quot;
//               (deleted when you close your browser).
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Types of Cookies We Use</h3>

//             <h4 className="text-lg font-semibold mb-2 mt-4">Essential Cookies</h4>
//             <p className="text-white/70 leading-relaxed mb-3">
//               These cookies are necessary for our Services to function an




























//                           <h4 className="text-lg font-semibold mb-2 mt-4">Essential Cookies</h4>
//             <p className="text-white/70 leading-relaxed mb-3">
//               These cookies are necessary for our Services to function and enable core functionality. They are required for authentication, security, and basic platform operations. You cannot opt out of essential cookies as they are necessary for our Services to work.
//             </p>

//             <h4 className="text-lg font-semibold mb-2 mt-4">Performance Cookies</h4>
//             <p className="text-white/70 leading-relaxed mb-3">
//               These cookies help us understand how you use our Services by collecting information about pages visited, features used, and actions taken. This helps us optimize platform performance and user experience. You can control these cookies through your browser settings.
//             </p>

//             <h4 className="text-lg font-semibold mb-2 mt-4">Analytics Cookies</h4>
//             <p className="text-white/70 leading-relaxed mb-3">
//               We use analytics tools like Google Analytics to analyze usage patterns, track user journeys, and measure campaign effectiveness. These cookies help us improve our Services but are not essential for functionality.
//             </p>

//             <h4 className="text-lg font-semibold mb-2 mt-4">Marketing Cookies</h4>
//             <p className="text-white/70 leading-relaxed mb-3">
//               We may use marketing cookies to display relevant ads and personalized content. These cookies track your browsing habits across websites. You can opt out of marketing cookies without affecting platform functionality.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Your Cookie Choices</h3>
//             <p className="text-white/70 leading-relaxed mb-3">You can control cookies through:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Browser settings: Most browsers allow you to refuse cookies or alert you when they are being sent</li>
//               <li>Cookie preference center: We provide a cookie control interface where you can select which types of cookies to accept</li>
//               <li>Do Not Track: Some browsers have Do Not Track features, which we respect where applicable</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Cookies</h3>
//             <p className="text-white/70 leading-relaxed">
//               Third-party service providers may place cookies on your device for analytics, advertising, and other purposes. These are governed by their respective privacy policies. We recommend reviewing their policies for more information.
//             </p>
//           </section>

//           <section id="international-transfers" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Mailfra operates globally, and your personal data may be transferred to, stored in, and processed in countries other than your country of residence, which may have data protection laws different from your home country.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Legal Basis for Transfers</h3>
//             <p className="text-white/70 leading-relaxed mb-3">When we transfer data internationally, we ensure appropriate protections:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Standard Contractual Clauses (SCCs) as approved by relevant authorities</li>
//               <li>Binding Corporate Rules (BCRs) where applicable</li>
//               <li>Adequacy decisions recognizing equivalent data protection</li>
//               <li>Your explicit consent for transfers to countries without adequate protections</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">US Data Protection</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               If your data is transferred to the United States, it will be protected according to this Privacy Policy and applicable US law. We implement additional technical and organizational measures to ensure adequate protection.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">EU/EEA Residents</h3>
//             <p className="text-white/70 leading-relaxed">
//               For residents of the European Union or European Economic Area, any transfer of personal data outside the EU/EEA is made only with appropriate safeguards in place, as required by the GDPR.
//             </p>
//           </section>

//           <section id="children-privacy" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               Our Services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal data from a child under 18, we will take appropriate steps to delete such information promptly.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Parental Consent</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               If you are under 18 years old and have created an account on Mailfra, or if a parent or guardian discovers that their child has created an account, please contact us immediately at privacy@mailfra.com so we can delete the child's information and account.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">COPPA Compliance</h3>
//             <p className="text-white/70 leading-relaxed">
//               We comply with the Children's Online Privacy Protection Act (COPPA) and do not knowingly collect personal information from children under 13. Parents or guardians who believe we have collected information from a child under 13 should contact us immediately at privacy@mailfra.com.
//             </p>
//           </section>

//           <section id="california-rights" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">California Consumer Privacy Rights (CCPA/CPRA)</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). This section details those rights and how to exercise them.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Know</h3>
//             <p className="text-white/70 leading-relaxed mb-3">You have the right to request:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>The categories of personal information we collect about you</li>
//               <li>The sources from which we collect such information</li>
//               <li>The business or commercial purposes for collecting and using the information</li>
//               <li>The categories of third parties with whom we share such information</li>
//               <li>A copy of the specific personal information we have collected about you</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Delete</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               You have the right to request deletion of personal information we have collected from you, subject to certain exceptions:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>We may retain information necessary to complete a transaction or provide requested service</li>
//               <li>Information needed for security, fraud prevention, or legal compliance</li>
//               <li>Data required to comply with law or detect/prevent security incidents</li>
//               <li>Information necessary to enable internal uses reasonably aligned with your expectations</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Opt-Out of Sales/Sharing</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We do not sell or share your personal information for cross-context behavioral advertising. However, if our practices change, we will provide you with a clear opt-out link and honor your request within 45 days.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Non-Discrimination</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We will not discriminate against you for exercising your CCPA rights. We will not deny you goods or services, charge you different prices, or provide different quality of service based on your exercise of privacy rights.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Right to Limit Use</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               You have the right to limit our use of your personal information to purposes necessary to provide the services you request or reasonably expected by you.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">How to Submit CCPA Requests</h3>
//             <p className="text-white/70 leading-relaxed mb-3">To submit a CCPA request:</p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Email: privacy@mailfra.com with "CCPA Request" in the subject line</li>
//               <li>Use your account portal if available</li>
//               <li>Call: [Your phone number] (if available)</li>
//             </ul>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We will verify your identity and respond within 45 days. You may designate an authorized agent to make requests on your behalf with proper documentation.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">CCPA Data Sales Disclosure</h3>
//             <p className="text-white/70 leading-relaxed">
//               Mailfra does not sell personal information as defined by the CCPA. We do not engage in the sale of personal information for monetary or other valuable consideration.
//             </p>
//           </section>

//           <section id="changes" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
//             <p className="text-white/70 leading-relaxed mb-4">
//               We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by updating the &quot;Last Updated&quot; date at the top of this policy and/or sending you an email notification.
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Your Rights Upon Changes</h3>
//             <p className="text-white/70 leading-relaxed mb-3">
//               If we make material changes that restrict your rights or increase our data collection, we will:
//             </p>
//             <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//               <li>Notify you at least 30 days before the changes take effect</li>
//               <li>Obtain your affirmative consent to any new or expanded data processing</li>
//               <li>Provide clear information about what has changed</li>
//               <li>Allow you to opt out or delete your account if you disagree with the changes</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Continued Use</h3>
//             <p className="text-white/70 leading-relaxed">
//               Your continued use of Mailfra after we post changes to this Privacy Policy indicates your acceptance of the updated policy. We encourage you to review this policy regularly to stay informed about how we protect your privacy.
//             </p>
//           </section>

//           <section id="contact" className="mb-16 scroll-mt-32">
//             <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
//             <p className="text-white/70 leading-relaxed mb-6">
//               If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
//             </p>

//             <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//               <h3 className="text-xl font-semibold mb-4">Mailfra Privacy Team</h3>
//               <div className="space-y-3 text-white/70">
//                 <p>
//                   <strong className="text-white">Email:</strong>{" "}
//                   <a href="mailto:privacy@mailfra.com" className="text-white underline hover:text-white/80">
//                     privacy@mailfra.com
//                   </a>
//                 </p>
//                 <p>
//                   <strong className="text-white">Mailing Address:</strong>
//                   <br />
//                   Mailfra
//                   <br />
//                   [Your Company Address]
//                 </p>
//                 <p>
//                   <strong className="text-white">Support Portal:</strong>{" "}
//                   <a href="https://support.mailfra.com" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-white/80">
//                     support.mailfra.com
//                   </a>
//                 </p>
//               </div>
//             </div>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Data Protection Officer</h3>
//             <p className="text-white/70 leading-relaxed mb-4">
//               If you are in the EU or EEA, you can contact our Data Protection Officer (DPO) at:
//               <br />
//               <strong className="text-white">dpo@mailfra.com</strong>
//             </p>

//             <h3 className="text-xl font-semibold mb-3 mt-6">Supervisory Authority</h3>
//             <p className="text-white/70 leading-relaxed">
//               If you have complaints about our privacy practices that we have not adequately addressed, you may lodge a complaint with your local data protection authority or supervisory authority. Contact information for supervisory authorities can typically be found on your country's data protection authority website.
//             </p>
//           </section>
//         </div>
//       </div>
//     </section>
//   </main>
// )
// }

















// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Shield, Calendar } from "lucide-react"
// import PageHeader from "@/components/shared/page-header"
// import PageFooter from "@/components/shared/page-footer"

// const sections = [
//   { id: "introduction", title: "Introduction" },
//   { id: "information-we-collect", title: "Information We Collect" },
//   { id: "gmail-api-usage", title: "Gmail API Data Usage" },
//   { id: "how-we-use", title: "How We Use Your Information" },
//   { id: "data-sharing", title: "Data Sharing" },
//   { id: "data-retention", title: "Data Retention" },
//   { id: "your-rights", title: "Your Rights" },
//   { id: "security", title: "Security" },
//   { id: "cookies", title: "Cookies and Tracking Technologies" },
//   { id: "international-transfers", title: "International Data Transfers" },
//   { id: "children-privacy", title: "Children's Privacy" },
//   { id: "california-rights", title: "California Consumer Privacy Rights (CCPA/CPRA)" },
//   { id: "changes", title: "Changes to This Privacy Policy" },
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
//             <span>Last updated: December 24, 2024</span>
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
//             <div className="prose prose-invert prose-lg max-w-none space-y-8">
//               {/* Introduction */}
//               <section id="introduction" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Introduction</h2>
//                 <p className="text-white/70 leading-relaxed">
//                   At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
//                   privacy and ensuring the security of your personal information. This Privacy Policy explains how we
//                   collect, use, disclose, and safeguard your information when you use our cold email platform and
//                   related services (collectively, the &quot;Services&quot;).
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   By using Mailfra, you agree to the collection and use of information in accordance with this policy.
//                   If you do not agree with our policies and practices, please do not use our Services. We operate in
//                   compliance with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA),
//                   and other applicable privacy regulations worldwide.
//                 </p>
//               </section>

//               {/* Information We Collect */}
//               <section id="information-we-collect" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We collect several types of information to provide and improve our Services:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information You Provide</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Full name, email address, and phone number</li>
//                   <li>Company name, job title, and business information</li>
//                   <li>Billing address and payment information</li>
//                   <li>Account credentials and profile information</li>
//                   <li>Communication preferences and support inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data Collected Automatically</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>IP address, browser type, operating system, and device information</li>
//                   <li>Access times, session duration, and pages viewed</li>
//                   <li>Features used and actions taken within the platform</li>
//                   <li>Email campaign metrics including sends, opens, clicks, and replies</li>
//                   <li>Error logs, diagnostic data, and performance information</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Email Campaign Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Email content, subject lines, and templates you create</li>
//                   <li>Recipient email addresses and contact information</li>
//                   <li>Email engagement metrics (opens, clicks, bounces, replies)</li>
//                   <li>Campaign schedules, automation rules, and sequences</li>
//                   <li>Custom segments, tags, and organizational metadata</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Authentication Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>OAuth tokens and access credentials from connected services</li>
//                   <li>Account identifiers and profile information from third parties</li>
//                   <li>Permission scopes granted to our application</li>
//                 </ul>
//               </section>

//               {/* Gmail API Usage */}
//               <section id="gmail-api-usage" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Gmail API Data Usage and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   When you connect your Gmail account to Mailfra, we access specific data through the Google Gmail API
//                   to provide email outreach automation. We handle your Gmail data with the highest level of security and
//                   transparency.
//                 </p>

//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//                   <h4 className="text-lg font-semibold mb-3">Gmail Data Access</h4>
//                   <p className="text-white/70 leading-relaxed">
//                     By connecting your Gmail account, you authorize Mailfra to access your Gmail data as described. Your
//                     use is also subject to{" "}
//                     <a
//                       href="https://policies.google.com/privacy"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline"
//                     >
//                       Google&apos;s Privacy Policy
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="https://policies.google.com/terms"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline"
//                     >
//                       Terms of Service
//                     </a>
//                     .
//                   </p>
//                 </div>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How We Use Gmail Data</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-6">
//                   <li>Sending personalized outreach emails on your behalf</li>
//                   <li>Detecting and tracking replies from prospects</li>
//                   <li>Organizing emails with labels and metadata</li>
//                   <li>Providing engagement analytics and performance metrics</li>
//                   <li>Managing email drafts and campaign scheduling</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data Security</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>No full email content is stored on our servers</li>
//                   <li>Access tokens are encrypted with AES-256 encryption</li>
//                   <li>All communication uses TLS/SSL encryption</li>
//                   <li>We never store your Gmail password</li>
//                   <li>Gmail data is never sold or used for advertising</li>
//                 </ul>
//               </section>

//               {/* How We Use Information */}
//               <section id="how-we-use" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We use the information we collect for the following purposes:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Delivery and Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Provide, operate, and maintain our platform</li>
//                   <li>Process transactions and billing</li>
//                   <li>Send technical notices and support communications</li>
//                   <li>Respond to your inquiries and support requests</li>
//                   <li>Manage your account and user preferences</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Product Development and Improvement</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Conduct research and development to improve our platform</li>
//                   <li>Develop new features, products, and services</li>
//                   <li>Optimize user experience and interface design</li>
//                   <li>Generate aggregate statistics and analytics reports</li>
//                   <li>Identify and fix technical issues and bugs</li>
//                   <li>Analyze usage patterns to enhance functionality</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personalization and Communication</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Customize your experience based on preferences</li>
//                   <li>Provide personalized recommendations and suggestions</li>
//                   <li>Send marketing communications (with your consent)</li>
//                   <li>Send product updates and feature announcements</li>
//                   <li>Tailor content to your specific needs</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security and Compliance</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Detect, prevent, and address fraud and abuse</li>
//                   <li>Monitor for suspicious activity and policy violations</li>
//                   <li>Protect against security threats and vulnerabilities</li>
//                   <li>Comply with applicable laws and regulations</li>
//                   <li>Enforce our Terms of Service and legal agreements</li>
//                   <li>Respond to legal requests and law enforcement inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Business planning and forecasting</li>
//                   <li>Manage relationships with service providers and partners</li>
//                   <li>Facilitate mergers, acquisitions, or business transfers</li>
//                   <li>Maintain business records and documentation</li>
//                   <li>Perform accounting, auditing, and financial reporting</li>
//                 </ul>
//               </section>

//               {/* Data Sharing */}
//               <section id="data-sharing" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Data Sharing and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We do not sell your personal information to third parties. We may share your information only in these
//                   specific circumstances:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We share data with third-party vendors who perform services on our behalf:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Payment processors for billing and fraud detection</li>
//                   <li>Cloud infrastructure providers for data hosting</li>
//                   <li>Analytics services for usage insights</li>
//                   <li>Email delivery services for transactional messages</li>
//                   <li>Customer support platforms for assistance</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We may disclose information when required by law or in response to valid legal processes:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Compliance with applicable laws and regulations</li>
//                   <li>Response to valid legal requests and subpoenas</li>
//                   <li>Enforcement of our Terms of Service</li>
//                   <li>Protection of rights, property, and safety</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Transfers</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   In connection with mergers, acquisitions, or sale of assets, your information may be transferred to
//                   the successor entity.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Aggregated and De-identified Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We may share aggregated or anonymized data that cannot identify you for research, analytics, and
//                   product improvement.
//                 </p>
//               </section>

//               {/* Data Retention */}
//               <section id="data-retention" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Data Retention</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We retain your information for as long as necessary to provide services and comply with legal
//                   obligations:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Retention Periods</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Profile information: Retained during active account lifetime</li>
//                   <li>Campaign data: Retained for 24 months after last activity</li>
//                   <li>Email metadata: Retained for 24 months for analytics</li>
//                   <li>Billing records: Retained for 7 years for tax compliance</li>
//                   <li>Usage logs: Retained for 18 months for security</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Account Deletion</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   When you delete your account, personal information is permanently deleted within 30 days. Some data
//                   may be retained longer if required by law, for fraud prevention, or to resolve disputes. Backup
//                   systems may retain data for up to 90 days.
//                 </p>
//               </section>

//               {/* Your Rights */}
//               <section id="your-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Your Privacy Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Depending on your location, you have certain rights regarding your personal data:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request a copy of your personal data and information about how we process it.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Rectification</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request correction of inaccurate or incomplete data through your account settings or by
//                   contacting us.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Erasure</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request deletion of your data when it is no longer necessary, you withdraw consent, or
//                   processing is unlawful.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can receive your data in a structured, machine-readable format and request transfer to another
//                   service.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can object to processing for marketing purposes or based on legitimate interests.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restriction</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request limitation of processing while we verify your request or resolve disputes.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How to Exercise Your Rights</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   To exercise any of these rights, contact us at privacy@mailfra.com with your request. We will respond
//                   within 30 days or notify you if we need more time.
//                 </p>
//               </section>

//               {/* Security */}
//               <section id="security" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Security</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We implement industry-standard security measures to protect your information:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>TLS/SSL encryption for all data in transit</li>
//                   <li>AES-256 encryption for sensitive data at rest</li>
//                   <li>Regular security audits and penetration testing</li>
//                   <li>Access controls and role-based permissions</li>
//                   <li>Secure authentication and session management</li>
//                   <li>Automated threat detection and monitoring</li>
//                   <li>Incident response and data breach protocols</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   While we maintain comprehensive security measures, no method is 100% secure. We cannot guarantee
//                   absolute security of your data.
//                 </p>
//               </section>

//               {/* Cookies */}
//               <section id="cookies" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Cookies and Tracking Technologies</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We use cookies and similar technologies to track activity and remember your preferences:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Essential Cookies</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   These cookies are necessary for our Services to function and enable core functionality. They are
//                   required for authentication, security, and basic platform operations. You cannot opt out of essential
//                   cookies as they are necessary for our Services to work.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Performance Cookies</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   These cookies help us understand how you use our Services by collecting information about pages
//                   visited, features used, and actions taken. This helps us optimize platform performance and user
//                   experience. You can control these cookies through your browser settings.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Analytics Cookies</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We use analytics tools like Google Analytics to analyze usage patterns, track user journeys, and
//                   measure campaign effectiveness. These cookies help us improve our Services but are not essential for
//                   functionality.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Marketing Cookies</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We may use marketing cookies to display relevant ads and personalized content. These cookies track
//                   your browsing habits across websites. You can opt out of marketing cookies without affecting platform
//                   functionality.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Your Cookie Choices</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">You can control cookies through:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     Browser settings: Most browsers allow you to refuse cookies or alert you when they are being sent
//                   </li>
//                   <li>
//                     Cookie preference center: We provide a cookie control interface where you can select which types of
//                     cookies to accept
//                   </li>
//                   <li>Do Not Track: Some browsers have Do Not Track features, which we respect where applicable</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Cookies</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   Third-party service providers may place cookies on your device for analytics, advertising, and other
//                   purposes. These are governed by their respective privacy policies. We recommend reviewing their
//                   policies for more information.
//                 </p>
//               </section>

//               {/* International Transfers */}
//               <section id="international-transfers" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">International Data Transfers</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Mailfra operates globally, and your personal data may be transferred to, stored in, and processed in
//                   countries other than your country of residence, which may have data protection laws different from
//                   your home country.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal Basis for Transfers</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   When we transfer data internationally, we ensure appropriate protections:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Standard Contractual Clauses (SCCs) as approved by relevant authorities</li>
//                   <li>Binding Corporate Rules (BCRs) where applicable</li>
//                   <li>Adequacy decisions recognizing equivalent data protection</li>
//                   <li>Your explicit consent for transfers to countries without adequate protections</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">US Data Protection</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If your data is transferred to the United States, it will be protected according to this Privacy
//                   Policy and applicable US law. We implement additional technical and organizational measures to ensure
//                   adequate protection.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">EU/EEA Residents</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   For residents of the European Union or European Economic Area, any transfer of personal data outside
//                   the EU/EEA is made only with appropriate safeguards in place, as required by the GDPR.
//                 </p>
//               </section>

//               {/* Children's Privacy */}
//               <section id="children-privacy" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Our Services are not directed to individuals under 18 years of age. We do not knowingly collect
//                   personal information from children under 18. If we learn that we have collected personal data from a
//                   child under 18, we will take appropriate steps to delete such information promptly.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Parental Consent</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If you are under 18 years old and have created an account on Mailfra, or if a parent or guardian
//                   discovers that their child has created an account, please contact us immediately at
//                   privacy@mailfra.com so we can delete the child's information and account.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">COPPA Compliance</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   We comply with the Children's Online Privacy Protection Act (COPPA) and do not knowingly collect
//                   personal information from children under 13. Parents or guardians who believe we have collected
//                   information from a child under 13 should contact us immediately at privacy@mailfra.com.
//                 </p>
//               </section>

//               {/* California Rights */}
//               <section id="california-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">California Consumer Privacy Rights (CCPA/CPRA)</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If you are a California resident, you have specific rights under the California Consumer Privacy Act
//                   (CCPA) and the California Privacy Rights Act (CPRA). This section details those rights and how to
//                   exercise them.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Know</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">You have the right to request:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>The categories of personal information we collect about you</li>
//                   <li>The sources from which we collect such information</li>
//                   <li>The business or commercial purposes for collecting and using the information</li>
//                   <li>The categories of third parties with whom we share such information</li>
//                   <li>A copy of the specific personal information we have collected about you</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Delete</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to request deletion of personal information we have collected from you, subject to
//                   certain exceptions:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>We may retain information necessary to complete a transaction or provide requested service</li>
//                   <li>Information needed for security, fraud prevention, or legal compliance</li>
//                   <li>Data required to comply with law or detect/prevent security incidents</li>
//                   <li>Information necessary to enable internal uses reasonably aligned with your expectations</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Opt-Out of Sales/Sharing</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We do not sell or share your personal information for cross-context behavioral advertising. However,
//                   if our practices change, we will provide you with a clear opt-out link and honor your request within
//                   45 days.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Non-Discrimination</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We will not discriminate against you for exercising your CCPA rights. We will not deny you goods or
//                   services, charge you different prices, or provide different quality of service based on your exercise
//                   of privacy rights.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Limit Use</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   You have the right to limit our use of your personal information to purposes necessary to provide the
//                   services you request or reasonably expected by you.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How to Submit CCPA Requests</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">To submit a CCPA request:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email: privacy@mailfra.com with "CCPA Request" in the subject line</li>
//                   <li>Use your account portal if available</li>
//                   <li>Call: 0111549963 </li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We will verify your identity and respond within 45 days. You may designate an authorized agent to make
//                   requests on your behalf with proper documentation.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">CCPA Data Sales Disclosure</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   Mailfra does not sell personal information as defined by the CCPA. We do not engage in the sale of
//                   personal information for monetary or other valuable consideration.
//                 </p>
//               </section>

//               {/* Changes to Policy */}
//               <section id="changes" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal
//                   requirements, or other factors. When we make material changes, we will notify you by updating the
//                   &quot;Last Updated&quot; date at the top of this policy and/or sending you an email notification.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Your Rights Upon Changes</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   If we make material changes that restrict your rights or increase our data collection, we will:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Notify you at least 30 days before the changes take effect</li>
//                   <li>Obtain your affirmative consent to any new or expanded data processing</li>
//                   <li>Provide clear information about what has changed</li>
//                   <li>Allow you to opt out or delete your account if you disagree with the changes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Continued Use</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   Your continued use of Mailfra after we post changes to this Privacy Policy indicates your acceptance
//                   of the updated policy. We encourage you to review this policy regularly to stay informed about how we
//                   protect your privacy.
//                 </p>
//               </section>

//               {/* Contact */}
//               <section id="contact" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
//                   please contact us at:
//                 </p>

//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//                   <h3 className="text-xl font-semibold mb-4">Mailfra Privacy Team</h3>
//                   <div className="space-y-3 text-white/70">
//                     <p>
//                       <strong className="text-white">Email:</strong>{" "}
//                       <a href="mailto:privacy@mailfra.com" className="text-white underline hover:text-white/80">
//                         privacy@mailfra.com
//                       </a>
//                     </p>
//                     <p>
//                       <strong className="text-white">Mailing Address:</strong>
//                       <br />
//                       Mailfra Privacy Team
//                       <br />
//                       548 Market Street, Suite 42
//                       <br />
//                       San Francisco, CA 94104
//                       <br />
//                       United States
//                     </p>
//                     <p>
//                       <strong className="text-white">Support Portal:</strong>{" "}
//                       <a
//                         href="https://support.mailfra.com"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-white underline hover:text-white/80"
//                       >
//                         support.mailfra.com
//                       </a>
//                     </p>
//                   </div>
//                 </div>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Protection Officer</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If you are in the EU or EEA, you can contact our Data Protection Officer (DPO) at:
//                   <br />
//                   <strong className="text-white">dpo@mailfra.com</strong>
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Supervisory Authority</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   If you have complaints about our privacy practices that we have not adequately addressed, you may
//                   lodge a complaint with your local data protection authority or supervisory authority. Contact
//                   information for supervisory authorities can typically be found on your country's data protection
//                   authority website.
//                 </p>
//               </section>
//             </div>
//           </div>
//         </div>
//       </section>

//       <PageFooter />
//     </main>
//   )
// }













// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Shield, Calendar } from "lucide-react"
// import PageHeader from "@/components/shared/page-header"
// import PageFooter from "@/components/shared/page-footer"

// const sections = [
//   { id: "introduction", title: "Introduction" },
//   { id: "information-we-collect", title: "Information We Collect" },
//   { id: "gmail-api-usage", title: "Gmail API Data Usage" },
//   { id: "how-we-use", title: "How We Use Your Information" },
//   { id: "data-sharing", title: "Data Sharing" },
//   { id: "data-retention", title: "Data Retention" },
//   { id: "your-rights", title: "Your Rights" },
//   { id: "security", title: "Security" },
//   { id: "cookies", title: "Cookies" },
//   { id: "international-transfers", title: "International Data Transfers" },
//   { id: "children-privacy", title: "Children's Privacy" },
//   { id: "california-rights", title: "California Privacy Rights" },
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
//       { threshold: 0.1, rootMargin: "-150px 0px -200px 0px" }, // More lenient trigger zone
//     )
//     // const observer = new IntersectionObserver(
//     //   (entries) => {
//     //     entries.forEach((entry) => {
//     //       if (entry.isIntersecting) {
//     //         setVisibleSections((prev) => new Set([...prev, entry.target.id]))
//     //         setActiveSection(entry.target.id)
//     //       }
//     //     })
//     //   },
//     //   { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" },
//     // )

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
//             <span>Last updated: December 24, 2024</span>
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
//                   related services (collectively, the &quot;Services&quot;).
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   By using Mailfra, you agree to the collection and use of information in accordance with this policy.
//                   If you do not agree with our policies and practices, please do not use our Services. This policy
//                   applies to all users of our Services, including visitors, registered users, and subscribers.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We operate in compliance with applicable data protection laws, including the General Data Protection
//                   Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant privacy regulations.
//                   This Privacy Policy should be read in conjunction with our Terms of Service.
//                 </p>
//               </section>

//               <section id="information-we-collect" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We collect several types of information to provide and improve our Services. The information we
//                   collect falls into the following categories:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information that identifies you as an individual or relates to an identifiable individual:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Full name and email address</li>
//                   <li>Company name, job title, and business information</li>
//                   <li>Billing information including credit card details and billing address</li>
//                   <li>Phone number and other contact details (optional)</li>
//                   <li>Profile information including profile picture and bio</li>
//                   <li>Account credentials including username and encrypted password</li>
//                   <li>Communication preferences and notification settings</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Usage Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information automatically collected about how you interact with our Services:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email campaign performance metrics including send rates, delivery rates, and bounce rates</li>
//                   <li>Login and access times, session duration, and frequency of use</li>
//                   <li>Features used, actions taken within the platform, and user preferences</li>
//                   <li>Device information including type, operating system, and unique device identifiers</li>
//                   <li>Browser type, version, language settings, and time zone</li>
//                   <li>IP address, location data, and network information</li>
//                   <li>Referring and exit pages, clickstream data, and navigation paths</li>
//                   <li>Error logs, diagnostic data, and performance metrics</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Email Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Information related to your email campaigns and outreach activities:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email content, subject lines, and templates you create</li>
//                   <li>Recipient email addresses, names, and contact information</li>
//                   <li>Email engagement data including opens, clicks, replies, and bounces</li>
//                   <li>Email sending schedules, automation rules, and sequence configurations</li>
//                   <li>Custom fields, tags, and segments you create for organizing contacts</li>
//                   <li>Email metadata including timestamps, sender information, and delivery status</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Authentication Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   When you connect third-party services to Mailfra:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>OAuth tokens and refresh tokens for connected accounts</li>
//                   <li>Account identifiers from third-party services</li>
//                   <li>Permission scopes granted to our application</li>
//                   <li>Profile information shared by the third-party service</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Payment Information</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Financial information necessary to process your subscription:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Credit card number, expiration date, and CVV (processed securely by our payment processor)</li>
//                   <li>Billing address and payment method details</li>
//                   <li>Transaction history and payment receipts</li>
//                   <li>Tax identification numbers if required by law</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Communications</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">Information from your interactions with us:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>Customer support inquiries and correspondence</li>
//                   <li>Feedback, survey responses, and product reviews</li>
//                   <li>Marketing communications preferences</li>
//                   <li>Participation in contests, promotions, or events</li>
//                 </ul>
//               </section>

//               <section id="gmail-api-usage" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Gmail API Data Usage and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   When you connect your Gmail account to Mailfra, we access specific data through the Google Gmail API
//                   to provide our email outreach automation services. This section explains in detail how we handle your
//                   Gmail data.
//                 </p>

//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
//                   <h4 className="text-lg font-semibold mb-3">Important Notice About Gmail Data</h4>
//                   <p className="text-white/70 leading-relaxed mb-3">
//                     By connecting your Gmail account, you authorize Mailfra to access your Gmail data as described in
//                     this section. Your use of Gmail through Mailfra is also subject to{" "}
//                     <a
//                       href="https://policies.google.com/privacy"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Google&apos;s Privacy Policy
//                     </a>{" "}
//                     and{" "}
//                     <a
//                       href="https://policies.google.com/terms"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Terms of Service
//                     </a>
//                     .
//                   </p>
//                 </div>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data We Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We request access to the following Gmail data through specific API scopes:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Email Sending Capabilities (gmail.send scope):</strong> Allows us to
//                     send emails on your behalf as part of your outreach campaigns. This is the core functionality that
//                     enables automated email sequences.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Composition and Drafts (gmail.compose scope):</strong> Enables
//                     us to create, edit, and manage email drafts in your account. This allows you to preview and modify
//                     emails before they are sent.
//                   </li>
//                   <li>
//                     <strong className="text-white">Read Access to Emails (gmail.readonly scope):</strong> Provides
//                     read-only access to your emails, which we use exclusively to monitor replies from prospects and
//                     track email engagement metrics for your campaigns.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Modification Capabilities (gmail.modify scope):</strong> Allows
//                     us to apply labels, organize campaign emails, and manage email metadata. This helps you track
//                     campaign performance and organize your inbox.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How We Use Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We use your Gmail data solely and exclusively to provide our email outreach automation services. 
//                   Specifically:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Sending Campaign Emails:</strong> We send personalized outreach
//                     emails to prospects you have added to your campaigns. Each email is sent from your Gmail account
//                     using your authenticated credentials, maintaining your sender reputation and email deliverability.
//                   </li>
//                   <li>
//                     <strong className="text-white">Reply Detection and Tracking:</strong> We monitor your inbox
//                     specifically for replies to campaign emails. When a prospect responds, we automatically detect the
//                     reply, notify you through our platform, update the campaign status, and pause any scheduled
//                     follow-up emails to that prospect.
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Organization:</strong> We apply custom labels to sent campaign
//                     emails to help you organize and track your outreach efforts. This includes labels for campaign
//                     names, prospect status, and email sequence steps.
//                   </li>
//                   <li>
//                     <strong className="text-white">Draft Management:</strong> We create draft emails that you can
//                     review, edit, and approve before they are sent. This gives you full control over the content and
//                     timing of your outreach.
//                   </li>
//                   <li>
//                     <strong className="text-white">Engagement Analytics:</strong> We track email opens, clicks, and
//                     other engagement metrics to provide you with performance insights and help optimize your campaigns.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Gmail Data Storage and Security</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We take the security and privacy of your Gmail data seriously:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">No Email Content Storage:</strong> We do not store the full content
//                     of emails from your Gmail account on our servers. We only store minimal metadata necessary for
//                     campaign tracking, such as sender, recipient, subject line, and timestamps.
//                   </li>
//                   <li>
//                     <strong className="text-white">Encrypted Token Storage:</strong> Your Gmail access tokens and
//                     refresh tokens are encrypted using AES-256 encryption and stored securely in our database. These
//                     tokens are never exposed to unauthorized parties.
//                   </li>
//                   <li>
//                     <strong className="text-white">Secure Data Transmission:</strong> All communication between Mailfra
//                     and Gmail API uses industry-standard TLS/SSL encryption to protect your data in transit.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Password Storage:</strong> We never store your Gmail password.
//                     Authentication is handled entirely through Google&apos;s secure OAuth 2.0 protocol.
//                   </li>
//                   <li>
//                     <strong className="text-white">Limited Access:</strong> Only authorized Mailfra systems and
//                     personnel with legitimate need have access to Gmail API credentials, and all access is logged and
//                     monitored.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Sharing and Third-Party Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   Your Gmail data is treated with the highest level of confidentiality:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">No Selling or Renting:</strong> We will never sell, rent, or trade
//                     your Gmail data to third parties under any circumstances.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Advertising Use:</strong> We do not use your Gmail data for
//                     advertising purposes, either on our platform or for third-party advertising networks.
//                   </li>
//                   <li>
//                     <strong className="text-white">No Third-Party Applications:</strong> We do not allow third-party
//                     applications or services to access your Gmail data through our platform.
//                   </li>
//                   <li>
//                     <strong className="text-white">Service Provider Access:</strong> The only exception is our
//                     infrastructure providers (e.g., cloud hosting, database services) who may have technical access to
//                     encrypted data as part of providing core infrastructure services. These providers are bound by
//                     strict confidentiality agreements and data protection obligations.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Retention for Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We retain Gmail-related data according to the following policies:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Active Account:</strong> Gmail access tokens are retained as long as
//                     your Mailfra account is active and you have not revoked Gmail access.
//                   </li>
//                   <li>
//                     <strong className="text-white">Campaign Metadata:</strong> Email metadata (sender, recipient,
//                     subject, timestamps, engagement metrics) is retained for up to 24 months after campaign completion
//                     for analytics and reporting purposes.
//                   </li>
//                   <li>
//                     <strong className="text-white">Upon Revocation:</strong> When you revoke Gmail access through
//                     Mailfra or Google Account settings, we immediately stop accessing your Gmail and delete all stored
//                     access tokens within 24 hours.
//                   </li>
//                   <li>
//                     <strong className="text-white">Account Deletion:</strong> When you delete your Mailfra account, all
//                     Gmail-related data including access tokens and campaign metadata is permanently deleted within 30
//                     days.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Your Control Over Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You maintain complete control over your Gmail data at all times:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Revoke Access Anytime:</strong> You can disconnect Gmail from
//                     Mailfra at any time through your account settings. Additionally, you can revoke access directly
//                     through your{" "}
//                     <a
//                       href="https://myaccount.google.com/permissions"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-white underline hover:text-white/80"
//                     >
//                       Google Account Permissions
//                     </a>{" "}
//                     page.
//                   </li>
//                   <li>
//                     <strong className="text-white">Review Connected Apps:</strong> You can view all apps with access to
//                     your Gmail at any time through your Google Account settings.
//                   </li>
//                   <li>
//                     <strong className="text-white">Data Export:</strong> You can request an export of your campaign
//                     data, including metadata about emails sent through Mailfra, by contacting our support team.
//                   </li>
//                   <li>
//                     <strong className="text-white">Data Deletion:</strong> You can request deletion of all your
//                     Gmail-related data by contacting privacy@mailfra.com. We will process your request within 30 days.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Human Access to Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We strictly limit human access to your Gmail data. Mailfra employees will only access your Gmail data
//                   under the following specific circumstances:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">With Your Explicit Consent:</strong> When you specifically request
//                     support assistance that requires reviewing your email data.
//                   </li>
//                   <li>
//                     <strong className="text-white">Security Purposes:</strong> To investigate potential security
//                     incidents, fraud, or abuse of our Services.
//                   </li>
//                   <li>
//                     <strong className="text-white">Legal Compliance:</strong> When required by applicable law, legal
//                     process, or valid government requests.
//                   </li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   All human access to user data is logged, monitored, and subject to strict internal access controls
//                   and approval processes.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Compliance with Google API Services User Data Policy</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Mailfra&apos;s use and transfer of information received from Google APIs adheres to the{" "}
//                   <a
//                     href="https://developers.google.com/terms/api-services-user-data-policy"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-white underline hover:text-white/80"
//                   >
//                     Google API Services User Data Policy
//                   </a>
//                   , including the Limited Use requirements. Specifically:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>We only request the minimum Gmail API scopes necessary to provide our email automation services</li>
//                   <li>We do not use Gmail API data for serving advertisements to you or others</li>
//                   <li>
//                     We do not allow humans to read Gmail API data unless explicitly permitted for security, compliance,
//                     or with your consent
//                   </li>
//                   <li>
//                     We do not transfer Gmail API data to others unless necessary to provide our Services, for security
//                     purposes, or to comply with applicable law
//                   </li>
//                   <li>All Gmail API data access is logged and auditable</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security Measures for Gmail Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We implement comprehensive security measures specifically for Gmail data protection:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">OAuth 2.0 Authentication:</strong> All Gmail API access uses
//                     industry-standard OAuth 2.0 protocol. We never request or store your Gmail password.
//                   </li>
//                   <li>
//                     <strong className="text-white">Encrypted Token Storage:</strong> Access tokens and refresh tokens
//                     are encrypted using AES-256 encryption before storage in our database.
//                   </li>
//                   <li>
//                     <strong className="text-white">TLS/SSL Encryption:</strong> All API communications with Gmail use
//                     TLS 1.3 encryption to protect data in transit.
//                   </li>
//                   <li>
//                     <strong className="text-white">Regular Security Audits:</strong> We conduct regular security audits
//                     and vulnerability assessments of our Gmail API integration.
//                   </li>
//                   <li>
//                     <strong className="text-white">Access Logging:</strong> All Gmail API requests are logged with
//                     timestamps, user IDs, and action types for security monitoring and audit purposes.
//                   </li>
//                   <li>
//                     <strong className="text-white">Employee Training:</strong> All employees with access to systems
//                     handling Gmail data undergo mandatory security and privacy training.
//                   </li>
//                   <li>
//                     <strong className="text-white">Least Privilege Access:</strong> Internal access to Gmail API
//                     credentials and user data is restricted to only those employees who require it for their job
//                     functions.
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Data Breach Notification</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   In the unlikely event of a security breach affecting your Gmail data, we commit to:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-3 mb-4">
//                   <li>
//                     <strong className="text-white">Immediate Action:</strong> Contain and remediate the breach as
//                     quickly as possible
//                   </li>
//                   <li>
//                     <strong className="text-white">Timely Notification:</strong> Notify you within 72 hours of
//                     discovering the breach, or sooner if required by applicable law
//                   </li>
//                   <li>
//                     <strong className="text-white">Google Notification:</strong> Notify Google as required by the Gmail
//                     API Terms of Service
//                   </li>
//                   <li>
//                     <strong className="text-white">Detailed Information:</strong> Provide you with specific details
//                     about what data was affected, the nature of the breach, and steps we are taking to address it
//                   </li>
//                   <li>
//                     <strong className="text-white">Assistance:</strong> Offer guidance and assistance in securing your
//                     Gmail account if necessary
//                   </li>
//                   <li>
//                     <strong className="text-white">Regulatory Compliance:</strong> Notify relevant regulatory
//                     authorities as required by data protection laws
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Questions About Gmail Data Usage</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   If you have any questions or concerns about how we handle your Gmail data, please contact us at
//                   privacy@mailfra.com. We are committed to transparency and will respond to your inquiries within 48
//                   hours.
//                 </p>
//               </section>

//               <section id="how-we-use" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We use the information we collect for various purposes related to providing, maintaining, and
//                   improving our Services. Below is a comprehensive explanation of how we use your data:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Provision and Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Provide, operate, and maintain our email outreach automation platform</li>
//                   <li>Process and manage your email campaigns, sequences, and automation workflows</li>
//                   <li>Enable you to create, send, and track email communications</li>
//                   <li>Manage your account, profile, and preferences</li>
//                   <li>Authenticate your identity and maintain account security</li>
//                   <li>Provide customer support and respond to your inquiries</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Billing and Transactions</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Process subscription payments and manage billing cycles</li>
//                   <li>Send transaction confirmations, invoices, and payment receipts</li>
//                   <li>Manage subscription upgrades, downgrades, and cancellations</li>
//                   <li>Detect and prevent fraudulent transactions</li>
//                   <li>Calculate and collect applicable taxes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Communication and Notifications</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Send you technical notices, system alerts, and security notifications</li>
//                   <li>Provide updates about new features, improvements, and service changes</li>
//                   <li>Send administrative messages related to your account</li>
//                   <li>Respond to your comments, questions, and customer service requests</li>
//                   <li>Send marketing communications about our Services (with your consent)</li>
//                   <li>Notify you about campaign performance and important events</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Analytics and Improvement</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Monitor and analyze usage patterns, trends, and user behavior</li>
//                   <li>Measure the effectiveness of our Services and features</li>
//                   <li>Conduct research and development to improve our platform</li>
//                   <li>Develop new features, products, and services</li>
//                   <li>Optimize user experience and interface design</li>
//                   <li>Generate aggregate statistics and analytics reports</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Personalization</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Customize your experience based on your preferences and usage</li>
//                   <li>Provide personalized recommendations and suggestions</li>
//                   <li>Remember your settings and preferences across sessions</li>
//                   <li>Tailor content and features to your specific needs</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security and Fraud Prevention</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Detect, prevent, and address technical issues and system errors</li>
//                   <li>Identify and prevent fraud, abuse, and unauthorized access</li>
//                   <li>Protect against security threats and vulnerabilities</li>
//                   <li>Monitor for suspicious activity and policy violations</li>
//                   <li>Enforce our Terms of Service and other policies</li>
//                   <li>Maintain the security and integrity of our Services</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal Compliance</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Comply with applicable laws, regulations, and legal obligations</li>
//                   <li>Respond to legal requests and prevent illegal activities</li>
//                   <li>Enforce our legal rights and defend against legal claims</li>
//                   <li>Maintain records as required by law</li>
//                   <li>Cooperate with law enforcement and regulatory authorities</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Operations</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2">
//                   <li>Conduct business planning and forecasting</li>
//                   <li>Manage relationships with service providers and partners</li>
//                   <li>Facilitate mergers, acquisitions, or business transfers</li>
//                   <li>Maintain business records and documentation</li>
//                   <li>Perform accounting, auditing, and financial reporting</li>
//                 </ul>
//               </section>

//               <section id="data-sharing" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We do not sell your personal information to third parties. We may share your information only in the
//                   specific circumstances described below, and we require all recipients to protect your data and comply
//                   with applicable privacy laws.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Service Providers and Business Partners</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We share data with carefully selected third-party vendors who perform services on our behalf. These
//                   service providers are contractually obligated to protect your information and may only use it for the
//                   specific purposes we authorize:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Payment Processors:</strong> To process subscription payments,
//                     manage billing, and detect fraud (e.g., Stripe, PayPal)
//                   </li>
//                   <li>
//                     <strong className="text-white">Cloud Infrastructure:</strong> To host our platform and store data
//                     securely (e.g., AWS, Google Cloud)
//                   </li>
//                   <li>
//                     <strong className="text-white">Analytics Services:</strong> To understand usage patterns and improve
//                     our Services (e.g., Google Analytics, Mixpanel)
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Delivery:</strong> To send transactional emails and
//                     notifications (e.g., SendGrid, Amazon SES)
//                   </li>
//                   <li>
//                     <strong className="text-white">Customer Support:</strong> To provide technical support and respond
//                     to inquiries (e.g., Intercom, Zendesk)
//                   </li>
//                   <li>
//                     <strong className="text-white">Security Services:</strong> To protect against fraud, abuse, and
//                     security threats
//                   </li>
//                   <li>
//                     <strong className="text-white">Database Services:</strong> To store and manage data efficiently
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Business Transfers</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   In connection with a corporate transaction, your information may be transferred:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>During negotiations of a merger, acquisition, or sale of company assets</li>
//                   <li>In the event of a bankruptcy or insolvency proceeding</li>
//                   <li>As part of a corporate reorganization or restructuring</li>
//                   <li>To a successor entity that assumes our obligations under this Privacy Policy</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We will notify you via email and/or prominent notice on our website before your information is
//                   transferred and becomes subject to a different privacy policy.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements and Protection</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We may disclose your information when we believe in good faith that disclosure is necessary to:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Comply with applicable laws, regulations, or legal processes</li>
//                   <li>Respond to valid legal requests from government authorities or law enforcement</li>
//                   <li>Enforce our Terms of Service and other agreements</li>
//                   <li>Protect the rights, property, or safety of Mailfra, our users, or the public</li>
//                   <li>Detect, prevent, or address fraud, security, or technical issues</li>
//                   <li>Investigate potential violations of our policies</li>
//                   <li>Defend against legal claims or litigation</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">With Your Consent</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We may share your information with third parties when you explicitly consent or direct us to do so.
//                   For example:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>When you authorize integrations with third-party applications or services</li>
//                   <li>When you participate in promotional activities with partners</li>
//                   <li>When you request us to share information with specific third parties</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Aggregated and De-identified Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to
//                   identify you. This data may be used for:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Industry research and analysis</li>
//                   <li>Marketing and promotional purposes</li>
//                   <li>Improving our Services and developing new features</li>
//                   <li>Creating benchmarks and industry reports</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">API and Integration Partners</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   When you connect third-party services (such as Gmail, CRM systems, or other tools) to Mailfra, you
//                   authorize us to share relevant data with those services to enable the integration functionality. These
//                   integrations are subject to both our Privacy Policy and the third party&apos;s privacy policy.
//                 </p>
//               </section>

//               <section id="data-retention" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We retain your personal information for as long as necessary to fulfill the purposes outlined in this
//                   Privacy Policy, unless a longer retention period is required or permitted by law. Our retention
//                   periods are based on business needs and legal requirements.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Active Account Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   While your account remains active, we retain:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Profile Information:</strong> Retained for the lifetime of your
//                     account
//                   </li>
//                   <li>
//                     <strong className="text-white">Campaign Data:</strong> Retained for 24 months after last activity or
//                     campaign completion
//                   </li>
//                   <li>
//                     <strong className="text-white">Email Metadata:</strong> Retained for 24 months to support analytics
//                     and reporting
//                   </li>
//                   <li>
//                     <strong className="text-white">Usage Analytics:</strong> Retained for 18 months for platform
//                     improvement purposes
//                   </li>
//                   <li>
//                     <strong className="text-white">Authentication Tokens:</strong> Retained until revoked or account
//                     deletion
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Billing and Transaction Data</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">Financial and transaction records are retained to:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Comply with tax laws and financial regulations (typically 7 years)</li>
//                   <li>Handle chargebacks, refunds, and billing disputes</li>
//                   <li>Maintain accurate financial records for accounting purposes</li>
//                   <li>Support audits and regulatory compliance</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Inactive Accounts</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   If your account becomes inactive (no login for 24 consecutive months):
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>We will send email notifications warning of potential account deletion</li>
//                   <li>After 90 days of continued inactivity following the final notice, we may delete your account</li>
//                   <li>Essential information may be retained for legal and security purposes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Account Deletion</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">When you delete your account:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Immediate:</strong> Your account access is disabled and active
//                     campaigns are stopped
//                   </li>
//                   <li>
//                     <strong className="text-white">Within 30 days:</strong> Personal information, campaign data, and
//                     email metadata are permanently deleted
//                   </li>
//                   <li>
//                     <strong className="text-white">Exceptions:</strong> Some data may be retained longer if required by
//                     law, for fraud prevention, to resolve disputes, or to enforce our Terms of Service
//                   </li>
//                   <li>
//                     <strong className="text-white">Backups:</strong> Data in backup systems may persist for up to 90
//                     days before complete deletion
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Legal and Regulatory Requirements</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We may retain certain information longer than standard retention periods when:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Required by applicable law or regulation</li>
//                   <li>Necessary to comply with legal obligations</li>
//                   <li>Needed to resolve disputes or enforce agreements</li>
//                   <li>Required for legitimate business purposes (fraud prevention, security)</li>
//                   <li>Subject to legal hold or ongoing litigation</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Anonymized Data</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   We may convert personal data into anonymized, aggregated data that cannot be used to identify you.
//                   This anonymized data may be retained indefinitely for analytics, research, and product improvement
//                   purposes.
//                 </p>
//               </section>

//               <section id="your-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Your Privacy Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Depending on your location and applicable laws, you may have certain rights regarding your personal
//                   data. We are committed to facilitating the exercise of these rights in accordance with applicable
//                   privacy regulations.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Access</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to request access to the personal data we hold about you, including:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Confirmation of whether we process your personal data</li>
//                   <li>Categories of personal data we collect and process</li>
//                   <li>Purposes for which we use your personal data</li>
//                   <li>Third parties with whom we share your data</li>
//                   <li>How long we retain your data</li>
//                   <li>A copy of your personal data in a structured format</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Rectification</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to request correction of inaccurate or incomplete personal data:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Update your account information directly through your account settings</li>
//                   <li>Request correction of data you cannot update yourself</li>
//                   <li>Add supplementary information to complete incomplete data</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Erasure (Right to be Forgotten)</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to request deletion of your personal data when:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>The data is no longer necessary for the purposes for which it was collected</li>
//                   <li>You withdraw consent and there is no other legal basis for processing</li>
//                   <li>You object to processing and there are no overriding legitimate grounds</li>
//                   <li>The data has been unlawfully processed</li>
//                   <li>Deletion is required to comply with a legal obligation</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Please note that we may retain certain information when we have a legal obligation or legitimate
//                   interest to do so.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Data Portability</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to receive your personal data in a structured, commonly used, and machine-readable
//                   format:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Export your campaign data, templates, and contact lists</li>
//                   <li>Receive data in CSV, JSON, or other standard formats</li>
//                   <li>Request that we transmit your data directly to another service provider where technically feasible</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Object</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">You have the right to object to:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Processing of your personal data for direct marketing purposes (including profiling)</li>
//                   <li>Processing based on legitimate interests or performance of a task in the public interest</li>
//                   <li>Automated decision-making and profiling that produces legal or similarly significant effects</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Restriction of Processing</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You have the right to request that we limit the processing of your personal data when:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>You contest the accuracy of the data (during verification)</li>
//                   <li>Processing is unlawful but you prefer restriction over deletion</li>
//                   <li>We no longer need the data but you need it for legal claims</li>
//                   <li>You have objected to processing pending verification of our legitimate grounds</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Withdraw Consent</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   Where we process your data based on consent, you have the right to withdraw that consent at any time.
//                   Withdrawal of consent does not affect the lawfulness of processing before withdrawal. You can withdraw
//                   consent through your account settings or by contacting us.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Lodge a Complaint</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   If you believe we have not adequately addressed your privacy concerns, you have the right to lodge a
//                   complaint with a supervisory authority in your jurisdiction. We would appreciate the opportunity to
//                   address your concerns first, so please contact us at privacy@mailfra.com.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">How to Exercise Your Rights</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">To exercise any of these rights:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Email us at privacy@mailfra.com with your request</li>
//                   <li>Use the data management tools in your account settings</li>
//                   <li>Contact our Data Protection Officer (if applicable)</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We will respond to your request within 30 days (or as required by applicable law). We may need to
//                   verify your identity before processing certain requests. There is no fee for exercising your rights,
//                   unless your request is clearly unfounded, repetitive, or excessive.
//                 </p>
//               </section>

//               <section id="security" className="mb-16 scroll-mt-32">
//                 <h2 className="text-2xl font-bold mb-4">Security Measures</h2>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We implement comprehensive technical, administrative, and physical security measures to protect your
//                   personal data against unauthorized access, alteration, disclosure, or destruction. While no system is
//                   completely secure, we continuously work to maintain and improve our security practices.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Technical Security Measures</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Encryption in Transit:</strong> All data transmitted between your
//                     browser and our servers is encrypted using TLS 1.3 (Transport Layer Security) protocol
//                   </li>
//                   <li>
//                     <strong className="text-white">Encryption at Rest:</strong> Sensitive data stored in our databases
//                     is encrypted using AES-256 encryption
//                   </li>
//                   <li>
//                     <strong className="text-white">Password Protection:</strong> User passwords are hashed using
//                     industry-standard bcrypt algorithm with appropriate salt rounds
//                   </li>
//                   <li>
//                     <strong className="text-white">OAuth Token Security:</strong> Third-party authentication tokens are
//                     encrypted and stored securely with restricted access
//                   </li>
//                   <li>
//                     <strong className="text-white">Secure APIs:</strong> All API endpoints are protected with
//                     authentication and authorization mechanisms
//                   </li>
//                   <li>
//                     <strong className="text-white">Database Security:</strong> Databases are hosted in secure
//                     environments with network isolation and access controls
//                   </li>
//                   <li>
//                     <strong className="text-white">Regular Security Updates:</strong> We promptly apply security patches
//                     and updates to all systems and dependencies
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Administrative Security Measures</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Access Controls:</strong> Strict least-privilege access policies
//                     ensure employees only access data necessary for their roles
//                   </li>
//                   <li>
//                     <strong className="text-white">Employee Training:</strong> All employees undergo mandatory security
//                     awareness and privacy training
//                   </li>
//                   <li>
//                     <strong className="text-white">Background Checks:</strong> Employees with access to sensitive data
//                     undergo appropriate background screening
//                   </li>
//                   <li>
//                     <strong className="text-white">Confidentiality Agreements:</strong> All employees and contractors
//                     sign confidentiality and data protection agreements
//                   </li>
//                   <li>
//                     <strong className="text-white">Access Logging:</strong> All access to production systems and user
//                     data is logged and regularly audited
//                   </li>
//                   <li>
//                     <strong className="text-white">Incident Response:</strong> We maintain a documented incident
//                     response plan for security breaches
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Physical Security Measures</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Secure Data Centers:</strong> Our infrastructure is hosted in
//                     tier-3+ certified data centers with 24/7 monitoring
//                   </li>
//                   <li>
//                     <strong className="text-white">Environmental Controls:</strong> Data centers maintain appropriate
//                     temperature, humidity, and fire suppression systems
//                   </li>
//                   <li>
//                     <strong className="text-white">Access Control:</strong> Physical access to servers is restricted to
//                     authorized data center personnel
//                   </li>
//                   <li>
//                     <strong className="text-white">Redundancy:</strong> Critical systems have redundant power supplies,
//                     network connections, and backup systems
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Monitoring and Testing</h3>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>
//                     <strong className="text-white">Security Audits:</strong> Regular third-party security audits and
//                     penetration testing
//                   </li>
//                   <li>
//                     <strong className="text-white">Vulnerability Scanning:</strong> Automated vulnerability scans of our
//                     infrastructure and applications
//                   </li>
//                   <li>
//                     <strong className="text-white">Security Monitoring:</strong> 24/7 monitoring for suspicious
//                     activities and security incidents
//                   </li>
//                   <li>
//                     <strong className="text-white">Intrusion Detection:</strong> Automated systems detect and alert on
//                     potential security threats
//                   </li>
//                   <li>
//                     <strong className="text-white">Code Reviews:</strong> All code changes undergo security-focused peer
//                     review before deployment
//                   </li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Account Security Features</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">We provide you with tools to protect your account:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Strong password requirements with minimum complexity standards</li>
//                   <li>Two-factor authentication (2FA) option for enhanced account security</li>
//                   <li>Session management with automatic timeout after periods of inactivity</li>
//                   <li>Login notifications for new devices or suspicious activity</li>
//                   <li>Ability to review active sessions and revoke access from specific devices</li>
//                   <li>Security alerts for important account changes</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Third-Party Security</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   We carefully vet all third-party service providers and require them to implement appropriate security
//                   measures. Our agreements with service providers include:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Contractual obligations to protect your data</li>
//                   <li>Compliance with applicable data protection laws</li>
//                   <li>Regular security assessments and certifications</li>
//                   <li>Breach notification requirements</li>
//                   <li>Data processing agreements compliant with GDPR and other regulations</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security Best Practices for Users</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">We recommend you take these steps to protect your account:</p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>Use a strong, unique password for your Mailfra account</li>
//                   <li>Enable two-factor authentication (2FA)</li>
//                   <li>Never share your password with others</li>
//                   <li>Log out when using shared or public computers</li>
//                   <li>Keep your contact information up to date for security notifications</li>
//                   <li>Regularly review your account activity and connected integrations</li>
//                   <li>Report any suspicious activity or security concerns immediately</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Security Incident Response</h3>
//                 <p className="text-white/70 leading-relaxed mb-4">
//                   In the event of a data breach or security incident:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
//                   <li>We will investigate and contain the incident immediately</li>
//                   <li>Affected users will be notified within 72 hours (or as required by law)</li>
//                   <li>We will provide specific information about what data was affected</li>
//                   <li>We will offer guidance on steps you can take to protect yourself</li>
//                   <li>We will notify relevant regulatory authorities as required</li>
//                   <li>We will conduct a post-incident review and implement preventive measures</li>
//                 </ul>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Limitations</h3>
//                 <p className="text-white/70 leading-relaxed">
//                   While we implement strong security measures, no method of transmission over the Internet or electronic
//                   storage is 100% secure. We cannot guarantee absolute security, but we continuously work to protect
//                   your data using industry-leading practices. You use our Services at your own risk, and we encourage
//                   you to take appropriate precautions to protect your own data.
//                 </p>
//               </section>

//               {/* Cookies */}
//               <section id="cookies" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Cookies and Tracking Technologies</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We use cookies and similar technologies to track activity and remember your preferences:
//                 </p>
//                 <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
//                   <li>Essential cookies for platform functionality</li>
//                   <li>Analytics cookies to understand usage patterns</li>
//                   <li>Preference cookies to remember your settings</li>
//                   <li>Marketing cookies for campaigns and retargeting</li>
//                 </ul>
//                 <p className="text-white/70 leading-relaxed">
//                   You can control cookies through your browser settings. Disabling cookies may limit your ability to use
//                   certain features of our platform.
//                 </p>
//               </section>

//               {/* International Transfers */}
//               <section id="international-transfers" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">International Data Transfers</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Your information may be transferred to, stored in, and processed in countries other than your country
//                   of residence. These countries may have different data protection laws than your home country. By using
//                   our Services, you consent to the transfer of your information to countries outside your country of
//                   residence.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We implement safeguards to ensure adequate data protection, including Standard Contractual Clauses and
//                   Privacy Shield frameworks where applicable.
//                 </p>
//               </section>

//               {/* Children's Privacy */}
//               <section id="children-privacy" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   Our Services are not intended for children under the age of 13 (or the applicable age in your
//                   jurisdiction). We do not knowingly collect personal information from children. If we become aware that
//                   a child has provided us with personal information, we will delete such information and terminate the
//                   child's account.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   Parents or guardians who believe their child has provided information to us should contact us
//                   immediately at privacy@mailfra.com.
//                 </p>
//               </section>

//               {/* California Rights */}
//               <section id="california-rights" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">California Consumer Privacy Act (CCPA) Rights</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   If you are a California resident, you have additional rights under the CCPA:
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Know</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request to know what personal information we collect, use, share, and sell.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Delete</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   You can request deletion of personal information we have collected, subject to certain exceptions.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Opt-Out</h3>
//                 <p className="text-white/70 leading-relaxed mb-3">
//                   We do not sell personal information. You have the right to opt-out of any potential future sales.
//                 </p>

//                 <h3 className="text-xl font-semibold mb-3 mt-6">Right to Non-Discrimination</h3>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We will not discriminate against you for exercising your CCPA rights.
//                 </p>

//                 <p className="text-white/70 leading-relaxed">
//                   To submit a CCPA request, contact us at privacy@mailfra.com. We will verify your identity and respond
//                   within 45 days.
//                 </p>
//               </section>

//               {/* Changes to Policy */}
//               <section id="changes" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   We may update this Privacy Policy periodically. We will notify you of material changes by posting the
//                   new policy on this page and updating the "Last updated" date. Continued use of our Services after such
//                   modifications constitutes your acceptance of the updated Privacy Policy.
//                 </p>
//                 <p className="text-white/70 leading-relaxed">
//                   We encourage you to review this Privacy Policy regularly to stay informed about how we protect your
//                   information.
//                 </p>
//               </section>

//               {/* Contact */}
//               <section id="contact" className="mb-16 scroll-mt-32">
//                 <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
//                 <p className="text-white/70 leading-relaxed mb-6">
//                   If you have questions about this Privacy Policy or our privacy practices, please contact us:
//                 </p>
//                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Email</p>
//                     <p className="text-white">privacy@mailfra.com</p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Mailing Address</p>
//                     <p className="text-white">
//                       Mailfra Privacy Team
//                       <br />
//                       548 Market Street, Suite 42
//                       <br />
//                       San Francisco, CA 94104
//                       <br />
//                       United States
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Data Protection Officer</p>
//                     <p className="text-white">dpo@mailfra.com</p>
//                   </div>
//                   <div>
//                     <p className="text-white/50 text-sm uppercase tracking-wider">Response Time</p>
//                     <p className="text-white">
//                       We typically respond to privacy inquiries within 30 days. For CCPA requests, we respond within 45
//                       days as required by law.
//                     </p>
//                   </div>
//                 </div>
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
  { id: "smtp-data-usage", title: "SMTP Data Usage" },
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
      { threshold: 0.1, rootMargin: "-150px 0px -200px 0px" },
    )

    sections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
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

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 md:w-7 md:h-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">Privacy Policy</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm md:text-base">Last updated: December 24, 2024</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-16">
            {/* Sidebar Navigation */}
            <nav className="hidden lg:block">
              <div className="sticky top-32">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">On this page</h3>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`block py-2 px-3 text-sm rounded transition-colors ${
                          activeSection === section.id 
                            ? "text-foreground bg-accent/10 font-semibold border-l-2 border-primary" 
                            : "text-muted-foreground hover:text-foreground"
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
            <div className="max-w-none space-y-12 md:space-y-16">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">Introduction</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    At Mailfra (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to protecting your
                    privacy and ensuring the security of your personal information. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when you use our cold email platform and
                    related services (collectively, the &quot;Services&quot;).
                  </p>
                  <p>
                    By using Mailfra, you agree to the collection and use of information in accordance with this policy.
                    If you do not agree with our policies and practices, please do not use our Services. This policy
                    applies to all users of our Services, including visitors, registered users, and subscribers.
                  </p>
                  <p>
                    We operate in compliance with applicable data protection laws, including the General Data Protection
                    Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant privacy regulations.
                    This Privacy Policy should be read in conjunction with our Terms of Service.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section id="information-we-collect" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We collect several types of information to provide and improve our Services. The information we
                  collect falls into the following categories:
                </p>

                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Personal Information</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Information that identifies you as an individual or relates to an identifiable individual:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Full name and email address</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Company name, job title, and business information</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Billing information including credit card details and billing address</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Phone number and other contact details (optional)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Profile information including profile picture and bio</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Account credentials including username and encrypted password</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Communication preferences and notification settings</span>
                      </li>
                    </ul>
                  </div>

                  {/* Usage Data */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Usage Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Information automatically collected about how you interact with our Services:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Email campaign performance metrics including send rates, delivery rates, and bounce rates</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Login and access times, session duration, and frequency of use</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Features used, actions taken within the platform, and user preferences</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Device information including type, operating system, and unique device identifiers</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Browser type, version, language settings, and time zone</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>IP address, location data, and network information</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Referring and exit pages, clickstream data, and navigation paths</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Error logs, diagnostic data, and performance metrics</span>
                      </li>
                    </ul>
                  </div>

                  {/* Email Data */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Email Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Information related to your email campaigns and outreach activities:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Email content, subject lines, and templates you create</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Recipient email addresses, names, and contact information</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Email engagement data including opens, clicks, replies, and bounces</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Email sending schedules, automation rules, and sequence configurations</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Custom fields, tags, and segments you create for organizing contacts</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Email metadata including timestamps, sender information, and delivery status</span>
                      </li>
                    </ul>
                  </div>

                  {/* Third-Party Authentication Data */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Third-Party Authentication Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      When you connect third-party services to Mailfra:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>OAuth tokens and refresh tokens for connected accounts</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Account identifiers from third-party services</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Permission scopes granted to our application</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Profile information shared by the third-party service</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Payment Information</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Financial information necessary to process your subscription:
                    </p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Credit card number, expiration date, and CVV (processed securely by our payment processor)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Billing address and payment method details</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Transaction history and payment receipts</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Tax identification numbers if required by law</span>
                      </li>
                    </ul>
                  </div>

                  {/* Communications */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Communications</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">Information from your interactions with us:</p>
                    <ul className="space-y-2 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Customer support inquiries and correspondence</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Feedback, survey responses, and product reviews</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Marketing communications preferences</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>Participation in contests, promotions, or events</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SMTP Data Usage */}
              <section id="smtp-data-usage" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">SMTP Data Usage and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  When you connect your email account to Mailfra through SMTP, we access specific data
                  to provide our email outreach automation services. This section explains in detail how we handle your
                  email data.
                </p>

                <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-8">
                  <h4 className="text-base md:text-lg font-semibold text-foreground mb-3">Important Notice About Email Data</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    By connecting your email account via SMTP, you authorize Mailfra to access and send emails
                    as described in this section. Your email usage through Mailfra is protected by industry-standard
                    security protocols and encryption standards.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* SMTP Data We Access */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">SMTP Data We Access</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We access the following email data through SMTP protocol:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Email Sending Capabilities:</strong> Allows us to send emails on your behalf as part of your outreach campaigns. This is the core functionality that enables automated email sequences.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Email Recipient Information:</strong> We receive and store recipient addresses and basic delivery status to track campaign performance.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Delivery Status and Bounce Information:</strong> Provides delivery confirmations, bounce notifications, and basic engagement metrics for your campaigns.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Email Metadata:</strong> Allows us to track email sending timestamps, sender information, and delivery details. This helps you track campaign performance.</span>
                      </li>
                    </ul>
                  </div>

                  {/* How We Use SMTP Data */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">How We Use SMTP Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We use your SMTP data solely and exclusively to provide our email outreach automation services. 
                      Specifically:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Sending Campaign Emails:</strong> We send personalized outreach emails to prospects you have added to your campaigns. Each email is sent from your email account using your authenticated credentials, maintaining your sender reputation and email deliverability.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Delivery Tracking:</strong> We monitor delivery status and bounce notifications to automatically track which emails were successfully delivered, which bounced, and other delivery metrics.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Campaign Management:</strong> We track email sending records to help you organize and manage your outreach efforts, including campaign status and performance metrics.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Performance Analytics:</strong> We aggregate delivery data to provide you with performance insights and help optimize your campaigns.</span>
                      </li>
                    </ul>
                  </div>

                  {/* SMTP Data Storage and Security */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">SMTP Data Storage and Security</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We take the security and privacy of your email data seriously:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Minimal Data Storage:</strong> We store only the essential metadata necessary for campaign tracking, such as recipient, subject line, timestamps, and delivery status. We do not store full email content unnecessarily.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Encrypted Credential Storage:</strong> Your SMTP credentials are encrypted using AES-256 encryption and stored securely in our database. Credentials are never exposed to unauthorized parties.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Secure Data Transmission:</strong> All communication between Mailfra and email servers uses industry-standard TLS/SSL encryption to protect your data in transit.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Limited Access:</strong> Only authorized Mailfra systems and personnel with legitimate need have access to email credentials, and all access is logged and monitored.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Data Sharing */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Data Sharing and Third-Party Access</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Your email data is treated with the highest level of confidentiality:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">No Selling or Renting:</strong> We will never sell, rent, or trade your email data to third parties under any circumstances.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">No Advertising Use:</strong> We do not use your email data for advertising purposes, either on our platform or for third-party advertising networks.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">No Third-Party Applications:</strong> We do not allow third-party applications or services to access your email data through our platform.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Service Provider Access:</strong> The only exception is our infrastructure providers (e.g., cloud hosting, database services) who may have technical access to encrypted data as part of providing core infrastructure services. These providers are bound by strict confidentiality agreements and data protection obligations.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Data Retention */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Data Retention for Email Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We retain email-related data according to the following policies:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Active Account:</strong> SMTP credentials are retained as long as your Mailfra account is active and you have not revoked email access.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Campaign Metadata:</strong> Email metadata (recipient, subject, timestamps, delivery metrics) is retained for up to 24 months after campaign completion for analytics and reporting purposes.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Upon Revocation:</strong> When you revoke email access, we immediately stop accessing your email and delete all stored credentials within 24 hours.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Account Deletion:</strong> When you delete your Mailfra account, all email-related data including credentials and campaign metadata is permanently deleted within 30 days.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Your Control */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Your Control Over Email Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      You maintain complete control over your email data at all times:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Revoke Access Anytime:</strong> You can disconnect your email account from Mailfra at any time through your account settings.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Data Export:</strong> You can request an export of your campaign data, including metadata about emails sent through Mailfra, by contacting our support team.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Data Deletion:</strong> You can request deletion of all your email-related data by contacting privacy@mailfra.com. We will process your request within 30 days.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Security Measures */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Security Measures for Email Data</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      We implement comprehensive security measures for email data protection:
                    </p>
                    <ul className="space-y-3 text-muted-foreground ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Encrypted Transmission:</strong> All SMTP communications use TLS 1.3 encryption to protect data in transit.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Encrypted Credential Storage:</strong> SMTP credentials are encrypted using AES-256 encryption before storage in our database.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Regular Security Audits:</strong> We conduct regular security audits and vulnerability assessments of our SMTP integration.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span><strong className="text-foreground">Access Controls:</strong> Only authorized personnel have access to systems handling email credentials.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section id="how-we-use" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We use the information we collect for various purposes, including:</p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Providing, operating, and maintaining our Services</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Improving and personalizing your experience</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Processing transactions and sending related information</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Sending marketing and promotional communications (with your consent)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Responding to your inquiries and providing customer support</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Analyzing usage patterns and trends to improve our Services</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Detecting, preventing, and addressing fraud, abuse, and security issues</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Complying with applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Data Sharing</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We may share your information with third parties in the following circumstances:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Service Providers:</strong> We share information with service providers who assist us in operating our website, conducting our business, or providing services to you.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Legal Requirements:</strong> We may disclose your information if required by law or if we believe in good faith that disclosure is necessary to comply with legal obligations.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Business Transfers:</strong> If Mailfra is involved in a merger, acquisition, bankruptcy, or sale of assets, your information may be transferred as part of that transaction.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">With Your Consent:</strong> We may share your information with third parties when we have your explicit consent to do so.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Data Retention */}
              <section id="data-retention" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Data Retention</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We retain your personal information for as long as necessary to provide our Services and fulfill the purposes outlined in this Privacy Policy. The retention period may vary depending on the type of information and the purpose for which we use it:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Account Information:</strong> Retained while your account is active and for a reasonable period afterward for backup and legal purposes.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Campaign Data:</strong> Retained for up to 24 months after campaign completion for analytics purposes.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Payment Information:</strong> Retained for the duration of your subscription and as required by law for tax and accounting purposes.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Marketing Data:</strong> Retained until you unsubscribe from our communications.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Your Rights</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Depending on your location and applicable laws, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Right to Access:</strong> You have the right to request and obtain a copy of the personal information we hold about you.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Right to Correction:</strong> You have the right to request that we correct or update inaccurate personal information.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Right to Deletion:</strong> You have the right to request deletion of your personal information under certain circumstances.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Right to Portability:</strong> You have the right to obtain your personal information in a structured, commonly used format and transfer it to another service.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Right to Object:</strong> You have the right to object to processing of your personal information for certain purposes.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Security */}
              <section id="security" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Security</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We implement comprehensive security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our security measures include:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Encryption of data in transit and at rest using industry-standard protocols</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Secure access controls and authentication mechanisms</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Regular security audits and vulnerability assessments</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Employee access controls and confidentiality agreements</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Incident response procedures for data breaches</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    While we implement strong security measures, no system is 100% secure. We cannot guarantee absolute security of your information. However, we are committed to maintaining reasonable and appropriate security practices.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section id="cookies" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Cookies</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on our Services. Cookies are small text files stored on your device that allow us to recognize you and remember your preferences.
                  </p>
                  <p>
                    <strong className="text-foreground">Types of Cookies We Use:</strong>
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Essential Cookies:</strong> Required for the functionality of our Services</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Performance Cookies:</strong> Help us analyze how you use our Services</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Functionality Cookies:</strong> Remember your preferences and settings</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span><strong className="text-foreground">Marketing Cookies:</strong> Track your activity for marketing purposes</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    You can control cookie preferences through your browser settings or by opting out of certain cookies through our cookie consent tool.
                  </p>
                </div>
              </section>

              {/* International Data Transfers */}
              <section id="international-transfers" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">International Data Transfers</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Our Services may be accessed from various countries. Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country.
                  </p>
                  <p>
                    When we transfer information internationally, we implement appropriate safeguards such as Standard Contractual Clauses and other mechanisms required by applicable data protection laws to ensure your information remains protected.
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section id="children-privacy" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Children's Privacy</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Our Services are not directed to children under the age of 13 (or the applicable age of digital consent in your jurisdiction). We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete such information promptly.
                  </p>
                  <p>
                    If you believe we have collected information from a child without parental consent, please contact us immediately at privacy@mailfra.com.
                  </p>
                </div>
              </section>

              {/* California Privacy Rights */}
              <section id="california-rights" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">California Privacy Rights</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Right to know what personal information is collected, used, and shared</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Right to delete personal information collected from you</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Right to opt-out of the sale or sharing of your personal information</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Right to limit use and disclosure of sensitive personal information</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>Right to non-discrimination for exercising your rights</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    To exercise these rights, please contact us at privacy@mailfra.com or through your account settings.
                  </p>
                </div>
              </section>

              {/* Changes to This Policy */}
              <section id="changes" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Changes to This Policy</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by updating the "Last Updated" date at the top of this policy and, if necessary, by providing additional notice (such as through email or a prominent announcement on our website).
                  </p>
                  <p>
                    Your continued use of our Services after any changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact" className="scroll-mt-32">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you have questions about this Privacy Policy, our privacy practices, or how we handle your personal information, please contact us at:
                  </p>
                  <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <a href="mailto:privacy@mailfra.com" className="text-primary hover:underline">
                        privacy@mailfra.com
                      </a>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Mailing Address</p>
                      <p>Mailfra, Inc.<br />Privacy Department<br />Your Address Here</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Data Protection Officer</p>
                      <p>For GDPR-related inquiries, contact our Data Protection Officer at privacy@mailfra.com</p>
                    </div>
                  </div>
                  <p>
                    We will respond to your inquiry within 30 days or as required by applicable law.
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
