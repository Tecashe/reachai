"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, FolderOpen, Users, AlertTriangle, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFolders } from "@/lib/actions/prospect-folders"
import { getProspects, uploadProspects } from "@/lib/actions/prospects"
import { DuplicateDetectorDialog } from "@/components/prospects/duplicate-detector-dialog"
import { toast } from "sonner"
import { WaveLoader } from "../loader/wave-loader"

interface Folder {
  id: string
  name: string
  color: string
  icon: string
  prospectCount: number
}

interface Prospect {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  company: string | null
  jobTitle: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  folderId: string | null
}

interface DuplicateGroup {
  email: string
  prospects: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    company: string | null
    jobTitle: string | null
    folderId: string | null
    folderName: string | null
    createdAt: Date
  }[]
}

interface FolderImportProps {
  campaignId: string
  onImportComplete: (count: number) => void
}

export function FolderImport({ campaignId, onImportComplete }: FolderImportProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([])
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [pendingProspects, setPendingProspects] = useState<Prospect[]>([])

  useEffect(() => {
    async function loadFolders() {
      setLoading(true)
      try {
        const foldersData = await getFolders()
        setFolders(foldersData)
      } catch (error) {
        toast.error("Failed to load folders")
      }
      setLoading(false)
    }
    loadFolders()
  }, [])

  const toggleFolder = (folderId: string) => {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId],
    )
  }

  const selectAll = () => {
    if (selectedFolderIds.length === folders.length) {
      setSelectedFolderIds([])
    } else {
      setSelectedFolderIds(folders.map((f) => f.id))
    }
  }

  const totalSelectedProspects = folders
    .filter((f) => selectedFolderIds.includes(f.id))
    .reduce((sum, f) => sum + f.prospectCount, 0)

  const findDuplicates = (prospects: Prospect[], folderMap: Map<string, string>): DuplicateGroup[] => {
    const emailMap = new Map<string, Prospect[]>()

    for (const prospect of prospects) {
      const email = prospect.email.toLowerCase()
      if (!emailMap.has(email)) {
        emailMap.set(email, [])
      }
      emailMap.get(email)!.push(prospect)
    }

    const duplicates: DuplicateGroup[] = []
    for (const [email, group] of emailMap) {
      if (group.length > 1) {
        duplicates.push({
          email,
          prospects: group.map((p) => ({
            ...p,
            folderName: p.folderId ? folderMap.get(p.folderId) || null : null,
            createdAt: new Date(),
          })),
        })
      }
    }

    return duplicates
  }

  const handleImport = async () => {
    if (selectedFolderIds.length === 0) return

    setImporting(true)

    try {
      const allProspects: Prospect[] = []
      const folderMap = new Map<string, string>()

      for (const folder of folders) {
        if (selectedFolderIds.includes(folder.id)) {
          folderMap.set(folder.id, folder.name)
        }
      }

      for (const folderId of selectedFolderIds) {
        const prospects = await getProspects(undefined, folderId, false)
        allProspects.push(...prospects)
      }

      if (allProspects.length === 0) {
        toast.error("No prospects found in selected folders")
        setImporting(false)
        return
      }

      const duplicates = findDuplicates(allProspects, folderMap)

      if (duplicates.length > 0) {
        setDuplicateGroups(duplicates)
        setPendingProspects(allProspects)
        setShowDuplicateDialog(true)
        setImporting(false)
        return
      }

      await importProspects(allProspects)
    } catch (error) {
      toast.error("Failed to fetch prospects from folders")
      setImporting(false)
    }
  }

  const importProspects = async (prospects: Prospect[]) => {
    setImporting(true)

    const uniqueProspects = Array.from(new Map(prospects.map((p) => [p.email.toLowerCase(), p])).values())

    try {
      const result = await uploadProspects(
        campaignId,
        uniqueProspects.map((p) => ({
          email: p.email,
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          company: p.company || "",
          jobTitle: p.jobTitle || "",
          linkedinUrl: p.linkedinUrl || "",
          websiteUrl: p.websiteUrl || "",
        })),
      )

      toast.success(`Imported ${result.count} prospects`)
      onImportComplete(result.count)
      setSelectedFolderIds([])
    } catch (error) {
      toast.error("Failed to import prospects")
    }

    setImporting(false)
  }

  const handleDuplicatesResolved = async () => {
    setShowDuplicateDialog(false)

    const uniqueProspects = Array.from(new Map(pendingProspects.map((p) => [p.email.toLowerCase(), p])).values())

    await importProspects(uniqueProspects)
    setPendingProspects([])
    setDuplicateGroups([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        {/* <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> */}
        <WaveLoader size="sm" bars={8} gap="tight" />
      </div>
    )
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h4 className="font-medium mb-2">No Folders Found</h4>
        <p className="text-sm text-muted-foreground">Create folders in the Prospects page first to import from them.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Select one or more folders to import prospects from</p>
        <Button variant="ghost" size="sm" onClick={selectAll}>
          {selectedFolderIds.length === folders.length ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {folders.map((folder) => {
            const isSelected = selectedFolderIds.includes(folder.id)

            return (
              <Card
                key={folder.id}
                className={cn("cursor-pointer transition-all border-2", isSelected && "border-primary bg-primary/5")}
                onClick={() => toggleFolder(folder.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox checked={isSelected} className="pointer-events-none" />

                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: folder.color + "20", color: folder.color }}
                    >
                      {folder.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {folder.prospectCount} {folder.prospectCount === 1 ? "prospect" : "prospects"}
                      </p>
                    </div>

                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {folder.prospectCount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>

      {selectedFolderIds.length > 1 && (
        <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Importing from multiple folders will automatically check for duplicate prospects.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {selectedFolderIds.length} folder(s) selected ({totalSelectedProspects} prospects)
        </div>

        <Button onClick={handleImport} disabled={selectedFolderIds.length === 0 || importing}>
          {importing ? (
            <>
              {/* <Loader2 className="h-4 w-4 mr-2 animate-spin" /> */}
              <WaveLoader size="sm" bars={8} gap="tight" />
              Importing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Import {totalSelectedProspects} Prospects
            </>
          )}
        </Button>
      </div>

      <DuplicateDetectorDialog
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        duplicateGroups={duplicateGroups}
        onResolved={handleDuplicatesResolved}
      />
    </div>
  )
}
