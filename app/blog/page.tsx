// "use client"

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, Clock, Search, X } from "lucide-react"
// import { PageHeader } from "@/components/shared/page-header"
// import { PageFooter } from "@/components/shared/page-footer"

// const categories = [
//   { id: "all", name: "All Posts" },
//   { id: "deliverability", name: "Deliverability" },
//   { id: "cold-email", name: "Cold Email" },
//   { id: "growth", name: "Growth" },
//   { id: "case-studies", name: "Case Studies" },
//   { id: "product", name: "Product Updates" },
// ]

// const featuredPost = {
//   slug: "ultimate-guide-cold-email-2024",
//   title: "The Ultimate Guide to Cold Email in 2024: Everything You Need to Know",
//   excerpt:
//     "Master the art of cold outreach with our comprehensive guide covering deliverability, personalization, follow-ups, and scaling strategies that actually work.",
//   category: "cold-email",
//   author: {
//     name: "Simon M",
//     role: "Head of Growth",
//     avatar: "/images/blog/author-sarah.jpg",
//   },
//   date: "Dec 2, 2024",
//   readTime: "15 min read",
//   image: "/images/blog/featured-cold-email.jpg",
// }

// const posts = [
//   {
//     slug: "spf-dkim-dmarc-explained",
//     title: "SPF, DKIM & DMARC Explained: The Complete Authentication Guide",
//     excerpt:
//       "Learn how email authentication protocols work together to improve your deliverability and protect your domain.",
//     category: "deliverability",
//     author: { name: "Mike Roberts", avatar: "/images/blog/author-mike.jpg" },
//     date: "Nov 28, 2024",
//     readTime: "8 min read",
//     image: "/images/blog/auth-guide.jpg",
//   },
//   {
//     slug: "inbox-rotation-strategy",
//     title: "Inbox Rotation: How to 10x Your Sending Volume Without Getting Flagged",
//     excerpt: "Discover the science behind inbox rotation and how to implement it correctly for maximum deliverability.",
//     category: "deliverability",
//     author: { name: "Simon M", avatar: "/images/blog/author-sarah.jpg" },
//     date: "Nov 25, 2024",
//     readTime: "6 min read",
//     image: "/images/blog/inbox-rotation.jpg",
//   },
//   {
//     slug: "personalization-at-scale",
//     title: "Personalization at Scale: AI-Powered Approaches That Convert",
//     excerpt: "How to write personalized cold emails that feel human while reaching thousands of prospects.",
//     category: "cold-email",
//     author: { name: "Alex Kim", avatar: "/images/blog/author-alex.jpg" },
//     date: "Nov 22, 2024",
//     readTime: "7 min read",
//     image: "/images/blog/personalization.jpg",
//   },
//   {
//     slug: "cold-email-subject-lines",
//     title: "47 Cold Email Subject Lines That Actually Get Opened",
//     excerpt: "Data-driven subject line formulas tested across 10 million emails with real open rate statistics.",
//     category: "cold-email",
//     author: { name: "Jordan Lee", avatar: "/images/blog/author-jordan.jpg" },
//     date: "Nov 19, 2024",
//     readTime: "10 min read",
//     image: "/images/blog/subject-lines.jpg",
//   },
//   {
//     slug: "warmup-best-practices",
//     title: "Email Warmup Best Practices: From 0 to 100 Emails/Day",
//     excerpt: "The complete warmup schedule and strategy to safely ramp up your email sending volume.",
//     category: "deliverability",
//     author: { name: "Mike Roberts", avatar: "/images/blog/author-mike.jpg" },
//     date: "Nov 15, 2024",
//     readTime: "5 min read",
//     image: "/images/blog/warmup.jpg",
//   },
//   {
//     slug: "agency-case-study-techscale",
//     title: "How TechScale Agency Booked 847 Meetings in 90 Days",
//     excerpt: "An inside look at how one agency transformed their outreach with automated cold email campaigns.",
//     category: "case-studies",
//     author: { name: "Simon M", avatar: "/images/blog/author-sarah.jpg" },
//     date: "Nov 12, 2024",
//     readTime: "12 min read",
//     image: "/images/blog/case-techscale.jpg",
//   },
//   {
//     slug: "follow-up-sequences",
//     title: "The Perfect Follow-Up Sequence: Timing, Templates & Psychology",
//     excerpt: "Why 80% of deals are closed after the 5th follow-up and how to craft sequences that convert.",
//     category: "cold-email",
//     author: { name: "Alex Kim", avatar: "/images/blog/author-alex.jpg" },
//     date: "Nov 8, 2024",
//     readTime: "9 min read",
//     image: "/images/blog/follow-up.jpg",
//   },
//   {
//     slug: "email-deliverability-audit",
//     title: "How to Audit Your Email Deliverability in 30 Minutes",
//     excerpt: "A step-by-step checklist to identify and fix deliverability issues affecting your campaigns.",
//     category: "deliverability",
//     author: { name: "Jordan Lee", avatar: "/images/blog/author-jordan.jpg" },
//     date: "Nov 5, 2024",
//     readTime: "6 min read",
//     image: "/images/blog/audit.jpg",
//   },
//   {
//     slug: "scaling-outbound-team",
//     title: "Scaling Your Outbound Team: From Solo to 50 Reps",
//     excerpt: "Infrastructure, processes, and tools needed to scale cold outreach across growing teams.",
//     category: "growth",
//     author: { name: "Simon M", avatar: "/images/blog/author-sarah.jpg" },
//     date: "Nov 1, 2024",
//     readTime: "11 min read",
//     image: "/images/blog/scaling.jpg",
//   },
// ]

