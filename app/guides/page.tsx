// "use client"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, BookOpen, Clock, Download, ChevronRight, CheckCircle2 } from "lucide-react"
// import { PageHeader } from "@/components/shared/page-header"
// import { PageFooter } from "@/components/shared/page-footer"

// const guides = [
//   {
//     slug: "cold-email-masterclass",
//     title: "Cold Email Masterclass",
//     description: "Everything you need to know about cold email, from first principles to advanced strategies.",
//     chapters: 12,
//     readTime: "2 hours",
//     difficulty: "Beginner to Advanced",
//     image: "/images/guides/cold-email-masterclass.jpg",
//     color: "from-blue-500/20 to-purple-500/20",
//     featured: true,
//     tableOfContents: [
//       { title: "Introduction to Cold Email", duration: "8 min" },
//       { title: "Building Your Prospect List", duration: "12 min" },
//       { title: "Email Authentication Setup", duration: "10 min" },
//       { title: "Domain & Inbox Strategy", duration: "15 min" },
//       { title: "Writing Compelling Subject Lines", duration: "10 min" },
//       { title: "Crafting the Perfect Opening", duration: "8 min" },
//       { title: "The Art of Personalization", duration: "12 min" },
//       { title: "Call-to-Actions That Convert", duration: "8 min" },
//       { title: "Follow-Up Sequences", duration: "15 min" },
//       { title: "A/B Testing Methodology", duration: "10 min" },
//       { title: "Scaling Your Outreach", duration: "12 min" },
//       { title: "Measuring & Optimizing", duration: "10 min" },
//     ],
//   },
//   {
//     slug: "deliverability-deep-dive",
//     title: "Deliverability Deep Dive",
//     description: "Master email deliverability with technical guides on authentication, warmup, and inbox placement.",
//     chapters: 8,
//     readTime: "90 min",
//     difficulty: "Intermediate",
//     image: "/images/guides/deliverability.jpg",
//     color: "from-green-500/20 to-emerald-500/20",
//     featured: false,
//     tableOfContents: [
//       { title: "Understanding Deliverability", duration: "10 min" },
//       { title: "SPF Configuration", duration: "12 min" },
//       { title: "DKIM Setup Guide", duration: "12 min" },
//       { title: "DMARC Implementation", duration: "10 min" },
//       { title: "Email Warmup Strategy", duration: "15 min" },
//       { title: "Inbox Rotation Tactics", duration: "12 min" },
//       { title: "Avoiding Spam Filters", duration: "10 min" },
//       { title: "Monitoring & Troubleshooting", duration: "9 min" },
//     ],
//   },
//   {
//     slug: "agency-growth-playbook",
//     title: "Agency Growth Playbook",
//     description: "Scale your agency with proven cold outreach strategies used by top-performing teams.",
//     chapters: 10,
//     readTime: "2 hours",
//     difficulty: "Intermediate",
//     image: "/images/guides/agency-playbook.jpg",
//     color: "from-orange-500/20 to-red-500/20",
//     featured: false,
//     tableOfContents: [
//       { title: "Agency Outreach Fundamentals", duration: "10 min" },
//       { title: "Defining Your ICP", duration: "12 min" },
//       { title: "Multi-Channel Approach", duration: "15 min" },
//       { title: "White-Label Cold Email", duration: "10 min" },
//       { title: "Client Onboarding Process", duration: "12 min" },
//       { title: "Managing Multiple Campaigns", duration: "15 min" },
//       { title: "Reporting & Analytics", duration: "10 min" },
//       { title: "Pricing Your Services", duration: "8 min" },
//       { title: "Scaling Operations", duration: "15 min" },
//       { title: "Case Studies & Examples", duration: "13 min" },
//     ],
//   },
//   {
//     slug: "b2b-sales-automation",
//     title: "B2B Sales Automation",
//     description: "Automate your entire sales pipeline from prospecting to booking meetings.",
//     chapters: 7,
//     readTime: "75 min",
//     difficulty: "Advanced",
//     image: "/images/guides/sales-automation.jpg",
//     color: "from-purple-500/20 to-pink-500/20",
//     featured: false,
//     tableOfContents: [
//       { title: "Sales Automation Overview", duration: "8 min" },
//       { title: "CRM Integration Setup", duration: "12 min" },
//       { title: "Lead Scoring Models", duration: "10 min" },
//       { title: "Trigger-Based Sequences", duration: "15 min" },
//       { title: "Meeting Scheduling Automation", duration: "10 min" },
//       { title: "Handoff to Sales Team", duration: "10 min" },
//       { title: "Measuring ROI", duration: "10 min" },
//     ],
//   },
// ]

// export default function GuidesPage() {
//   const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
//   const [visibleCards, setVisibleCards] = useState<number[]>([])
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([])

//   const featuredGuide = guides.find((g) => g.featured)
//   const otherGuides = guides.filter((g) => !g.featured)

