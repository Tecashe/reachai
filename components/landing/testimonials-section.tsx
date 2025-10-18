import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Sales",
    company: "TechFlow",
    content:
      "ReachAI increased our reply rate from 8% to 24% in just two weeks. The AI research is incredibly accurate and saves us hours every day.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "GrowthLabs",
    content:
      "Finally, a cold email tool that actually personalizes at scale. We've booked 3x more meetings since switching to ReachAI.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "SDR Manager",
    company: "CloudScale",
    content:
      "The quality scoring feature is a game-changer. No more generic emails slipping through. Our team's productivity has doubled.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "VP of Sales",
    company: "DataSync",
    content:
      "Best investment we've made this year. The competitor intelligence feature alone has helped us close deals we would have lost.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Sales Teams
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">See what our customers are saying about ReachAI.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
