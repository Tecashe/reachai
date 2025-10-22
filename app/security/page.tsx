import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
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

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Security at ReachAI</h1>
              <p className="text-xl text-muted-foreground">
                Your data security is our top priority. Learn how we protect your information.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <div className="rounded-lg border bg-card p-6">
                <Lock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Encryption</h3>
                <p className="text-muted-foreground">
                  All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your sensitive
                  information is never stored in plain text.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <Server className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Infrastructure</h3>
                <p className="text-muted-foreground">
                  Hosted on Vercel with automatic scaling and DDoS protection. Database hosted on Neon with automated
                  backups and point-in-time recovery.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <Eye className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Access Control</h3>
                <p className="text-muted-foreground">
                  Role-based access control (RBAC) ensures users only access data they're authorized to see.
                  Multi-factor authentication available for all accounts.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <FileCheck className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Compliance</h3>
                <p className="text-muted-foreground">
                  GDPR compliant with data processing agreements. SOC 2 Type II certification in progress. Regular
                  third-party security audits.
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Security Practices</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <strong>Regular Security Audits:</strong> Third-party penetration testing and vulnerability
                    assessments conducted quarterly
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <strong>Automated Backups:</strong> Daily automated backups with 30-day retention and instant
                    recovery
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <strong>Monitoring & Logging:</strong> 24/7 security monitoring with real-time alerts for suspicious
                    activity
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <strong>Secure Development:</strong> Code reviews, dependency scanning, and automated security
                    testing in our CI/CD pipeline
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div>
                    <strong>Employee Training:</strong> Regular security awareness training for all team members
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 p-6">
              <div className="flex gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Report a Security Issue</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you discover a security vulnerability, please report it to us immediately. We take all reports
                    seriously and will respond within 24 hours.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="mailto:security@reachai.com">Report Vulnerability</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
