import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Search, BookOpen, Zap, Users, Mail, BarChart, Settings } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section className="container py-20">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Documentation</h1>
              <p className="text-xl text-muted-foreground mb-8">Everything you need to know about using ReachAI</p>
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search documentation..." className="pl-10" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <Link
                href="/docs/getting-started"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  Getting Started
                </h3>
                <p className="text-sm text-muted-foreground">Learn the basics and set up your first campaign</p>
              </Link>

              <Link
                href="/docs/campaigns"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <Zap className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">Campaigns</h3>
                <p className="text-sm text-muted-foreground">Create and manage your email campaigns</p>
              </Link>

              <Link
                href="/docs/prospects"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <Users className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">Prospects</h3>
                <p className="text-sm text-muted-foreground">Upload and manage your prospect lists</p>
              </Link>

              <Link
                href="/docs/email-generation"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <Mail className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  Email Generation
                </h3>
                <p className="text-sm text-muted-foreground">Use AI to generate personalized emails</p>
              </Link>

              <Link
                href="/docs/analytics"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <BarChart className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">Analytics</h3>
                <p className="text-sm text-muted-foreground">Track performance and optimize campaigns</p>
              </Link>

              <Link
                href="/docs/settings"
                className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-all"
              >
                <Settings className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  Settings & Integrations
                </h3>
                <p className="text-sm text-muted-foreground">Configure your account and connect tools</p>
              </Link>
            </div>

            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
