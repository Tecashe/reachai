import { Brain, Zap, Target, TrendingUp, Users, Shield, Sparkles, Mail, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI Research Assistant",
    description:
      "Automatically researches prospects using LinkedIn, company websites, and news sources to find perfect talking points.",
  },
  {
    icon: Sparkles,
    title: "Hyper-Personalization",
    description:
      "Generate unique, personalized emails for each prospect based on their role, company, and recent activities.",
  },
  {
    icon: Zap,
    title: "Multi-Touch Sequences",
    description: "Create automated follow-up sequences that adapt based on prospect engagement and behavior.",
  },
  {
    icon: Target,
    title: "Quality Scoring",
    description: "AI scores each email for personalization quality, ensuring only the best messages get sent.",
  },
  {
    icon: TrendingUp,
    title: "Competitor Intelligence",
    description:
      "Discover what tools your prospects use and craft messaging that positions you as the better alternative.",
  },
  {
    icon: Mail,
    title: "Smart Send Times",
    description:
      "AI optimizes send times based on recipient timezone, industry patterns, and historical engagement data.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track opens, clicks, replies, and revenue attribution with detailed campaign performance metrics.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team, share templates, and maintain consistent messaging across campaigns.",
  },
  {
    icon: Shield,
    title: "Email Health Monitoring",
    description:
      "Protect your sender reputation with bounce detection, spam score checking, and deliverability insights.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Scale Outreach
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Powerful features designed to help you write better emails, faster—without sacrificing personalization.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
