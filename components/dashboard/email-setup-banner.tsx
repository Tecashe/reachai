"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, AlertTriangle, Zap, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function EmailSetupBanner() {
  const router = useRouter()
  const [hasEmail, setHasEmail] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEmailConnection()
  }, [])

  const checkEmailConnection = async () => {
    try {
      const response = await fetch("/api/settings/sending-accounts")
      const data = await response.json()
      setHasEmail(data.accounts && data.accounts.length > 0)
    } catch (error) {
      console.error("Failed to check email connection:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectEmail = (provider: "gmail" | "outlook") => {
    toast.info(`Redirecting to ${provider === "gmail" ? "Google" : "Microsoft"} OAuth...`)
    window.location.href = `/api/oauth/${provider}?redirect=/dashboard`
  }

  if (loading || hasEmail) return null

  return (
    <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-orange-500/10 border border-orange-500/20">
            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-balance">Connect Your Email to Start Sending</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You need to connect an email account before you can create and send campaigns. Choose the quickest
                option below.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="border rounded-lg p-4 space-y-2 bg-card">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-sm">Quick Start (30 sec)</h4>
                </div>
                <p className="text-xs text-muted-foreground">Connect Gmail or Outlook via OAuth. No DNS needed.</p>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => handleConnectEmail("gmail")} size="sm" className="flex-1">
                    <svg className="mr-2 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                    </svg>
                    Gmail
                  </Button>
                  <Button onClick={() => handleConnectEmail("outlook")} size="sm" className="flex-1">
                    <svg className="mr-2 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.62q0-.48.33-.8.33-.33.8-.33h13.75q.46 0 .8.33.32.32.32.8V12zm-3 0V3.12H8.5v3.88H18q.41 0 .7.3.3.29.3.7v7.5h1.5zm-15 2.62q.14-.14.14-.35V8.87q0-.21-.14-.34-.15-.14-.35-.14H1.5v9.23h4.62q.21 0 .35-.15zm14.38-4.87l-4.88-4.88v4.88h4.88z" />
                    </svg>
                    Outlook
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-2 bg-card">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold text-sm">Custom Domain</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use your own domain with SMTP. Requires DNS configuration.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/email-setup")}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  Setup SMTP
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
