
// "use client"

// import type React from "react"

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
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
//   Pencil,
//   Sparkles,
//   X,
// } from "lucide-react"
// import { toast } from "sonner"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { syncCRMLeads } from "@/lib/actions/lead-finder"
// import { WaveLoader } from "../loader/wave-loader"

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
//   folderId?: string | null
//   onImportComplete?: () => void
//   trigger?: React.ReactNode
// }

// type Step = "select" | "preview" | "importing" | "complete"

// export function CRMImportDialog({ folderId, onImportComplete, trigger }: CRMImportDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [step, setStep] = useState<Step>("select")
//   const [loading, setLoading] = useState(false)
//   const [integrations, setIntegrations] = useState<any[]>([])
//   const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
//   const [progress, setProgress] = useState(0)
//   const [importedCount, setImportedCount] = useState(0)
//   const [skippedCount, setSkippedCount] = useState(0)

//   // Preview state
//   const [contacts, setContacts] = useState<CRMContact[]>([])
//   const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
//   const [summary, setSummary] = useState({ total: 0, high: 0, medium: 0, low: 0 })
//   const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all")

//   // Edit low quality contacts
//   const [editingContact, setEditingContact] = useState<CRMContact | null>(null)
//   const [editForm, setEditForm] = useState({ email: "", firstName: "", lastName: "", company: "" })

//   // AI Quality check
//   const [aiChecking, setAiChecking] = useState(false)

//   useEffect(() => {
//     if (open) {
//       loadIntegrations()
//     } else {
//       setStep("select")
//       setSelectedCRM(null)
//       setContacts([])
//       setSelectedContacts(new Set())
//       setProgress(0)
//       setEditingContact(null)
//       setActiveTab("all")
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

//   const handleAIQualityCheck = async () => {
//     setAiChecking(true)
//     try {
//       const response = await fetch("/api/crm/ai-quality-check", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contacts }),
//       })

//       if (!response.ok) {
//         throw new Error("AI quality check failed")
//       }

//       const data = await response.json()
//       setContacts(data.contacts)
//       setSummary(data.summary)

//       const autoSelected = new Set<string>(
//         data.contacts.filter((c: CRMContact) => c.quality !== "low").map((c: CRMContact) => c.id),
//       )
//       setSelectedContacts(autoSelected)

//       toast.success("AI quality check complete")
//     } catch (error) {
//       toast.error("AI quality check failed")
//     } finally {
//       setAiChecking(false)
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

//   const startEditingContact = (contact: CRMContact) => {
//     setEditingContact(contact)
//     setEditForm({
//       email: contact.email || "",
//       firstName: contact.firstName || "",
//       lastName: contact.lastName || "",
//       company: contact.company || "",
//     })
//   }

//   const saveEditedContact = () => {
//     if (!editingContact) return

//     const updatedContacts = contacts.map((c) => {
//       if (c.id === editingContact.id) {
//         const updated = {
//           ...c,
//           email: editForm.email || null,
//           firstName: editForm.firstName || null,
//           lastName: editForm.lastName || null,
//           company: editForm.company || null,
//         }

//         const missingFields: string[] = []
//         if (!updated.email) missingFields.push("email")
//         if (!updated.firstName && !updated.lastName) missingFields.push("name")
//         if (!updated.company) missingFields.push("company")

//         let quality: "high" | "medium" | "low" = "high"
//         if (!updated.email) {
//           quality = "low"
//         } else if (missingFields.length > 0) {
//           quality = "medium"
//         }

//         return { ...updated, quality, missingFields }
//       }
//       return c
//     })

//     setContacts(updatedContacts)

//     const newSummary = {
//       total: updatedContacts.length,
//       high: updatedContacts.filter((c) => c.quality === "high").length,
//       medium: updatedContacts.filter((c) => c.quality === "medium").length,
//       low: updatedContacts.filter((c) => c.quality === "low").length,
//     }
//     setSummary(newSummary)

//     const updatedContact = updatedContacts.find((c) => c.id === editingContact.id)
//     if (updatedContact && updatedContact.quality !== "low") {
//       setSelectedContacts((prev) => new Set([...prev, editingContact.id]))
//     }

//     setEditingContact(null)
//     toast.success("Contact updated")
//   }

