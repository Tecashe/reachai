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

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, CheckCircle2, AlertCircle, RefreshCw, User, AlertTriangle } from "lucide-react"
import { getUserIntegrations } from "@/lib/actions/integrations"
import { syncCRMLeads } from "@/lib/actions/lead-finder"
import { cn } from "@/lib/utils"

const CRM_PROVIDERS = [
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1280px-Salesforce.com_logo.svg.png",
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    logo: "https://www.pipedrive.com/favicon.ico",
  },
]

interface CRMImportDialogProps {
  trigger?: React.ReactNode
  onImportComplete?: (count: number) => void
}

export function CRMImportDialog({ trigger, onImportComplete }: CRMImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [integrations, setIntegrations] = useState<any[]>([])
  const [selectedCrm, setSelectedCrm] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [loadingIntegrations, setLoadingIntegrations] = useState(true)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    count?: number
    skipped?: number
    lowQuality?: Array<{ name: string; email?: string; reason: string }>
  } | null>(null)

  useEffect(() => {
    if (open) {
      loadIntegrations()
    }
  }, [open])

  const loadIntegrations = async () => {
    setLoadingIntegrations(true)
    try {
      const data = await getUserIntegrations()
      const crmIntegrations = data.filter(
        (i: any) => ["hubspot", "salesforce", "pipedrive"].includes(i.type.toLowerCase()) && i.status === "CONNECTED",
      )
      setIntegrations(crmIntegrations)

      if (crmIntegrations.length === 1) {
        setSelectedCrm(crmIntegrations[0].type.toLowerCase())
      }
    } catch (error) {
      console.error("Error loading integrations:", error)
    } finally {
      setLoadingIntegrations(false)
    }
  }

  const handleImport = async () => {
    if (!selectedCrm) return

    setLoading(true)
    setResult(null)

    try {
      const integration = integrations.find((i: { type: string }) => i.type.toLowerCase() === selectedCrm.toLowerCase())

      if (!integration) {
        setResult({ success: false, message: "Integration not found. Please reconnect your CRM." })
        return
      }

      const response = await syncCRMLeads(selectedCrm)

      if (response.success) {
        const count = response.imported || 0
        const skipped = response.skipped || 0
        const lowQuality = response.lowQualityContacts || []

        setResult({
          success: true,
          message:
            count > 0
              ? `Successfully imported ${count} prospect${count !== 1 ? "s" : ""} from ${selectedCrm}.`
              : `No new prospects found to import from ${selectedCrm}.`,
          count,
          skipped,
          lowQuality,
        })
        onImportComplete?.(count)
      } else {
        setResult({
          success: false,
          message: response.error || "Failed to import prospects. Please try again.",
        })
      }
    } catch (error) {
      console.error("CRM import error:", error)
      setResult({
        success: false,
        message: "An error occurred while importing. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const connectedCrmIds = integrations.map((i) => i.type.toLowerCase())
  const selectedProvider = CRM_PROVIDERS.find((p) => p.id === selectedCrm)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Import from CRM
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card/80 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Import Prospects from CRM</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loadingIntegrations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : connectedCrmIds.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No CRM integrations connected. Connect a CRM first to import prospects.
              </p>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Go to CRM Settings
              </Button>
            </div>
          ) : (
            <>
              <RadioGroup value={selectedCrm} onValueChange={setSelectedCrm}>
                <div className="grid gap-3">
                  {CRM_PROVIDERS.filter((crm) => connectedCrmIds.includes(crm.id)).map((crm) => (
                    <Label
                      key={crm.id}
                      htmlFor={crm.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
                        "bg-background/50 backdrop-blur-sm",
                        "hover:bg-muted/50 hover:border-foreground/20",
                        selectedCrm === crm.id ? "border-foreground/30 bg-muted/30 shadow-sm" : "border-border/50",
                      )}
                    >
                      <RadioGroupItem value={crm.id} id={crm.id} />
                      <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                        <Image
                          src={crm.logo || "/placeholder.svg"}
                          alt={crm.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{crm.name}</p>
                        <p className="text-xs text-muted-foreground">Connected</p>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    </Label>
                  ))}
                </div>
              </RadioGroup>

              {result && (
                <div className="space-y-3">
                  <div
                    className={cn(
                      "p-4 rounded-xl text-sm flex items-start gap-3",
                      result.success
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20",
                    )}
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p>{result.message}</p>
                      {result.skipped && result.skipped > 0 && (
                        <p className="text-xs opacity-80">
                          {result.skipped} contact{result.skipped !== 1 ? "s" : ""} skipped (already imported or
                          invalid)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Low quality contacts section */}
                  {result.lowQuality && result.lowQuality.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          {result.lowQuality.length} Low Quality Contact{result.lowQuality.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ScrollArea className="max-h-32">
                        <div className="space-y-2">
                          {result.lowQuality.map((contact, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs p-2 rounded-lg bg-background/50"
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{contact.name || "Unknown"}</span>
                                {contact.email && <span className="text-muted-foreground">{contact.email}</span>}
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              >
                                {contact.reason}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <p className="text-xs text-muted-foreground mt-2">
                        These contacts were skipped due to missing required fields.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setOpen(false)
                    setResult(null)
                  }}
                >
                  {result?.success ? "Done" : "Cancel"}
                </Button>
                <Button className="flex-1" onClick={handleImport} disabled={!selectedCrm || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : result?.success ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Again
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Import Prospects
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