// export default function BlogPage() {
//   const [activeCategory, setActiveCategory] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [visiblePosts, setVisiblePosts] = useState<number[]>([])
//   const postRefs = useRef<(HTMLDivElement | null)[]>([])

//   const filteredPosts = posts.filter((post) => {
//     const matchesCategory = activeCategory === "all" || post.category === activeCategory
//     const matchesSearch =
//       post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
//     return matchesCategory && matchesSearch
//   })

//   useEffect(() => {
//     const observers: IntersectionObserver[] = []

//     postRefs.current.forEach((ref, index) => {
//       if (ref) {
//         const observer = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               setVisiblePosts((prev) => [...new Set([...prev, index])])
//             }
//           },
//           { threshold: 0.1 },
//         )
//         observer.observe(ref)
//         observers.push(observer)
//       }
//     })

//     return () => observers.forEach((obs) => obs.disconnect())
//   }, [filteredPosts])

//   return (
//     <main className="min-h-screen bg-white">
//       <PageHeader />

//       {/* Hero Section */}
//       <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col items-center text-center mb-12">
//             <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">The Mailfra Blog</span>
//             <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6 text-balance">
//               Insights for Modern
//               <br />
//               <span className="text-neutral-400">Cold Outreach</span>
//             </h1>
//             <p className="text-lg text-neutral-600 max-w-2xl">
//               Expert guides, strategies, and case studies to help you master cold email and scale your outbound
//               pipeline.
//             </p>
//           </div>

//           {/* Search Bar */}
//           <div className="max-w-xl mx-auto mb-12">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
//               <input
//                 type="text"
//                 placeholder="Search articles..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-12 py-4 bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Categories */}
//           <div className="flex flex-wrap justify-center gap-2 mb-16">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setActiveCategory(category.id)}
//                 className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
//                   activeCategory === category.id
//                     ? "bg-neutral-900 text-white"
//                     : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
//                 }`}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>

