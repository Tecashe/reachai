// "use client"

// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// interface ConnectionMethod {
//   id: string
//   title: string
//   description: string
//   badge?: string
// }

// const methods: ConnectionMethod[] = [
//   {
//     id: "app-password",
//     title: "Gmail App Password",
//     description: "Connect personal Gmail with app-specific password (easiest)",
//     badge: "Easiest Setup",
//   },
//   {
//     id: "manual-smtp",
//     title: "Manual SMTP/IMAP",
//     description: "Custom SMTP/IMAP settings for any provider (Gmail, Outlook, Yahoo, etc)",
//     badge: "Most Control",
//   },
// ]

// export function ConnectionSelector({ onSelect }: { onSelect: (method: string) => void }) {
//   return (
//     <div className="space-y-4">
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Connect Email Account</h2>
//         <p className="text-sm text-muted-foreground">Choose how you'd like to connect your email</p>
//       </div>

//       <div className="grid gap-3">
//         {methods.map((method) => (
//           <Card
//             key={method.id}
//             className="cursor-pointer hover:border-primary transition-colors"
//             onClick={() => onSelect(method.id)}
//           >
//             <CardContent className="pt-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-semibold">{method.title}</h3>
//                   <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
//                 </div>
//                 {method.badge && <Badge variant="outline">{method.badge}</Badge>}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"
import { SetupGuideModal } from "./setup-guide-modal"

interface Provider {
  id: "gmail" | "outlook" | "yahoo" | "custom"
  name: string
  icon: string
  description: string
}

const PROVIDERS: Provider[] = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "📧",
    description: "Connect your Gmail account with app password",
  },
  {
    id: "outlook",
    name: "Outlook / Microsoft 365",
    icon: "💼",
    description: "Connect your Outlook or Microsoft email",
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    icon: "🔶",
    description: "Connect your Yahoo email account",
  },
  {
    id: "custom",
    name: "Custom SMTP/IMAP",
    icon: "⚙️",
    description: "Advanced: Connect any email provider",
  },
]

interface ConnectionSelectorWithGuideProps {
  onSelect: (provider: Provider["id"]) => void
}

export function ConnectionSelectorWithGuide({ onSelect }: ConnectionSelectorWithGuideProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider["id"] | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)

  const handleSelectProvider = (providerId: Provider["id"]) => {
    setSelectedProvider(providerId)
    onSelect(providerId)
  }

  const handleOpenGuide = (providerId: Provider["id"]) => {
    setSelectedProvider(providerId)
    setGuideOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {PROVIDERS.map((provider) => (
          <Card
            key={provider.id}
            className={`cursor-pointer transition-all ${
              selectedProvider === provider.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => handleSelectProvider(provider.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{provider.icon}</span>
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{provider.description}</CardDescription>
                  </div>
                </div>
                {selectedProvider === provider.id && (
                  <Badge variant="default" className="ml-2">
                    Selected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenGuide(provider.id)
                }}
              >
                <HelpCircle className="h-4 w-4" />
                View Setup Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProvider && selectedProvider !== "custom" && (
        <SetupGuideModal open={guideOpen} onOpenChange={setGuideOpen} provider={selectedProvider} />
      )}
    </>
  )
}
