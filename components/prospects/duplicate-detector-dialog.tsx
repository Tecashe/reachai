"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Check, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { removeDuplicates } from "@/lib/actions/prospects"

interface DuplicateDetectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  duplicateGroups: any[]
  onResolved: () => void
}

export function DuplicateDetectorDialog({
  open,
  onOpenChange,
  duplicateGroups,
  onResolved,
}: DuplicateDetectorDialogProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [selectedProspect, setSelectedProspect] = useState<string | null>(null)
  const [isResolving, setIsResolving] = useState(false)

  const currentGroup = duplicateGroups[currentGroupIndex]

  useEffect(() => {
    if (currentGroup) {
      setSelectedProspect(currentGroup.prospects[0].id)
    }
  }, [currentGroup, currentGroupIndex])

  const handleResolve = async () => {
    if (!selectedProspect || !currentGroup) return

    setIsResolving(true)
    const prospectIds = currentGroup.prospects.map((p: any) => p.id)
    const result = await removeDuplicates(prospectIds, selectedProspect)
    setIsResolving(false)

    if (result.success) {
      toast.success(`Removed ${result.removed} duplicate(s)`)

      if (currentGroupIndex < duplicateGroups.length - 1) {
        setCurrentGroupIndex(currentGroupIndex + 1)
      } else {
        onResolved()
        onOpenChange(false)
      }
    } else {
      toast.error("Failed to remove duplicates")
    }
  }

  const handleSkip = () => {
    if (currentGroupIndex < duplicateGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1)
    } else {
      onOpenChange(false)
    }
  }

  if (!currentGroup) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Duplicate Found ({currentGroupIndex + 1} of {duplicateGroups.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm font-medium">{currentGroup.reason}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Select which prospect to keep. Others will be moved to trash.
            </p>
          </div>

          <div className="space-y-3">
            {currentGroup.prospects.map((prospect: any) => (
              <Card
                key={prospect.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedProspect === prospect.id
                    ? "border-2 border-primary shadow-md"
                    : "hover:border-muted-foreground/50"
                }`}
                onClick={() => setSelectedProspect(prospect.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {prospect.firstName} {prospect.lastName}
                      </h4>
                      {selectedProspect === prospect.id && (
                        <Badge variant="default" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Keep This
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{prospect.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Company</p>
                        <p className="font-medium">{prospect.company || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Job Title</p>
                        <p className="font-medium">{prospect.jobTitle || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quality Score</p>
                        <p className="font-medium">{prospect.qualityScore || 0}/100</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">LinkedIn</p>
                        <p className="font-medium">{prospect.linkedinUrl ? "✓ Yes" : "✗ No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium">
                          {prospect.emailsOpened || 0} opens, {prospect.emailsReplied || 0} replies
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleResolve} disabled={!selectedProspect || isResolving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Duplicates
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