//   useEffect(() => {
//     const observers: IntersectionObserver[] = []

//     cardRefs.current.forEach((ref, index) => {
//       if (ref) {
//         const observer = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               setVisibleCards((prev) => [...new Set([...prev, index])])
//             }
//           },
//           { threshold: 0.1 },
//         )
//         observer.observe(ref)
//         observers.push(observer)
//       }
//     })

//     return () => observers.forEach((obs) => obs.disconnect())
//   }, [])

//   return (
//     <main className="min-h-screen bg-white">
//       <PageHeader />

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center text-center mb-16">
//             <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">Learning Center</span>
//             <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">In-Depth Guides</h1>
//             <p className="text-lg text-neutral-600 max-w-2xl">
//               Comprehensive, step-by-step guides to master every aspect of cold outreach. From beginner fundamentals to
//               advanced strategies.
//             </p>
//           </div>

//           {/* Featured Guide */}
//           {featuredGuide && (
//             <div className="relative rounded-3xl overflow-hidden bg-neutral-900 mb-20">
//               <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-transparent z-10" />
//               <Image
//                 src={featuredGuide.image || "/placeholder.svg"}
//                 alt={featuredGuide.title}
//                 fill
//                 className="object-cover opacity-50"
//               />
//               <div className="relative z-20 grid md:grid-cols-2 gap-8 p-8 md:p-16">
//                 <div className="flex flex-col justify-center">
//                   <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white/80 w-fit mb-6">
//                     Most Popular
//                   </span>
//                   <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredGuide.title}</h2>
//                   <p className="text-neutral-400 text-lg mb-8">{featuredGuide.description}</p>
//                   <div className="flex flex-wrap items-center gap-6 mb-8">
//                     <div className="flex items-center gap-2 text-neutral-300">
//                       <BookOpen className="w-5 h-5" />
//                       <span>{featuredGuide.chapters} Chapters</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-neutral-300">
//                       <Clock className="w-5 h-5" />
//                       <span>{featuredGuide.readTime}</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-4">
//                     <Link
//                       href={`/guides/${featuredGuide.slug}`}
//                       className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors"
//                     >
//                       Start Reading
//                       <ArrowRight className="w-4 h-4" />
//                     </Link>
//                     <button className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
//                       <Download className="w-4 h-4" />
//                       Download PDF
//                     </button>
//                   </div>
//                 </div>

//                 {/* Table of Contents Preview */}
//                 <div className="hidden md:block">
//                   <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//                     <h3 className="text-white font-semibold mb-4">Table of Contents</h3>
//                     <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
//                       {featuredGuide.tableOfContents.map((chapter, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
//                         >
//                           <div className="flex items-center gap-3">
//                             <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs text-white/60">
//                               {index + 1}
//                             </span>
//                             <span className="text-white/80 text-sm">{chapter.title}</span>
//                           </div>
//                           <span className="text-white/40 text-xs">{chapter.duration}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Other Guides */}
//       <section className="py-16 px-6">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-2xl font-bold text-neutral-900 mb-12">All Guides</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {otherGuides.map((guide, index) => (
//               <div
//                 key={guide.slug}
//                 ref={(el) => {
//                   cardRefs.current[index] = el
//                 }}
//                 className={`transition-all duration-700 ${
//                   visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                 }`}
//                 style={{ transitionDelay: `${index * 100}ms` }}
//               >
//                 <div className="group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-xl transition-all duration-300">
//                   <div
//                     className={`absolute inset-0 bg-gradient-to-br ${guide.color} opacity-0 group-hover:opacity-100 transition-opacity`}
//                   />

//                   <div className="relative">
//                     <div className="relative aspect-[16/9] overflow-hidden">
//                       <Image
//                         src={guide.image || "/placeholder.svg"}
//                         alt={guide.title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                       <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
//                         <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium text-white">
//                           {guide.difficulty}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="p-6">
//                       <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
//                         {guide.title}
//                       </h3>
//                       <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{guide.description}</p>

//                       <div className="flex items-center gap-4 mb-6 text-sm text-neutral-400">
//                         <span className="flex items-center gap-1">
//                           <BookOpen className="w-4 h-4" />
//                           {guide.chapters} chapters
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-4 h-4" />
//                           {guide.readTime}
//                         </span>
//                       </div>

//                       {/* Expandable TOC */}
//                       <button
//                         onClick={() => setExpandedGuide(expandedGuide === guide.slug ? null : guide.slug)}
//                         className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
//                       >
//                         <ChevronRight
//                           className={`w-4 h-4 transition-transform ${expandedGuide === guide.slug ? "rotate-90" : ""}`}
//                         />
//                         View chapters
//                       </button>

