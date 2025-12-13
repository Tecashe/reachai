"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ConflictResolutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  localVersion: {
    subject: string
    body: string
    updatedAt: Date
  }
  serverVersion: {
    subject: string
    body: string
    updatedAt: Date
    updatedBy?: string
  }
  onResolve: (resolution: "local" | "server" | "merge") => void
}

export function ConflictResolutionDialog({
  open,
  onOpenChange,
  localVersion,
  serverVersion,
  onResolve,
}: ConflictResolutionDialogProps) {
  const [selectedResolution, setSelectedResolution] = useState<"local" | "server" | "merge">("local")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resolve Template Conflict</DialogTitle>
          <DialogDescription>
            This template was modified by {serverVersion.updatedBy || "another user"} while you were editing. Choose how
            to resolve the conflict.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your changes were made at {localVersion.updatedAt.toLocaleString()}. The server version was updated at{" "}
            {serverVersion.updatedAt.toLocaleString()}.
          </AlertDescription>
        </Alert>

        <RadioGroup value={selectedResolution} onValueChange={(v) => setSelectedResolution(v as any)}>
          <div className="space-y-4">
            <div
              className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
              onClick={() => setSelectedResolution("local")}
            >
              <RadioGroupItem value="local" id="local" />
              <div className="flex-1">
                <Label htmlFor="local" className="font-semibold cursor-pointer">
                  Keep My Changes
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Overwrite the server version with your local changes. The other user's changes will be lost.
                </p>
                <ScrollArea className="h-32 mt-2 rounded border bg-muted p-2">
                  <div className="text-xs">
                    <p className="font-medium">Subject:</p>
                    <p className="mb-2">{localVersion.subject}</p>
                    <p className="font-medium">Body:</p>
                    <div dangerouslySetInnerHTML={{ __html: localVersion.body.substring(0, 200) + "..." }} />
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div
              className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
              onClick={() => setSelectedResolution("server")}
            >
              <RadioGroupItem value="server" id="server" />
              <div className="flex-1">
                <Label htmlFor="server" className="font-semibold cursor-pointer">
                  Use Server Version
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Discard your changes and use the version from the server. Your local changes will be lost.
                </p>
                <ScrollArea className="h-32 mt-2 rounded border bg-muted p-2">
                  <div className="text-xs">
                    <p className="font-medium">Subject:</p>
                    <p className="mb-2">{serverVersion.subject}</p>
                    <p className="font-medium">Body:</p>
                    <div dangerouslySetInnerHTML={{ __html: serverVersion.body.substring(0, 200) + "..." }} />
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div
              className="flex items-start space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
              onClick={() => setSelectedResolution("merge")}
            >
              <RadioGroupItem value="merge" id="merge" />
              <div className="flex-1">
                <Label htmlFor="merge" className="font-semibold cursor-pointer">
                  Merge Both Versions
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Combine your changes with the server version. Your subject will be kept, and body content will be
                  merged.
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onResolve(selectedResolution)}>Resolve Conflict</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