//           {/* Featured Post */}
//           {activeCategory === "all" && !searchQuery && (
//             <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
//               <div className="relative overflow-hidden rounded-3xl bg-neutral-900">
//                 <div className="grid md:grid-cols-2 gap-8">
//                   <div className="relative aspect-[4/3] md:aspect-auto">
//                     <Image
//                       src={featuredPost.image || "/placeholder.svg"}
//                       alt={featuredPost.title}
//                       fill
//                       className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
//                     />
//                   </div>
//                   <div className="flex flex-col justify-center p-8 md:p-12 md:pr-16">
//                     <span className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white/80 w-fit mb-6">
//                       Featured
//                     </span>
//                     <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-neutral-200 transition-colors">
//                       {featuredPost.title}
//                     </h2>
//                     <p className="text-neutral-400 mb-8 line-clamp-3">{featuredPost.excerpt}</p>
//                     <div className="flex items-center gap-4">
//                       <Image
//                         src={featuredPost.author.avatar || "/placeholder.svg"}
//                         alt={featuredPost.author.name}
//                         width={44}
//                         height={44}
//                         className="rounded-full"
//                       />
//                       <div>
//                         <p className="text-white font-medium">{featuredPost.author.name}</p>
//                         <p className="text-sm text-neutral-500">
//                           {featuredPost.date} · {featuredPost.readTime}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           )}
//         </div>
//       </section>

