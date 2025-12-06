"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Calendar, Clock, Play, Users, Bell, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"

const upcomingWebinars = [
  {
    id: 1,
    title: "Mastering Cold Email Deliverability in 2025",
    description:
      "Learn the latest strategies to land in primary inbox every time. We'll cover authentication, warmup, and advanced sender reputation tactics.",
    date: "December 12, 2024",
    time: "11:00 AM EST",
    duration: "60 min",
    speakers: [
      { name: "Sarah Chen", role: "Head of Deliverability", avatar: "/images/webinars/speaker-sarah.jpg" },
      { name: "Mike Roberts", role: "Email Strategist", avatar: "/images/webinars/speaker-mike.jpg" },
    ],
    attendees: 847,
    image: "/images/webinars/deliverability-2025.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Personalization at Scale",
    description:
      "Discover how to use AI to write personalized emails that feel human while reaching thousands of prospects daily.",
    date: "December 19, 2024",
    time: "2:00 PM EST",
    duration: "45 min",
    speakers: [{ name: "Alex Kim", role: "AI Product Lead", avatar: "/images/webinars/speaker-alex.jpg" }],
    attendees: 523,
    image: "/images/webinars/ai-personalization.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Building a $1M Outbound Pipeline",
    description:
      "A tactical breakdown of how top SDR teams structure their outbound motion to generate consistent revenue.",
    date: "January 9, 2025",
    time: "11:00 AM EST",
    duration: "75 min",
    speakers: [{ name: "Jordan Lee", role: "VP of Sales", avatar: "/images/webinars/speaker-jordan.jpg" }],
    attendees: 312,
    image: "/images/webinars/pipeline-building.jpg",
    featured: false,
  },
]

const pastWebinars = [
  {
    id: 4,
    title: "The Science of Follow-Up Sequences",
    description: "Data-driven insights on timing, frequency, and messaging for maximum response rates.",
    date: "November 28, 2024",
    duration: "52 min",
    views: 4521,
    speakers: [{ name: "Sarah Chen", role: "Head of Deliverability", avatar: "/images/webinars/speaker-sarah.jpg" }],
    image: "/images/webinars/follow-up-science.jpg",
  },
  {
    id: 5,
    title: "Cold Email Copywriting Masterclass",
    description: "Write emails that get opened, read, and replied to with proven copywriting frameworks.",
    date: "November 14, 2024",
    duration: "68 min",
    views: 7834,
    speakers: [{ name: "Alex Kim", role: "AI Product Lead", avatar: "/images/webinars/speaker-alex.jpg" }],
    image: "/images/webinars/copywriting.jpg",
  },
  {
    id: 6,
    title: "Scaling Your Agency with Cold Outreach",
    description: "How to build and scale a profitable cold email agency from scratch.",
    date: "October 31, 2024",
    duration: "61 min",
    views: 5612,
    speakers: [{ name: "Mike Roberts", role: "Email Strategist", avatar: "/images/webinars/speaker-mike.jpg" }],
    image: "/images/webinars/agency-scaling.jpg",
  },
  {
    id: 7,
    title: "Email Warmup Deep Dive",
    description: "Everything you need to know about warming up new inboxes for optimal deliverability.",
    date: "October 17, 2024",
    duration: "45 min",
    views: 3298,
    speakers: [{ name: "Jordan Lee", role: "VP of Sales", avatar: "/images/webinars/speaker-jordan.jpg" }],
    image: "/images/webinars/warmup-deep-dive.jpg",
  },
]

