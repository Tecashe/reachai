// "use client"

// import { useState, useEffect } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"
// import { Cloud, Loader2, CheckCircle2, AlertCircle, Link2, Database } from "lucide-react"
// import { toast } from "sonner"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { syncCRMLeads } from "@/lib/actions/lead-finder"

// interface CRMImportDialogProps {
//   onImportComplete?: () => void
// }

// export function CRMImportDialog({ onImportComplete }: CRMImportDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [importedCount, setImportedCount] = useState(0)

//   useEffect(() => {
//     if (open) {
//       loadIntegrations()
//     }
//   }, [open])

//   const loadIntegrations = async () => {
//     try {
//       const userIntegrations = await getUserIntegrations()
//       const crmIntegrations = userIntegrations.filter((i: any) =>
//         ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type),
//       )
//       setIntegrations(crmIntegrations)
//     } catch (error) {
//       toast.error("Failed to load integrations")
//     }
//   }

//   const handleImport = async (crmType: string) => {
//     setLoading(true)
//     setSelectedCRM(crmType)
//     setProgress(10)

//     try {
//       toast.info(`Syncing leads from ${crmType}...`)
//       setProgress(50)

//       const result = await syncCRMLeads(crmType)

//       if (!result.success) {
//         toast.error(result.error || "Failed to sync leads")
//         return
//       }

//       setImportedCount(result.imported || 0)
//       setProgress(100)

//       toast.success(`Successfully imported ${result.imported} leads from ${crmType}!`)

//       if (onImportComplete) {
//         onImportComplete()
//       }

//       setTimeout(() => {
//         setOpen(false)
//         setSelectedCRM(null)
//         setProgress(0)
//       }, 2000)
//     } catch (error: any) {
//       toast.error(error.message || "Failed to import leads")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const crmIcons: Record<string, any> = {
//     HUBSPOT: { icon: Cloud, color: "text-orange-600" },
//     SALESFORCE: { icon: Cloud, color: "text-blue-600" },
//     PIPEDRIVE: { icon: Database, color: "text-green-600" },
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Link2 className="mr-2 h-4 w-4" />
//           Import from CRM
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Database className="h-5 w-5 text-primary" />
//             Import Leads from CRM
//           </DialogTitle>
//           <DialogDescription>
//             Sync contacts from your connected CRM platforms directly into your campaigns
//           </DialogDescription>
//         </DialogHeader>

//         {integrations.length === 0 ? (
//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>No CRM Integrations Connected</AlertTitle>
//             <AlertDescription>
//               <p className="mb-3">Connect HubSpot, Salesforce, or Pipedrive to import leads from your CRM.</p>
//               <Button size="sm" onClick={() => (window.location.href = "/dashboard/crm")}>
//                 Connect CRM
//               </Button>
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <div className="space-y-4">
//             {loading && selectedCRM ? (
//               <div className="space-y-6 py-8">
//                 <div className="flex flex-col items-center justify-center gap-4">
//                   <div className="rounded-full bg-primary/10 p-4">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   </div>
//                   <div className="text-center">
//                     <h3 className="font-semibold">Importing Leads from {selectedCRM}</h3>
//                     <p className="text-sm text-muted-foreground">This may take a few moments...</p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Progress</span>
//                     <span className="font-medium">{progress}%</span>
//                   </div>
//                   <Progress value={progress} className="h-2" />
//                 </div>

//                 {progress === 100 && (
//                   <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertTitle className="text-green-900 dark:text-green-100">
//                       Successfully Imported {importedCount} Leads
//                     </AlertTitle>
//                   </Alert>
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <p className="text-sm text-muted-foreground">Select a CRM to import leads from:</p>
//                 {integrations.map((integration) => {
//                   const { icon: Icon, color } = crmIcons[integration.type] || { icon: Database, color: "text-gray-600" }
//                   return (
//                     <div
//                       key={integration.id}
//                       className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`rounded-full bg-muted p-2 ${color}`}>
//                           <Icon className="h-5 w-5" />
//                         </div>
//                         <div>
//                           <p className="font-medium">{integration.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Connected {integration.lastSyncedAt ? "and synced" : ""}
//                           </p>
//                         </div>
//                       </div>
//                       <Button onClick={() => handleImport(integration.type)} disabled={loading}>
//                         Import Leads
//                       </Button>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }




// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, CheckCircle2, AlertCircle, Link2, Database } from "lucide-react"
// import { toast } from "sonner"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { syncCRMLeads } from "@/lib/actions/lead-finder"

// const CRM_LOGOS: Record<string, string> = {
//   HUBSPOT: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
//   SALESFORCE:
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
//   PIPEDRIVE: "https://www.pipedrive.com/favicon.ico",
// }

// interface CRMImportDialogProps {
//   onImportComplete?: () => void
// }

// export function CRMImportDialog({ onImportComplete }: CRMImportDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [importedCount, setImportedCount] = useState(0)

//   useEffect(() => {
//     if (open) {
//       loadIntegrations()
//     }
//   }, [open])

