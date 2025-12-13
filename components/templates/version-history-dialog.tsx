"use client"

import type React from "react"

import { useState } from "react"
import { History, RotateCcw, Eye, Calendar, User, FileText, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { format, formatDistanceToNow } from "date-fns"

interface TemplateVersion {
  id: string
  templateId: string
  version: number
  name: string
  subject: string
  body: string
  createdAt: Date
  createdBy?: {
    name: string
    email: string
  }
  changeNote?: string
  isCurrent: boolean
}

interface VersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  versions: TemplateVersion[]
  currentVersion: TemplateVersion
  onRestoreVersion: (versionId: string) => Promise<void>
  onCompareVersions?: (versionA: string, versionB: string) => void
}

export function VersionHistoryDialog({
  open,
  onOpenChange,
  versions,
  currentVersion,
  onRestoreVersion,
  onCompareVersions,
}: VersionHistoryDialogProps) {
  const [selectedVersion, setSelectedVersion] = useState<TemplateVersion | null>(null)
  const [restoring, setRestoring] = useState(false)

  const handleRestore = async (versionId: string) => {
    if (
      !confirm("Are you sure you want to restore this version? Your current changes will be saved as a new version.")
    ) {
      return
    }

    setRestoring(true)
    try {
      await onRestoreVersion(versionId)
      toast.success("Version restored successfully")
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Version restore error:", error)
      toast.error("Failed to restore version")
    } finally {
      setRestoring(false)
    }
  }

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </DialogTitle>
          <DialogDescription>View, compare, and restore previous versions of your template</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Version list */}
          <div className="w-80 flex flex-col border-r">
            <div className="px-4 py-2 border-b bg-muted/50">
              <p className="text-sm font-medium">{versions.length} Versions</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {sortedVersions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => setSelectedVersion(version)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      "hover:bg-muted/50",
                      selectedVersion?.id === version.id
                        ? "bg-primary/10 border-primary/50 border"
                        : "border border-transparent",
                    )}
                  >
                    <div className="flex-shrink-0 pt-1">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          version.isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        v{version.version}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{version.name}</p>
                        {version.isCurrent && (
                          <Badge variant="default" className="text-[10px] h-5">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                      </p>
                      {version.changeNote && (
                        <p className="text-xs text-muted-foreground truncate">{version.changeNote}</p>
                      )}
                      {version.createdBy && (
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{version.createdBy.name}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Version details */}
          <div className="flex-1 flex flex-col min-w-0">
            {selectedVersion ? (
              <>
                <div className="px-4 py-3 border-b space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedVersion.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(selectedVersion.createdAt, "PPp")}
                        </div>
                        {selectedVersion.createdBy && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {selectedVersion.createdBy.name}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {!selectedVersion.isCurrent && (
                      <Button onClick={() => handleRestore(selectedVersion.id)} disabled={restoring} size="sm">
                        <RotateCcw className="w-3.5 h-3.5 mr-2" />
                        {restoring ? "Restoring..." : "Restore"}
                      </Button>
                    )}
                  </div>

                  {selectedVersion.changeNote && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-1 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" />
                        Change Note
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedVersion.changeNote}</p>
                    </div>
                  )}
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">
                        Subject
                      </Label>
                      <div className="p-3 bg-muted/30 rounded-lg border">
                        <p className="text-sm">{selectedVersion.subject || "No subject"}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Body</Label>
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedVersion.body || "<p>No content</p>" }}
                        />
                      </div>
                    </div>

                    {/* Compare button */}
                    {onCompareVersions && !selectedVersion.isCurrent && (
                      <Button
                        variant="outline"
                        onClick={() => onCompareVersions(currentVersion.id, selectedVersion.id)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Compare with Current Version
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <History className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-sm font-medium mb-2">Select a version to view details</p>
                  <p className="text-sm text-muted-foreground">
                    Click on any version from the list to see its content and restore it if needed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