//   const handleImport = async () => {
//     if (!selectedCRM || selectedContacts.size === 0) return

//     setStep("importing")
//     setProgress(10)

//     try {
//       toast.info(`Importing ${selectedContacts.size} contacts from ${selectedCRM}...`)
//       setProgress(50)

//       const result = await syncCRMLeads(selectedCRM, folderId || undefined)

//       if (!result.success) {
//         toast.error(result.error || "Failed to sync leads")
//         setStep("preview")
//         return
//       }

//       setImportedCount(result.imported || 0)
//       setSkippedCount(result.skipped || 0)
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

//   const getFilteredContacts = () => {
//     if (activeTab === "all") return contacts
//     return contacts.filter((c) => c.quality === activeTab)
//   }

//   const filteredContacts = getFilteredContacts()

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button variant="outline">
//             <Link2 className="mr-2 h-4 w-4" />
//             Import from CRM
//           </Button>
//         )}
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
//                 {folderId && (
//                   <Alert className="bg-primary/5 border-primary/20">
//                     <CheckCircle2 className="h-4 w-4 text-primary" />
//                     <AlertDescription>Contacts will be imported into the current folder.</AlertDescription>
//                   </Alert>
//                 )}
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
//                             <WaveLoader size="sm" bars={8} gap="tight" />
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

//             <div className="flex items-center justify-between">
//               <Button variant="outline" size="sm" onClick={handleAIQualityCheck} disabled={aiChecking}>
//                 {aiChecking ? (
//                   <>
//                     <WaveLoader size="sm" bars={8} gap="tight" />
//                     Checking...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="mr-2 h-4 w-4" />
//                     AI Quality Check
//                   </>
//                 )}
//               </Button>
//               <p className="text-sm text-muted-foreground">
//                 {selectedContacts.size} of {contacts.length} contacts selected
//               </p>
//             </div>

//             <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
//                 <TabsTrigger value="high">High ({summary.high})</TabsTrigger>
//                 <TabsTrigger value="medium">Medium ({summary.medium})</TabsTrigger>
//                 <TabsTrigger value="low">Low ({summary.low})</TabsTrigger>
//               </TabsList>
//             </Tabs>

//             {activeTab === "low" && summary.low > 0 && (
//               <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertTitle>Low Quality Contacts</AlertTitle>
//                 <AlertDescription>
//                   These contacts are missing critical fields. Click the edit icon to manually fill in missing
//                   information.
//                 </AlertDescription>
//               </Alert>
//             )}

//             <ScrollArea className="flex-1 min-h-0 border rounded-lg max-h-[300px]">
//               <div className="divide-y">
//                 {filteredContacts.length === 0 ? (
//                   <div className="p-8 text-center text-muted-foreground">No contacts in this category</div>
//                 ) : (
//                   filteredContacts.map((contact) => (
//                     <div
//                       key={contact.id}
//                       className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${
//                         selectedContacts.has(contact.id) ? "bg-primary/5" : ""
//                       }`}
//                     >
//                       <Checkbox
//                         checked={selectedContacts.has(contact.id)}
//                         onCheckedChange={() => toggleContact(contact.id)}
//                         disabled={contact.quality === "low" && !contact.email}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2">
//                           <p className="font-medium truncate">
//                             {contact.firstName || contact.lastName
//                               ? `${contact.firstName || ""} ${contact.lastName || ""}`.trim()
//                               : "Unknown Name"}
//                           </p>
//                           {getQualityBadge(contact.quality)}
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
//                           {contact.email ? (
//                             <span className="flex items-center gap-1 truncate">
//                               <Mail className="h-3 w-3" />
//                               {contact.email}
//                             </span>
//                           ) : (
//                             <span className="flex items-center gap-1 text-destructive">
//                               <Mail className="h-3 w-3" />
//                               No email
//                             </span>
//                           )}
//                           {contact.company && (
//                             <span className="flex items-center gap-1 truncate">
//                               <Building className="h-3 w-3" />
//                               {contact.company}
//                             </span>
//                           )}
//                           {contact.title && (
//                             <span className="flex items-center gap-1 truncate">
//                               <User className="h-3 w-3" />
//                               {contact.title}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="icon" onClick={() => startEditingContact(contact)}>
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </ScrollArea>

