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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ExternalLink, Info } from "lucide-react"

export function GmailAppPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    appPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const handleCopyClientId = () => {
    navigator.clipboard.writeText("YOUR_CLIENT_ID_HERE")
    toast.success("Client ID copied to clipboard")
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.appPassword) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/settings/sending-accounts/app-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          appPassword: formData.appPassword,
          provider: "gmail",
        }),
      })

      if (!response.ok) throw new Error("Failed to connect")

      toast.success("Gmail connected successfully!")
      setOpen(false)
      setFormData({ name: "", email: "", appPassword: "" })
      window.location.reload()
    } catch (error) {
      toast.error("Failed to connect Gmail account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs">
          Use App Password instead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect Gmail with App Password</DialogTitle>
          <DialogDescription>
            Use this method if you can't use OAuth or need to connect a personal Gmail account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: Enable 2-Step Verification */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 1</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Enable 2-Step Verification</h4>
                <p className="text-sm text-muted-foreground">
                  App passwords only work with accounts that have 2-step verification enabled
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://myaccount.google.com/security", "_blank")}
                >
                  Go to Google Security Settings
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
                <ol className="text-sm text-muted-foreground space-y-1 mt-3 ml-4 list-decimal">
                  <li>Click on "2-Step Verification"</li>
                  <li>Follow the setup process to enable it</li>
                  <li>Come back here once enabled</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Step 2: Generate App Password */}
          <Card className="p-4 border-2">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Step 2</Badge>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">Generate App Password</h4>
                <p className="text-sm text-muted-foreground">
                  Create a special password for mailfra to access your Gmail
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://myaccount.google.com/apppasswords", "_blank")}
                >
                  Go to App Passwords
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
                <ol className="text-sm text-muted-foreground space-y-1 mt-3 ml-4 list-decimal">
                  <li>Select "Mail" for the app</li>
                  <li>Select "Other (Custom name)" for the device</li>
                  <li>Enter "mailfra" as the name</li>
                  <li>Click "Generate"</li>
                  <li>Copy the 16-character password shown</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* Step 3: Enter Details */}
          <Card className="p-4 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Badge className="mt-1 bg-primary">Step 3</Badge>
              <div className="flex-1 space-y-4">
                <h4 className="font-semibold">Enter Your Details</h4>

                <div className="space-y-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="My Gmail Account"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Gmail Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appPassword">App Password (16 characters)</Label>
                  <Input
                    id="appPassword"
                    type="password"
                    placeholder="abcd efgh ijkl mnop"
                    value={formData.appPassword}
                    onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste the 16-character password from Step 2 (spaces will be removed automatically)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Security Note:</strong> App passwords are less secure than OAuth. We recommend using the OAuth
              method ("Connect Gmail" button) unless you have a specific reason to use app passwords.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Connecting..." : "Connect Gmail"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
