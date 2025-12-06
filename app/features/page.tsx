"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useRef, useState } from "react"
import {
  Mail,
  Inbox,
  BarChart3,
  Users,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  RefreshCw,
  Target,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: Inbox,
    title: "Unlimited Email Accounts",
    description: "Connect unlimited sending accounts across Gmail, Outlook, and SMTP. No per-account fees, ever.",
    stat: "Unlimited",
    statLabel: "email accounts",
  },
  {
    icon: RefreshCw,
    title: "Smart Inbox Rotation",
    description: "Automatically distribute sends across accounts to maximize deliverability and avoid spam triggers.",
    stat: "3x",
    statLabel: "better deliverability",
  },
  {
    icon: Zap,
    title: "AI-Powered Warmup",
    description: "Our intelligent warmup engine builds sender reputation automatically with real engagement signals.",
    stat: "14 days",
    statLabel: "to full reputation",
  },
  {
    icon: Target,
    title: "Advanced Personalization",
    description: "Dynamic variables, conditional content, and AI-generated personalization at scale.",
    stat: "47%",
    statLabel: "higher reply rates",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track opens, clicks, replies, and conversions with live dashboards and exportable reports.",
    stat: "100+",
    statLabel: "data points tracked",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Shared workspaces, role-based permissions, and real-time activity feeds for your entire team.",
    stat: "50+",
    statLabel: "team members supported",
  },
  {
    icon: Shield,
    title: "Deliverability Suite",
    description:
      "Spam testing, domain health monitoring, and automatic blacklist detection to protect your sender reputation.",
    stat: "98.7%",
    statLabel: "inbox placement",
  },
  {
    icon: Globe,
    title: "Multi-timezone Sending",
    description: "Send emails at the perfect local time for each prospect, no matter where they are in the world.",
    stat: "24",
    statLabel: "timezones supported",
  },
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "All replies in one place. Manage conversations, tag leads, and never miss a response.",
    stat: "Zero",
    statLabel: "missed replies",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "AI determines the optimal send time for each recipient based on historical engagement data.",
    stat: "32%",
    statLabel: "more opens",
  },
  {
    icon: Layers,
    title: "Multi-channel Sequences",
    description: "Combine email, LinkedIn, and calls in automated sequences that adapt based on engagement.",
    stat: "3",
    statLabel: "channels supported",
  },
  {
    icon: Mail,
    title: "A/B Testing",
    description: "Test subject lines, content, and send times. Auto-optimize based on winning variants.",
    stat: "∞",
    statLabel: "test variations",
  },
]

const showcaseFeatures = [
  {
    title: "Inbox Rotation Engine",
    subtitle: "Distribute sends intelligently",
    description:
      "Our smart rotation algorithm analyzes account health, sending limits, and warm-up status to distribute your campaigns across accounts for maximum deliverability.",
    image: "/images/feature-inbox-rotation.jpg",
    stats: [
      { value: "50+", label: "Accounts per workspace" },
      { value: "Smart", label: "Load balancing" },
      { value: "Auto", label: "Failover protection" },
    ],
  },
  {
    title: "AI Email Warmup",
    subtitle: "Build reputation automatically",
    description:
      "Connect a new account and watch our AI build its reputation through realistic engagement patterns, gradual volume increases, and spam folder rescues.",
    image: "/images/feature-warmup.jpg",
    stats: [
      { value: "14 days", label: "To full warmup" },
      { value: "Real", label: "Engagement signals" },
      { value: "24/7", label: "Automated process" },
    ],
  },
  {
    title: "Campaign Analytics",
    subtitle: "Data-driven decisions",
    description:
      "Real-time dashboards show exactly how your campaigns perform. Track every open, click, reply, and conversion across all your sequences.",
    image: "/images/feature-analytics.jpg",
    stats: [
      { value: "Live", label: "Real-time updates" },
      { value: "Export", label: "Custom reports" },
      { value: "API", label: "Data access" },
    ],
  },
]

export default function FeaturesPage() {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([])
  const [activeShowcase, setActiveShowcase] = useState(0)
  const featureRefs = useRef<(HTMLDivElement | null)[]>([])
  const showcaseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observers = featureRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFeatures((prev) => [...new Set([...prev, index])])
          }
        },
        { threshold: 0.2 },
      )
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return
      const rect = showcaseRef.current.getBoundingClientRect()
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      const newIndex = Math.min(Math.floor(scrollProgress * showcaseFeatures.length), showcaseFeatures.length - 1)
      setActiveShowcase(newIndex)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
              <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              Platform Capabilities
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
              Everything you need to
              <span className="block text-muted-foreground">scale cold outreach</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From inbox rotation to AI warmup, analytics to team collaboration. One platform with every feature you
              need to book more meetings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="h-14 px-8 bg-foreground text-background font-medium rounded-full flex items-center gap-2 hover:bg-foreground/90 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="h-14 px-8 border border-border font-medium rounded-full flex items-center gap-2 hover:bg-muted transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Powerful features, simple interface</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every tool you need to run successful cold email campaigns, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => {
                  featureRefs.current[index] = el
                }}
                className="group relative bg-background rounded-2xl p-8 border border-border hover:border-foreground/20 transition-all duration-500"
                style={{
                  opacity: visibleFeatures.includes(index) ? 1 : 0,
                  transform: visibleFeatures.includes(index) ? "translateY(0)" : "translateY(30px)",
                  transitionDelay: `${(index % 3) * 100}ms`,
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

                {/* Stat */}
                <div className="pt-6 border-t border-border">
                  <span className="text-2xl font-bold text-foreground">{feature.stat}</span>
                  <span className="text-sm text-muted-foreground ml-2">{feature.statLabel}</span>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase - Sticky Scroll */}
      <section ref={showcaseRef} className="relative" style={{ height: `${showcaseFeatures.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text content */}
              <div className="relative">
                {showcaseFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="transition-all duration-700"
                    style={{
                      position: index === 0 ? "relative" : "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      opacity: activeShowcase === index ? 1 : 0,
                      transform: activeShowcase === index ? "translateY(0)" : "translateY(20px)",
                      pointerEvents: activeShowcase === index ? "auto" : "none",
                    }}
                  >
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
                      {feature.subtitle}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">{feature.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">{feature.description}</p>

                    {/* Stats */}
                    <div className="flex gap-8">
                      {feature.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Progress indicators */}
                <div className="flex gap-2 mt-12">
                  {showcaseFeatures.map((_, index) => (
                    <div
                      key={index}
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: activeShowcase === index ? "48px" : "24px",
                        backgroundColor: activeShowcase === index ? "var(--foreground)" : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden bg-muted">
                {showcaseFeatures.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      opacity: activeShowcase === index ? 1 : 0,
                      transform: activeShowcase === index ? "scale(1)" : "scale(1.05)",
                    }}
                  >
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background mb-6">
            Ready to scale your outreach?
          </h2>
          <p className="text-lg text-background/70 mb-10 max-w-2xl mx-auto">
            Join thousands of sales teams using mailfra to book more meetings and close more deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="h-14 px-8 bg-background text-foreground font-medium rounded-full flex items-center gap-2 hover:bg-background/90 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="h-14 px-8 border border-background/30 text-background font-medium rounded-full flex items-center gap-2 hover:bg-background/10 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  )
}
