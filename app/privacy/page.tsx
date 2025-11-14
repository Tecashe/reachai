import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="container py-20">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
            <h1>Privacy Policy</h1>
            <p className="lead">Last updated: January 22, 2025</p>

            <h2>Introduction</h2>
            <p>
              mailfra ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our service.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <ul>
              <li>Account information (name, email, password)</li>
              <li>Billing information (processed securely through Stripe)</li>
              <li>Prospect data you upload or create</li>
              <li>Email templates and campaigns you create</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Information We Collect Automatically</h3>
            <ul>
              <li>Usage data and analytics</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process your transactions</li>
              <li>Send you service updates and marketing communications</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul>
              <li>Service providers (OpenAI, Stripe, Resend, etc.)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including encryption, secure
              servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to data processing</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide services. You can
              request deletion of your data at any time.
            </p>

            <h2>Children's Privacy</h2>
            <p>Our service is not intended for children under 13. We do not knowingly collect data from children.</p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the "Last updated" date.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@mailfra.com
              <br />
              Address: 123 AI Street, San Francisco, CA 94105
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
