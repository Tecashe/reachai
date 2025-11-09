"use client"

import { useState, useEffect } from "react"
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
import { Cloud, Loader2, CheckCircle2, AlertCircle, Link2, Database } from "lucide-react"
import { toast } from "sonner"
import { getUserIntegrations } from "@/lib/actions/integrations"
import { syncCRMLeads } from "@/lib/actions/lead-finder"

interface CRMImportDialogProps {
  onImportComplete?: () => void
}

export function CRMImportDialog({ onImportComplete }: CRMImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [integrations, setIntegrations] = useState<any[]>([])
  const [selectedCRM, setSelectedCRM] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [importedCount, setImportedCount] = useState(0)

  useEffect(() => {
    if (open) {
      loadIntegrations()
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

  const handleImport = async (crmType: string) => {
    setLoading(true)
    setSelectedCRM(crmType)
    setProgress(10)

    try {
      toast.info(`Syncing leads from ${crmType}...`)
      setProgress(50)

      const result = await syncCRMLeads(crmType)

      if (!result.success) {
        toast.error(result.error || "Failed to sync leads")
        return
      }

      setImportedCount(result.imported || 0)
      setProgress(100)

      toast.success(`Successfully imported ${result.imported} leads from ${crmType}!`)

      if (onImportComplete) {
        onImportComplete()
      }

      setTimeout(() => {
        setOpen(false)
        setSelectedCRM(null)
        setProgress(0)
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to import leads")
    } finally {
      setLoading(false)
    }
  }

  const crmIcons: Record<string, any> = {
    HUBSPOT: { icon: Cloud, color: "text-orange-600" },
    SALESFORCE: { icon: Cloud, color: "text-blue-600" },
    PIPEDRIVE: { icon: Database, color: "text-green-600" },
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link2 className="mr-2 h-4 w-4" />
          Import from CRM
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Import Leads from CRM
          </DialogTitle>
          <DialogDescription>
            Sync contacts from your connected CRM platforms directly into your campaigns
          </DialogDescription>
        </DialogHeader>

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
          <div className="space-y-4">
            {loading && selectedCRM ? (
              <div className="space-y-6 py-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">Importing Leads from {selectedCRM}</h3>
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

                {progress === 100 && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900 dark:text-green-100">
                      Successfully Imported {importedCount} Leads
                    </AlertTitle>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select a CRM to import leads from:</p>
                {integrations.map((integration) => {
                  const { icon: Icon, color } = crmIcons[integration.type] || { icon: Database, color: "text-gray-600" }
                  return (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-muted p-2 ${color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Connected {integration.lastSyncedAt ? "and synced" : ""}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => handleImport(integration.type)} disabled={loading}>
                        Import Leads
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
