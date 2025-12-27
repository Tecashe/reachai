"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AppPasswordSetup({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("")
  const [appPassword, setAppPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleConnect = async () => {
    if (!email || appPassword.length !== 16) {
      setError("Email and 16-character app password required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/settings/sending-accounts/app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Gmail - ${email}`,
          email,
          appPassword,
          provider: "gmail",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to connect")
        return
      }

      setSuccess(true)
      toast({ title: "Success", description: "Email account connected!" })
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gmail App Password</CardTitle>
        <CardDescription>Secure app-specific password for Gmail</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@gmail.com"
            disabled={success}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            App Password (16 characters)
            <button onClick={() => setShowGuide(!showGuide)} className="ml-2 text-blue-600 text-xs hover:underline">
              {showGuide ? "Hide" : "Show"} guide
            </button>
          </label>
          <Input
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value.replace(/\s/g, ""))}
            placeholder="xxxx xxxx xxxx xxxx"
            maxLength={16}
            className="font-mono"
            disabled={success}
          />
        </div>

        {showGuide && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <p className="font-semibold mb-2">How to get an App Password:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Enable 2-Step Verification on your Google Account</li>
                <li>
                  Visit{" "}
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    myaccount.google.com/apppasswords
                  </a>
                </li>
                <li>Select "Mail" and "Windows Computer" (or your device)</li>
                <li>Google generates a 16-character password</li>
                <li>Copy it here (spaces are removed automatically)</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Connected successfully!</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleConnect}
          disabled={loading || success || !email || appPassword.length !== 16}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Connecting..." : "Connect Account"}
        </Button>
      </CardContent>
    </Card>
  )
}
