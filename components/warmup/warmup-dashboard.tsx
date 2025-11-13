// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Switch } from "@/components/ui/switch"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Inbox, Send, TrendingUp, CheckCircle2, AlertCircle, Plus, Trash2, Mail, Loader2 } from "lucide-react"
// import { toast } from "sonner"

// interface WarmupEmail {
//   id: string
//   email: string
//   name: string
//   provider: string
//   isActive: boolean
//   inboxPlacement: number
//   lastUsedAt: Date | null
//   createdAt: Date
// }

// export function WarmupDashboard() {
//   const [stats, setStats] = useState<any>(null)
//   const [warmupEmails, setWarmupEmails] = useState<WarmupEmail[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     provider: "gmail",
//     imapHost: "imap.gmail.com",
//     imapPort: 993,
//     imapUsername: "",
//     imapPassword: "",
//     smtpHost: "smtp.gmail.com",
//     smtpPort: 587,
//     smtpUsername: "",
//     smtpPassword: "",
//   })

//   useEffect(() => {
//     fetchWarmupStats()
//     fetchWarmupEmails()
//   }, [])

//   const fetchWarmupStats = async () => {
//     try {
//       const response = await fetch("/api/warmup/stats")
//       const data = await response.json()
//       setStats(data)
//     } catch (error) {
//       toast.error("Failed to load warmup stats")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchWarmupEmails = async () => {
//     try {
//       const response = await fetch("/api/warmup/emails")
//       const data = await response.json()
//       setWarmupEmails(data)
//     } catch (error) {
//       toast.error("Failed to load warmup emails")
//     }
//   }

//   const handleAddEmail = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/warmup/emails", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) throw new Error("Failed to add email")

//       toast.success("Warmup email added successfully")
//       setDialogOpen(false)
//       setFormData({
//         name: "",
//         email: "",
//         provider: "gmail",
//         imapHost: "imap.gmail.com",
//         imapPort: 993,
//         imapUsername: "",
//         imapPassword: "",
//         smtpHost: "smtp.gmail.com",
//         smtpPort: 587,
//         smtpUsername: "",
//         smtpPassword: "",
//       })
//       await fetchWarmupEmails()
//       await fetchWarmupStats()
//     } catch (error) {
//       toast.error("Failed to add warmup email")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteEmail = async (id: string) => {
//     if (!confirm("Are you sure you want to remove this warmup email?")) return

//     try {
//       await fetch(`/api/warmup/emails/${id}`, { method: "DELETE" })
//       toast.success("Warmup email removed")
//       await fetchWarmupEmails()
//       await fetchWarmupStats()
//     } catch (error) {
//       toast.error("Failed to remove warmup email")
//     }
//   }

//   const handleToggleEmail = async (id: string, isActive: boolean) => {
//     try {
//       await fetch(`/api/warmup/emails/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive }),
//       })
//       toast.success(`Warmup email ${isActive ? "activated" : "deactivated"}`)
//       await fetchWarmupEmails()
//     } catch (error) {
//       toast.error("Failed to update warmup email")
//     }
//   }