//   const loadIntegrations = async () => {
//     try {
//       const userIntegrations = await getUserIntegrations()
//       const crmIntegrations = userIntegrations.filter((i: any) =>
//         ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type),
//       )
//       setIntegrations(crmIntegrations)
//     } catch (error) {
//       toast.error("Failed to load integrations")
//     }
//   }

//   const handleImport = async (crmType: string) => {
//     setLoading(true)
//     setSelectedCRM(crmType)
//     setProgress(10)

//     try {
//       toast.info(`Syncing leads from ${crmType}...`)
//       setProgress(50)

//       const result = await syncCRMLeads(crmType)

//       if (!result.success) {
//         toast.error(result.error || "Failed to sync leads")
//         return
//       }

//       setImportedCount(result.imported || 0)
//       setProgress(100)

//       toast.success(`Successfully imported ${result.imported} leads from ${crmType}!`)

//       if (onImportComplete) {
//         onImportComplete()
//       }

//       setTimeout(() => {
//         setOpen(false)
//         setSelectedCRM(null)
//         setProgress(0)
//       }, 2000)
//     } catch (error: any) {
//       toast.error(error.message || "Failed to import leads")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Link2 className="mr-2 h-4 w-4" />
//           Import from CRM
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Database className="h-5 w-5 text-primary" />
//             Import Leads from CRM
//           </DialogTitle>
//           <DialogDescription>
//             Sync contacts from your connected CRM platforms directly into your campaigns
//           </DialogDescription>
//         </DialogHeader>

//         {integrations.length === 0 ? (
//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>No CRM Integrations Connected</AlertTitle>
//             <AlertDescription>
//               <p className="mb-3">Connect HubSpot, Salesforce, or Pipedrive to import leads from your CRM.</p>
//               <Button size="sm" onClick={() => (window.location.href = "/dashboard/crm")}>
//                 Connect CRM
//               </Button>
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <div className="space-y-4">
//             {loading && selectedCRM ? (
//               <div className="space-y-6 py-8">
//                 <div className="flex flex-col items-center justify-center gap-4">
//                   <div className="rounded-full bg-primary/10 p-4">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   </div>
//                   <div className="text-center">
//                     <h3 className="font-semibold">Importing Leads from {selectedCRM}</h3>
//                     <p className="text-sm text-muted-foreground">This may take a few moments...</p>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Progress</span>
//                     <span className="font-medium">{progress}%</span>
//                   </div>
//                   <Progress value={progress} className="h-2" />
//                 </div>

//                 {progress === 100 && (
//                   <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertTitle className="text-green-900 dark:text-green-100">
//                       Successfully Imported {importedCount} Leads
//                     </AlertTitle>
//                   </Alert>
//                 )}
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <p className="text-sm text-muted-foreground">Select a CRM to import leads from:</p>
//                 {integrations.map((integration) => {
//                   const logo = CRM_LOGOS[integration.type]
//                   return (
//                     <div
//                       key={integration.id}
//                       className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5 border">
//                           {logo ? (
//                             <Image
//                               src={logo || "/placeholder.svg"}
//                               alt={integration.name || integration.type}
//                               width={28}
//                               height={28}
//                               className="object-contain"
//                             />
//                           ) : (
//                             <Database className="h-5 w-5 text-muted-foreground" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium">{integration.name || integration.type}</p>
//                           <p className="text-sm text-muted-foreground flex items-center gap-1">
//                             <CheckCircle2 className="h-3 w-3 text-green-500" />
//                             Connected {integration.lastSyncedAt ? "and synced" : ""}
//                           </p>
//                         </div>
//                       </div>
//                       <Button onClick={() => handleImport(integration.type)} disabled={loading}>
//                         Import Leads
//                       </Button>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Loader2,
//   CheckCircle2,
//   AlertCircle,
//   Link2,
//   Database,
//   ArrowLeft,
//   AlertTriangle,
//   User,
//   Building,
//   Mail,
// } from "lucide-react"
// import { toast } from "sonner"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { syncCRMLeads } from "@/lib/actions/lead-finder"

// const CRM_LOGOS: Record<string, string> = {
//   HUBSPOT: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
//   SALESFORCE:
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
//   PIPEDRIVE: "https://www.pipedrive.com/favicon.ico",
// }

// interface CRMContact {
//   id: string
//   email: string | null
//   firstName: string | null
//   lastName: string | null
//   company: string | null
//   phone: string | null
//   title: string | null
//   quality: "high" | "medium" | "low"
//   missingFields: string[]
// }

// interface CRMImportDialogProps {
//   onImportComplete?: () => void
// }

// type Step = "select" | "preview" | "importing" | "complete"

// export function CRMImportDialog({ onImportComplete }: CRMImportDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [step, setStep] = useState<Step>("select")
//   const [loading, setLoading] = useState(false)
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [importedCount, setImportedCount] = useState(0)

//   // Preview state
//   const [contacts, setContacts] = useState<CRMContact[]>([])
//   const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
//   const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0 })
//   const [excludeLowQuality, setExcludeLowQuality] = useState(true)

