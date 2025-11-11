// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { Loader2 } from "lucide-react"

// interface CrmIntegrationSetupProps {
//   onSuccess?: () => void
// }

// export function CrmIntegrationSetup({ onSuccess }: CrmIntegrationSetupProps) {
//   const { toast } = useToast()
//   const [connecting, setConnecting] = useState(false)
//   const [selectedCrm, setSelectedCrm] = useState<"hubspot" | "salesforce" | "pipedrive" | null>(null)

//   const handleConnect = async (crmType: "hubspot" | "salesforce" | "pipedrive") => {
//     setConnecting(true)
//     try {
//       const response = await fetch("/api/integrations/crm/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ crmType }),
//       })

//       if (!response.ok) throw new Error("Connection failed")

//       const data = await response.json()
//       window.location.href = data.authUrl

//       setTimeout(() => {
//         onSuccess?.()
//       }, 2000)
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to connect CRM", variant: "destructive" })
//     } finally {
//       setConnecting(false)
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-96">
//       <div className="max-w-2xl w-full">
//         <Card>
//           <CardHeader>
//             <CardTitle>Connect Your CRM</CardTitle>
//             <CardDescription>
//               Sync your leads directly from your CRM for AI-powered deal scoring and email personalization
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-3">
//               <CrmOption
//                 name="HubSpot"
//                 description="Sales CRM & marketing automation"
//                 logo="🔵"
//                 onConnect={() => handleConnect("hubspot")}
//                 disabled={connecting}
//               />
//               <CrmOption
//                 name="Salesforce"
//                 description="Enterprise CRM platform"
//                 logo="☁️"
//                 onConnect={() => handleConnect("salesforce")}
//                 disabled={connecting}
//               />
//               <CrmOption
//                 name="Pipedrive"
//                 description="Sales-focused CRM"
//                 logo="📊"
//                 onConnect={() => handleConnect("pipedrive")}
//                 disabled={connecting}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// function CrmOption({
//   name,
//   description,
//   logo,
//   onConnect,
//   disabled,
// }: {
//   name: string
//   description: string
//   logo: string
//   onConnect: () => void
//   disabled: boolean
// }) {
//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardContent className="pt-6 space-y-4">
//         <div className="text-4xl">{logo}</div>
//         <div>
//           <h3 className="font-semibold">{name}</h3>
//           <p className="text-sm text-muted-foreground">{description}</p>
//         </div>
//         <Button onClick={onConnect} disabled={disabled} className="w-full">
//           {disabled && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//           Connect
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface CrmIntegrationSetupProps {
  onSuccess?: () => void
}

export function CrmIntegrationSetup({ onSuccess }: CrmIntegrationSetupProps) {
  const { toast } = useToast()
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async (crmType: "hubspot" | "salesforce" | "pipedrive") => {
    setConnecting(true)
    try {
      const response = await fetch("/api/integrations/crm/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crmType }),
      })

      if (!response.ok) throw new Error("Connection failed")

      const data = await response.json()
      window.location.href = data.authUrl

      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("[builtbycashe] CRM connect error:", error)
      toast({ title: "Error", description: "Failed to connect CRM", variant: "destructive" })
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your CRM</CardTitle>
            <CardDescription>
              Sync your leads directly from your CRM for AI-powered deal scoring and email personalization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <CrmOption
                name="HubSpot"
                description="Sales CRM & marketing automation"
                logoSrc="/hubspot.png"
                alt="HubSpot"
                onConnect={() => handleConnect("hubspot")}
                disabled={connecting}
              />
              <CrmOption
                name="Salesforce"
                description="Enterprise CRM platform"
                logoSrc="/salesforce.png"
                alt="Salesforce"
                onConnect={() => handleConnect("salesforce")}
                disabled={connecting}
              />
              <CrmOption
                name="Pipedrive"
                description="Sales-focused CRM"
                logoSrc="/pipedrive.png"
                alt="Pipedrive"
                onConnect={() => handleConnect("pipedrive")}
                disabled={connecting}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CrmOption({
  name,
  description,
  logoSrc,
  alt,
  onConnect,
  disabled,
}: {
  name: string
  description: string
  logoSrc: string
  alt: string
  onConnect: () => void
  disabled: boolean
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 space-y-4">
        <div className="h-12 w-12 relative">
          <Image src={logoSrc || "/placeholder.svg"} alt={alt} fill className="object-contain" />
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={onConnect} disabled={disabled} className="w-full">
          {disabled && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Connect
        </Button>
      </CardContent>
    </Card>
  )
}
