import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-strong rounded-[3rem] p-12 sm:p-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Limited Time Offer</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Try Reachai free for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">14 days</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            No credit card required. Start generating leads and sending personalized emails in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 glass hover:bg-muted bg-transparent">
              Schedule a Demo
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {["No credit card required", "Cancel anytime", "Full access to all features"].map((feature, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
