"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Mail, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import Link from "next/link"

interface EmailConnectionRequiredProps {
  onConnected?: () => void
}

export function EmailConnectionRequired({ onConnected }: EmailConnectionRequiredProps) {
  const [hasAccounts, setHasAccounts] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const response = await fetch("/api/settings/sending-accounts")
      const data = await response.json()
      setAccounts(data || [])
      setHasAccounts((data || []).length > 0)

      if ((data || []).length > 0 && onConnected) {
        onConnected()
      }
    } catch (error) {
      console.error("[v0] Failed to check email connection:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (hasAccounts) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                {accounts.length} Email Account{accounts.length > 1 ? "s" : ""} Connected
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">You're all set to send campaigns</p>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" size="sm" className="bg-transparent">
                Manage Accounts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:border-blue-900 dark:from-blue-950 dark:to-cyan-950">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Connect Your Email to Get Started</CardTitle>
            <CardDescription>Choose the fastest way to connect</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-300 dark:border-blue-700">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            You need at least one connected email account to send campaigns
          </AlertDescription>
        </Alert>

        <div className="grid gap-3 md:grid-cols-2">
          {/* Quick Start Path - OAuth */}
          <Card className="relative overflow-hidden border-2 border-blue-500/20 hover:border-blue-500/40 transition-colors">
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                <Zap className="h-3 w-3" />
                Recommended
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Start (30 seconds)</CardTitle>
              <CardDescription className="text-xs">Connect Gmail or Outlook with one click</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 justify-start bg-white dark:bg-gray-900"
                  onClick={() => (window.location.href = "/api/oauth/gmail")}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950">
                      <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">Connect Gmail</div>
                      <div className="text-xs text-muted-foreground">OAuth - No DNS needed</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-auto py-3 justify-start bg-white dark:bg-gray-900"
                  onClick={() => (window.location.href = "/api/oauth/outlook")}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">Connect Outlook</div>
                      <div className="text-xs text-muted-foreground">OAuth - No DNS needed</div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ready in 30 seconds</span>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Path - Custom Domain */}
          <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Advanced Setup</CardTitle>
              <CardDescription className="text-xs">Use custom domain with SMTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Configure DNS records</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Setup SMTP credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Verify domain</span>
                </div>
              </div>

              <Link href="/dashboard/email-setup">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  Setup Custom Domain
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center">For branded email addresses</p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-center text-muted-foreground">
            <strong>Recommendation:</strong> Start with Quick Start (Gmail/Outlook) to begin sending immediately. Add
            custom domains later for branded emails.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
