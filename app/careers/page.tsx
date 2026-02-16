"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MapPin, Clock, DollarSign, Building2, Code, Megaphone, Users, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/page-header"
import PageFooter from "@/components/shared/page-footer"

const departments = [
  { id: "all", name: "All Departments", icon: Building2 },
  { id: "engineering", name: "Engineering", icon: Code },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "sales", name: "Sales", icon: Users },
  { id: "support", name: "Support", icon: Headphones },
]

const jobs = [
  {
    id: 1,
    title: "Senior Backend Engineer",
    department: "engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$180k - $250k",
    description: "Build the core infrastructure that powers millions of emails daily.",
    requirements: ["5+ years experience", "Python/Go expertise", "Distributed systems"],
  },
  {
    id: 2,
    title: "Frontend Engineer",
    department: "engineering",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$150k - $200k",
    description: "Create beautiful, performant interfaces that sales teams love.",
    requirements: ["3+ years experience", "React/TypeScript", "Design sensibility"],
  },
  {
    id: 3,
    title: "Machine Learning Engineer",
    department: "engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$200k - $280k",
    description: "Build AI models for email personalization and deliverability prediction.",
    requirements: ["4+ years ML experience", "NLP expertise", "Production ML systems"],
  },
  {
    id: 4,
    title: "Head of Growth Marketing",
    department: "marketing",
    location: "New York, NY",
    type: "Full-time",
    salary: "$160k - $220k",
    description: "Scale our acquisition channels and build a world-class growth team.",
    requirements: ["7+ years in growth", "B2B SaaS experience", "Data-driven mindset"],
  },
  {
    id: 5,
    title: "Content Marketing Manager",
    department: "marketing",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$100k - $140k",
    description: "Create content that educates and converts. Own our blog, guides, and SEO.",
    requirements: ["4+ years content marketing", "SEO expertise", "B2B writing samples"],
  },
  {
    id: 6,
    title: "Enterprise Account Executive",
    department: "sales",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k + commission",
    description: "Close six and seven-figure deals with Fortune 500 companies.",
    requirements: ["5+ years enterprise sales", "SaaS experience", "Proven track record"],
  },
  {
    id: 7,
    title: "Sales Development Representative",
    department: "sales",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$60k - $80k + commission",
    description: "Generate pipeline through outbound prospecting. Yes, using Mailfra.",
    requirements: ["1+ year SDR experience", "Hunger to learn", "Great communicator"],
  },
  {
    id: 8,
    title: "Customer Success Manager",
    department: "support",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Ensure our customers succeed and become advocates for Mailfra.",
    requirements: ["3+ years CS experience", "Technical aptitude", "Customer-obsessed"],
  },
]

const perks = [
  {
    title: "Competitive Equity",
    description: "Significant ownership stake. We win together.",
    image: "/images/perks/equity.png",
  },
  {
    title: "Unlimited PTO",
    description: "Take time when you need it. We trust you.",
    image: "/images/perks/pto.png",
  },
  {
    title: "Remote-First",
    description: "Work from anywhere. We have teammates in 12 countries.",
    image: "/images/perks/remote.png",
  },
  {
    title: "Health & Wellness",
    description: "Premium health, dental, vision. Plus $200/mo wellness stipend.",
    image: "/images/perks/health.png",
  },
  {
    title: "Learning Budget",
    description: "$2,000/year for courses, conferences, and books.",
    image: "/images/perks/learning.png",
  },
  {
    title: "Home Office Setup",
    description: "$2,500 to set up your perfect workspace.",
    image: "/images/perks/office.png",
  },
]

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "$29M", label: "Raised" },
  { value: "48", label: "Team Members" },
  { value: "12", label: "Countries" },
]

