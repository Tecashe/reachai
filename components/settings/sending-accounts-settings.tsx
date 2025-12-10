// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Mail, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
// import {
//   createSendingAccount,
//   getSendingAccounts,
//   deleteSendingAccount,
//   toggleSendingAccount,
// } from "@/lib/actions/sending-accounts"

// interface SendingAccount {
//   id: string
//   name: string
//   email: string
//   provider: string
//   dailyLimit: number
//   hourlyLimit: number
//   emailsSentToday: number
//   emailsSentThisHour: number
//   warmupEnabled: boolean
//   warmupStage: number
//   warmupDailyLimit: number
//   isActive: boolean
//   bounceRate: number
//   createdAt: Date
// }

// export function SendingAccountsSettings() {
//   const [accounts, setAccounts] = useState<SendingAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     provider: "resend",
//     apiKey: "",
//     dailyLimit: 50,
//     hourlyLimit: 10,
//   })

//   useEffect(() => {
//     loadAccounts()
//   }, [])

//   async function loadAccounts() {
//     try {
//       const data = await getSendingAccounts()
//       setAccounts(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load sending accounts",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleCreateAccount() {
//     try {
//       setLoading(true)
//       await createSendingAccount(formData)
//       toast({
//         title: "Success",
//         description: "Sending account created successfully",
//       })
//       setDialogOpen(false)
//       setFormData({
//         name: "",
//         email: "",
//         provider: "resend",
//         apiKey: "",
//         dailyLimit: 50,
//         hourlyLimit: 10,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create sending account",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDeleteAccount(accountId: string) {
//     if (!confirm("Are you sure you want to delete this sending account?")) return

