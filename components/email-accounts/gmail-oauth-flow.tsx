"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { WaveLoader } from "@/components/loader/wave-loader"
import { AlertCircle, CheckCircle2, Shield, Zap } from "lucide-react"

interface Props {
  onAccountAdded: () => void
}

export function GmailOAuthFlow({ onAccountAdded }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleOAuthConnect = async () => {
    try {
      setIsLoading(true)
      
      // Redirect to OAuth initiation endpoint
      window.location.href = "/api/oauth/gmail"
      
    } catch (error) {
      console.error("[v0] OAuth initiation error:", error)
      toast({
        title: "Error",
        description: "Failed to initiate OAuth connection",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-medium text-sm text-foreground">Recommended for Enterprise</p>
            <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <li>• More stable connection, less prone to disconnections</li>
              <li>• Works with both Gmail and Google Workspace</li>
              <li>• No 2FA or app password configuration needed</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-5 bg-card border-border/50">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-foreground mb-2">What happens next?</h3>
            <ol className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li className="flex gap-2">
                <span className="font-medium text-foreground">1.</span>
                <span>You'll be redirected to Google's secure login page</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">2.</span>
                <span>Sign in with your Google account</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">3.</span>
                <span>Grant permission to send and read emails via IMAP/SMTP</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">4.</span>
                <span>You'll be redirected back with your account connected</span>
              </li>
            </ol>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Zap className="h-3.5 w-3.5" />
            <span>Connection takes less than 30 seconds</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              This uses standard IMAP/SMTP protocols with OAuth authentication. Your credentials are stored securely
              and encrypted.
            </p>
          </div>
        </div>
      </Card>

      <Button
        onClick={handleOAuthConnect}
        disabled={isLoading}
        className="w-full h-10 gap-2"
        size="sm"
      >
        {isLoading ? (
          <>
            <WaveLoader size="sm" color="bg-primary-foreground" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Connect with OAuth
          </>
        )}
      </Button>
    </div>
  )
}