export default function WebinarsPage() {
  const [registeredWebinars, setRegisteredWebinars] = useState<number[]>([])
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const featuredWebinar = upcomingWebinars.find((w) => w.featured)
  const otherUpcoming = upcomingWebinars.filter((w) => !w.featured)

  const handleRegister = (id: number) => {
    setRegisteredWebinars((prev) => [...prev, id])
  }

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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-sm font-medium text-neutral-500 tracking-wider uppercase mb-4">Live & On-Demand</span>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">Expert Webinars</h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Learn from industry experts with live workshops and on-demand sessions covering every aspect of cold
              outreach.
            </p>
          </div>

          {/* Featured Webinar */}
          {featuredWebinar && (
            <div className="relative rounded-3xl overflow-hidden bg-neutral-900 mb-16">
              <div className="absolute inset-0">
                <Image
                  src={featuredWebinar.image || "/placeholder.svg"}
                  alt={featuredWebinar.title}
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-transparent" />
              </div>

              <div className="relative z-10 grid md:grid-cols-5 gap-8 p-8 md:p-12">
                <div className="md:col-span-3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center gap-2 px-3 py-1 bg-red-500/20 backdrop-blur rounded-full text-xs font-medium text-red-400">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Upcoming Live
                    </span>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white/80">
                      Featured
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredWebinar.title}</h2>
                  <p className="text-neutral-400 text-lg mb-8 max-w-xl">{featuredWebinar.description}</p>

                  <div className="flex flex-wrap items-center gap-6 mb-8 text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{featuredWebinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>
                        {featuredWebinar.time} · {featuredWebinar.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{featuredWebinar.attendees} registered</span>
                    </div>
                  </div>

                  {/* Speakers */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex -space-x-3">
                      {featuredWebinar.speakers.map((speaker, i) => (
                        <Image
                          key={i}
                          src={speaker.avatar || "/placeholder.svg"}
                          alt={speaker.name}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-neutral-900"
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      <p className="text-white font-medium">
                        {featuredWebinar.speakers.map((s) => s.name).join(" & ")}
                      </p>
                      <p className="text-neutral-500">{featuredWebinar.speakers.map((s) => s.role).join(", ")}</p>
                    </div>
                  </div>

                  {registeredWebinars.includes(featuredWebinar.id) ? (
                    <div className="flex items-center gap-3 px-8 py-4 bg-green-500/20 text-green-400 rounded-full w-fit">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You&apos;re registered! Check your email.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegister(featuredWebinar.id)}
                      className="flex items-center gap-2 px-8 py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-100 transition-colors w-fit"
                    >
                      <Bell className="w-5 h-5" />
                      Reserve Your Spot
                    </button>
                  )}
                </div>

                <div className="md:col-span-2 hidden md:flex items-center justify-center">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                    <Image
                      src={featuredWebinar.image || "/placeholder.svg"}
                      alt={featuredWebinar.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur rounded-full">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Other Upcoming Webinars */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Upcoming Webinars</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {otherUpcoming.map((webinar, index) => (
              <div
                key={webinar.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-400 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video">
                    <Image
                      src={webinar.image || "/placeholder.svg"}
                      alt={webinar.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium text-neutral-900">
                        <Calendar className="w-3 h-3" />
                        {webinar.date}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">{webinar.title}</h3>
                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{webinar.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {webinar.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {webinar.attendees} attending
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {webinar.speakers.map((speaker, i) => (
                          <Image
                            key={i}
                            src={speaker.avatar || "/placeholder.svg"}
                            alt={speaker.name}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        ))}
                        <span className="text-sm text-neutral-600">{webinar.speakers[0].name}</span>
                      </div>

                      {registeredWebinars.includes(webinar.id) ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRegister(webinar.id)}
                          className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Past Webinars */}
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">On-Demand Library</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastWebinars.map((webinar, index) => (
              <div
                key={webinar.id}
                ref={(el) => {
                  cardRefs.current[index + otherUpcoming.length] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCards.includes(index + otherUpcoming.length)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group cursor-pointer">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <Image
                      src={webinar.image || "/placeholder.svg"}
                      alt={webinar.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur rounded-full group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      {webinar.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-neutral-600 transition-colors line-clamp-2">
                    {webinar.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span>{webinar.date}</span>
                    <span>·</span>
                    <span>{webinar.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Never miss a webinar</h2>
          <p className="text-neutral-600 text-lg mb-10">
            Get notified about upcoming live sessions and new on-demand content.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