//   useEffect(() => {
//     if (open) {
//       loadIntegrations()
//     } else {
//       // Reset state when dialog closes
//       setStep("select")
//       setSelectedCRM(null)
//       setContacts([])
//       setSelectedContacts(new Set())
//       setProgress(0)
//     }
//   }, [open])

//   const loadIntegrations = async () => {
//     try {
//       const userIntegrations = await getUserIntegrations()
//       const crmIntegrations = userIntegrations.filter((i: any) =>
//         ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type),
//       )
//       setIntegrations(crmIntegrations)
//     } catch (error) {
//       toast.error("Failed to load integrations")
//     }
//   }

//   const handlePreview = async (crmType: string) => {
//     setLoading(true)
//     setSelectedCRM(crmType)

//     try {
//       const response = await fetch(`/api/crm/preview?type=${crmType}`)
//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch contacts")
//       }

//       setContacts(data.contacts)
//       setSummary(data.summary)

//       const autoSelected = new Set<string>(
//         data.contacts.filter((c: CRMContact) => c.quality !== "low").map((c: CRMContact) => c.id),
//       )
//       setSelectedContacts(autoSelected)

//       setStep("preview")
//     } catch (error: any) {
//       toast.error(error.message || "Failed to load contacts")
//       setSelectedCRM(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleContact = (id: string) => {
//     const newSelected = new Set(selectedContacts)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelectedContacts(newSelected)
//   }

//   const toggleAll = (quality?: "high" | "medium" | "low") => {
//     const filtered = quality ? contacts.filter((c) => c.quality === quality) : contacts
//     const allSelected = filtered.every((c) => selectedContacts.has(c.id))

//     const newSelected = new Set(selectedContacts)
//     filtered.forEach((c) => {
//       if (allSelected) {
//         newSelected.delete(c.id)
//       } else {
//         newSelected.add(c.id)
//       }
//     })
//     setSelectedContacts(newSelected)
//   }

//   const handleImport = async () => {
//     if (!selectedCRM || selectedContacts.size === 0) return

//     setStep("importing")
//     setProgress(10)

//     try {
//       toast.info(`Importing ${selectedContacts.size} contacts from ${selectedCRM}...`)
//       setProgress(50)

//       const result = await syncCRMLeads(selectedCRM)

//       if (!result.success) {
//         toast.error(result.error || "Failed to sync leads")
//         setStep("preview")
//         return
//       }

//       setImportedCount(result.imported || 0)
//       setProgress(100)
//       setStep("complete")

//       toast.success(`Successfully imported ${result.imported} leads from ${selectedCRM}!`)

//       if (onImportComplete) {
//         onImportComplete()
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to import leads")
//       setStep("preview")
//     }
//   }

//   const getQualityBadge = (quality: "high" | "medium" | "low") => {
//     switch (quality) {
//       case "high":
//         return <Badge className="bg-success/20 text-success border-success/30">High Quality</Badge>
//       case "medium":
//         return (
//           <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
//             Medium
//           </Badge>
//         )
//       case "low":
//         return (
//           <Badge variant="outline" className="border-destructive/30 text-destructive">
//             Low Quality
//           </Badge>
//         )
//     }
//   }

//   const filteredContacts = excludeLowQuality ? contacts.filter((c) => c.quality !== "low") : contacts

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Link2 className="mr-2 h-4 w-4" />
//           Import from CRM
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Database className="h-5 w-5 text-primary" />
//             {step === "select" && "Import Leads from CRM"}
//             {step === "preview" && "Preview Contacts"}
//             {step === "importing" && "Importing Leads"}
//             {step === "complete" && "Import Complete"}
//           </DialogTitle>
//           <DialogDescription>
//             {step === "select" && "Sync contacts from your connected CRM platforms"}
//             {step === "preview" && `Review contacts from ${selectedCRM} before importing`}
//             {step === "importing" && "Please wait while we import your contacts..."}
//             {step === "complete" && "Your contacts have been imported successfully"}
//           </DialogDescription>
//         </DialogHeader>