export default function CareersPage() {
  const [activeDepartment, setActiveDepartment] = useState("all")
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [expandedJob, setExpandedJob] = useState<number | null>(null)

  const filteredJobs = activeDepartment === "all" ? jobs : jobs.filter((job) => job.department === activeDepartment)

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
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/careers/mailfra-office.png" alt="Mailfra office" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {jobs.length} open positions
          </div>

          <h1
            id="hero-title"
            data-animate
            className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${visibleSections.has("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Build the future of
            <br />
            outbound sales
          </h1>
          <p
            id="hero-subtitle"
            data-animate
            className={`text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-200 ${visibleSections.has("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Join a team of ambitious builders working to transform how businesses connect with customers.
          </p>

          <Link href="#openings">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              View Open Roles <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                id={`stat-${index}`}
                data-animate
                className={`text-center transition-all duration-700 ${visibleSections.has(`stat-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              id="culture-grid"
              data-animate
              className={`grid grid-cols-2 gap-4 transition-all duration-1000 ${visibleSections.has("culture-grid") ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
            >
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image src="/images/culture/team1.png" alt="Team collaboration" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden mt-8">
                <Image src="/images/culture/team2.png" alt="Team event" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden -mt-8">
                <Image src="/images/culture/team3.png" alt="Office space" fill className="object-cover" />
              </div>
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image src="/images/culture/team4.png" alt="Team meeting" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h2
                id="culture-title"
                data-animate
                className={`text-4xl md:text-5xl font-bold mb-8 transition-all duration-700 ${visibleSections.has("culture-title") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
              >
                Why Mailfra?
              </h2>
              <div
                id="culture-text"
                data-animate
                className={`space-y-6 text-lg text-white/70 transition-all duration-700 delay-200 ${visibleSections.has("culture-text") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
              >
                <p>
                  We&apos;re not just building a product. We&apos;re defining how modern sales teams connect with
                  prospects in a world where attention is the scarcest resource.
                </p>
                <p>
                  You&apos;ll work alongside people who&apos;ve built products at Google, Salesforce, and Stripe. People
                  who obsess over craft and care deeply about impact.
                </p>
                <p>
                  We move fast, ship often, and celebrate wins together. If you want ownership, autonomy, and the chance
                  to make a real difference, you&apos;ll love it here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <h2
            id="perks-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${visibleSections.has("perks-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Perks & Benefits
          </h2>
          <p
            id="perks-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-16 transition-all duration-700 delay-100 ${visibleSections.has("perks-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            We take care of our team so they can focus on doing great work
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <div
                key={perk.title}
                id={`perk-${index}`}
                data-animate
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${visibleSections.has(`perk-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video relative">
                  <Image
                    src={perk.image || "/placeholder.svg"}
                    alt={perk.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-semibold mb-2">{perk.title}</h3>
                  <p className="text-white/60">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            id="jobs-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-center mb-6 transition-all duration-700 ${visibleSections.has("jobs-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Open Positions
          </h2>
          <p
            id="jobs-subtitle"
            data-animate
            className={`text-xl text-white/60 text-center max-w-2xl mx-auto mb-12 transition-all duration-700 delay-100 ${visibleSections.has("jobs-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            Find your next role
          </p>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {departments.map((dept) => {
              const Icon = dept.icon
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDepartment(dept.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${activeDepartment === dept.id
                    ? "bg-white text-black border-white"
                    : "border-white/20 hover:border-white/40"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {dept.name}
                </button>
              )
            })}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                id={`job-${index}`}
                data-animate
                className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-white/30 ${visibleSections.has(`job-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" /> {job.salary}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${expandedJob === job.id ? "rotate-90" : ""}`} />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${expandedJob === job.id ? "max-h-96" : "max-h-0"
                    }`}
                >
                  <div className="px-6 pb-6 border-t border-white/10 pt-4">
                    <p className="text-white/70 mb-4">{job.description}</p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold mb-2 text-white/50">Requirements</h4>
                      <ul className="list-disc list-inside text-white/70 space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <Button className="bg-white text-black hover:bg-white/90">
                      Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-white/50">No positions available in this department right now.</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Don&apos;t see your role?</h2>
          <p className="text-xl text-black/60 mb-10">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll be in touch when we have a
            fit.
          </p>
          <Button size="lg" className="bg-black text-white hover:bg-black/80">
            Send Open Application <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      <PageFooter />
    </main>
  )
}
