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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Copy, ExternalLink, Info, Shield } from "lucide-react"

const CLIENT_ID = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID || "YOUR_CLIENT_ID_HERE"

export function GoogleWorkspaceInstructions() {
  const [open, setOpen] = useState(false)

  const handleCopyClientId = () => {
    navigator.clipboard.writeText(CLIENT_ID)
    toast.success("Client ID copied to clipboard")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-xs h-auto p-0">
          Google Workspace admin? Click here first
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Google Workspace Admin Setup
          </DialogTitle>
          <DialogDescription>
            If you use Google Workspace (not personal Gmail), your admin must approve ReachAI before you can connect
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-blue-600 bg-blue-50 dark:bg-blue-950">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong className="text-blue-900 dark:text-blue-100">Important:</strong> This step is ONLY for Google
            Workspace accounts (e.g., you@company.com). Personal Gmail accounts (e.g., you@gmail.com) can skip this.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Step 1: Copy Client ID */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 1</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Copy ReachAI's Client ID</h4>
                <p className="text-sm text-muted-foreground">
                  You'll need this to approve ReachAI in your Google Workspace Admin Console
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                  <code className="flex-1">{CLIENT_ID}</code>
                  <Button size="sm" variant="outline" onClick={handleCopyClientId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Step 2: Open Admin Console */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 2</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Open Google Workspace Admin Console</h4>
                <p className="text-sm text-muted-foreground">
                  Log in as a Super Admin to your Google Workspace Admin Console
                </p>
                <Button variant="outline" size="sm" onClick={() => window.open("https://admin.google.com", "_blank")}>
                  Open Admin Console
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Step 3: Navigate to API Controls */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 3</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Navigate to API Controls</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                  <li>
                    Click on <strong>"Security"</strong> in the left sidebar
                  </li>
                  <li>
                    Click <strong>"Access and data control"</strong>
                  </li>
                  <li>
                    Click <strong>"API Controls"</strong>
                  </li>
                  <li>
                    Click <strong>"MANAGE APP ACCESS"</strong> button
                  </li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Step 4: Configure New App */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 4</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Configure ReachAI App</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                  <li>
                    Click <strong>"Configure new app"</strong>
                  </li>
                  <li>
                    Select <strong>"OAuth App Name Or Client ID"</strong>
                  </li>
                  <li>Paste the Client ID you copied in Step 1</li>
                  <li>
                    Click <strong>"Search"</strong>
                  </li>
                  <li>
                    Select <strong>"ReachAI OAuth Email"</strong> when it appears
                  </li>
                  <li>
                    Click <strong>"Select"</strong>
                  </li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Step 5: Set Permissions */}
          <Card className="p-4 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Badge className="mt-1 bg-primary">Step 5</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Approve Access</h4>
                <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                  <li>
                    Select <strong>"All users"</strong> as the scope (or specific organizational unit)
                  </li>
                  <li>
                    Choose <strong>"Trusted"</strong> as the access type
                  </li>
                  <li>
                    Click <strong>"Continue"</strong>
                  </li>
                  <li>Review the permissions</li>
                  <li>
                    Click <strong>"Finish"</strong>
                  </li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Step 6: Connect */}
          <Card className="p-4 border-2 border-green-500/20 bg-green-50 dark:bg-green-950">
            <div className="flex items-start gap-3">
              <Badge className="mt-1 bg-green-600">Step 6</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-green-900 dark:text-green-100">You're All Set!</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Now you can click the "Connect Gmail" button and sign in with your Google Workspace account
                </p>
                <Button
                  onClick={() => {
                    setOpen(false)
                    window.location.href = "/api/oauth/gmail"
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Connect Gmail Now
                </Button>
              </div>
            </div>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Need help?</strong> Watch our video tutorial or contact your IT department to help with these
              steps. This is a one-time setup required by Google for security.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
