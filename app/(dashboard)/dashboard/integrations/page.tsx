
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { getUserIntegrations } from "@/lib/actions/integrations"
import { IntegrationCard } from "@/components/integrations/integration-card"

const availableIntegrations = [
  {
    type: "GMAIL",
    name: "Gmail",
    description: "Send emails directly from your Gmail account with OAuth authentication",
    category: "Email",
    icon: "📧",
    features: ["OAuth 2.0 Authentication", "Send emails", "Track delivery", "Auto-sync"],
  },
  {
    type: "OUTLOOK",
    name: "Outlook",
    description: "Connect your Microsoft Outlook account for email sending",
    category: "Email",
    icon: "📨",
    features: ["Microsoft OAuth", "Send emails", "Calendar integration", "Contact sync"],
  },
  {
    type: "RESEND",
    name: "Resend",
    description: "Use Resend API for reliable email delivery and tracking",
    category: "Email",
    icon: "✉️",
    features: ["API Key Authentication", "High deliverability", "Email analytics", "Webhooks"],
  },
  {
    type: "OPENAI",
    name: "OpenAI",
    description: "Power AI features with your own OpenAI API key for email generation",
    category: "AI",
    icon: "🤖",
    features: ["GPT-4 Access", "Custom prompts", "Email generation", "Research insights"],
  },
]

export default async function IntegrationsPage() {
  const userIntegrations = await getUserIntegrations()
  const connectedTypes = new Set(userIntegrations.map((i) => i.type))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect mailfra with your email providers and AI services</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>All-in-One Platform</CardTitle>
          <CardDescription>
            mailfra includes built-in email warmup, deliverability optimization, A/B testing, advanced analytics, and
            AI-powered email generation. No need for external tools like Lemlist or Instantly.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Connected Integrations Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Services</CardTitle>
          <CardDescription>
            You have {userIntegrations.length} integration{userIntegrations.length !== 1 ? "s" : ""} connected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userIntegrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No integrations connected yet</p>
            ) : (
              userIntegrations.map((integration) => (
                <Badge key={integration.id} variant="secondary" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {integration.name}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Integrations</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableIntegrations.map((integration) => {
            const isConnected = connectedTypes.has(integration.type as any)
            const connectedIntegration = userIntegrations.find((i) => i.type === integration.type)
            return (
              <IntegrationCard
                key={integration.type}
                integration={integration}
                isConnected={isConnected}
                connectedIntegration={connectedIntegration}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