//                       <div
//                         className={`overflow-hidden transition-all duration-300 ${
//                           expandedGuide === guide.slug ? "max-h-96 mt-4" : "max-h-0"
//                         }`}
//                       >
//                         <div className="space-y-2 pt-4 border-t border-neutral-100">
//                           {guide.tableOfContents.slice(0, 5).map((chapter, i) => (
//                             <div key={i} className="flex items-center gap-2 text-sm text-neutral-500">
//                               <CheckCircle2 className="w-3 h-3 text-neutral-300" />
//                               {chapter.title}
//                             </div>
//                           ))}
//                           {guide.tableOfContents.length > 5 && (
//                             <p className="text-xs text-neutral-400 pl-5">
//                               +{guide.tableOfContents.length - 5} more chapters
//                             </p>
//                           )}
//                         </div>
//                       </div>

//                       <Link
//                         href={`/guides/${guide.slug}`}
//                         className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
//                       >
//                         Start Guide
//                         <ArrowRight className="w-4 h-4" />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Request a Guide */}
//       <section className="py-24 px-6 bg-neutral-50">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
//             Don&apos;t see what you&apos;re looking for?
//           </h2>
//           <p className="text-neutral-600 text-lg mb-10">
//             We&apos;re constantly creating new guides. Let us know what topics you&apos;d like us to cover next.
//           </p>
//           <button className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
//             Request a Guide
//             <ArrowRight className="w-4 h-4" />
//           </button>
//         </div>
//       </section>

//       <PageFooter />
//     </main>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Clock, Download, ChevronRight, CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { getAllGuides, getFeaturedGuide, Guide } from "@/lib/guides-data"

export default function GuidesPage() {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Get guides from centralized data
  const allGuides = getAllGuides()
  const featuredGuide = getFeaturedGuide()
  const otherGuides = allGuides.filter((g) => !g.featured)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => [...new Set([...prev, index])])
            }
          },
          { threshold: 0.1 },
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">Learning Center</span>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">In-Depth Guides</h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Comprehensive, step-by-step guides to master every aspect of cold outreach. From beginner fundamentals to
              advanced strategies.
            </p>
          </div>

          {/* Featured Guide */}
          {featuredGuide && (
            <div className="relative rounded-3xl overflow-hidden bg-neutral-900 mb-20">
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/95 to-transparent z-10" />
              <Image
                src={featuredGuide.image || "/placeholder.svg"}
                alt={featuredGuide.title}
                fill
                className="object-cover opacity-50"
              />
              <div className="relative z-20 grid md:grid-cols-2 gap-8 p-8 md:p-16">
                <div className="flex flex-col justify-center">
                  <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white/80 w-fit mb-6">
                    Most Popular
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{featuredGuide.title}</h2>
                  <p className="text-neutral-400 text-lg mb-8">{featuredGuide.description}</p>
                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <BookOpen className="w-5 h-5" />
                      <span>{featuredGuide.chapters} Chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Clock className="w-5 h-5" />
                      <span>{featuredGuide.readTime} min</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href={`/guides/${featuredGuide.slug}`}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors"
                    >
                      Start Reading
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>

                {/* Table of Contents Preview */}
                <div className="hidden md:block">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4">Table of Contents</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {featuredGuide.tableOfContents.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full text-xs text-white/60">
                              {index + 1}
                            </span>
                            <span className="text-white/80 text-sm">{chapter.title}</span>
                          </div>
                          <span className="text-white/40 text-xs">{chapter.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Other Guides */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-12">All Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherGuides.map((guide, index) => (
              <div
                key={guide.slug}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-xl transition-all duration-300">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${guide.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={guide.image || "/placeholder.svg"}
                        alt={guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium text-white">
                          {guide.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{guide.description}</p>

                      <div className="flex items-center gap-4 mb-6 text-sm text-neutral-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {guide.chapters} chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {guide.readTime} min
                        </span>
                      </div>

                      {/* Expandable TOC */}
                      <button
                        onClick={() => setExpandedGuide(expandedGuide === guide.slug ? null : guide.slug)}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedGuide === guide.slug ? "rotate-90" : ""}`}
                        />
                        View chapters
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedGuide === guide.slug ? "max-h-96 mt-4" : "max-h-0"
                        }`}
                      >
                        <div className="space-y-2 pt-4 border-t border-neutral-100">
                          {guide.tableOfContents.slice(0, 5).map((chapter) => (
                            <div key={chapter.id} className="flex items-center gap-2 text-sm text-neutral-500">
                              <CheckCircle2 className="w-3 h-3 text-neutral-300" />
                              {chapter.title}
                            </div>
                          ))}
                          {guide.tableOfContents.length > 5 && (
                            <p className="text-xs text-neutral-400 pl-5">
                              +{guide.tableOfContents.length - 5} more chapters
                            </p>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/guides/${guide.slug}`}
                        className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Start Guide
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request a Guide */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Don&apos;t see what you&apos;re looking for?
          </h2>
          <p className="text-neutral-600 text-lg mb-10">
            We&apos;re constantly creating new guides. Let us know what topics you&apos;d like us to cover next.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
            Request a Guide
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}