//             <div className="flex items-center justify-between pt-4 border-t">
//               <Button variant="outline" onClick={() => setStep("select")}>
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
//           <div className="py-8 space-y-6">
//             <div className="flex flex-col items-center gap-4">
//               {/* <Loader2 className="h-12 w-12 animate-spin text-primary" /> */}
//               <WaveLoader size="sm" bars={8} gap="tight" />
//               <p className="text-lg font-medium">Importing contacts...</p>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>
//         )}

//         {/* Step: Complete */}
//         {step === "complete" && (
//           <div className="py-8 space-y-6">
//             <div className="flex flex-col items-center gap-4">
//               <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
//                 <CheckCircle2 className="h-8 w-8 text-success" />
//               </div>
//               <div className="text-center">
//                 <p className="text-lg font-medium">Import Complete!</p>
//                 <p className="text-muted-foreground">
//                   {importedCount} contacts imported, {skippedCount} skipped
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-center">
//               <Button onClick={() => setOpen(false)}>Done</Button>
//             </div>
//           </div>
//         )}

//         {/* Edit Contact Modal */}
//         {editingContact && (
//           <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
//             <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">Edit Contact</h3>
//                 <Button variant="ghost" size="icon" onClick={() => setEditingContact(null)}>
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email *</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={editForm.email}
//                     onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                     placeholder="email@example.com"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input
//                       id="firstName"
//                       value={editForm.firstName}
//                       onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input
//                       id="lastName"
//                       value={editForm.lastName}
//                       onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="company">Company</Label>
//                   <Input
//                     id="company"
//                     value={editForm.company}
//                     onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setEditingContact(null)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={saveEditedContact}>Save Changes</Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import type React from "react"

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
import { WaveLoader } from "../loader/wave-loader"

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
  folderId?: string | null
  onImportComplete?: () => void
  trigger?: React.ReactNode
}

type Step = "select" | "preview" | "importing" | "complete"

export function CRMImportDialog({ folderId, onImportComplete, trigger }: CRMImportDialogProps) {
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

    const updatedContacts = contacts.map((c) => {
      if (c.id === editingContact.id) {
        const updated = {
          ...c,
          email: editForm.email || null,
          firstName: editForm.firstName || null,
          lastName: editForm.lastName || null,
          company: editForm.company || null,
        }

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

    const newSummary = {
      total: updatedContacts.length,
      high: updatedContacts.filter((c) => c.quality === "high").length,
      medium: updatedContacts.filter((c) => c.quality === "medium").length,
      low: updatedContacts.filter((c) => c.quality === "low").length,
    }
    setSummary(newSummary)

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

      const result = await syncCRMLeads(selectedCRM, folderId || undefined)

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
        {trigger || (
          <Button variant="outline">
            <Link2 className="mr-2 h-4 w-4" />
            Import from CRM
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 flex flex-col">
        {/* Fixed Header - doesn't scroll */}
        <div className="px-6 pt-6 pb-4 border-b">
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
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
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
                              <WaveLoader size="sm" bars={8} gap="tight" />
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
            <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleAIQualityCheck} disabled={aiChecking}>
                  {aiChecking ? (
                    <>
                      <WaveLoader size="sm" bars={8} gap="tight" />
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

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
                  <TabsTrigger value="high">High ({summary.high})</TabsTrigger>
                  <TabsTrigger value="medium">Medium ({summary.medium})</TabsTrigger>
                  <TabsTrigger value="low">Low ({summary.low})</TabsTrigger>
                </TabsList>
              </Tabs>

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

              <div className="border rounded-lg max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <div className="divide-y">
                  {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No contacts in this category</div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors ${selectedContacts.has(contact.id) ? "bg-primary/5" : ""
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
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => startEditingContact(contact)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === "importing" && (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <WaveLoader size="sm" bars={8} gap="tight" />
                <p className="text-lg font-medium">Importing contacts...</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && (
            <div className="py-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Import Complete!</p>
                  <p className="text-muted-foreground">
                    {importedCount} contacts imported, {skippedCount} skipped
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={() => setOpen(false)}>Done</Button>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer - only shows for preview step */}
        {step === "preview" && (
          <div className="px-6 py-4 border-t bg-background">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep("select")}>
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
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Edit Contact</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditingContact(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingContact(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedContact}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}