//         {/* Step: Select CRM */}
//         {step === "select" && (
//           <>
//             {integrations.length === 0 ? (
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>No CRM Integrations Connected</AlertTitle>
//                 <AlertDescription>
//                   <p className="mb-3">Connect HubSpot, Salesforce, or Pipedrive to import leads from your CRM.</p>
//                   <Button size="sm" onClick={() => (window.location.href = "/dashboard/crm")}>
//                     Connect CRM
//                   </Button>
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <div className="space-y-3">
//                 <p className="text-sm text-muted-foreground">Select a CRM to preview and import leads from:</p>
//                 {integrations.map((integration) => {
//                   const logo = CRM_LOGOS[integration.type]
//                   return (
//                     <div
//                       key={integration.id}
//                       className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5 border">
//                           {logo ? (
//                             <Image
//                               src={logo || "/placeholder.svg"}
//                               alt={integration.name || integration.type}
//                               width={28}
//                               height={28}
//                               className="object-contain"
//                             />
//                           ) : (
//                             <Database className="h-5 w-5 text-muted-foreground" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium">{integration.name || integration.type}</p>
//                           <p className="text-sm text-muted-foreground flex items-center gap-1">
//                             <CheckCircle2 className="h-3 w-3 text-success" />
//                             Connected
//                           </p>
//                         </div>
//                       </div>
//                       <Button onClick={() => handlePreview(integration.type)} disabled={loading}>
//                         {loading && selectedCRM === integration.type ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Loading...
//                           </>
//                         ) : (
//                           "Preview Contacts"
//                         )}
//                       </Button>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* Step: Preview Contacts */}
//         {step === "preview" && (
//           <div className="flex flex-col flex-1 min-h-0 space-y-4">
//             {/* Summary Cards */}
//             <div className="grid grid-cols-4 gap-3">
//               <div className="rounded-lg border bg-card/50 p-3 text-center">
//                 <p className="text-2xl font-bold">{summary.total}</p>
//                 <p className="text-xs text-muted-foreground">Total</p>
//               </div>
//               <div className="rounded-lg border bg-success/10 border-success/20 p-3 text-center">
//                 <p className="text-2xl font-bold text-success">{summary.high}</p>
//                 <p className="text-xs text-muted-foreground">High Quality</p>
//               </div>
//               <div className="rounded-lg border bg-yellow-500/10 border-yellow-500/20 p-3 text-center">
//                 <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.medium}</p>
//                 <p className="text-xs text-muted-foreground">Medium</p>
//               </div>
//               <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-3 text-center">
//                 <p className="text-2xl font-bold text-destructive">{summary.low}</p>
//                 <p className="text-xs text-muted-foreground">Low Quality</p>
//               </div>
//             </div>

//             {/* Low Quality Warning */}
//             {summary.low > 0 && (
//               <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertTitle>Low Quality Contacts Detected</AlertTitle>
//                 <AlertDescription className="flex items-center justify-between">
//                   <span>{summary.low} contacts are missing email addresses and cannot be contacted.</span>
//                   <div className="flex items-center gap-2">
//                     <Checkbox
//                       id="excludeLow"
//                       checked={excludeLowQuality}
//                       onCheckedChange={(checked) => setExcludeLowQuality(checked as boolean)}
//                     />
//                     <label htmlFor="excludeLow" className="text-sm cursor-pointer">
//                       Hide low quality
//                     </label>
//                   </div>
//                 </AlertDescription>
//               </Alert>
//             )}

//             {/* Contacts List */}
//             <div className="flex items-center justify-between">
//               <p className="text-sm text-muted-foreground">
//                 {selectedContacts.size} of {filteredContacts.length} contacts selected
//               </p>
//               <Button variant="ghost" size="sm" onClick={() => toggleAll()}>
//                 {filteredContacts.every((c) => selectedContacts.has(c.id)) ? "Deselect All" : "Select All"}
//               </Button>
//             </div>

//             <ScrollArea className="flex-1 min-h-0 border rounded-lg">
//               <div className="divide-y">
//                 {filteredContacts.map((contact) => (
//                   <div
//                     key={contact.id}
//                     className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
//                       selectedContacts.has(contact.id) ? "bg-primary/5" : ""
//                     }`}
//                     onClick={() => toggleContact(contact.id)}
//                   >
//                     <Checkbox checked={selectedContacts.has(contact.id)} />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <p className="font-medium truncate">
//                           {contact.firstName || contact.lastName
//                             ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
//                             : "Unknown Name"}
//                         </p>
//                         {getQualityBadge(contact.quality)}
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
//                         {contact.email ? (
//                           <span className="flex items-center gap-1 truncate">
//                             <Mail className="h-3 w-3" />
//                             {contact.email}
//                           </span>
//                         ) : (
//                           <span className="flex items-center gap-1 text-destructive">
//                             <Mail className="h-3 w-3" />
//                             No email
//                           </span>
//                         )}
//                         {contact.company && (
//                           <span className="flex items-center gap-1 truncate">
//                             <Building className="h-3 w-3" />
//                             {contact.company}
//                           </span>
//                         )}
//                         {contact.title && (
//                           <span className="flex items-center gap-1 truncate">
//                             <User className="h-3 w-3" />
//                             {contact.title}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>

//             {/* Actions */}
//             <div className="flex items-center justify-between pt-2 border-t">
//               <Button variant="ghost" onClick={() => setStep("select")}>
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//               <Button onClick={handleImport} disabled={selectedContacts.size === 0}>
//                 Import {selectedContacts.size} Contacts
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Step: Importing */}
//         {step === "importing" && (
//           <div className="space-y-6 py-8">
//             <div className="flex flex-col items-center justify-center gap-4">
//               <div className="rounded-full bg-primary/10 p-4">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//               </div>
//               <div className="text-center">
//                 <h3 className="font-semibold">Importing Contacts from {selectedCRM}</h3>
//                 <p className="text-sm text-muted-foreground">This may take a few moments...</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Progress</span>
//                 <span className="font-medium">{progress}%</span>
//               </div>
//               <Progress value={progress} className="h-2" />
//             </div>
//           </div>
//         )}

