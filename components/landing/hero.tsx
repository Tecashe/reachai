"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="morph-shape morph-shape-1"></div>
        <div className="morph-shape morph-shape-2"></div>
        <div className="morph-shape morph-shape-3"></div>
        <div className="morph-shape morph-shape-4"></div>
      </div>

      <div className="absolute inset-0 bg-[url('/abstract-dotted-pattern.png')] opacity-[0.03] bg-repeat" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Powered Email Outreach Platform</span>
            </div> */}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance">
              Generate leads in{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                14 days
              </span>{" "}
              free to start
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              From lead discovery to email delivery. mailfra automates your entire outreach workflow with AI-powered
              personalization and deliverability monitoring.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25 group"
                >
                  Start My 14 Days Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 glass hover:bg-muted bg-transparent">
                  Watch Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full glass border-2 border-background overflow-hidden">
                    <img
                      src={`/professional-person.png?height=40&width=40&query=professional+person+${i}`}
                      alt={`User ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">10,000+ businesses</p>
                <p className="text-xs text-muted-foreground">Trusted by growth teams worldwide</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] blur-3xl" />
            <div className="relative glass-strong rounded-[2rem] p-8 space-y-6">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                <img src="/modern-email-dashboard-interface.jpg" alt="mailfra Dashboard" className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-xs text-muted-foreground">Deliverability</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">5x</div>
                  <div className="text-xs text-muted-foreground">Response Rate</div>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-xs text-muted-foreground">Emails/Day</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
