// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
// import { Copy, CheckCircle2, Building2, ExternalLink, AlertCircle } from "lucide-react"

// interface Props {
//   onAccountAdded: () => void
// }

// export function WorkspaceDelegationFlow({ onAccountAdded }: Props) {
//   const [copied, setCopied] = useState(false)
//   const { toast } = useToast()

//   // This should come from your environment variable
//   const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(clientId)
//       setCopied(true)
//       toast({
//         title: "Copied!",
//         description: "Client ID copied to clipboard",
//       })
//       setTimeout(() => setCopied(false), 2000)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to copy to clipboard",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleProceedToOAuth = () => {
//     // After admin completes delegation, user can proceed with regular OAuth
//     window.location.href = "/api/auth/gmail"
//   }

//   return (
//     <div className="space-y-4">
//       <Card className="p-4 bg-primary/5 border-primary/20">
//         <div className="flex gap-3">
//           <Building2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
//           <div className="space-y-1.5">
//             <p className="font-medium text-sm text-foreground">Enterprise Setup</p>
//             <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
//               <li>• Pre-approve for all users in your Google Workspace</li>
//               <li>• No individual user approval needed</li>
//               <li>• One-time setup by Workspace admin</li>
//             </ul>
//           </div>
//         </div>
//       </Card>

//       <Card className="p-5 bg-card border-border/50">
//         <div className="space-y-4">
//           <div>
//             <p className="text-sm font-medium text-foreground mb-3">
//               Allow your app to access Google Workspace
//             </p>
//             <div className="bg-success/10 text-success text-xs px-3 py-2 rounded-md inline-block mb-4">
//               You only need to do this once per domain
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
//                   1
//                 </span>
//                 <div className="flex-1">
//                   <p className="text-sm text-foreground mb-1">Go to your Google Workspace Admin Panel</p>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-8 text-xs gap-2"
//                     onClick={() => window.open("https://admin.google.com/ac/owl/list?tab=configuredApps", "_blank")}
//                   >
//                     Open Admin Console
//                     <ExternalLink className="h-3 w-3" />
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
//                   2
//                 </span>
//                 <p className="text-sm text-foreground flex-1">Click "Configure new app"</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
//                   3
//                 </span>
//                 <div className="flex-1 space-y-2">
//                   <p className="text-sm text-foreground">Use the following Client ID to search for your app:</p>
//                   <div className="bg-muted/30 p-3 rounded-md border border-border/50">
//                     <div className="flex items-start justify-between gap-2">
//                       <code className="text-xs font-mono text-foreground break-all flex-1">
//                         {clientId || "Your Client ID will appear here"}
//                       </code>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-7 px-2 flex-shrink-0"
//                         onClick={handleCopy}
//                         disabled={!clientId}
//                       >
//                         {copied ? (
//                           <CheckCircle2 className="h-3.5 w-3.5 text-success" />
//                         ) : (
//                           <Copy className="h-3.5 w-3.5" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
//                   4
//                 </span>
//                 <p className="text-sm text-foreground flex-1">
//                   Select and approve your app to access your Google Workspace
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-start gap-3">
//                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
//                   5
//                 </span>
//                 <div className="flex-1">
//                   <p className="text-sm text-foreground mb-2">
//                     After admin approval, click below to connect your account
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       <Card className="p-4 bg-muted/30 border-border/50">
//         <div className="flex gap-3">
//           <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
//           <div className="space-y-1">
//             <p className="text-xs text-muted-foreground leading-relaxed">
//               <span className="font-medium text-foreground">Note:</span> This requires admin access to your Google
//               Workspace. If you don't have admin access, use the standard OAuth option instead.
//             </p>
//           </div>
//         </div>
//       </Card>

//       <Button onClick={handleProceedToOAuth} className="w-full h-10 gap-2" size="sm">
//         <CheckCircle2 className="h-4 w-4" />
//         Continue with Google OAuth
//       </Button>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Copy, CheckCircle2, Building2, ExternalLink, AlertCircle } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function WorkspaceDelegationFlow({ onAccountAdded }: Props) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // This should come from your environment variable
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(clientId)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Client ID copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleProceedToOAuth = () => {
    // After admin completes delegation, user can proceed with regular OAuth
    window.location.href = "/api/auth/gmail"
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Building2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-medium text-sm text-foreground">Enterprise Setup</p>
            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <li>• Pre-approve for all users in your Google Workspace</li>
              <li>• No individual user approval needed</li>
              <li>• One-time setup by Workspace admin</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Allow our app to access your Google Workspace
            </p>
            <div className="bg-success/10 text-success text-xs px-3 py-2 rounded-md inline-block mb-4">
              You only need to do this once per domain
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  1
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-1">Go to your Google Workspace Admin Panel</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-2"
                    onClick={() => window.open("https://admin.google.com/ac/owl/list?tab=configuredApps", "_blank")}
                  >
                    Open Admin Console
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  2
                </span>
                <p className="text-sm text-foreground flex-1">Click "Configure new app"</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  3
                </span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">Use the following Client ID to search for us:</p>
                  <div className="bg-muted/30 p-3 rounded-md border border-border/50">
                    <div className="flex items-start justify-between gap-2">
                      <code className="text-xs font-mono text-foreground break-all flex-1">
                        {clientId || "Loading Client ID..."}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 flex-shrink-0"
                        onClick={handleCopy}
                        disabled={!clientId}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {!clientId && (
                    <p className="text-xs text-warning mt-1">
                      Client ID not configured. Please contact support.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  4
                </span>
                <p className="text-sm text-foreground flex-1">
                  Select and approve our app to access your Google Workspace
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                  5
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground mb-2">
                    After admin approval, click below to connect your account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Note:</span> This requires admin access to your Google
              Workspace. If you don't have admin access, use the standard OAuth option instead.
            </p>
          </div>
        </div>
      </Card>

      <Button onClick={handleProceedToOAuth} className="w-full h-10 gap-2" size="sm">
        <CheckCircle2 className="h-4 w-4" />
        Continue with Google OAuth
      </Button>
    </div>
  )
}