//         {/* Step: Complete */}
//         {step === "complete" && (
//           <div className="space-y-6 py-8">
//             <div className="flex flex-col items-center justify-center gap-4">
//               <div className="rounded-full bg-success/10 p-4">
//                 <CheckCircle2 className="h-8 w-8 text-success" />
//               </div>
//               <div className="text-center">
//                 <h3 className="font-semibold">Import Complete!</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Successfully imported {importedCount} contacts from {selectedCRM}
//                 </p>
//               </div>
//             </div>

//             <div className="flex justify-center">
//               <Button onClick={() => setOpen(false)}>Done</Button>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link2,
  Database,
  ArrowLeft,
  AlertTriangle,
  User,
  Building,
  Mail,
  Pencil,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { getUserIntegrations } from "@/lib/actions/integrations"
import { syncCRMLeads } from "@/lib/actions/lead-finder"

const CRM_LOGOS: Record<string, string> = {
  HUBSPOT: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  SALESFORCE:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
  PIPEDRIVE: "https://www.pipedrive.com/favicon.ico",
}

interface CRMContact {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  company: string | null
  phone: string | null
  title: string | null
  quality: "high" | "medium" | "low"
  missingFields: string[]
}

interface CRMImportDialogProps {
  folderId?: string
  onImportComplete?: () => void
}

type Step = "select" | "preview" | "importing" | "complete"

