"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Props {
  onAccountAdded: () => void
}

export function OutlookSetupGuide({ onAccountAdded }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleOutlookOAuth = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/oauth/outlook/authorize")
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("[v0] Outlook OAuth error:", error)
      toast({
        title: "Error",
        description: "Failed to initiate Outlook authentication",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">Connect Outlook or Office 365</h3>
        <p className="text-muted-foreground text-lg">
          Securely connect your Microsoft account for seamless email sending
        </p>
      </div>

      <div className="space-y-4">
        {[
          "Click the button below to authenticate with Microsoft",
          "Sign in with your Outlook or Office 365 account",
          "Grant ReachAI permission to access your email",
          "Your account will be connected immediately",
        ].map((step, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold flex-shrink-0">
              {index + 1}
            </div>
            <p className="text-foreground pt-1">{step}</p>
          </div>
        ))}
      </div>

      <Button
        onClick={handleOutlookOAuth}
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Redirecting to Microsoft...
          </>
        ) : (
          <>
            <span>Connect Outlook Account</span>
            <span className="ml-2">→</span>
          </>
        )}
      </Button>
    </div>
  )
}
