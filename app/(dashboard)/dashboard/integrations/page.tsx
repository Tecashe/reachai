// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Check, ExternalLink } from "lucide-react"

// const integrations = [
//   {
//     name: "Gmail",
//     description: "Send emails directly from your Gmail account",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: true,
//     category: "Email",
//   },
//   {
//     name: "Outlook",
//     description: "Connect your Microsoft Outlook account",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: false,
//     category: "Email",
//   },
//   {
//     name: "Salesforce",
//     description: "Sync prospects and deals with Salesforce",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: false,
//     category: "CRM",
//   },
//   {
//     name: "HubSpot",
//     description: "Integrate with HubSpot CRM",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: true,
//     category: "CRM",
//   },
//   {
//     name: "Slack",
//     description: "Get notifications in Slack",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: false,
//     category: "Communication",
//   },
//   {
//     name: "Zapier",
//     description: "Connect with 5000+ apps via Zapier",
//     logo: "/placeholder.svg?height=40&width=40",
//     connected: false,
//     category: "Automation",
//   },
// ]

// export default function IntegrationsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
//         <p className="text-muted-foreground">Connect ReachAI with your favorite tools</p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {integrations.map((integration) => (
//           <Card key={integration.name}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
//                     <img src={integration.logo || "/placeholder.svg"} alt={integration.name} className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <CardTitle className="text-lg">{integration.name}</CardTitle>
//                     <Badge variant="secondary" className="text-xs mt-1">
//                       {integration.category}
//                     </Badge>
//                   </div>
//                 </div>
//                 {integration.connected && (
//                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
//                     <Check className="h-4 w-4 text-white" />
//                   </div>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p className="text-sm text-muted-foreground">{integration.description}</p>
//               <Button className="w-full" variant={integration.connected ? "outline" : "default"}>
//                 {integration.connected ? "Manage" : "Connect"}
//                 <ExternalLink className="h-4 w-4 ml-2" />
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink } from "lucide-react"
import { getUserIntegrations } from "@/lib/actions/integrations"

const availableIntegrations = [
  {
    type: "GMAIL",
    name: "Gmail",
    description: "Send emails directly from your Gmail account",
    category: "Email",
  },
  {
    type: "OUTLOOK",
    name: "Outlook",
    description: "Connect your Microsoft Outlook account",
    category: "Email",
  },
  {
    type: "RESEND",
    name: "Resend",
    description: "Use Resend for email delivery",
    category: "Email",
  },
  {
    type: "OPENAI",
    name: "OpenAI",
    description: "Power AI features with your own OpenAI API key",
    category: "AI",
  },
  {
    type: "STRIPE",
    name: "Stripe",
    description: "Accept payments and manage subscriptions",
    category: "Payments",
  },
]

export default async function IntegrationsPage() {
  const userIntegrations = await getUserIntegrations()
  const connectedTypes = new Set(userIntegrations.map((i) => i.type))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect ReachAI with your favorite tools</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableIntegrations.map((integration) => {
          const isConnected = connectedTypes.has(integration.type as any)
          return (
            <Card key={integration.type}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <span className="text-lg font-bold">{integration.name[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                <Button className="w-full" variant={isConnected ? "outline" : "default"}>
                  {isConnected ? "Manage" : "Connect"}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