//       {/* Posts Grid */}
//       <section className="py-16 px-6">
//         <div className="max-w-7xl mx-auto">
//           {filteredPosts.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-neutral-500 text-lg">No articles found matching your search.</p>
//               <button
//                 onClick={() => {
//                   setSearchQuery("")
//                   setActiveCategory("all")
//                 }}
//                 className="mt-4 text-neutral-900 font-medium hover:underline"
//               >
//                 Clear filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredPosts.map((post, index) => (
//                 <div
//                   key={post.slug}
//                   ref={(el) => {
//                     postRefs.current[index] = el
//                   }}
//                   className={`transition-all duration-700 ${
//                     visiblePosts.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                   }`}
//                   style={{ transitionDelay: `${(index % 3) * 100}ms` }}
//                 >
//                   <Link href={`/blog/${post.slug}`} className="group block">
//                     <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-neutral-100">
//                       <Image
//                         src={post.image || "/placeholder.svg"}
//                         alt={post.title}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>
//                     <div className="flex items-center gap-3 mb-3">
//                       <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
//                         {categories.find((c) => c.id === post.category)?.name}
//                       </span>
//                       <span className="w-1 h-1 bg-neutral-300 rounded-full" />
//                       <span className="flex items-center gap-1 text-xs text-neutral-400">
//                         <Clock className="w-3 h-3" />
//                         {post.readTime}
//                       </span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors line-clamp-2">
//                       {post.title}
//                     </h3>
//                     <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
//                     <div className="flex items-center gap-3">
//                       <Image
//                         src={post.author.avatar || "/placeholder.svg"}
//                         alt={post.author.name}
//                         width={32}
//                         height={32}
//                         className="rounded-full"
//                       />
//                       <span className="text-sm text-neutral-600">{post.author.name}</span>
//                       <span className="text-sm text-neutral-400 ml-auto">{post.date}</span>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Load More */}
//           {filteredPosts.length >= 9 && (
//             <div className="flex justify-center mt-16">
//               <button className="group flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
//                 Load More Articles
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Newsletter Section */}
//       <section className="py-24 px-6 bg-neutral-900">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Get weekly cold email tips</h2>
//           <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
//             Join 15,000+ sales professionals receiving actionable insights to improve their outreach every week.
//           </p>
//           <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/50"
//             />
//             <button
//               type="submit"
//               className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors whitespace-nowrap"
//             >
//               Subscribe
//             </button>
//           </form>
//           <p className="text-xs text-neutral-600 mt-4">No spam, unsubscribe anytime.</p>
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
import { ArrowRight, Clock, Search, X, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { blogPosts } from "@/lib/blog-data"

const categories = [
  { id: "all", name: "All Posts" },
  { id: "deliverability", name: "Deliverability" },
  { id: "cold-email", name: "Cold Email" },
  { id: "growth", name: "Growth" },
  { id: "ai-personalization", name: "AI & Personalization" },
  { id: "strategy", name: "Strategy" },
]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [visiblePosts, setVisiblePosts] = useState<number[]>([])
  const postRefs = useRef<(HTMLDivElement | null)[]>([])

  const featuredPost = blogPosts[0]
  const posts = blogPosts.slice(1)

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    postRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisiblePosts((prev) => [...new Set([...prev, index])])
            }
          },
          { threshold: 0.1 },
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [filteredPosts])

  return (
    <main className="min-h-screen bg-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-lime-50 border border-lime-200 rounded-full text-sm font-medium text-lime-900 mb-6">
              <TrendingUp className="w-4 h-4" />
              Expert insights on cold outreach
            </span>
            <h1 className="font-[family-name:var(--font-crimson)] text-5xl md:text-7xl font-bold text-neutral-900 mb-6 text-balance leading-[1.1]">
              The Mailfra Blog
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
              Master cold email, deliverability, and revenue growth with expert guides by Cashe
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-14 py-5 bg-white border-2 border-neutral-200 rounded-2xl text-neutral-900 text-lg placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {activeCategory === "all" && !searchQuery && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[family-name:var(--font-crimson)] text-3xl font-bold text-neutral-900">Featured</h2>
              </div>

              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
                  <div className="grid lg:grid-cols-[1.2fr,1fr] gap-0">
                    <div className="relative aspect-[16/10] lg:aspect-auto min-h-[400px]">
                      <Image
                        src={featuredPost.image || "/placeholder.svg"}
                        alt={featuredPost.title}
                        fill
                        className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent lg:hidden" />
                    </div>
                    <div className="flex flex-col justify-center p-8 lg:p-12 lg:pr-16">
                      <span className="inline-flex items-center px-4 py-2 bg-lime-400 text-neutral-900 rounded-full text-sm font-bold w-fit mb-6 shadow-lg">
                        ⭐ Featured Article
                      </span>
                      <h3 className="font-[family-name:var(--font-crimson)] text-3xl lg:text-4xl font-bold text-white mb-5 group-hover:text-lime-200 transition-colors leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="text-neutral-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <Image
                          src={featuredPost.author.avatar || "/placeholder.svg"}
                          alt={featuredPost.author.name}
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-white/20"
                        />
                        <div>
                          <p className="text-white font-semibold">{featuredPost.author.name}</p>
                          <p className="text-sm text-neutral-400 flex items-center gap-2">
                            {featuredPost.date} <span className="w-1 h-1 rounded-full bg-neutral-600" />{" "}
                            {featuredPost.readTime}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white ml-auto group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-lg">No articles found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("all")
                }}
                className="mt-4 text-neutral-900 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.slug}
                  ref={(el) => {
                    postRefs.current[index] = el
                  }}
                  className={`transition-all duration-700 ${
                    visiblePosts.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  } ${index === 0 || index === 3 ? "md:col-span-2 lg:col-span-1" : ""}`}
                  style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-neutral-100 hover:border-neutral-900 transition-all duration-300 hover:shadow-xl overflow-hidden">
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-1 flex flex-col p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                            {categories.find((c) => c.id === post.category)?.name}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-bold text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-neutral-600 text-base line-clamp-3 mb-5 leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                          <Image
                            src={post.author.avatar || "/placeholder.svg"}
                            alt={post.author.name}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-neutral-900">{post.author.name}</p>
                            <p className="text-xs text-neutral-500">{post.date}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredPosts.length >= 9 && (
            <div className="flex justify-center mt-16">
              <button className="group flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors">
                Load More Articles
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Get weekly cold email tips</h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
            Join 15,000+ sales professionals receiving actionable insights to improve their outreach every week.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-neutral-600 mt-4">No spam, unsubscribe anytime.</p>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