export function CRMImportDialog({ folderId, onImportComplete }: CRMImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("select")
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState<any[]>([])
  const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [importedCount, setImportedCount] = useState(0)
  const [skippedCount, setSkippedCount] = useState(0)

  // Preview state
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0 })
  const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all")

  // Edit low quality contacts
  const [editingContact, setEditingContact] = useState<CRMContact | null>(null)
  const [editForm, setEditForm] = useState({ email: "", firstName: "", lastName: "", company: "" })

  // AI Quality check
  const [aiChecking, setAiChecking] = useState(false)

  useEffect(() => {
    if (open) {
      loadIntegrations()
    } else {
      // Reset state when dialog closes
      setStep("select")
      setSelectedCRM(null)
      setContacts([])
      setSelectedContacts(new Set())
      setProgress(0)
      setEditingContact(null)
      setActiveTab("all")
    }
  }, [open])

  const loadIntegrations = async () => {
    try {
      const userIntegrations = await getUserIntegrations()
      const crmIntegrations = userIntegrations.filter((i: any) =>
        ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type),
      )
      setIntegrations(crmIntegrations)
    } catch (error) {
      toast.error("Failed to load integrations")
    }
  }

  const handlePreview = async (crmType: string) => {
    setLoading(true)
    setSelectedCRM(crmType)

    try {
      const response = await fetch(`/api/crm/preview?type=${crmType}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch contacts")
      }

      setContacts(data.contacts)
      setSummary(data.summary)

      // Auto-select high and medium quality contacts
      const autoSelected = new Set<string>(
        data.contacts.filter((c: CRMContact) => c.quality !== "low").map((c: CRMContact) => c.id),
      )
      setSelectedContacts(autoSelected)

      setStep("preview")
    } catch (error: any) {
      toast.error(error.message || "Failed to load contacts")
      setSelectedCRM(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAIQualityCheck = async () => {
    setAiChecking(true)
    try {
      const response = await fetch("/api/crm/ai-quality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts }),
      })

      if (!response.ok) {
        throw new Error("AI quality check failed")
      }

      const data = await response.json()
      setContacts(data.contacts)
      setSummary(data.summary)

      // Update selection based on new quality scores
      const autoSelected = new Set<string>(
        data.contacts.filter((c: CRMContact) => c.quality !== "low").map((c: CRMContact) => c.id),
      )
      setSelectedContacts(autoSelected)

      toast.success("AI quality check complete")
    } catch (error) {
      toast.error("AI quality check failed")
    } finally {
      setAiChecking(false)
    }
  }

  const toggleContact = (id: string) => {
    const newSelected = new Set(selectedContacts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedContacts(newSelected)
  }

  const toggleAll = (quality?: "high" | "medium" | "low") => {
    const filtered = quality ? contacts.filter((c) => c.quality === quality) : contacts
    const allSelected = filtered.every((c) => selectedContacts.has(c.id))

    const newSelected = new Set(selectedContacts)
    filtered.forEach((c) => {
      if (allSelected) {
        newSelected.delete(c.id)
      } else {
        newSelected.add(c.id)
      }
    })
    setSelectedContacts(newSelected)
  }

  const startEditingContact = (contact: CRMContact) => {
    setEditingContact(contact)
    setEditForm({
      email: contact.email || "",
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      company: contact.company || "",
    })
  }

  const saveEditedContact = () => {
    if (!editingContact) return

    // Update the contact in the list
    const updatedContacts = contacts.map((c) => {
      if (c.id === editingContact.id) {
        const updated = {
          ...c,
          email: editForm.email || null,
          firstName: editForm.firstName || null,
          lastName: editForm.lastName || null,
          company: editForm.company || null,
        }

        // Recalculate quality
        const missingFields: string[] = []
        if (!updated.email) missingFields.push("email")
        if (!updated.firstName && !updated.lastName) missingFields.push("name")
        if (!updated.company) missingFields.push("company")

        let quality: "high" | "medium" | "low" = "high"
        if (!updated.email) {
          quality = "low"
        } else if (missingFields.length > 0) {
          quality = "medium"
        }

        return { ...updated, quality, missingFields }
      }
      return c
    })

    setContacts(updatedContacts)

    // Recalculate summary
    const newSummary = {
      total: updatedContacts.length,
      high: updatedContacts.filter((c) => c.quality === "high").length,
      medium: updatedContacts.filter((c) => c.quality === "medium").length,
      low: updatedContacts.filter((c) => c.quality === "low").length,
    }
    setSummary(newSummary)

    // Auto-select if quality improved
    const updatedContact = updatedContacts.find((c) => c.id === editingContact.id)
    if (updatedContact && updatedContact.quality !== "low") {
      setSelectedContacts((prev) => new Set([...prev, editingContact.id]))
    }

    setEditingContact(null)
    toast.success("Contact updated")
  }

  const handleImport = async () => {
    if (!selectedCRM || selectedContacts.size === 0) return

    setStep("importing")
    setProgress(10)

    try {
      toast.info(`Importing ${selectedContacts.size} contacts from ${selectedCRM}...`)
      setProgress(50)

      const result = await syncCRMLeads(selectedCRM, folderId)

      if (!result.success) {
        toast.error(result.error || "Failed to sync leads")
        setStep("preview")
        return
      }

      setImportedCount(result.imported || 0)
      setSkippedCount(result.skipped || 0)
      setProgress(100)
      setStep("complete")

      toast.success(`Successfully imported ${result.imported} leads from ${selectedCRM}!`)

      if (onImportComplete) {
        onImportComplete()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to import leads")
      setStep("preview")
    }
  }

  const getQualityBadge = (quality: "high" | "medium" | "low") => {
    switch (quality) {
      case "high":
        return <Badge className="bg-success/20 text-success border-success/30">High Quality</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="border-destructive/30 text-destructive">
            Low Quality
          </Badge>
        )
    }
  }

  const getFilteredContacts = () => {
    if (activeTab === "all") return contacts
    return contacts.filter((c) => c.quality === activeTab)
  }

  const filteredContacts = getFilteredContacts()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 className="mr-2 h-4 w-4" />
          Import from CRM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {step === "select" && "Import Leads from CRM"}
            {step === "preview" && "Preview Contacts"}
            {step === "importing" && "Importing Leads"}
            {step === "complete" && "Import Complete"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" && "Sync contacts from your connected CRM platforms"}
            {step === "preview" && `Review contacts from ${selectedCRM} before importing`}
            {step === "importing" && "Please wait while we import your contacts..."}
            {step === "complete" && "Your contacts have been imported successfully"}
          </DialogDescription>
        </DialogHeader>

        {/* Step: Select CRM */}
        {step === "select" && (
          <>
            {integrations.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No CRM Integrations Connected</AlertTitle>
                <AlertDescription>
                  <p className="mb-3">Connect HubSpot, Salesforce, or Pipedrive to import leads from your CRM.</p>
                  <Button size="sm" onClick={() => (window.location.href = "/dashboard/crm")}>
                    Connect CRM
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select a CRM to preview and import leads from:</p>
                {folderId && (
                  <Alert className="bg-primary/5 border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertDescription>Contacts will be imported into the current folder.</AlertDescription>
                  </Alert>
                )}
                {integrations.map((integration) => {
                  const logo = CRM_LOGOS[integration.type]
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5 border">
                          {logo ? (
                            <Image
                              src={logo || "/placeholder.svg"}
                              alt={integration.name || integration.type}
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          ) : (
                            <Database className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{integration.name || integration.type}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            Connected
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => handlePreview(integration.type)} disabled={loading}>
                        {loading && selectedCRM === integration.type ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Preview Contacts"
                        )}
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Step: Preview Contacts */}
        {step === "preview" && (
          <div className="flex flex-col flex-1 min-h-0 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg border bg-card/50 p-3 text-center">
                <p className="text-2xl font-bold">{summary.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg border bg-success/10 border-success/20 p-3 text-center">
                <p className="text-2xl font-bold text-success">{summary.high}</p>
                <p className="text-xs text-muted-foreground">High Quality</p>
              </div>
              <div className="rounded-lg border bg-yellow-500/10 border-yellow-500/20 p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.medium}</p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="rounded-lg border bg-destructive/10 border-destructive/20 p-3 text-center">
                <p className="text-2xl font-bold text-destructive">{summary.low}</p>
                <p className="text-xs text-muted-foreground">Low Quality</p>
              </div>
            </div>

            {/* AI Quality Check Button */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleAIQualityCheck} disabled={aiChecking}>
                {aiChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Quality Check
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {selectedContacts.size} of {contacts.length} contacts selected
              </p>
            </div>

            {/* Tabs for filtering by quality */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
                <TabsTrigger value="high">High ({summary.high})</TabsTrigger>
                <TabsTrigger value="medium">Medium ({summary.medium})</TabsTrigger>
                <TabsTrigger value="low">Low ({summary.low})</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Low Quality Warning */}
            {activeTab === "low" && summary.low > 0 && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Low Quality Contacts</AlertTitle>
                <AlertDescription>
                  These contacts are missing critical fields. Click the edit icon to manually fill in missing
                  information.
                </AlertDescription>
              </Alert>
            )}

            {/* Contacts List */}
            <ScrollArea className="flex-1 min-h-0 border rounded-lg">
              <div className="divide-y">
                {filteredContacts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No contacts in this category</div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${
                        selectedContacts.has(contact.id) ? "bg-primary/5" : ""
                      }`}
                    >
                      <Checkbox
                        checked={selectedContacts.has(contact.id)}
                        onCheckedChange={() => toggleContact(contact.id)}
                        disabled={contact.quality === "low" && !contact.email}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {contact.firstName || contact.lastName
                              ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
                              : "Unknown Name"}
                          </p>
                          {getQualityBadge(contact.quality)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
                          {contact.email ? (
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-destructive">
                              <Mail className="h-3 w-3" />
                              No email
                            </span>
                          )}
                          {contact.company && (
                            <span className="flex items-center gap-1 truncate">
                              <Building className="h-3 w-3" />
                              {contact.company}
                            </span>
                          )}
                          {contact.title && (
                            <span className="flex items-center gap-1 truncate">
                              <User className="h-3 w-3" />
                              {contact.title}
                            </span>
                          )}
                        </div>
                        {contact.missingFields.length > 0 && (
                          <p className="text-xs text-destructive mt-1">Missing: {contact.missingFields.join(", ")}</p>
                        )}
                      </div>
                      {/* Edit button for low/medium quality */}
                      {(contact.quality === "low" || contact.quality === "medium") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditingContact(contact)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button variant="ghost" onClick={() => setStep("select")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleImport} disabled={selectedContacts.size === 0}>
                Import {selectedContacts.size} Contacts
              </Button>
            </div>
          </div>
        )}

        {/* Edit Contact Modal */}
        {editingContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg border shadow-lg w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Edit Contact</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditingContact(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="john@company.com"
                  />
                  {!editForm.email && (
                    <p className="text-xs text-destructive">Email is required to import this contact</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingContact(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedContact}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Importing */}
        {step === "importing" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Importing Contacts from {selectedCRM}</h3>
                <p className="text-sm text-muted-foreground">This may take a few moments...</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-success/10 p-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Import Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Successfully imported {importedCount} contacts from {selectedCRM}
                </p>
                {skippedCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {skippedCount} contacts were skipped (duplicates or low quality)
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={() => setOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}



// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Download, CheckCircle2, AlertCircle, RefreshCw, User, AlertTriangle } from "lucide-react"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { syncCRMLeads } from "@/lib/actions/lead-finder"
// import { cn } from "@/lib/utils"

// const CRM_PROVIDERS = [
//   {
//     id: "HUBSPOT",
//     name: "HubSpot",
//     logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
//   },
//   {
//     id: "SALESFORCE",
//     name: "Salesforce",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
//   },
//   {
//     id: "PIPEDRIVE",
//     name: "Pipedrive",
//     logo: "https://www.pipedrive.com/favicon.ico",
//   },
// ]

// interface CRMImportDialogProps {
//   trigger?: React.ReactNode
//   onImportComplete?: (count: number) => void
// }

// export function CRMImportDialog({ trigger, onImportComplete }: CRMImportDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [selectedCrm, setSelectedCrm] = useState<string>("")
//   const [loading, setLoading] = useState(false)
//   const [loadingIntegrations, setLoadingIntegrations] = useState(true)
//   const [result, setResult] = useState<{
//     success: boolean
//     message: string
//     count?: number
//     skipped?: number
//     lowQuality?: Array<{ name: string; email?: string; reason: string }>
//   } | null>(null)

//   useEffect(() => {
//     if (open) {
//       loadIntegrations()
//     }
//   }, [open])

//   const loadIntegrations = async () => {
//     setLoadingIntegrations(true)
//     try {
//       const data = await getUserIntegrations()
//       const crmIntegrations = data.filter(
//         (i: any) => ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"].includes(i.type) && i.status === "CONNECTED",
//       )
//       setIntegrations(crmIntegrations)

//       if (crmIntegrations.length === 1) {
//         setSelectedCrm(crmIntegrations[0].type)
//       }
//     } catch (error) {
//       console.error("Error loading integrations:", error)
//     } finally {
//       setLoadingIntegrations(false)
//     }
//   }

//   const handleImport = async () => {
//     if (!selectedCrm) return

//     setLoading(true)
//     setResult(null)

//     try {
//       const integration = integrations.find((i: { type: string }) => i.type === selectedCrm)

//       if (!integration) {
//         setResult({ success: false, message: "Integration not found. Please reconnect your CRM." })
//         return
//       }

//       const response = await syncCRMLeads(selectedCrm)

//       if (response.success) {
//         const count = response.imported || 0
//         const skipped = response.skipped || 0
//         const lowQuality = response.lowQualityContacts || []

//         setResult({
//           success: true,
//           message:
//             count > 0
//               ? `Successfully imported ${count} prospect${count !== 1 ? "s" : ""} from ${selectedCrm}.`
//               : `No new prospects found to import from ${selectedCrm}.`,
//           count,
//           skipped,
//           lowQuality,
//         })
//         onImportComplete?.(count)
//       } else {
//         setResult({
//           success: false,
//           message: response.error || "Failed to import prospects. Please try again.",
//         })
//       }
//     } catch (error) {
//       console.error("CRM import error:", error)
//       setResult({
//         success: false,
//         message: "An error occurred while importing. Please try again.",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const connectedCrmIds = integrations.map((i) => i.type)
//   const selectedProvider = CRM_PROVIDERS.find((p) => p.id === selectedCrm)

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline" size="sm">
//             <Download className="mr-2 h-4 w-4" />
//             Import from CRM
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-lg bg-card/80 backdrop-blur-xl border-border/50">
//         <DialogHeader>
//           <DialogTitle>Import Prospects from CRM</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {loadingIntegrations ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
//             </div>
//           ) : connectedCrmIds.length === 0 ? (
//             <div className="text-center py-8 space-y-3">
//               <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
//               <p className="text-sm text-muted-foreground">
//                 No CRM integrations connected. Connect a CRM first to import prospects.
//               </p>
//               <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
//                 Go to CRM Settings
//               </Button>
//             </div>
//           ) : (
//             <>
//               <RadioGroup value={selectedCrm} onValueChange={setSelectedCrm}>
//                 <div className="grid gap-3">
//                   {CRM_PROVIDERS.filter((crm) => connectedCrmIds.includes(crm.id)).map((crm) => (
//                     <Label
//                       key={crm.id}
//                       htmlFor={crm.id}
//                       className={cn(
//                         "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
//                         "bg-background/50 backdrop-blur-sm",
//                         "hover:bg-muted/50 hover:border-foreground/20",
//                         selectedCrm === crm.id ? "border-foreground/30 bg-muted/30 shadow-sm" : "border-border/50",
//                       )}
//                     >
//                       <RadioGroupItem value={crm.id} id={crm.id} />
//                       <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
//                         <Image
//                           src={crm.logo || "/placeholder.svg"}
//                           alt={crm.name}
//                           width={24}
//                           height={24}
//                           className="object-contain"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-sm">{crm.name}</p>
//                         <p className="text-xs text-muted-foreground">Connected</p>
//                       </div>
//                       <CheckCircle2 className="h-4 w-4 text-success" />
//                     </Label>
//                   ))}
//                 </div>
//               </RadioGroup>

//               {result && (
//                 <div className="space-y-3">
//                   <div
//                     className={cn(
//                       "p-4 rounded-xl text-sm flex items-start gap-3",
//                       result.success
//                         ? "bg-success/10 text-success border border-success/20"
//                         : "bg-destructive/10 text-destructive border border-destructive/20",
//                     )}
//                   >
//                     {result.success ? (
//                       <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
//                     ) : (
//                       <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
//                     )}
//                     <div className="space-y-1">
//                       <p>{result.message}</p>
//                       {result.skipped && result.skipped > 0 && (
//                         <p className="text-xs opacity-80">
//                           {result.skipped} contact{result.skipped !== 1 ? "s" : ""} skipped (already imported or
//                           invalid)
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Low quality contacts section */}
//                   {result.lowQuality && result.lowQuality.length > 0 && (
//                     <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
//                       <div className="flex items-center gap-2 mb-3">
//                         <AlertTriangle className="h-4 w-4 text-amber-500" />
//                         <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
//                           {result.lowQuality.length} Low Quality Contact{result.lowQuality.length !== 1 ? "s" : ""}
//                         </p>
//                       </div>
//                       <ScrollArea className="max-h-32">
//                         <div className="space-y-2">
//                           {result.lowQuality.map((contact, idx) => (
//                             <div
//                               key={idx}
//                               className="flex items-center justify-between text-xs p-2 rounded-lg bg-background/50"
//                             >
//                               <div className="flex items-center gap-2">
//                                 <User className="h-3 w-3 text-muted-foreground" />
//                                 <span className="font-medium">{contact.name || "Unknown"}</span>
//                                 {contact.email && <span className="text-muted-foreground">{contact.email}</span>}
//                               </div>
//                               <Badge
//                                 variant="secondary"
//                                 className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400"
//                               >
//                                 {contact.reason}
//                               </Badge>
//                             </div>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                       <p className="text-xs text-muted-foreground mt-2">
//                         These contacts were skipped due to missing required fields.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   className="flex-1 bg-transparent"
//                   onClick={() => {
//                     setOpen(false)
//                     setResult(null)
//                   }}
//                 >
//                   {result?.success ? "Done" : "Cancel"}
//                 </Button>
//                 <Button className="flex-1" onClick={handleImport} disabled={!selectedCrm || loading}>
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Importing...
//                     </>
//                   ) : result?.success ? (
//                     <>
//                       <RefreshCw className="mr-2 h-4 w-4" />
//                       Sync Again
//                     </>
//                   ) : (
//                     <>
//                       <Download className="mr-2 h-4 w-4" />
//                       Import Prospects
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
