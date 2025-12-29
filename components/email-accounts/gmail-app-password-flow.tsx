// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
// import { WaveLoader } from "@/components/loader/wave-loader"
// import { AlertCircle, CheckCircle2 } from "lucide-react"

// interface Props {
//   onAccountAdded: () => void
// }

// export function GmailAppPasswordFlow({ onAccountAdded }: Props) {
//   const [formData, setFormData] = useState({
//     accountName: "",
//     email: "",
//     appPassword: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       setIsLoading(true)
//       const response = await fetch("/api/settings/sending-accounts/app-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           provider: "gmail",
//           connectionMethod: "app_password",
//         }),
//       })
//       if (!response.ok) throw new Error("Failed to add account")
//       toast({
//         title: "Success",
//         description: "Gmail account connected successfully",
//       })
//       onAccountAdded()
//     } catch (error) {
//       console.error("[v0] App password setup error:", error)
//       toast({
//         title: "Error",
//         description: "Failed to connect email account",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <Card className="p-4 bg-warning/5 border-warning/20">
//         <div className="flex gap-3">
//           <AlertCircle className="h-4 w-4 text-warning-foreground flex-shrink-0 mt-0.5" />
//           <div className="space-y-1.5">
//             <p className="font-medium text-sm text-foreground">Requirements</p>
//             <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
//               <li>• 2FA must be enabled on your Google account</li>
//               <li>• Generate App Password at myaccount.google.com/apppasswords</li>
//             </ul>
//           </div>
//         </div>
//       </Card>

//       <Card className="p-5 bg-card border-border/50">
//         <div className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-foreground mb-1.5">Account Name</label>
//             <Input
//               name="accountName"
//               placeholder="My Gmail Account"
//               value={formData.accountName}
//               onChange={handleInputChange}
//               required
//               className="h-9 text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-foreground mb-1.5">Gmail Address</label>
//             <Input
//               name="email"
//               type="email"
//               placeholder="your-email@gmail.com"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//               className="h-9 text-sm"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-foreground mb-1.5">App Password</label>
//             <Input
//               name="appPassword"
//               type="password"
//               placeholder="16-character app password"
//               value={formData.appPassword}
//               onChange={handleInputChange}
//               required
//               className="h-9 text-sm"
//             />
//             <p className="text-xs text-muted-foreground mt-1.5">Enter without spaces</p>
//           </div>
//         </div>
//       </Card>

//       <Button type="submit" disabled={isLoading} className="w-full h-10 gap-2" size="sm">
//         {isLoading ? (
//           <>
//             <WaveLoader size="sm" color="bg-primary-foreground" />
//             <span>Connecting...</span>
//           </>
//         ) : (
//           <>
//             <CheckCircle2 className="h-4 w-4" />
//             Connect Account
//           </>
//         )}
//       </Button>
//     </form>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function GmailAppPasswordFlow({ onAccountAdded }: Props) {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    appPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/settings/sending-accounts/app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          provider: "gmail",
          connectionMethod: "app_password",
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to add account")
      }

      toast({
        title: "Success",
        description: "Gmail account connected successfully",
      })
      
      // Reset form
      setFormData({
        accountName: "",
        email: "",
        appPassword: "",
      })
      
      // Call the callback to refresh the parent component
      onAccountAdded()
      
    } catch (error) {
      console.error("[v0] App password setup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect email account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-4 bg-warning/5 border-warning/20">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-warning-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-medium text-sm text-foreground">Requirements</p>
            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <li>• 2FA must be enabled on your Google account</li>
              <li>• Generate App Password at myaccount.google.com/apppasswords</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Account Name</label>
            <Input
              name="accountName"
              placeholder="My Gmail Account"
              value={formData.accountName}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Gmail Address</label>
            <Input
              name="email"
              type="email"
              placeholder="your-email@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">App Password</label>
            <Input
              name="appPassword"
              type="password"
              placeholder="16-character app password"
              value={formData.appPassword}
              onChange={handleInputChange}
              required
              className="h-9 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1.5">Enter without spaces</p>
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={isLoading} className="w-full h-10 gap-2" size="sm">
        {isLoading ? (
          <>
            <WaveLoader size="sm" color="bg-primary-foreground" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Connect Account
          </>
        )}
      </Button>
    </form>
  )
}