// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Mail, Plus, Zap, AlertCircle } from "lucide-react"
// import { toast } from "sonner"
// import { WaveLoader } from "@/components/loader/wave-loader"

// interface ConnectedAccount {
//   id: string
//   email: string
//   provider: string
//   warmupEnabled: boolean
//   connectionDate: Date
// }

// export function AccountWarmupSelector() {
//   const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [enablingAccounts, setEnablingAccounts] = useState<Set<string>>(new Set())

//   useEffect(() => {
//     fetchConnectedAccounts()
//   }, [])

//   const fetchConnectedAccounts = async () => {
//     try {
//       const response = await fetch("/api/settings/sending-accounts")
//       if (!response.ok) throw new Error("Failed to fetch accounts")

//       const data = await response.json()
//       const accounts = (data.accounts || []).map((acc: any) => ({
//         id: acc.id,
//         email: acc.email,
//         provider: acc.provider,
//         warmupEnabled: acc.warmupEnabled || false,
//         connectionDate: acc.createdAt,
//       }))

//       setConnectedAccounts(accounts)
//     } catch (error) {
//       console.error("[v0] Error fetching connected accounts:", error)
//       toast.error("Failed to load connected accounts")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEnableWarmup = async (accountId: string) => {
//     setEnablingAccounts((prev) => new Set(prev).add(accountId))

//     try {
//       const response = await fetch(`/api/settings/sending-accounts/${accountId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ warmupEnabled: true }),
//       })

//       if (!response.ok) throw new Error("Failed to enable warmup")

//       setConnectedAccounts((prev) => prev.map((acc) => (acc.id === accountId ? { ...acc, warmupEnabled: true } : acc)))

//       toast.success("Warmup enabled! Your account will start warming up shortly.")
//     } catch (error) {
//       console.error("[v0] Error enabling warmup:", error)
//       toast.error("Failed to enable warmup")
//     } finally {
//       setEnablingAccounts((prev) => {
//         const updated = new Set(prev)
//         updated.delete(accountId)
//         return updated
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-8">
//         <WaveLoader color="bg-foreground" size="sm" speed="normal" />
//       </div>
//     )
//   }

//   const disabledAccounts = connectedAccounts.filter((acc) => !acc.warmupEnabled)
//   const enabledAccounts = connectedAccounts.filter((acc) => acc.warmupEnabled)

//   return (
//     <div className="space-y-6">
//       {/* Enabled Accounts */}
//       {enabledAccounts.length > 0 && (
//         <div className="space-y-3">
//           <div>
//             <h3 className="text-sm font-semibold text-foreground">Warming Accounts ({enabledAccounts.length})</h3>
//             <p className="text-xs text-muted-foreground">These accounts are actively warming up</p>
//           </div>
//           <div className="grid gap-3 md:grid-cols-2">
//             {enabledAccounts.map((account) => (
//               <Card key={account.id} className="border border-border">
//                 <CardContent className="pt-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
//                         <Zap className="h-5 w-5 text-success" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-foreground">{account.email}</p>
//                         <p className="text-xs text-muted-foreground capitalize">{account.provider}</p>
//                       </div>
//                     </div>
//                     <Badge variant="outline" className="bg-success/10 text-success border-success/20">
//                       Warming
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Available to Enable */}
//       {disabledAccounts.length > 0 && (
//         <div className="space-y-3">
//           <div>
//             <h3 className="text-sm font-semibold text-foreground">Available Accounts ({disabledAccounts.length})</h3>
//             <p className="text-xs text-muted-foreground">Click to add these accounts to the warmup pool</p>
//           </div>
//           <div className="grid gap-3 md:grid-cols-2">
//             {disabledAccounts.map((account) => (
//               <Card key={account.id} className="border border-border hover:border-foreground/30 transition-colors">
//                 <CardContent className="pt-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
//                         <Mail className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-foreground truncate">{account.email}</p>
//                         <p className="text-xs text-muted-foreground capitalize">{account.provider}</p>
//                       </div>
//                     </div>
//                     <Button
//                       size="sm"
//                       onClick={() => handleEnableWarmup(account.id)}
//                       disabled={enablingAccounts.has(account.id)}
//                     >
//                       {enablingAccounts.has(account.id) ? (
//                         <>
//                           <WaveLoader color="bg-white" size="sm" speed="normal" />
//                         </>
//                       ) : (
//                         <>
//                           <Plus className="h-4 w-4 mr-1" />
//                           Enable
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* No Accounts */}
//       {connectedAccounts.length === 0 && (
//         <Card className="border border-border">
//           <CardHeader className="text-center">
//             <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//             <CardTitle className="text-base">No Connected Accounts</CardTitle>
//             <CardDescription>Connect email accounts in the settings to start warming them up</CardDescription>
//           </CardHeader>
//           <CardContent className="text-center">
//             <Button asChild>
//               <a href="/dashboard/settings?tab=email-accounts">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Connect Email Account
//               </a>
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       {/* Info Banner for Free Users */}
//       {connectedAccounts.length > 0 && (
//         <div className="p-4 bg-muted/50 border border-border rounded-lg">
//           <div className="flex gap-3">
//             <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
//             <div className="text-sm text-muted-foreground">
//               <p className="font-medium text-foreground mb-1">Free users get basic warmup access</p>
//               <p>
//                 All accounts get access to our basic warmup pool. Upgrade to PRO for advanced features like peer-to-peer
//                 matching and AI-generated responses.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Zap, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { WaveLoader } from "@/components/loader/wave-loader"

