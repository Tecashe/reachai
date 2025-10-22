import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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

          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <h1>Terms of Service</h1>
            <p className="lead">Last updated: January 22, 2025</p>

            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using ReachAI, you agree to be bound by these Terms of Service. If you disagree with any
              part of these terms, you may not access the service.
            </p>

            <h2>Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to use ReachAI for your business purposes,
              subject to these terms and your subscription plan.
            </p>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Send spam or unsolicited emails</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service to harm, harass, or impersonate others</li>
              <li>Scrape or copy content without permission</li>
            </ul>

            <h2>Subscription and Billing</h2>
            <p>
              Subscriptions are billed monthly or annually based on your chosen plan. You can cancel at any time, but
              refunds are not provided for partial months. We reserve the right to change pricing with 30 days notice.
            </p>

            <h2>Data Ownership</h2>
            <p>
              You retain all rights to your data. We claim no ownership over your content. You grant us a license to use
              your data solely to provide and improve our services.
            </p>

            <h2>Service Availability</h2>
            <p>
              We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance that
              temporarily affects availability.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The ReachAI platform, including all content, features, and functionality, is owned by us and protected by
              copyright, trademark, and other intellectual property laws.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              ReachAI is provided "as is" without warranties. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the service.
            </p>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes.
              Continued use of the service after changes constitutes acceptance.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of California, without regard to its conflict of law
              provisions.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
              <br />
              Email: legal@reachai.com
              <br />
              Address: 123 AI Street, San Francisco, CA 94105
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
