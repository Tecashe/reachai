"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const team = [
  {
    name: "Alex Chen",
    role: "Co-founder & CEO",
    image: "/images/team/alex-chen.jpg",
    bio: "Former VP of Sales at Salesforce. 15+ years in B2B sales.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sarah Mitchell",
    role: "Co-founder & CTO",
    image: "/images/team/sarah-mitchell.jpg",
    bio: "Ex-Google engineer. Built email infrastructure at scale.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marcus Johnson",
    role: "VP of Engineering",
    image: "/images/team/marcus-johnson.jpg",
    bio: "Previously led engineering at Mailchimp for 8 years.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Emily Rodriguez",
    role: "VP of Product",
    image: "/images/team/emily-rodriguez.jpg",
    bio: "Product leader from HubSpot. Passionate about UX.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Kim",
    role: "VP of Sales",
    image: "/images/team/david-kim.jpg",
    bio: "Built and scaled sales teams at 3 unicorn startups.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Jessica Wang",
    role: "VP of Customer Success",
    image: "/images/team/jessica-wang.jpg",
    bio: "Customer-obsessed leader from Zendesk.",
    linkedin: "#",
    twitter: "#",
  },
]

const timeline = [
  {
    year: "2021",
    title: "The Beginning",
    description: "Founded in a garage in San Francisco with a mission to fix cold email forever.",
  },
  {
    year: "2022",
    title: "First 1,000 Users",
    description: "Launched publicly and hit our first major milestone. Raised $4M seed round.",
  },
  {
    year: "2023",
    title: "10M Emails Sent",
    description: "Crossed 10 million emails with 98%+ deliverability. Raised $25M Series A.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Opened offices in London and Singapore. 50,000+ active users worldwide.",
  },
  {
    year: "2025",
    title: "AI Revolution",
    description: "Launched AI-powered features and hit 100M emails/month. The journey continues.",
  },
]

const values = [
  {
    title: "Customer Obsession",
    description: "Every decision starts with the question: how does this help our customers succeed?",
  },
  {
    title: "Radical Transparency",
    description: "We share everything - our roadmap, our metrics, our challenges. No black boxes.",
  },
  {
    title: "Move Fast, Stay Stable",
    description: "We ship quickly but never compromise on reliability. Your emails must always land.",
  },
  {
    title: "Continuous Learning",
    description: "The email landscape evolves daily. We stay ahead through relentless experimentation.",
  },
]

const investors = [
  { name: "Sequoia Capital", logo: "/images/investors/sequoia.jpg" },
  { name: "Andreessen Horowitz", logo: "/images/investors/a16z.jpg" },
  { name: "Y Combinator", logo: "/images/investors/yc.jpg" },
  { name: "Accel", logo: "/images/investors/accel.jpg" },
]

export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [activeTimeline, setActiveTimeline] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

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
    const handleScroll = () => {
      if (!timelineRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, (window.innerHeight / 2 - rect.top) / rect.height))
      setActiveTimeline(Math.floor(progress * timeline.length))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      <PageHeader />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/about-hero.jpg" alt="Mailfra team" fill className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1
            id="hero-title"
            data-animate
            className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 transition-all duration-1000 ${
              visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            We&apos;re on a mission to fix cold email
          </h1>
          <p
            id="hero-subtitle"
            data-animate
            className={`text-xl md:text-2xl text-white/60 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
              visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Cold email is broken. Spam filters are smarter, inboxes are crowded, and getting through is harder than
            ever. We built Mailfra to change that.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                id="story-title"
                data-animate
                className={`text-4xl md:text-5xl font-bold mb-8 transition-all duration-700 ${
                  visibleSections.has("story-title") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                Our Story
              </h2>
              <div
                id="story-text"
                data-animate
                className={`space-y-6 text-lg text-white/70 transition-all duration-700 delay-200 ${
                  visibleSections.has("story-text") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                <p>
                  In 2021, our founders Alex and Sarah were running a sales consulting agency. They watched their
                  clients struggle daily with the same problem: emails weren&apos;t landing.
                </p>
                <p>
                  Deliverability was a black box. Tools were fragmented. And every month, more emails were hitting spam.
                  They knew there had to be a better way.
                </p>
                <p>
                  So they built it. Mailfra started as an internal tool, then became a product, and is now the platform
                  trusted by over 50,000 sales teams worldwide.
                </p>
              </div>
            </div>
            <div
              id="story-image"
              data-animate
              className={`relative aspect-square transition-all duration-1000 delay-300 ${
                visibleSections.has("story-image") ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <Image
                src="/images/about-founders.jpg"
                alt="Mailfra founders"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="timeline-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-20 transition-all duration-700 ${
              visibleSections.has("timeline-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our Journey
          </h2>

          <div ref={timelineRef} className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
            <div
              className="absolute left-1/2 top-0 w-px bg-white -translate-x-1/2 transition-all duration-500"
              style={{ height: `${(activeTimeline / (timeline.length - 1)) * 100}%` }}
            />

            {timeline.map((item, index) => (
              <div
                key={item.year}
                id={`timeline-${index}`}
                data-animate
                className={`relative flex items-center mb-24 last:mb-0 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } transition-all duration-700 ${
                  visibleSections.has(`timeline-${index}`) ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-16 text-right" : "pl-16 text-left"}`}>
                  <span className="text-6xl font-bold text-white/10">{item.year}</span>
                  <h3 className="text-2xl font-semibold mt-2 mb-3">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>

                {/* Timeline dot */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                    index <= activeTimeline ? "bg-white border-white scale-125" : "bg-black border-white/30"
                  }`}
                />

                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            id="values-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("values-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Our Values
          </h2>
          <p
            id="values-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("values-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            The principles that guide everything we do
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                id={`value-${index}`}
                data-animate
                className={`group p-8 border border-white/10 rounded-2xl hover:border-white/30 hover:bg-white/[0.02] transition-all duration-500 ${
                  visibleSections.has(`value-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl font-bold text-white/10 mb-4 group-hover:text-white/20 transition-colors">
                  0{index + 1}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="team-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${
              visibleSections.has("team-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Meet the Team
          </h2>
          <p
            id="team-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("team-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            World-class talent from companies you know and trust
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                id={`team-${index}`}
                data-animate
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                  visibleSections.has(`team-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-white/60 mb-2">{member.role}</p>
                  <p className="text-sm text-white/40 mb-4">{member.bio}</p>

                  <div className="flex gap-3">
                    <a
                      href={member.linkedin}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.twitter}
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/careers">
              <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 bg-transparent">
                Join the Team <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="investors-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
              visibleSections.has("investors-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Backed by the Best
          </h2>
          <p
            id="investors-subtitle"
            data-animate
            className={`text-xl text-white/60 mb-16 transition-all duration-700 delay-100 ${
              visibleSections.has("investors-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            $29M raised from world-class investors
          </p>

          <div
            id="investors-grid"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-200 ${
              visibleSections.has("investors-grid") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {investors.map((investor) => (
              <div
                key={investor.name}
                className="aspect-video relative bg-white/5 rounded-xl p-6 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Image
                  src={investor.logo || "/placeholder.svg"}
                  alt={investor.name}
                  fill
                  className="object-contain p-4 opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to join us?</h2>
          <p className="text-xl text-black/60 mb-10">
            Whether you&apos;re looking to scale your outreach or join our team, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-black text-white hover:bg-black/80 w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/careers">
              <Button size="lg" variant="outline" className="border-black/20 w-full sm:w-auto bg-transparent">
                View Open Roles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
