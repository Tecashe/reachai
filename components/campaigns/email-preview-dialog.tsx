"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Mail, User, Building2 } from "lucide-react"

interface EmailPreviewDialogProps {
  campaignId: string
  prospects: Array<{
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    company?: string | null
    generatedEmail?: any
    status: string
  }>
}

export function EmailPreviewDialog({ campaignId, prospects }: EmailPreviewDialogProps) {
  const [selectedProspect, setSelectedProspect] = useState(prospects[0])

  const emailData = selectedProspect?.generatedEmail
    ? typeof selectedProspect.generatedEmail === "string"
      ? JSON.parse(selectedProspect.generatedEmail)
      : selectedProspect.generatedEmail
    : null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Preview Emails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
          <DialogDescription>Preview personalized emails that will be sent to your prospects</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="w-64 border-r pr-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Prospects ({prospects.length})</h3>
            <div className="space-y-2">
              {prospects.slice(0, 15).map((prospect) => (
                <button
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedProspect?.id === prospect.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-sm truncate">
                    {prospect.firstName} {prospect.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{prospect.email}</p>
                  {prospect.company && <p className="text-xs text-muted-foreground truncate">{prospect.company}</p>}
                </button>
              ))}
              {prospects.length > 15 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  + {prospects.length - 15} more prospects
                </p>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {selectedProspect && emailData ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedProspect.firstName} {selectedProspect.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{selectedProspect.email}</span>
                    </div>
                    {selectedProspect.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{selectedProspect.company}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">{selectedProspect.status.toLowerCase()}</Badge>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 border-b">
                    <p className="text-sm font-medium">Subject:</p>
                    <p className="text-base mt-1">{emailData.subject}</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-gray-950">
                    <div className="prose prose-sm max-w-none" style={{ whiteSpace: "pre-wrap" }}>
                      {emailData.body}
                    </div>
                  </div>
                </div>

                {(emailData.qualityScore || emailData.personalizationScore) && (
                  <div className="flex gap-4">
                    {emailData.qualityScore && (
                      <div className="flex-1 p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Quality Score</p>
                        <p className="text-2xl font-bold">{emailData.qualityScore}/100</p>
                      </div>
                    )}
                    {emailData.personalizationScore && (
                      <div className="flex-1 p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Personalization</p>
                        <p className="text-2xl font-bold">{emailData.personalizationScore}/100</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No email generated for this prospect</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
