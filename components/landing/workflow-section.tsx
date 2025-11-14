import { Sparkles } from "lucide-react"

export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Connect Apollo",
      description: "Link your Apollo account to discover and import high-quality leads",
      color: "from-primary/20 to-primary/5",
    },
    {
      number: "02",
      title: "Enrich Data",
      description: "Automatically verify and enhance lead information with 50+ data points",
      color: "from-accent/20 to-accent/5",
    },
    {
      number: "03",
      title: "AI Writes Emails",
      description: "Generate personalized emails based on each prospect's profile and activity",
      color: "from-primary/20 to-primary/5",
    },
    {
      number: "04",
      title: "Warmup & Send",
      description: "Gradually warm up your domains and send with optimized timing",
      color: "from-accent/20 to-accent/5",
    },
    {
      number: "05",
      title: "Track & Optimize",
      description: "Monitor opens, replies, and health scores to continuously improve",
      color: "from-primary/20 to-primary/5",
    },
  ]

  return (
    <section id="workflow" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Your outreach workflow,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">automated</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From discovery to delivery, every step is optimized for maximum results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-strong rounded-3xl p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}

          <div className="md:col-span-2 lg:col-span-3 glass-strong rounded-3xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">All automated. Zero manual work.</h3>
              <p className="text-lg text-muted-foreground mb-8">
                mailfra handles the entire workflow so you can focus on closing deals, not sending emails
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Outreach</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Inbox Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">5x</div>
                  <div className="text-sm text-muted-foreground">More Responses</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
