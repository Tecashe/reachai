import { Hero } from "@/components/hero"
import { LogoBar } from "@/components/sections/logo-bar"
import { Problem } from "@/components/sections/problem"
import { Features } from "@/components/sections/features"
import { Stats } from "@/components/sections/stats"
import { DashboardPreview } from "@/components/sections/dashboard-preview"
import { HowItWorks } from "@/components/sections/how-it-works"
import { UseCases } from "@/components/sections/use-cases"
import { Integrations } from "@/components/sections/integrations"
import { Comparison } from "@/components/sections/comparison"
import { CaseStudies } from "@/components/sections/case-studies"
import { Security } from "@/components/sections/security"
import { Pricing } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonials"
import { Guarantee } from "@/components/sections/guarantee"
import { FAQ } from "@/components/sections/faq"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"
import { EmailWarmup } from "@/components/sections/email-warmup"
import { GetStarted } from "@/components/sections/get-started"
import { ROICalculator } from "@/components/sections/roi-calculator"
import { LiveActivity } from "@/components/sections/live-activity"
import { LiquidMorph } from "@/components/sections/transforms/liquid-morph"

export default function Home() {
  return (
    <main>
      <Hero />
      <LogoBar />
      <Problem />
      <Features />
      <Stats />
      <EmailWarmup />
      {/* <DashboardPreview /> */}
      {/* <HowItWorks /> */}
      <GetStarted />
      <UseCases />
      {/* <Integrations /> */}
      <Comparison />
      <CaseStudies />
      <ROICalculator />
      <Security />
      <LiquidMorph />
      <Pricing />
      <LiveActivity />
      <Testimonials />
      <Guarantee />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
