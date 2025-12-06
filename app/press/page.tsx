"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Download, ExternalLink, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const pressReleases = [
  {
    date: "November 15, 2024",
    title: "Mailfra Raises $25M Series A to Transform Cold Email",
    excerpt: "Funding led by Sequoia Capital will accelerate AI development and global expansion.",
    link: "#",
    featured: true,
    image: "/images/press/series-a.jpg",
  },
  {
    date: "September 3, 2024",
    title: "Mailfra Surpasses 50,000 Active Users",
    excerpt: "Milestone achieved just 18 months after public launch.",
    link: "#",
    image: "/images/press/50k-users.jpg",
  },
  {
    date: "June 12, 2024",
    title: "Introducing AI Subject Line Generator",
    excerpt: "New feature uses machine learning to write subject lines that get 2x more opens.",
    link: "#",
    image: "/images/press/ai-launch.jpg",
  },
  {
    date: "March 28, 2024",
    title: "Mailfra Opens London Office",
    excerpt: "European expansion to serve growing customer base across EMEA.",
    link: "#",
    image: "/images/press/london.jpg",
  },
  {
    date: "January 10, 2024",
    title: "Mailfra Named to Forbes Cloud 100 Rising Stars",
    excerpt: "Recognition as one of the top private cloud companies to watch.",
    link: "#",
    image: "/images/press/forbes.jpg",
  },
]

const mediaKit = [
  {
    title: "Logo Package",
    description: "All logo variants in PNG, SVG, and EPS formats",
    size: "2.4 MB",
    file: "/downloads/mailfra-logos.zip",
  },
  {
    title: "Brand Guidelines",
    description: "Complete brand style guide with colors, typography, and usage",
    size: "8.1 MB",
    file: "/downloads/brand-guidelines.pdf",
  },
  {
    title: "Product Screenshots",
    description: "High-resolution screenshots of key product features",
    size: "15.6 MB",
    file: "/downloads/screenshots.zip",
  },
  {
    title: "Executive Headshots",
    description: "Professional photos of leadership team",
    size: "12.3 MB",
    file: "/downloads/headshots.zip",
  },
  {
    title: "Company Fact Sheet",
    description: "Key stats, milestones, and company information",
    size: "1.2 MB",
    file: "/downloads/fact-sheet.pdf",
  },
]

const coverage = [
  {
    publication: "TechCrunch",
    logo: "/images/press/techcrunch.jpg",
    headline: "Mailfra is fixing cold email's spam problem",
    date: "Nov 2024",
    link: "#",
  },
  {
    publication: "Forbes",
    logo: "/images/press/forbes-logo.jpg",
    headline: "The Startup Making Sales Teams 10x More Productive",
    date: "Oct 2024",
    link: "#",
  },
  {
    publication: "VentureBeat",
    logo: "/images/press/venturebeat.jpg",
    headline: "How AI is revolutionizing B2B outreach",
    date: "Sep 2024",
    link: "#",
  },
  {
    publication: "SaaStr",
    logo: "/images/press/saastr.jpg",
    headline: "Mailfra: From 0 to $10M ARR in 24 months",
    date: "Aug 2024",
    link: "#",
  },
]

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "100M+", label: "Emails/Month" },
  { value: "98.7%", label: "Deliverability" },
  { value: "$29M", label: "Total Funding" },
]

export default function PressPage() {
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

      {/* Hero Section */}
      <section className="py-32 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1
                id="hero-title"
                data-animate
                className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${
                  visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Press &<br />
                Media
              </h1>
              <p
                id="hero-subtitle"
                data-animate
                className={`text-xl text-white/60 mb-8 transition-all duration-1000 delay-200 ${
                  visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                Get the latest news, announcements, and resources about Mailfra. For press inquiries, reach out to our
                media team.
              </p>
              <div
                id="hero-cta"
                data-animate
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-300 ${
                  visibleSections.has("hero-cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Mail className="mr-2 w-4 h-4" /> Contact Press Team
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 bg-transparent">
                  <Download className="mr-2 w-4 h-4" /> Download Media Kit
                </Button>
              </div>
            </div>

            <div
              id="hero-stats"
              data-animate
              className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-400 ${
                visibleSections.has("hero-stats") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="featured-title"
            data-animate
            className={`text-3xl font-bold mb-12 transition-all duration-700 ${
              visibleSections.has("featured-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Latest Announcement
          </h2>

          <div
            id="featured-card"
            data-animate
            className={`group relative overflow-hidden rounded-3xl transition-all duration-1000 ${
              visibleSections.has("featured-card") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="aspect-[21/9] relative">
              <Image
                src={pressReleases[0].image || "/placeholder.svg"}
                alt={pressReleases[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-center gap-2 text-white/60 mb-4">
                <Calendar className="w-4 h-4" />
                {pressReleases[0].date}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 max-w-3xl">{pressReleases[0].title}</h3>
              <p className="text-lg text-white/70 mb-6 max-w-2xl">{pressReleases[0].excerpt}</p>
              <Button className="bg-white text-black hover:bg-white/90">
                Read Full Release <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="releases-title"
            data-animate
            className={`text-3xl font-bold mb-12 transition-all duration-700 ${
              visibleSections.has("releases-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Press Releases
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {pressReleases.slice(1).map((release, index) => (
              <Link
                key={release.title}
                href={release.link}
                id={`release-${index}`}
                data-animate
                className={`group block overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 ${
                  visibleSections.has(`release-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video relative">
                  <Image
                    src={release.image || "/placeholder.svg"}
                    alt={release.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-white/50 mb-2">{release.date}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-white/80 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-white/60">{release.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="coverage-title"
            data-animate
            className={`text-3xl font-bold mb-12 transition-all duration-700 ${
              visibleSections.has("coverage-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            In the News
          </h2>

          <div className="space-y-4">
            {coverage.map((item, index) => (
              <a
                key={item.headline}
                href={item.link}
                id={`coverage-${index}`}
                data-animate
                className={`group flex items-center gap-6 p-6 border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/[0.02] transition-all duration-500 ${
                  visibleSections.has(`coverage-${index}`) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-12 relative flex-shrink-0 bg-white/10 rounded-lg overflow-hidden">
                  <Image
                    src={item.logo || "/placeholder.svg"}
                    alt={item.publication}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white/50 mb-1">
                    {item.publication} &middot; {item.date}
                  </div>
                  <h3 className="text-lg font-medium truncate group-hover:text-white/80 transition-colors">
                    {item.headline}
                  </h3>
                </div>

                <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              id="mediakit-title"
              data-animate
              className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
                visibleSections.has("mediakit-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Media Kit
            </h2>
            <p
              id="mediakit-subtitle"
              data-animate
              className={`text-xl text-white/60 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
                visibleSections.has("mediakit-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              Download official Mailfra assets for your publication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaKit.map((item, index) => (
              <div
                key={item.title}
                id={`kit-${index}`}
                data-animate
                className={`group p-6 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-500 ${
                  visibleSections.has(`kit-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">{item.size}</span>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="contact-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
              visibleSections.has("contact-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Press Inquiries
          </h2>
          <p
            id="contact-text"
            data-animate
            className={`text-xl text-white/60 mb-10 transition-all duration-700 delay-100 ${
              visibleSections.has("contact-text") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            For interviews, quotes, or additional information, contact our press team at{" "}
            <a href="mailto:press@mailfra.io" className="text-white underline hover:no-underline">
              press@mailfra.io
            </a>
          </p>
          <Button size="lg" className="bg-white text-black hover:bg-white/90">
            <Mail className="mr-2 w-4 h-4" /> Contact Press Team
          </Button>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
