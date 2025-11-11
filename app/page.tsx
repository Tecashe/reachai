import { Navigation } from "@/components/landing/navigation"
import { Hero } from "@/components/landing/hero"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { SecurityShowcase } from "@/components/landing/security-showcase"
import { GradientBentoSection } from "@/components/landing/gradient-bento-section"
import { IntegrationsSection } from "@/components/landing/integrations-section"
import { StatsSection } from "@/components/landing/stats-section"
import { TestimonialSection } from "@/components/landing/testimonial-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturesGrid />
      <SecurityShowcase />
      <GradientBentoSection />
      <IntegrationsSection />
      <StatsSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  )
}
