"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function SendingAccountWizard() {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Before adding email accounts, make sure your domain is verified with proper DNS configuration. Go to the DNS
          Configuration tab to set up SPF, DKIM, and DMARC records.
        </AlertDescription>
      </Alert>

      <p className="text-sm text-muted-foreground">
        Once your domain is verified, you can connect email accounts from the Settings → Sending Accounts page.
      </p>
    </div>
  )
}
