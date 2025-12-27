"use client"

import { EmailConnectionManager } from "@/components/email-accounts/email-connection-manager"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Mail } from "lucide-react"

export function EmailAccountsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Email Accounts</h2>
        <p className="text-muted-foreground mt-1">Connect and manage your email accounts for sending campaigns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/10 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-foreground" />
              <CardTitle className="text-base">Multiple Accounts</CardTitle>
            </div>
            <CardDescription>
              Connect multiple email accounts to increase sending capacity and reliability
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-success/10 bg-success/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <CardTitle className="text-base">Auto Warmup</CardTitle>
            </div>
            <CardDescription>
              Accounts are automatically warmed up following best practices for deliverability
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main connection manager */}
      <EmailConnectionManager />
    </div>
  )
}
