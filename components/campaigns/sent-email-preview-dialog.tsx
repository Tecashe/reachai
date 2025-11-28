"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Mail, User, Eye, MousePointerClick, Reply, AlertCircle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

interface SentEmailPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: any
}

export function SentEmailPreviewDialog({ open, onOpenChange, email }: SentEmailPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preview
          </DialogTitle>
          <DialogDescription>Full details and content of this email</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {/* Email Metadata */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {email.prospect?.firstName} {email.prospect?.lastName}
                  </span>
                </div>
                {email.status === "OPENED" && (
                  <Badge variant="default" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Opened {email.opens}x
                  </Badge>
                )}
                {email.status === "CLICKED" && (
                  <Badge variant="default" className="gap-1">
                    <MousePointerClick className="h-3 w-3" />
                    Clicked {email.clicks}x
                  </Badge>
                )}
                {email.status === "REPLIED" && (
                  <Badge variant="default" className="gap-1">
                    <Reply className="h-3 w-3" />
                    Replied
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">To</p>
                  <p className="font-medium">{email.toEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">{email.fromEmail}</p>
                </div>
                {email.prospect?.company && (
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-medium">{email.prospect.company}</p>
                  </div>
                )}
                {email.prospect?.jobTitle && (
                  <div>
                    <p className="text-muted-foreground">Job Title</p>
                    <p className="font-medium">{email.prospect.jobTitle}</p>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {email.sentAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-medium">{format(new Date(email.sentAt), "PPp")}</p>
                    </div>
                  </div>
                )}
                {email.openedAt && (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-muted-foreground">First Opened</p>
                      <p className="font-medium">{format(new Date(email.openedAt), "PPp")}</p>
                    </div>
                  </div>
                )}
                {email.clickedAt && (
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-muted-foreground">First Clicked</p>
                      <p className="font-medium">{format(new Date(email.clickedAt), "PPp")}</p>
                    </div>
                  </div>
                )}
                {email.repliedAt && (
                  <div className="flex items-center gap-2">
                    <Reply className="h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-muted-foreground">Replied</p>
                      <p className="font-medium">{format(new Date(email.repliedAt), "PPp")}</p>
                    </div>
                  </div>
                )}
              </div>

              {email.errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">{email.errorMessage}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Email Content */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{email.subject}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Body</p>
                <div
                  className="prose prose-sm max-w-none p-4 bg-muted/30 rounded-md"
                  dangerouslySetInnerHTML={{ __html: email.body.replace(/\n/g, "<br/>") }}
                />
              </div>
            </div>

            {/* Additional Info */}
            {(email.provider || email.sendingAccount) && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {email.provider && (
                    <div>
                      <p className="text-muted-foreground">Provider</p>
                      <p className="font-medium capitalize">{email.provider}</p>
                    </div>
                  )}
                  {email.sendingAccount && (
                    <div>
                      <p className="text-muted-foreground">Sending Account</p>
                      <p className="font-medium">{email.sendingAccount.email}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
