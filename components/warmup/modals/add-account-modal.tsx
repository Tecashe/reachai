"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Mail,
  Server,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Users,
  Zap,
} from "lucide-react"

interface AddAccountModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  userTier: "FREE" | "STARTER" | "PRO" | "AGENCY"
}

type Step = 1 | 2 | 3 | 4

export function AddAccountModal({ open, onClose, onSuccess, userTier }: AddAccountModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionTested, setConnectionTested] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Step 1: Connection Details
  const [email, setEmail] = useState("")
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("587")
  const [smtpUser, setSmtpUser] = useState("")
  const [smtpPassword, setSmtpPassword] = useState("")
  const [imapHost, setImapHost] = useState("")
  const [imapPort, setImapPort] = useState("993")

  // Step 2: Warmup Configuration
  const [startVolume, setStartVolume] = useState(5)
  const [targetVolume, setTargetVolume] = useState(50)
  const [rampSpeed, setRampSpeed] = useState<"conservative" | "moderate" | "aggressive">("moderate")
  const [autoSpamRecovery, setAutoSpamRecovery] = useState(true)
  const [positiveReplies, setPositiveReplies] = useState(true)
  const [markImportant, setMarkImportant] = useState(true)

  // Auto-detect provider settings
  const detectProviderSettings = (emailAddress: string) => {
    const domain = emailAddress.split("@")[1]?.toLowerCase() || ""

    if (domain.includes("gmail") || domain.includes("googlemail")) {
      setSmtpHost("smtp.gmail.com")
      setSmtpPort("587")
      setImapHost("imap.gmail.com")
      setImapPort("993")
    } else if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live")) {
      setSmtpHost("smtp-mail.outlook.com")
      setSmtpPort("587")
      setImapHost("outlook.office365.com")
      setImapPort("993")
    } else if (domain.includes("yahoo")) {
      setSmtpHost("smtp.mail.yahoo.com")
      setSmtpPort("587")
      setImapHost("imap.mail.yahoo.com")
      setImapPort("993")
    }

    // Set username to email by default
    setSmtpUser(emailAddress)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value.includes("@")) {
      detectProviderSettings(value)
    }
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      const response = await fetch("/api/settings/sending-accounts/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          smtpHost,
          smtpPort: Number.parseInt(smtpPort),
          smtpUser,
          smtpPassword,
          imapHost,
          imapPort: Number.parseInt(imapPort),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Connection failed")
      }

      setConnectionTested(true)
      toast.success("Connection successful!")
    } catch (error: any) {
      toast.error(error.message || "Failed to connect. Please check your credentials.")
      setConnectionTested(false)
    } finally {
      setTestingConnection(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/sending-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          smtpHost,
          smtpPort: Number.parseInt(smtpPort),
          smtpUsername: smtpUser,
          smtpPassword,
          imapHost,
          imapPort: Number.parseInt(imapPort),
          imapUsername: smtpUser,
          imapPassword: smtpPassword,
          warmupEnabled: true,
          warmupStartVolume: startVolume,
          warmupDailyLimit: targetVolume,
          warmupRampSpeed: rampSpeed,
          spamRecoveryEnabled: autoSpamRecovery,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add account")
      }

      onSuccess()
      resetForm()
    } catch (error: any) {
      toast.error(error.message || "Failed to add account")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setEmail("")
    setSmtpHost("")
    setSmtpPort("587")
    setSmtpUser("")
    setSmtpPassword("")
    setImapHost("")
    setImapPort("993")
    setStartVolume(5)
    setTargetVolume(50)
    setRampSpeed("moderate")
    setAutoSpamRecovery(true)
    setPositiveReplies(true)
    setMarkImportant(true)
    setConnectionTested(false)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return email && smtpHost && smtpPassword && connectionTested
      case 2:
        return true
      case 3:
        return true
      case 4:
        return true
      default:
        return false
    }
  }

  const getEstimatedDuration = () => {
    switch (rampSpeed) {
      case "conservative":
        return "30-35 days"
      case "moderate":
        return "21-28 days"
      case "aggressive":
        return "14-21 days"
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          onClose()
          resetForm()
        }
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Email Account</DialogTitle>
          <DialogDescription>
            Step {step} of 4 -{" "}
            {step === 1
              ? "Connection Details"
              : step === 2
                ? "Warmup Configuration"
                : step === 3
                  ? "Network Selection"
                  : "Review & Confirm"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        {/* Step 1: Connection Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input placeholder="smtp.example.com" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Select value={smtpPort} onValueChange={setSmtpPort}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="587">587 (TLS)</SelectItem>
                    <SelectItem value="465">465 (SSL)</SelectItem>
                    <SelectItem value="25">25 (Plain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                placeholder="Usually your email address"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password / App Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password or app password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>IMAP Host</Label>
                <Input placeholder="imap.example.com" value={imapHost} onChange={(e) => setImapHost(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>IMAP Port</Label>
                <Input value={imapPort} onChange={(e) => setImapPort(e.target.value)} />
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={handleTestConnection}
              disabled={!email || !smtpHost || !smtpPassword || testingConnection}
            >
              {testingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : connectionTested ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Connection Verified
                </>
              ) : (
                <>
                  <Server className="h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Warmup Configuration */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Starting Volume (emails/day)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[startVolume]}
                  onValueChange={([v]) => setStartVolume(v)}
                  min={2}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <span className="w-8 text-right font-medium">{startVolume}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Target Volume (emails/day)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[targetVolume]}
                  onValueChange={([v]) => setTargetVolume(v)}
                  min={20}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="w-8 text-right font-medium">{targetVolume}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Ramp-up Speed</Label>
              <Select value={rampSpeed} onValueChange={(v: any) => setRampSpeed(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative (30-35 days)</SelectItem>
                  <SelectItem value="moderate">Moderate (21-28 days)</SelectItem>
                  <SelectItem value="aggressive">Aggressive (14-21 days)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Features</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Auto Spam Recovery</span>
                  </div>
                  <Switch checked={autoSpamRecovery} onCheckedChange={setAutoSpamRecovery} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Positive Replies</span>
                  </div>
                  <Switch checked={positiveReplies} onCheckedChange={setPositiveReplies} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mark as Important</span>
                  </div>
                  <Switch checked={markImportant} onCheckedChange={setMarkImportant} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Network Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Network Quality Score</span>
                <Badge className="bg-success/10 text-success border-success/20">95/100</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Google Workspace</span>
                  <span className="font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Office 365</span>
                  <span className="font-medium">3%</span>
                </div>
                <Progress value={3} className="h-2" />

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Other Premium</span>
                  <span className="font-medium">1%</span>
                </div>
                <Progress value={1} className="h-2" />
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {userTier === "PRO" || userTier === "AGENCY" ? "P2P Premium Network" : "Basic Warmup Pool"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {userTier === "PRO" || userTier === "AGENCY"
                  ? "Your account will be matched with high-quality peers for optimal warmup"
                  : "Your account will use our standard warmup pool. Upgrade for P2P access."}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>
                Estimated warmup duration: <strong className="text-foreground">{getEstimatedDuration()}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <h4 className="font-medium">Account Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium truncate">{email}</span>
                <span className="text-muted-foreground">SMTP:</span>
                <span className="font-medium">
                  {smtpHost}:{smtpPort}
                </span>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <h4 className="font-medium">Warmup Settings</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Starting Volume:</span>
                <span className="font-medium">{startVolume} emails/day</span>
                <span className="text-muted-foreground">Target Volume:</span>
                <span className="font-medium">{targetVolume} emails/day</span>
                <span className="text-muted-foreground">Ramp Speed:</span>
                <span className="font-medium capitalize">{rampSpeed}</span>
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{getEstimatedDuration()}</span>
              </div>
            </div>

            <div className="p-4 bg-success-muted rounded-lg border border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium text-foreground">Ready to Start Warmup</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your account will begin warming up within the next hour.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => (step === 1 ? onClose() : setStep((step - 1) as Step))}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep((step + 1) as Step)} disabled={!canProceed()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Start Warmup
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
