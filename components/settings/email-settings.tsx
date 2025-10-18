// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"

// export function EmailSettings() {
//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Sender Information</CardTitle>
//           <CardDescription>Configure your email sender details</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="fromName">From Name</Label>
//             <Input id="fromName" defaultValue="John Doe" />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="fromEmail">From Email</Label>
//             <Input id="fromEmail" type="email" defaultValue="john@acme.com" />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="replyTo">Reply-To Email</Label>
//             <Input id="replyTo" type="email" defaultValue="john@acme.com" />
//           </div>

//           <Button>Save Changes</Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Email Signature</CardTitle>
//           <CardDescription>Add a signature to your outgoing emails</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="signature">Signature</Label>
//             <textarea
//               id="signature"
//               className="w-full min-h-32 px-3 py-2 text-sm rounded-md border border-input bg-background"
//               defaultValue="Best regards,&#10;John Doe&#10;Sales Manager, Acme Inc."
//             />
//           </div>

//           <Button>Save Signature</Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Email Tracking</CardTitle>
//           <CardDescription>Configure email tracking preferences</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Track Email Opens</Label>
//               <p className="text-sm text-muted-foreground">Get notified when recipients open your emails</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Track Link Clicks</Label>
//               <p className="text-sm text-muted-foreground">Track when recipients click links in your emails</p>
//             </div>
//             <Switch defaultChecked />
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Track Replies</Label>
//               <p className="text-sm text-muted-foreground">Automatically detect and log email replies</p>
//             </div>
//             <Switch defaultChecked />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Loader2 } from "lucide-react"
// import { updateEmailSettings, getUser } from "@/lib/actions/settings"

// export function EmailSettings() {
//   const [loading, setLoading] = useState(false)
//   const [userData, setUserData] = useState<any>(null)

//   useEffect(() => {
//     getUser().then(setUserData).catch(console.error)
//   }, [])

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setLoading(true)

//     try {
//       const formData = new FormData(e.currentTarget)
//       await updateEmailSettings(formData)
//       alert("Email settings updated successfully!")
//     } catch (error) {
//       alert("Failed to update email settings")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!userData) {
//     return (
//       <Card>
//         <CardContent className="p-12 text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Sender Information</CardTitle>
//           <CardDescription>Configure your email sender details</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="defaultFromName">From Name</Label>
//               <Input
//                 id="defaultFromName"
//                 name="defaultFromName"
//                 defaultValue={userData.defaultFromName || ""}
//                 placeholder="Your Name"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="defaultFromEmail">From Email</Label>
//               <Input
//                 id="defaultFromEmail"
//                 name="defaultFromEmail"
//                 type="email"
//                 defaultValue={userData.defaultFromEmail || ""}
//                 placeholder="you@company.com"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="emailSignature">Email Signature</Label>
//               <textarea
//                 id="emailSignature"
//                 name="emailSignature"
//                 className="w-full min-h-32 px-3 py-2 text-sm rounded-md border border-input bg-background"
//                 defaultValue={userData.emailSignature || ""}
//                 placeholder="Best regards,&#10;Your Name&#10;Your Title"
//               />
//             </div>

//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateEmailSettings, getUser } from "@/lib/actions/settings"

interface EmailSettingsProps {
  settings: {
    defaultFromName: string | null
    defaultFromEmail: string | null
    emailSignature: string | null
  }
}

export function EmailSettings({ settings: initialSettings }: EmailSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(initialSettings)

  useEffect(() => {
    getUser().then(setUserData).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await updateEmailSettings(formData)
      alert("Email settings updated successfully!")
    } catch (error) {
      alert("Failed to update email settings")
    } finally {
      setLoading(false)
    }
  }

  if (!userData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sender Information</CardTitle>
          <CardDescription>Configure your email sender details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultFromName">From Name</Label>
              <Input
                id="defaultFromName"
                name="defaultFromName"
                defaultValue={userData.defaultFromName || ""}
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultFromEmail">From Email</Label>
              <Input
                id="defaultFromEmail"
                name="defaultFromEmail"
                type="email"
                defaultValue={userData.defaultFromEmail || ""}
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSignature">Email Signature</Label>
              <textarea
                id="emailSignature"
                name="emailSignature"
                className="w-full min-h-32 px-3 py-2 text-sm rounded-md border border-input bg-background"
                defaultValue={userData.emailSignature || ""}
                placeholder="Best regards,&#10;Your Name&#10;Your Title"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