//     try {
//       await deleteSendingAccount(accountId)
//       toast({
//         title: "Success",
//         description: "Sending account deleted",
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   async function handleToggleAccount(accountId: string, isActive: boolean) {
//     try {
//       await toggleSendingAccount(accountId, isActive)
//       toast({
//         title: "Success",
//         description: `Sending account ${isActive ? "activated" : "deactivated"}`,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   if (loading && accounts.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-medium">Sending Accounts</h3>
//           <p className="text-sm text-muted-foreground">
//             Manage multiple email accounts for better deliverability and higher sending limits
//           </p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Account
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add Sending Account</DialogTitle>
//               <DialogDescription>
//                 Connect a new email account to rotate sending and improve deliverability
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Account Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="My Primary Account"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="noreply@yourdomain.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="provider">Provider</Label>
//                 <Select
//                   value={formData.provider}
//                   onValueChange={(value) => setFormData({ ...formData, provider: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="resend">Resend</SelectItem>
//                     <SelectItem value="gmail">Gmail</SelectItem>
//                     <SelectItem value="outlook">Outlook</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="apiKey">API Key</Label>
//                 <Input
//                   id="apiKey"
//                   type="password"
//                   placeholder="re_xxxxxxxxxxxx"
//                   value={formData.apiKey}
//                   onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="dailyLimit">Daily Limit</Label>
//                   <Input
//                     id="dailyLimit"
//                     type="number"
//                     value={formData.dailyLimit}
//                     onChange={(e) => setFormData({ ...formData, dailyLimit: Number.parseInt(e.target.value) })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="hourlyLimit">Hourly Limit</Label>
//                   <Input
//                     id="hourlyLimit"
//                     type="number"
//                     value={formData.hourlyLimit}
//                     onChange={(e) => setFormData({ ...formData, hourlyLimit: Number.parseInt(e.target.value) })}
//                   />
//                 </div>
//               </div>
//               <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
//                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                 Add Account
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {accounts.length === 0 ? (
//         <Card className="p-12 text-center">
//           <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-4 text-lg font-medium">No sending accounts</h3>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Add your first sending account to start sending emails with better deliverability
//           </p>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {accounts.map((account) => (
//             <Card key={account.id} className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                     <Mail className="h-5 w-5 text-primary" />
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-medium">{account.name}</h4>
//                       {account.isActive ? (
//                         <Badge variant="default" className="gap-1">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Active
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary">Inactive</Badge>
//                       )}
//                       {account.bounceRate > 3 && (
//                         <Badge variant="destructive" className="gap-1">
//                           <AlertCircle className="h-3 w-3" />
//                           High Bounce Rate
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">{account.email}</p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>Provider: {account.provider}</span>
//                       <span>•</span>
//                       <span>
//                         Sent today: {account.emailsSentToday}/
//                         {account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit}
//                       </span>
//                       <span>•</span>
//                       <span>Bounce rate: {account.bounceRate.toFixed(2)}%</span>
//                     </div>
//                     {account.warmupEnabled && (
//                       <div className="mt-2">
//                         <Badge variant="outline">Warmup Stage {account.warmupStage}/5</Badge>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Switch
//                     checked={account.isActive}
//                     onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
//                   />
//                   <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
//         <div className="flex gap-3">
//           <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//           <div className="space-y-1">
//             <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Why use multiple sending accounts?</p>
//             <p className="text-sm text-blue-700 dark:text-blue-300">
//               Rotating between multiple email accounts helps maintain sender reputation, avoid rate limits, and improve
//               deliverability. Each account has its own daily limits and warmup schedule.
//             </p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Mail, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
// import {
//   createSendingAccount,
//   getSendingAccounts,
//   deleteSendingAccount,
//   toggleSendingAccount,
// } from "@/lib/actions/sending-accounts"

// interface SendingAccount {
//   id: string
//   name: string
//   email: string
//   provider: string
//   dailyLimit: number
//   hourlyLimit: number
//   emailsSentToday: number
//   emailsSentThisHour: number
//   warmupEnabled: boolean
//   warmupStage: number
//   warmupDailyLimit: number
//   isActive: boolean
//   bounceRate: number
//   createdAt: Date
// }

// export function SendingAccountsSettings() {
//   const [accounts, setAccounts] = useState<SendingAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     provider: "resend",
//     apiKey: "",
//     dailyLimit: 50,
//     hourlyLimit: 10,
//   })

//   useEffect(() => {
//     loadAccounts()
//   }, [])

//   async function loadAccounts() {
//     try {
//       const data = await getSendingAccounts()
//       const typedAccounts = data.map((account) => ({
//         ...account,
//         warmupStage: account.warmupStage as unknown as number,
//       }))
//       setAccounts(typedAccounts)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load sending accounts",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleCreateAccount() {
//     try {
//       setLoading(true)
//       await createSendingAccount(formData)
//       toast({
//         title: "Success",
//         description: "Sending account created successfully",
//       })
//       setDialogOpen(false)
//       setFormData({
//         name: "",
//         email: "",
//         provider: "resend",
//         apiKey: "",
//         dailyLimit: 50,
//         hourlyLimit: 10,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create sending account",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDeleteAccount(accountId: string) {
//     if (!confirm("Are you sure you want to delete this sending account?")) return

//     try {
//       await deleteSendingAccount(accountId)
//       toast({
//         title: "Success",
//         description: "Sending account deleted",
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   async function handleToggleAccount(accountId: string, isActive: boolean) {
//     try {
//       await toggleSendingAccount(accountId, isActive)
//       toast({
//         title: "Success",
//         description: `Sending account ${isActive ? "activated" : "deactivated"}`,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleConnectGmail = () => {
//     window.location.href = "/api/oauth/gmail"
//   }

//   const handleConnectOutlook = () => {
//     window.location.href = "/api/oauth/outlook"
//   }

//   if (loading && accounts.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-medium">Sending Accounts</h3>
//           <p className="text-sm text-muted-foreground">
//             Connect your email accounts to send campaigns with better deliverability
//           </p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Account
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Connect Email Account</DialogTitle>
//               <DialogDescription>
//                 Choose how you want to connect your email account for sending campaigns
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-3">
//               <Button
//                 variant="outline"
//                 className="w-full h-auto py-4 justify-start bg-transparent"
//                 onClick={handleConnectGmail}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
//                     <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium">Connect Gmail</div>
//                     <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
//                   </div>
//                 </div>
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full h-auto py-4 justify-start bg-transparent"
//                 onClick={handleConnectOutlook}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
//                     <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium">Connect Outlook</div>
//                     <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
//                   </div>
//                 </div>
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-background px-2 text-muted-foreground">Or use API key</span>
//                 </div>
//               </div>

//               <div className="space-y-4 pt-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Account Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="My Primary Account"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="noreply@yourdomain.com"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="provider">Provider</Label>
//                   <Select
//                     value={formData.provider}
//                     onValueChange={(value) => setFormData({ ...formData, provider: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="resend">Resend</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="apiKey">Resend API Key</Label>
//                   <Input
//                     id="apiKey"
//                     type="password"
//                     placeholder="re_xxxxxxxxxxxx"
//                     value={formData.apiKey}
//                     onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Get your API key from{" "}
//                     <a
//                       href="https://resend.com/api-keys"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="underline"
//                     >
//                       resend.com/api-keys
//                     </a>
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="dailyLimit">Daily Limit</Label>
//                     <Input
//                       id="dailyLimit"
//                       type="number"
//                       value={formData.dailyLimit}
//                       onChange={(e) => setFormData({ ...formData, dailyLimit: Number.parseInt(e.target.value) })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="hourlyLimit">Hourly Limit</Label>
//                     <Input
//                       id="hourlyLimit"
//                       type="number"
//                       value={formData.hourlyLimit}
//                       onChange={(e) => setFormData({ ...formData, hourlyLimit: Number.parseInt(e.target.value) })}
//                     />
//                   </div>
//                 </div>
//                 <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
//                   {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                   Add Resend Account
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {accounts.length === 0 ? (
//         <Card className="p-12 text-center">
//           <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-4 text-lg font-medium">No sending accounts</h3>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Add your first sending account to start sending emails with better deliverability
//           </p>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {accounts.map((account) => (
//             <Card key={account.id} className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                     <Mail className="h-5 w-5 text-primary" />
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-medium">{account.name}</h4>
//                       {account.isActive ? (
//                         <Badge variant="default" className="gap-1">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Active
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary">Inactive</Badge>
//                       )}
//                       {account.bounceRate > 3 && (
//                         <Badge variant="destructive" className="gap-1">
//                           <AlertCircle className="h-3 w-3" />
//                           High Bounce Rate
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">{account.email}</p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>Provider: {account.provider}</span>
//                       <span>•</span>
//                       <span>
//                         Sent today: {account.emailsSentToday}/
//                         {account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit}
//                       </span>
//                       <span>•</span>
//                       <span>Bounce rate: {account.bounceRate.toFixed(2)}%</span>
//                     </div>
//                     {account.warmupEnabled && (
//                       <div className="mt-2">
//                         <Badge variant="outline">Warmup Stage {account.warmupStage}/5</Badge>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Switch
//                     checked={account.isActive}
//                     onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
//                   />
//                   <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
//         <div className="flex gap-3">
//           <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//           <div className="space-y-1">
//             <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Why use multiple sending accounts?</p>
//             <p className="text-sm text-blue-700 dark:text-blue-300">
//               Rotating between multiple email accounts helps maintain sender reputation, avoid rate limits, and improve
//               deliverability. Each account has its own daily limits and warmup schedule.
//             </p>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Mail, Trash2, AlertCircle, CheckCircle2, Loader2, ShieldCheck, ShieldAlert } from "lucide-react"
// import {
//   createSendingAccount,
//   getSendingAccounts,
//   deleteSendingAccount,
//   toggleSendingAccount,
// } from "@/lib/actions/sending-accounts"

// interface SendingAccount {
//   id: string
//   name: string
//   email: string
//   provider: string
//   dailyLimit: number
//   hourlyLimit: number
//   emailsSentToday: number
//   emailsSentThisHour: number
//   warmupEnabled: boolean
//   warmupStage: number
//   warmupDailyLimit: number
//   isActive: boolean
//   bounceRate: number
//   healthScore: number
//   domainId: string | null
//   domain: {
//     id: string
//     domain: string
//     isVerified: boolean
//     healthScore: number
//   } | null
//   createdAt: Date
// }

// export function SendingAccountsSettings() {
//   const [accounts, setAccounts] = useState<SendingAccount[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const { toast } = useToast()

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     provider: "resend",
//     apiKey: "",
//     dailyLimit: 50,
//     hourlyLimit: 10,
//   })

//   useEffect(() => {
//     loadAccounts()
//   }, [])

//   async function loadAccounts() {
//     try {
//       const data = await getSendingAccounts()
//       const typedAccounts = data.map((account) => ({
//         ...account,
//         warmupStage: account.warmupStage as unknown as number,
//       }))
//       setAccounts(typedAccounts)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load sending accounts",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleCreateAccount() {
//     try {
//       setLoading(true)
//       await createSendingAccount(formData)
//       toast({
//         title: "Success",
//         description: "Sending account created successfully",
//       })
//       setDialogOpen(false)
//       setFormData({
//         name: "",
//         email: "",
//         provider: "resend",
//         apiKey: "",
//         dailyLimit: 50,
//         hourlyLimit: 10,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create sending account",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleDeleteAccount(accountId: string) {
//     if (!confirm("Are you sure you want to delete this sending account?")) return

//     try {
//       await deleteSendingAccount(accountId)
//       toast({
//         title: "Success",
//         description: "Sending account deleted",
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   async function handleToggleAccount(accountId: string, isActive: boolean) {
//     try {
//       await toggleSendingAccount(accountId, isActive)
//       toast({
//         title: "Success",
//         description: `Sending account ${isActive ? "activated" : "deactivated"}`,
//       })
//       await loadAccounts()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update sending account",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleConnectGmail = () => {
//     window.location.href = "/api/oauth/gmail"
//   }

//   const handleConnectOutlook = () => {
//     window.location.href = "/api/oauth/outlook"
//   }

//   if (loading && accounts.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-medium">Sending Accounts</h3>
//           <p className="text-sm text-muted-foreground">
//             Connect your email accounts to send campaigns with better deliverability
//           </p>
//         </div>
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Account
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle>Connect Email Account</DialogTitle>
//               <DialogDescription>
//                 Choose how you want to connect your email account for sending campaigns
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-3">
//               <Button
//                 variant="outline"
//                 className="w-full h-auto py-4 justify-start bg-transparent"
//                 onClick={handleConnectGmail}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
//                     <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium">Connect Gmail</div>
//                     <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
//                   </div>
//                 </div>
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full h-auto py-4 justify-start bg-transparent"
//                 onClick={handleConnectOutlook}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
//                     <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div className="text-left">
//                     <div className="font-medium">Connect Outlook</div>
//                     <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
//                   </div>
//                 </div>
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-background px-2 text-muted-foreground">Or use API key</span>
//                 </div>
//               </div>

//               <div className="space-y-4 pt-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Account Name</Label>
//                   <Input
//                     id="name"
//                     placeholder="My Primary Account"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="noreply@yourdomain.com"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="provider">Provider</Label>
//                   <Select
//                     value={formData.provider}
//                     onValueChange={(value) => setFormData({ ...formData, provider: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="resend">Resend</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="apiKey">Resend API Key</Label>
//                   <Input
//                     id="apiKey"
//                     type="password"
//                     placeholder="re_xxxxxxxxxxxx"
//                     value={formData.apiKey}
//                     onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Get your API key from{" "}
//                     <a
//                       href="https://resend.com/api-keys"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="underline"
//                     >
//                       resend.com/api-keys
//                     </a>
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="dailyLimit">Daily Limit</Label>
//                     <Input
//                       id="dailyLimit"
//                       type="number"
//                       value={formData.dailyLimit}
//                       onChange={(e) => setFormData({ ...formData, dailyLimit: Number.parseInt(e.target.value) })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="hourlyLimit">Hourly Limit</Label>
//                     <Input
//                       id="hourlyLimit"
//                       type="number"
//                       value={formData.hourlyLimit}
//                       onChange={(e) => setFormData({ ...formData, hourlyLimit: Number.parseInt(e.target.value) })}
//                     />
//                   </div>
//                 </div>
//                 <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
//                   {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
//                   Add Resend Account
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {accounts.length === 0 ? (
//         <Card className="p-12 text-center">
//           <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//           <h3 className="mt-4 text-lg font-medium">No sending accounts</h3>
//           <p className="mt-2 text-sm text-muted-foreground">
//             Add your first sending account to start sending emails with better deliverability
//           </p>
//         </Card>
//       ) : (
//         <div className="space-y-4">
//           {accounts.map((account) => (
//             <Card key={account.id} className="p-6">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                     <Mail className="h-5 w-5 text-primary" />
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-medium">{account.name}</h4>
//                       {account.isActive ? (
//                         <Badge variant="default" className="gap-1">
//                           <CheckCircle2 className="h-3 w-3" />
//                           Active
//                         </Badge>
//                       ) : (
//                         <Badge variant="secondary">Inactive</Badge>
//                       )}
//                       {account.bounceRate > 3 && (
//                         <Badge variant="destructive" className="gap-1">
//                           <AlertCircle className="h-3 w-3" />
//                           High Bounce Rate
//                         </Badge>
//                       )}
//                       {account.domain ? (
//                         account.domain.isVerified ? (
//                           <Badge
//                             variant="outline"
//                             className="gap-1 border-green-600 text-green-700 dark:border-green-400 dark:text-green-400"
//                           >
//                             <ShieldCheck className="h-3 w-3" />
//                             DNS Verified
//                           </Badge>
//                         ) : (
//                           <Badge
//                             variant="outline"
//                             className="gap-1 border-yellow-600 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400"
//                           >
//                             <ShieldAlert className="h-3 w-3" />
//                             DNS Pending
//                           </Badge>
//                         )
//                       ) : (
//                         <Badge
//                           variant="outline"
//                           className="gap-1 border-red-600 text-red-700 dark:border-red-400 dark:text-red-400"
//                         >
//                           <AlertCircle className="h-3 w-3" />
//                           No Domain
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">{account.email}</p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                       <span>Provider: {account.provider}</span>
//                       <span>•</span>
//                       <span>
//                         Sent today: {account.emailsSentToday}/
//                         {account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit}
//                       </span>
//                       <span>•</span>
//                       <span>Bounce rate: {account.bounceRate.toFixed(2)}%</span>
//                       <span>•</span>
//                       <span>Health: {account.healthScore}/100</span>
//                       {account.domain && (
//                         <>
//                           <span>•</span>
//                           <span>
//                             Domain: {account.domain.domain} ({account.domain.healthScore}/100)
//                           </span>
//                         </>
//                       )}
//                     </div>
//                     {account.warmupEnabled && (
//                       <div className="mt-2">
//                         <Badge variant="outline">Warmup Stage {account.warmupStage}/5</Badge>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Switch
//                     checked={account.isActive}
//                     onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
//                   />
//                   <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
//         <div className="flex gap-3">
//           <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//           <div className="space-y-1">
//             <p className="text-sm font-medium text-blue-900 dark:text-blue-100">DNS Verification Required</p>
//             <p className="text-sm text-blue-700 dark:text-blue-300">
//               Before adding sending accounts, verify your domain's DNS records (SPF, DKIM, DMARC) in the Deliverability
//               dashboard. This ensures high deliverability and protects your sender reputation. Multiple verified
//               accounts enable automatic rotation for better results.
//             </p>
//             <Button
//               variant="outline"
//               size="sm"
//               className="mt-2 bg-transparent"
//               onClick={() => (window.location.href = "/dashboard/deliverability")}
//             >
//               Setup DNS Records
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Mail, Trash2, AlertCircle, CheckCircle2, Loader2, ShieldCheck, ShieldAlert } from "lucide-react"
import {
  createSendingAccount,
  getSendingAccounts,
  deleteSendingAccount,
  toggleSendingAccount,
} from "@/lib/actions/sending-accounts"
import { WaveLoader } from "../loader/wave-loader"

interface SendingAccount {
  id: string
  name: string
  email: string
  provider: string
  dailyLimit: number
  hourlyLimit: number
  emailsSentToday: number
  emailsSentThisHour: number
  warmupEnabled: boolean
  warmupStage: number
  warmupDailyLimit: number
  isActive: boolean
  bounceRate: number
  healthScore: number
  domainId: string | null
  domain: {
    id: string
    domain: string
    isVerified: boolean
    healthScore: number
  } | null
  createdAt: Date
  peerWarmupEnabled: boolean
}

export function SendingAccountsSettings() {
  const [accounts, setAccounts] = useState<SendingAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    provider: "resend",
    apiKey: "",
    dailyLimit: 50,
    hourlyLimit: 10,
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      const data = await getSendingAccounts()
      const typedAccounts = data.map((account) => ({
        ...account,
        warmupStage: account.warmupStage as unknown as number,
        peerWarmupEnabled: account.peerWarmupEnabled || false,
      }))
      setAccounts(typedAccounts)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sending accounts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateAccount() {
    try {
      setLoading(true)
      await createSendingAccount(formData)
      toast({
        title: "Success",
        description: "Sending account created successfully",
      })
      setDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        provider: "resend",
        apiKey: "",
        dailyLimit: 50,
        hourlyLimit: 10,
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sending account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteAccount(accountId: string) {
    if (!confirm("Are you sure you want to delete this sending account?")) return

    try {
      await deleteSendingAccount(accountId)
      toast({
        title: "Success",
        description: "Sending account deleted",
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sending account",
        variant: "destructive",
      })
    }
  }

  async function handleToggleAccount(accountId: string, isActive: boolean) {
    try {
      await toggleSendingAccount(accountId, isActive)
      toast({
        title: "Success",
        description: `Sending account ${isActive ? "activated" : "deactivated"}`,
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update sending account",
        variant: "destructive",
      })
    }
  }

  async function handleTogglePeerWarmup(accountId: string, enabled: boolean) {
    try {
      await fetch(`/api/settings/sending-accounts/${accountId}/peer-warmup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerWarmupEnabled: enabled }),
      })
      toast({
        title: "Success",
        description: `Peer warmup ${enabled ? "enabled" : "disabled"}`,
      })
      await loadAccounts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update peer warmup setting",
        variant: "destructive",
      })
    }
  }

  const handleConnectGmail = () => {
    window.location.href = "/api/oauth/gmail"
  }

  const handleConnectOutlook = () => {
    window.location.href = "/api/oauth/outlook"
  }

  if (loading && accounts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        {/* <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> */}
        <WaveLoader size="sm" bars={8} gap="tight" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Sending Accounts</h3>
          <p className="text-sm text-muted-foreground">
            Connect your email accounts to send campaigns with better deliverability
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Email Account</DialogTitle>
              <DialogDescription>
                Choose how you want to connect your email account for sending campaigns
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start bg-transparent"
                onClick={handleConnectGmail}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                    <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Connect Gmail</div>
                    <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-auto py-4 justify-start bg-transparent"
                onClick={handleConnectOutlook}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Connect Outlook</div>
                    <div className="text-xs text-muted-foreground">Use OAuth for secure access</div>
                  </div>
                </div>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or use API key</span>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="My Primary Account"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) => setFormData({ ...formData, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Resend API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="re_xxxxxxxxxxxx"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      resend.com/api-keys
                    </a>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyLimit">Daily Limit</Label>
                    <Input
                      id="dailyLimit"
                      type="number"
                      value={formData.dailyLimit}
                      onChange={(e) => setFormData({ ...formData, dailyLimit: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyLimit">Hourly Limit</Label>
                    <Input
                      id="hourlyLimit"
                      type="number"
                      value={formData.hourlyLimit}
                      onChange={(e) => setFormData({ ...formData, hourlyLimit: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateAccount} disabled={loading} className="w-full">
                  {loading ? <WaveLoader size="sm" bars={8} gap="tight" /> : null}
                  Add Resend Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No sending accounts</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first sending account to start sending emails with better deliverability
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{account.name}</h4>
                      {account.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {account.bounceRate > 3 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          High Bounce Rate
                        </Badge>
                      )}
                      {account.domain ? (
                        account.domain.isVerified ? (
                          <Badge
                            variant="outline"
                            className="gap-1 border-green-600 text-green-700 dark:border-green-400 dark:text-green-400"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            DNS Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 border-yellow-600 text-yellow-700 dark:border-yellow-400 dark:text-yellow-400"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            DNS Pending
                          </Badge>
                        )
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 border-red-600 text-red-700 dark:border-red-400 dark:text-red-400"
                        >
                          <AlertCircle className="h-3 w-3" />
                          No Domain
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Provider: {account.provider}</span>
                      <span>•</span>
                      <span>
                        Sent today: {account.emailsSentToday}/
                        {account.warmupEnabled ? account.warmupDailyLimit : account.dailyLimit}
                      </span>
                      <span>•</span>
                      <span>Bounce rate: {account.bounceRate.toFixed(2)}%</span>
                      <span>•</span>
                      <span>Health: {account.healthScore}/100</span>
                      {account.domain && (
                        <>
                          <span>•</span>
                          <span>
                            Domain: {account.domain.domain} ({account.domain.healthScore}/100)
                          </span>
                        </>
                      )}
                    </div>
                    {account.warmupEnabled && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">Warmup Stage {account.warmupStage}/5</Badge>
                        {account.warmupStage >= 3 && (
                          <div className="flex items-center gap-2 ml-4">
                            <Label htmlFor={`peer-${account.id}`} className="text-xs cursor-pointer">
                              Peer Network
                            </Label>
                            <Switch
                              id={`peer-${account.id}`}
                              checked={account.peerWarmupEnabled || false}
                              onCheckedChange={(checked) => handleTogglePeerWarmup(account.id, checked)}
                              className="scale-75"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={account.isActive}
                    onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">DNS Verification Required</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Before adding sending accounts, verify your domain's DNS records (SPF, DKIM, DMARC) in the Deliverability
              dashboard. This ensures high deliverability and protects your sender reputation. Multiple verified
              accounts enable automatic rotation for better results.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={() => (window.location.href = "/dashboard/deliverability")}
            >
              Setup DNS Records
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