interface ConnectedAccount {
  id: string
  email: string
  provider: string
  warmupEnabled: boolean
  createdAt: Date
}

export function AccountWarmupSelector() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [enablingAccounts, setEnablingAccounts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchConnectedAccounts()
  }, [])

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch("/api/settings/sending-accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")

      const data = await response.json()
      setConnectedAccounts(data.accounts || [])
    } catch (error) {
      console.error("[v0] Error fetching connected accounts:", error)
      toast.error("Failed to load connected accounts")
    } finally {
      setLoading(false)
    }
  }

  const handleEnableWarmup = async (accountId: string) => {
    setEnablingAccounts((prev) => new Set(prev).add(accountId))

    try {
      const response = await fetch(`/api/settings/sending-accounts/${accountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warmupEnabled: true }),
      })

      if (!response.ok) throw new Error("Failed to enable warmup")

      setConnectedAccounts((prev) => prev.map((acc) => (acc.id === accountId ? { ...acc, warmupEnabled: true } : acc)))

      toast.success("Account added to warmup pool! It will start warming up now.")
    } catch (error) {
      console.error("[v0] Error enabling warmup:", error)
      toast.error("Failed to enable warmup")
    } finally {
      setEnablingAccounts((prev) => {
        const updated = new Set(prev)
        updated.delete(accountId)
        return updated
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <WaveLoader color="bg-foreground" size="sm" speed="normal" />
      </div>
    )
  }

  const disabledAccounts = connectedAccounts.filter((acc) => !acc.warmupEnabled)
  const enabledAccounts = connectedAccounts.filter((acc) => acc.warmupEnabled)

  return (
    <div className="space-y-6">
      {/* Enabled Accounts */}
      {enabledAccounts.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Warming Accounts ({enabledAccounts.length})</h3>
            <p className="text-xs text-muted-foreground">These accounts are actively warming up</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {enabledAccounts.map((account) => (
              <Card key={account.id} className="border border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{account.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.provider}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Warming
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available to Enable */}
      {disabledAccounts.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Available Accounts ({disabledAccounts.length})</h3>
            <p className="text-xs text-muted-foreground">Click to add these accounts to the warmup pool</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {disabledAccounts.map((account) => (
              <Card key={account.id} className="border border-border hover:border-foreground/30 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{account.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{account.provider}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleEnableWarmup(account.id)}
                      disabled={enablingAccounts.has(account.id)}
                    >
                      {enablingAccounts.has(account.id) ? (
                        <>
                          <WaveLoader color="bg-white" size="sm" speed="normal" />
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Enable
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Accounts */}
      {connectedAccounts.length === 0 && (
        <Card className="border border-border">
          <CardHeader className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <CardTitle className="text-base">No Connected Accounts</CardTitle>
            <CardDescription>Connect email accounts in the settings to start warming them up</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/dashboard/settings?tab=email-accounts">
                <Plus className="h-4 w-4 mr-2" />
                Connect Email Account
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Banner for Free Users */}
      {connectedAccounts.length > 0 && (
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Free users get basic warmup access</p>
              <p>
                All accounts get access to our basic warmup pool. Upgrade to PRO for advanced features like peer-to-peer
                matching and AI-generated responses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
