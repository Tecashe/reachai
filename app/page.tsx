// import { HeroSection } from "@/components/landing/hero-section"
// import { FeaturesSection } from "@/components/landing/features-section"
// import { HowItWorksSection } from "@/components/landing/how-it-works-section"
// import { PricingSection } from "@/components/landing/pricing-section"
// import { TestimonialsSection } from "@/components/landing/testimonials-section"
// import { CTASection } from "@/components/landing/cta-section"
// import { LandingHeader } from "@/components/landing/landing-header"
// import { LandingFooter } from "@/components/landing/landing-footer"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <LandingHeader />
//       <main>
//         <HeroSection />
//         <FeaturesSection />
//         <HowItWorksSection />
//         <PricingSection />
//         <TestimonialsSection />
//         <CTASection />
//       </main>
//       <LandingFooter />
//     </div>
//   )
// }


// import { HeroSection } from "@/components/landing/hero-section"
// import { FeaturesSection } from "@/components/landing/features-section"
// import { HowItWorksSection } from "@/components/landing/how-it-works-section"
// import { PricingSection } from "@/components/landing/pricing-section"
// import { TestimonialsSection } from "@/components/landing/testimonials-section"
// import { CTASection } from "@/components/landing/cta-section"
// import { LandingHeader } from "@/components/landing/landing-header"
// import { LandingFooter } from "@/components/landing/landing-footer"

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <LandingHeader />
//       <main className="overflow-hidden">
//         <HeroSection />
//         <FeaturesSection />
//         <HowItWorksSection />
//         <PricingSection />
//         <TestimonialsSection />
//         <CTASection />
//       </main>
//       <LandingFooter />
//     </div>
//   )
// }

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { StatsSection } from "@/components/landing/stats-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { ComparisonSection } from "@/components/landing/comparison-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="overflow-hidden">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