//   if (loading && !stats) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Overview */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Warmup Email Pool</CardTitle>
//             <Inbox className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.totalEmails || 0}</div>
//             <p className="text-xs text-muted-foreground">{stats?.activeEmails || 0} active</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
//             <Send className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
//             <p className="text-xs text-muted-foreground">Warming up accounts</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Inbox Placement</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.avgInboxPlacement?.toFixed(1) || 0}%</div>
//             <p className="text-xs text-muted-foreground">Average across pool</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
//             <p className="text-xs text-muted-foreground">Emails sent & received</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Warmup Email Pool Management */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Warmup Email Pool</CardTitle>
//               <CardDescription>
//                 Manage the {warmupEmails.length}/30 test emails used for warming up your domains
//               </CardDescription>
//             </div>
//             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Email
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>Add Warmup Email</DialogTitle>
//                   <DialogDescription>Add a test email account to your warmup pool</DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label>Name</Label>
//                     <Input
//                       placeholder="Test Account 1"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Email Address</Label>
//                     <Input
//                       type="email"
//                       placeholder="test1@example.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Provider</Label>
//                     <Select
//                       value={formData.provider}
//                       onValueChange={(value) => {
//                         const providers = {
//                           gmail: { imap: "imap.gmail.com", smtp: "smtp.gmail.com", imapPort: 993, smtpPort: 587 },
//                           outlook: {
//                             imap: "outlook.office365.com",
//                             smtp: "smtp.office365.com",
//                             imapPort: 993,
//                             smtpPort: 587,
//                           },
//                           yahoo: {
//                             imap: "imap.mail.yahoo.com",
//                             smtp: "smtp.mail.yahoo.com",
//                             imapPort: 993,
//                             smtpPort: 587,
//                           },
//                         }
//                         const config = providers[value as keyof typeof providers]
//                         setFormData({
//                           ...formData,
//                           provider: value,
//                           imapHost: config.imap,
//                           smtpHost: config.smtp,
//                           imapPort: config.imapPort,
//                           smtpPort: config.smtpPort,
//                         })
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="gmail">Gmail</SelectItem>
//                         <SelectItem value="outlook">Outlook</SelectItem>
//                         <SelectItem value="yahoo">Yahoo</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>IMAP Host</Label>
//                       <Input
//                         value={formData.imapHost}
//                         onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>IMAP Port</Label>
//                       <Input
//                         type="number"
//                         value={formData.imapPort}
//                         onChange={(e) => setFormData({ ...formData, imapPort: Number.parseInt(e.target.value) })}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>IMAP Username</Label>
//                     <Input
//                       value={formData.imapUsername}
//                       onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>IMAP Password</Label>
//                     <Input
//                       type="password"
//                       value={formData.imapPassword}
//                       onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })}
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>SMTP Host</Label>
//                       <Input
//                         value={formData.smtpHost}
//                         onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>SMTP Port</Label>
//                       <Input
//                         type="number"
//                         value={formData.smtpPort}
//                         onChange={(e) => setFormData({ ...formData, smtpPort: Number.parseInt(e.target.value) })}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>SMTP Username</Label>
//                     <Input
//                       value={formData.smtpUsername}
//                       onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>SMTP Password</Label>
//                     <Input
//                       type="password"
//                       value={formData.smtpPassword}
//                       onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
//                     />
//                   </div>
//                   <Button onClick={handleAddEmail} disabled={loading} className="w-full">
//                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     Add Email
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {warmupEmails.length === 0 ? (
//             <div className="text-center py-12">
//               <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-medium">No warmup emails</h3>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Add your first test email to start building your warmup pool
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {warmupEmails.map((email) => (
//                 <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                       <Mail className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{email.name}</p>
//                       <p className="text-sm text-muted-foreground">{email.email}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary">{email.provider}</Badge>
//                         <Badge variant={email.inboxPlacement >= 80 ? "default" : "destructive"}>
//                           {email.inboxPlacement.toFixed(0)}% inbox rate
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       checked={email.isActive}
//                       onCheckedChange={(checked) => handleToggleEmail(email.id, checked)}
//                     />
//                     <Button variant="ghost" size="icon" onClick={() => handleDeleteEmail(email.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* How Warmup Works */}
//       <Card>
//         <CardHeader>
//           <CardTitle>How Email Warmup Works</CardTitle>
//           <CardDescription>Our intelligent warmup system builds domain reputation gradually</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 1: NEW</Badge>
//               <span className="text-sm">20 emails/day for 7 days</span>
//             </div>
//             <Progress value={20} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 2: WARMING</Badge>
//               <span className="text-sm">40 emails/day for 7 days</span>
//             </div>
//             <Progress value={40} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 3: WARM</Badge>
//               <span className="text-sm">60 emails/day for 7 days</span>
//             </div>
//             <Progress value={60} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 4: ACTIVE</Badge>
//               <span className="text-sm">80 emails/day for 8 days</span>
//             </div>
//             <Progress value={80} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge variant="default">Stage 5: ESTABLISHED</Badge>
//               <span className="text-sm">150 emails/day - Full capacity</span>
//             </div>
//             <Progress value={100} />
//           </div>

//           <div className="flex items-start gap-2 mt-6 p-4 bg-muted rounded-lg">
//             <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
//             <div className="text-sm space-y-1">
//               <p className="font-medium">Peer-to-Peer Warmup Network</p>
//               <p className="text-muted-foreground">
//                 We use a pool of {stats?.totalEmails || 30} real Gmail and Outlook accounts to warm up your domain.
//                 Emails are sent with human-like timing and content, ensuring high inbox placement rates.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Switch } from "@/components/ui/switch"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Inbox, Send, TrendingUp, CheckCircle2, AlertCircle, Plus, Trash2, Mail, Loader2 } from "lucide-react"
// import { toast } from "sonner"

// interface WarmupEmail {
//   id: string
//   email: string
//   name: string
//   provider: string
//   isActive: boolean
//   inboxPlacement: number
//   lastUsedAt: Date | null
//   createdAt: Date
// }

// export function WarmupDashboard() {
//   const [stats, setStats] = useState<any>(null)
//   const [warmupEmails, setWarmupEmails] = useState<WarmupEmail[]>([])
//   const [loading, setLoading] = useState(true)
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     provider: "gmail",
//     imapHost: "imap.gmail.com",
//     imapPort: 993,
//     imapUsername: "",
//     imapPassword: "",
//     smtpHost: "smtp.gmail.com",
//     smtpPort: 587,
//     smtpUsername: "",
//     smtpPassword: "",
//   })

//   useEffect(() => {
//     fetchWarmupStats()
//     fetchWarmupEmails()
//   }, [])

//   const fetchWarmupStats = async () => {
//     try {
//       const response = await fetch("/api/warmup/stats")
//       const data = await response.json()
//       setStats(data)
//     } catch (error) {
//       toast.error("Failed to load warmup stats")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchWarmupEmails = async () => {
//     try {
//       const response = await fetch("/api/warmup/emails")
//       const data = await response.json()
//       setWarmupEmails(data)
//     } catch (error) {
//       toast.error("Failed to load warmup emails")
//     }
//   }

//   const handleAddEmail = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/warmup/emails", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) throw new Error("Failed to add email")

//       toast.success("Warmup email added successfully")
//       setDialogOpen(false)
//       setFormData({
//         name: "",
//         email: "",
//         provider: "gmail",
//         imapHost: "imap.gmail.com",
//         imapPort: 993,
//         imapUsername: "",
//         imapPassword: "",
//         smtpHost: "smtp.gmail.com",
//         smtpPort: 587,
//         smtpUsername: "",
//         smtpPassword: "",
//       })
//       await fetchWarmupEmails()
//       await fetchWarmupStats()
//     } catch (error) {
//       toast.error("Failed to add warmup email")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteEmail = async (id: string) => {
//     if (!confirm("Are you sure you want to remove this warmup email?")) return

//     try {
//       await fetch(`/api/warmup/emails/${id}`, { method: "DELETE" })
//       toast.success("Warmup email removed")
//       await fetchWarmupEmails()
//       await fetchWarmupStats()
//     } catch (error) {
//       toast.error("Failed to remove warmup email")
//     }
//   }

//   const handleToggleEmail = async (id: string, isActive: boolean) => {
//     try {
//       await fetch(`/api/warmup/emails/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ isActive }),
//       })
//       toast.success(`Warmup email ${isActive ? "activated" : "deactivated"}`)
//       await fetchWarmupEmails()
//     } catch (error) {
//       toast.error("Failed to update warmup email")
//     }
//   }

//   if (loading && !stats) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Stats Overview */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Warmup Email Pool</CardTitle>
//             <Inbox className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.totalEmails || 0}</div>
//             <p className="text-xs text-muted-foreground">{stats?.activeEmails || 0} active</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
//             <Send className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
//             <p className="text-xs text-muted-foreground">Warming up accounts</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Inbox Placement</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.avgInboxPlacement?.toFixed(1) || 0}%</div>
//             <p className="text-xs text-muted-foreground">Average across pool</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
//             <p className="text-xs text-muted-foreground">Emails sent & received</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Warmup Email Pool Management */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Warmup Email Pool</CardTitle>
//               <CardDescription>
//                 Manage the {warmupEmails.length}/30 test emails used for warming up your domains
//               </CardDescription>
//             </div>
//             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button>
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Email
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>Add Warmup Email</DialogTitle>
//                   <DialogDescription>Add a test email account to your warmup pool</DialogDescription>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label>Name</Label>
//                     <Input
//                       placeholder="Test Account 1"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Email Address</Label>
//                     <Input
//                       type="email"
//                       placeholder="test1@example.com"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>Provider</Label>
//                     <Select
//                       value={formData.provider}
//                       onValueChange={(value) => {
//                         const providers = {
//                           gmail: { imap: "imap.gmail.com", smtp: "smtp.gmail.com", imapPort: 993, smtpPort: 587 },
//                           outlook: {
//                             imap: "outlook.office365.com",
//                             smtp: "smtp.office365.com",
//                             imapPort: 993,
//                             smtpPort: 587,
//                           },
//                           yahoo: {
//                             imap: "imap.mail.yahoo.com",
//                             smtp: "smtp.mail.yahoo.com",
//                             imapPort: 993,
//                             smtpPort: 587,
//                           },
//                         }
//                         const config = providers[value as keyof typeof providers]
//                         setFormData({
//                           ...formData,
//                           provider: value,
//                           imapHost: config.imap,
//                           smtpHost: config.smtp,
//                           imapPort: config.imapPort,
//                           smtpPort: config.smtpPort,
//                         })
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="gmail">Gmail</SelectItem>
//                         <SelectItem value="outlook">Outlook</SelectItem>
//                         <SelectItem value="yahoo">Yahoo</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>IMAP Host</Label>
//                       <Input
//                         value={formData.imapHost}
//                         onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>IMAP Port</Label>
//                       <Input
//                         type="number"
//                         value={formData.imapPort}
//                         onChange={(e) => setFormData({ ...formData, imapPort: Number.parseInt(e.target.value) })}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>IMAP Username</Label>
//                     <Input
//                       value={formData.imapUsername}
//                       onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>IMAP Password</Label>
//                     <Input
//                       type="password"
//                       value={formData.imapPassword}
//                       onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })}
//                     />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>SMTP Host</Label>
//                       <Input
//                         value={formData.smtpHost}
//                         onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>SMTP Port</Label>
//                       <Input
//                         type="number"
//                         value={formData.smtpPort}
//                         onChange={(e) => setFormData({ ...formData, smtpPort: Number.parseInt(e.target.value) })}
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>SMTP Username</Label>
//                     <Input
//                       value={formData.smtpUsername}
//                       onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>SMTP Password</Label>
//                     <Input
//                       type="password"
//                       value={formData.smtpPassword}
//                       onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
//                     />
//                   </div>
//                   <Button onClick={handleAddEmail} disabled={loading} className="w-full">
//                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                     Add Email
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {warmupEmails.length === 0 ? (
//             <div className="text-center py-12">
//               <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-medium">No warmup emails</h3>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 Add your first test email to start building your warmup pool
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {warmupEmails.map((email) => (
//                 <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//                       <Mail className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{email.name}</p>
//                       <p className="text-sm text-muted-foreground">{email.email}</p>
//                       <div className="flex items-center gap-2 mt-1">
//                         <Badge variant="secondary">{email.provider}</Badge>
//                         <Badge variant={email.inboxPlacement >= 80 ? "default" : "destructive"}>
//                           {email.inboxPlacement.toFixed(0)}% inbox rate
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Switch
//                       checked={email.isActive}
//                       onCheckedChange={(checked) => handleToggleEmail(email.id, checked)}
//                     />
//                     <Button variant="ghost" size="icon" onClick={() => handleDeleteEmail(email.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* How Warmup Works */}
//       <Card>
//         <CardHeader>
//           <CardTitle>How Email Warmup Works</CardTitle>
//           <CardDescription>Our intelligent warmup system builds domain reputation gradually</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 1: NEW</Badge>
//               <span className="text-sm">20 emails/day for 7 days</span>
//             </div>
//             <Progress value={20} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 2: WARMING</Badge>
//               <span className="text-sm">40 emails/day for 7 days</span>
//             </div>
//             <Progress value={40} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 3: WARM</Badge>
//               <span className="text-sm">60 emails/day for 7 days</span>
//             </div>
//             <Progress value={60} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge>Stage 4: ACTIVE</Badge>
//               <span className="text-sm">80 emails/day for 8 days</span>
//             </div>
//             <Progress value={80} />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <Badge variant="default">Stage 5: ESTABLISHED</Badge>
//               <span className="text-sm">150 emails/day - Full capacity</span>
//             </div>
//             <Progress value={100} />
//           </div>

//           <div className="flex items-start gap-2 mt-6 p-4 bg-muted rounded-lg">
//             <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
//             <div className="text-sm space-y-1">
//               <p className="font-medium">Hybrid Warmup Strategy</p>
//               <p className="text-muted-foreground">
//                 <strong>Stage 1-2 (NEW & WARMING):</strong> We use your pool of {stats?.totalEmails || 30} test emails
//                 for safe initial warmup with 20-40 emails/day.
//               </p>
//               <p className="text-muted-foreground">
//                 <strong>Stage 3-5 (WARM, ACTIVE, ESTABLISHED):</strong> Accounts graduate to our peer-to-peer network
//                 with {stats?.peerNetworkSize || 0} other users for 60-150 emails/day, ensuring maximum inbox placement.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Inbox, Send, TrendingUp, CheckCircle2, AlertCircle, Plus, Trash2, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface WarmupEmail {
  id: string
  email: string
  name: string
  provider: string
  isActive: boolean
  inboxPlacement: number
  lastUsedAt: Date | null
  createdAt: Date
}

export function WarmupDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [warmupEmails, setWarmupEmails] = useState<WarmupEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    provider: "gmail",
    imapHost: "imap.gmail.com",
    imapPort: 993,
    imapUsername: "",
    imapPassword: "",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
  })

  useEffect(() => {
    fetchWarmupStats()
    fetchWarmupEmails()
  }, [])

  const fetchWarmupStats = async () => {
    try {
      const response = await fetch("/api/warmup/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error("Failed to load warmup stats")
    } finally {
      setLoading(false)
    }
  }

  const fetchWarmupEmails = async () => {
    try {
      const response = await fetch("/api/warmup/emails")
      const data = await response.json()
      setWarmupEmails(data)
    } catch (error) {
      toast.error("Failed to load warmup emails")
    }
  }

  const handleAddEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/warmup/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add email")

      toast.success("Warmup email added successfully")
      setDialogOpen(false)
      setFormData({
        name: "",
        email: "",
        provider: "gmail",
        imapHost: "imap.gmail.com",
        imapPort: 993,
        imapUsername: "",
        imapPassword: "",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
      })
      await fetchWarmupEmails()
      await fetchWarmupStats()
    } catch (error) {
      toast.error("Failed to add warmup email")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmail = async (id: string) => {
    if (!confirm("Are you sure you want to remove this warmup email?")) return

    try {
      await fetch(`/api/warmup/emails/${id}`, { method: "DELETE" })
      toast.success("Warmup email removed")
      await fetchWarmupEmails()
      await fetchWarmupStats()
    } catch (error) {
      toast.error("Failed to remove warmup email")
    }
  }

  const handleToggleEmail = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/warmup/emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      toast.success(`Warmup email ${isActive ? "activated" : "deactivated"}`)
      await fetchWarmupEmails()
    } catch (error) {
      toast.error("Failed to update warmup email")
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warmup Email Pool</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmails || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.activeEmails || 0} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">Warming up accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbox Placement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgInboxPlacement?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">Average across pool</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
            <p className="text-xs text-muted-foreground">Emails sent & received</p>
          </CardContent>
        </Card>
      </div>

      {/* Warmup Email Pool Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Warmup Email Pool</CardTitle>
              <CardDescription>
                Manage the {warmupEmails.length}/30 test emails used for warming up your domains
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Warmup Email</DialogTitle>
                  <DialogDescription>
                    Add a test email account to your warmup pool. These are separate accounts used only for warmup, not
                    your sending accounts.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">How to get these credentials:</p>
                    <ul className="text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                      <li>
                        <strong>Gmail:</strong> Enable "Less secure app access" OR generate an App Password (Settings →
                        Security → 2-Step Verification → App passwords)
                      </li>
                      <li>
                        <strong>Outlook:</strong> Use your regular password OR generate an App Password
                      </li>
                      <li>
                        <strong>Yahoo:</strong> Generate an App Password (Account Security → Generate app password)
                      </li>
                    </ul>
                    <p className="text-blue-800 dark:text-blue-200 mt-2">
                      <strong>Note:</strong> IMAP/SMTP must be enabled in your email provider settings.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Test Account 1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="test1@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select
                      value={formData.provider}
                      onValueChange={(value) => {
                        const providers = {
                          gmail: { imap: "imap.gmail.com", smtp: "smtp.gmail.com", imapPort: 993, smtpPort: 587 },
                          outlook: {
                            imap: "outlook.office365.com",
                            smtp: "smtp.office365.com",
                            imapPort: 993,
                            smtpPort: 587,
                          },
                          yahoo: {
                            imap: "imap.mail.yahoo.com",
                            smtp: "smtp.mail.yahoo.com",
                            imapPort: 993,
                            smtpPort: 587,
                          },
                        }
                        const config = providers[value as keyof typeof providers]
                        setFormData({
                          ...formData,
                          provider: value,
                          imapHost: config.imap,
                          smtpHost: config.smtp,
                          imapPort: config.imapPort,
                          smtpPort: config.smtpPort,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Gmail</SelectItem>
                        <SelectItem value="outlook">Outlook</SelectItem>
                        <SelectItem value="yahoo">Yahoo</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Selecting a provider auto-fills the correct IMAP/SMTP settings below
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IMAP Host</Label>
                      <Input
                        value={formData.imapHost}
                        onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Server for receiving emails</p>
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Port</Label>
                      <Input
                        type="number"
                        value={formData.imapPort}
                        onChange={(e) => setFormData({ ...formData, imapPort: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Usually 993</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>IMAP Username</Label>
                    <Input
                      placeholder="Usually your full email address"
                      value={formData.imapUsername}
                      onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>IMAP Password</Label>
                    <Input
                      type="password"
                      placeholder="Your email password or app password"
                      value={formData.imapPassword}
                      onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      If 2FA is enabled, use an App Password instead of your regular password
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={formData.smtpHost}
                        onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Server for sending emails</p>
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={formData.smtpPort}
                        onChange={(e) => setFormData({ ...formData, smtpPort: Number.parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Usually 587</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input
                      placeholder="Usually same as IMAP username"
                      value={formData.smtpUsername}
                      onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input
                      type="password"
                      placeholder="Usually same as IMAP password"
                      value={formData.smtpPassword}
                      onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleAddEmail} disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {warmupEmails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No warmup emails</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your first test email to start building your warmup pool
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {warmupEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{email.name}</p>
                      <p className="text-sm text-muted-foreground">{email.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{email.provider}</Badge>
                        <Badge variant={email.inboxPlacement >= 80 ? "default" : "destructive"}>
                          {email.inboxPlacement.toFixed(0)}% inbox rate
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={email.isActive}
                      onCheckedChange={(checked) => handleToggleEmail(email.id, checked)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEmail(email.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Warmup Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Email Warmup Works</CardTitle>
          <CardDescription>Our intelligent warmup system builds domain reputation gradually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Stage 1: NEW</Badge>
              <span className="text-sm">20 emails/day for 7 days</span>
            </div>
            <Progress value={20} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Stage 2: WARMING</Badge>
              <span className="text-sm">40 emails/day for 7 days</span>
            </div>
            <Progress value={40} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Stage 3: WARM</Badge>
              <span className="text-sm">60 emails/day for 7 days</span>
            </div>
            <Progress value={60} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge>Stage 4: ACTIVE</Badge>
              <span className="text-sm">80 emails/day for 8 days</span>
            </div>
            <Progress value={80} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">Stage 5: ESTABLISHED</Badge>
              <span className="text-sm">150 emails/day - Full capacity</span>
            </div>
            <Progress value={100} />
          </div>

          <div className="flex items-start gap-2 mt-6 p-4 bg-muted rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium">Hybrid Warmup Strategy</p>
              <p className="text-muted-foreground">
                <strong>Stage 1-2 (NEW & WARMING):</strong> We use your pool of {stats?.totalEmails || 30} test emails
                for safe initial warmup with 20-40 emails/day.
              </p>
              <p className="text-muted-foreground">
                <strong>Stage 3-5 (WARM, ACTIVE, ESTABLISHED):</strong> Accounts graduate to our peer-to-peer network
                with {stats?.peerNetworkSize || 0} other users for 60-150 emails/day, ensuring maximum inbox placement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
