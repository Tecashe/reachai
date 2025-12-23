"use client"

import { PageHeader } from "@/components/shared/page-header"
import { PageFooter } from "@/components/shared/page-footer"
import { useEffect, useRef, useState } from "react"
import { Sparkles, Wrench, Zap, Shield, ArrowRight, Rss } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type ChangeType = "feature" | "improvement" | "fix" | "security"

interface Change {
  type: ChangeType
  title: string
  description: string
}

interface Release {
  version: string
  date: string
  title: string
  description: string
  image?: string
  changes: Change[]
}

const releases: Release[] = [
  {
    version: "2.4.0",
    date: "December 2, 2024",
    title: "AI-Powered Subject Line Generator",
    description:
      "Generate high-converting subject lines with our new AI engine. Trained on millions of successful cold emails.",
    image: "/images/changelog/ai-subject.jpg",
    changes: [
      {
        type: "feature",
        title: "AI Subject Line Generator",
        description: "Generate multiple subject line variations with one click. A/B test automatically.",
      },
      {
        type: "feature",
        title: "Tone Customization",
        description: "Choose from professional, casual, urgent, or curious tones for your subject lines.",
      },
      {
        type: "improvement",
        title: "Faster Campaign Creation",
        description: "Reduced campaign setup time by 40% with new streamlined workflow.",
      },
      {
        type: "fix",
        title: "Gmail OAuth Refresh",
        description: "Fixed an issue where Gmail tokens would occasionally fail to refresh.",
      },
    ],
  },
  {
    version: "2.3.0",
    date: "November 18, 2024",
    title: "Team Workspaces",
    description: "Collaborate with your entire team. Shared campaigns, leads, and analytics with role-based access.",
    image: "/images/changelog/team-workspaces.jpg",
    changes: [
      {
        type: "feature",
        title: "Team Workspaces",
        description: "Create shared workspaces for your team with unified billing and management.",
      },
      {
        type: "feature",
        title: "Role-Based Permissions",
        description: "Admin, Manager, and Sender roles with granular permission controls.",
      },
      {
        type: "feature",
        title: "Activity Feed",
        description: "Real-time feed showing all team activity across campaigns and leads.",
      },
      {
        type: "security",
        title: "SSO Support",
        description: "Enterprise SSO with SAML 2.0 support for Google Workspace and Okta.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "November 4, 2024",
    title: "Advanced Analytics Dashboard",
    description: "Completely redesigned analytics with real-time updates, custom reports, and exportable data.",
    image: "/images/changelog/analytics-dashboard.jpg",
    changes: [
      {
        type: "feature",
        title: "Real-Time Dashboard",
        description: "Live updates every 30 seconds. Watch your campaigns perform in real-time.",
      },
      {
        type: "feature",
        title: "Custom Reports",
        description: "Build custom reports with drag-and-drop widgets. Save and share with your team.",
      },
      {
        type: "improvement",
        title: "Faster Data Loading",
        description: "Analytics now load 3x faster with our new data infrastructure.",
      },
      {
        type: "fix",
        title: "Timezone Accuracy",
        description: "Fixed timezone display issues in campaign scheduling.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "October 21, 2024",
    title: "LinkedIn Integration",
    description: "Add LinkedIn touchpoints to your sequences. Connect requests, profile visits, and InMails.",
    changes: [
      {
        type: "feature",
        title: "LinkedIn Steps",
        description: "Add LinkedIn connection requests and messages to your email sequences.",
      },
      {
        type: "feature",
        title: "Profile Visit Tracking",
        description: "Track when prospects view your LinkedIn profile after receiving emails.",
      },
      {
        type: "improvement",
        title: "Sequence Builder UX",
        description: "Redesigned sequence builder with better drag-and-drop and previews.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "October 7, 2024",
    title: "mailfra 2.0",
    description:
      "The biggest update ever. New UI, new warmup engine, new everything. Rebuilt from the ground up for scale.",
    image: "/images/changelog/mailfra-2.jpg",
    changes: [
      {
        type: "feature",
        title: "Completely New UI",
        description: "Modern, fast, and intuitive interface designed for power users.",
      },
      {
        type: "feature",
        title: "Next-Gen Warmup Engine",
        description: "AI-powered warmup that builds reputation 2x faster than before.",
      },
      {
        type: "feature",
        title: "Unlimited Email Accounts",
        description: "Connect as many accounts as you want. No per-account fees.",
      },
      {
        type: "improvement",
        title: "10x Performance",
        description: "Everything is faster. Page loads, campaign creation, analytics, everything.",
      },
      {
        type: "security",
        title: "SOC 2 Type II",
        description: "We're now SOC 2 Type II certified. Enterprise-grade security.",
      },
    ],
  },
]

const typeConfig: Record<ChangeType, { icon: typeof Sparkles; label: string; color: string }> = {
  feature: { icon: Sparkles, label: "New", color: "bg-emerald-500/10 text-emerald-600" },
  improvement: { icon: Zap, label: "Improved", color: "bg-blue-500/10 text-blue-600" },
  fix: { icon: Wrench, label: "Fixed", color: "bg-amber-500/10 text-amber-600" },
  security: { icon: Shield, label: "Security", color: "bg-purple-500/10 text-purple-600" },
}

export default function ChangelogPage() {
  const [visibleReleases, setVisibleReleases] = useState<number[]>([])
  const releaseRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = releaseRefs.current.map((ref, index) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleReleases((prev) => [...new Set([...prev, index])])
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground mb-8">
            <Sparkles className="w-4 h-4" />
            Product Updates
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">Changelog</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            All the latest updates, improvements, and fixes to mailfra. We ship new features every week.
          </p>
          <a
            href="/rss/changelog.xml"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Rss className="w-4 h-4" />
            Subscribe to RSS feed
          </a>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            {/* Releases */}
            <div className="space-y-16">
              {releases.map((release, index) => (
                <div
                  key={release.version}
                  ref={(el) => {
                    releaseRefs.current[index] = el
                  }}
                  className={`relative transition-all duration-700 ${
                    index % 2 === 0 ? "md:pr-[calc(50%+3rem)]" : "md:pl-[calc(50%+3rem)]"
                  }`}
                  style={{
                    opacity: visibleReleases.includes(index) ? 1 : 0,
                    transform: visibleReleases.includes(index) ? "translateY(0)" : "translateY(30px)",
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute top-0 w-4 h-4 rounded-full bg-foreground border-4 border-background left-0 md:left-1/2 -translate-x-1/2`}
                  />

                  {/* Content card */}
                  <div className="ml-8 md:ml-0 bg-background rounded-2xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="p-6 sm:p-8 border-b border-border">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-foreground text-background text-sm font-bold rounded-full">
                          v{release.version}
                        </span>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{release.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{release.description}</p>
                    </div>

                    {/* Image */}
                    {release.image && (
                      <div className="relative h-48 sm:h-64 bg-muted">
                        <Image
                          src={release.image || "/placeholder.svg"}
                          alt={release.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Changes */}
                    <div className="p-6 sm:p-8 space-y-4">
                      {release.changes.map((change, changeIndex) => {
                        const config = typeConfig[change.type]
                        return (
                          <div
                            key={changeIndex}
                            className="flex gap-4"
                            style={{
                              animation: visibleReleases.includes(index) ? `fadeIn 0.5s ease forwards` : "none",
                              animationDelay: `${changeIndex * 100}ms`,
                              opacity: 0,
                            }}
                          >
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.color} flex-shrink-0 h-fit`}
                            >
                              <config.icon className="w-3 h-3" />
                              {config.label}
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground mb-1">{change.title}</h3>
                              <p className="text-sm text-muted-foreground">{change.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Load more */}
          <div className="text-center mt-16">
            <button className="h-12 px-6 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
              Load older releases
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Want to see these features in action?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Start your free trial and experience the latest mailfra updates firsthand.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex h-14 px-8 bg-foreground text-background font-medium rounded-full items-center gap-2 hover:bg-foreground/90 transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <PageFooter />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
