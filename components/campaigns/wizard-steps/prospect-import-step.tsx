
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, UserPlus, ArrowRight, FolderOpen } from "lucide-react"
import { CSVImport } from "@/components/prospects/csv-import"
import { AddProspectForm } from "@/components/prospects/add-prospect-form"
import { FolderImport } from "../folder-import"
import { Badge } from "@/components/ui/badge"

interface ProspectImportStepProps {
  campaign: any
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function ProspectImportStep({ campaign, onNext, onBack, isFirstStep }: ProspectImportStepProps) {
  const [prospectsCount, setProspectsCount] = useState(campaign._count.prospects)

  const handleImportComplete = (count: number) => {
    setProspectsCount((prev: number) => prev + count)
  }

  const canProceed = prospectsCount > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Import Your Prospects</h3>
          <p className="text-sm text-muted-foreground">Add prospects via CSV, from folders, or manually</p>
        </div>
        <Badge variant={canProceed ? "default" : "secondary"}>
          {prospectsCount} {prospectsCount === 1 ? "Prospect" : "Prospects"}
        </Badge>
      </div>

      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="csv" className="gap-2">
            <Upload className="h-4 w-4" />
            CSV Upload
          </TabsTrigger>
          <TabsTrigger value="folders" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            From Folders
          </TabsTrigger>
          <TabsTrigger value="manual" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Manually
          </TabsTrigger>
        </TabsList>
        <TabsContent value="csv" className="space-y-4">
          <CSVImport campaignId={campaign.id} onImportComplete={handleImportComplete} />
        </TabsContent>
        <TabsContent value="folders" className="space-y-4">
          <FolderImport campaignId={campaign.id} onImportComplete={handleImportComplete} />
        </TabsContent>
        <TabsContent value="manual" className="space-y-4">
          <AddProspectForm campaignId={campaign.id} onSuccess={() => handleImportComplete(1)} />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Continue to Research
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
