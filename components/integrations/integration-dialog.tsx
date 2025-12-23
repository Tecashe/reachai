"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { connectIntegration } from "@/lib/actions/integrations"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { WaveLoader } from "../loader/wave-loader"

interface IntegrationDialogProps {
  integration: {
    type: string
    name: string
    description: string
  }
  isConnected: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IntegrationDialog({ integration, isConnected, open, onOpenChange }: IntegrationDialogProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const { toast } = useToast()

  const handleConnect = async () => {
    if (integration.type === "GMAIL" || integration.type === "OUTLOOK") {
      // OAuth flow
      handleOAuthConnect()
    } else {
      // API Key flow
      await handleApiKeyConnect()
    }
  }

  const handleOAuthConnect = () => {
    // Redirect to OAuth flow
    const redirectUri = `${window.location.origin}/api/integrations/callback/${integration.type.toLowerCase()}`
    const state = Math.random().toString(36).substring(7)

    if (integration.type === "GMAIL") {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/gmail.send&state=${state}&access_type=offline&prompt=consent`
      window.location.href = googleAuthUrl
    } else if (integration.type === "OUTLOOK") {
      const microsoftAuthUrl = `https://sign-in.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://graph.microsoft.com/Mail.Send&state=${state}`
      window.location.href = microsoftAuthUrl
    }
  }

  const handleApiKeyConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      await connectIntegration(integration.type, { apiKey })
      toast({
        title: "Integration connected",
        description: `${integration.name} has been connected successfully.`,
      })
      onOpenChange(false)
      setApiKey("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect integration. Please check your API key and try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isConnected ? "Manage" : "Connect"} {integration.name}
          </DialogTitle>
          <DialogDescription>{integration.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {integration.type === "GMAIL" || integration.type === "OUTLOOK" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the button below to authenticate with {integration.name} using OAuth 2.0. You'll be redirected to
                sign in and grant permissions.
              </p>
              <Button onClick={handleConnect} className="w-full" disabled={isConnecting}>
                {isConnecting && <WaveLoader size="sm" bars={8} gap="tight" />}
                Authenticate with {integration.name}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder={`Enter your ${integration.name} API key`}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your API key will be encrypted and stored securely.</p>
              </div>
              <Button onClick={handleConnect} className="w-full" disabled={isConnecting || !apiKey.trim()}>
                {isConnecting && <WaveLoader size="sm" bars={8} gap="tight" />}
                Connect {integration.name}
              </Button>
            </div>
          )}

          {integration.type === "OPENAI" && (
            <div className="rounded-lg bg-muted p-3 text-xs">
              <p className="font-medium mb-1">Where to find your API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to platform.openai.com</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new secret key</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
