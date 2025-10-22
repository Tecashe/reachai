import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
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
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="rounded-lg border bg-card p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Other ways to reach us</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">support@reachai.com</p>
                        <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Live Chat</h3>
                        <p className="text-muted-foreground">Available in-app</p>
                        <p className="text-sm text-muted-foreground mt-1">Monday-Friday, 9am-6pm EST</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Phone className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground mt-1">Enterprise customers only</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-6">
                  <h3 className="font-semibold mb-2">Looking for support?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check out our documentation and help center for instant answers to common questions.
                  </p>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/docs">Visit Help Center</Link>
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
