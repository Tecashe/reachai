import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"
import { ArrowLeft, Target, Users, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-20">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About mailfra</h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to revolutionize cold email outreach with AI-powered personalization that actually
              works.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container py-20 border-t">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Cold email outreach is broken. Generic templates get ignored, manual personalization doesn't scale, and
                sales teams waste hours on research that leads nowhere.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                mailfra changes that. We combine cutting-edge AI with deep prospect research to generate emails that
                feel personal, relevant, and human—at scale.
              </p>
              <p className="text-lg text-muted-foreground">
                Our goal is simple: help sales teams book more meetings by sending emails that prospects actually want
                to read.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="flex gap-4 p-6 rounded-lg border bg-card">
                <Target className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Precision Targeting</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered research finds the perfect talking points for every prospect
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg border bg-card">
                <Zap className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate hundreds of personalized emails in minutes, not hours
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 rounded-lg border bg-card">
                <Heart className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Human Touch</h3>
                  <p className="text-sm text-muted-foreground">
                    Emails that sound like they were written by a real person, because they were—with AI assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container py-20 border-t">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Built by Sales People, for Sales People</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team has spent years in the trenches of B2B sales, experiencing firsthand the pain of cold outreach.
              We built mailfra to solve our own problems—and now we're sharing it with the world.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">Join Us Today</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
