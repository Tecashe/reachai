import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 md:p-16">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-white/10" />

          <div className="relative mx-auto max-w-3xl text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
              Ready to 10x Your Cold Email Results?
            </h2>
            <p className="text-lg text-blue-50 text-balance mb-8">
              Join thousands of sales professionals who are closing more deals with AI-powered personalization.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-100">No credit card required • 100 free emails • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}
