"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, ChevronRight } from "lucide-react"

interface SetupGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: "gmail" | "outlook" | "yahoo" | "custom"
}

export function SetupGuideModal({ open, onOpenChange, provider }: SetupGuideModalProps) {
  const guides: Record<string, any> = {
    gmail: {
      title: "Connect Your Gmail Account",
      description: "Step-by-step guide to connect using Gmail App Password",
      steps: [
        {
          number: 1,
          title: "Go to Your Google Account",
          description: "Visit https://myaccount.google.com and sign in if needed",
          details: ["Click 'Google Account' at the top", "Select the 'Security' tab on the left"],
        },
        {
          number: 2,
          title: "Enable 2-Step Verification (if not already enabled)",
          description: "Gmail requires 2FA before you can create an app password",
          details: [
            'Scroll down to "How you sign in to Google"',
            'Click on "2-Step Verification"',
            "Follow the prompts to enable it",
          ],
        },
        {
          number: 3,
          title: "Create an App Password",
          description: "This is a special password just for ReachAI",
          details: [
            "Go back to Security tab",
            'Scroll down to "App passwords" (only visible after 2FA is on)',
            "Select 'Mail' and 'Windows Computer'",
            "Google will generate a 16-character password",
            "Copy this password exactly",
          ],
        },
        {
          number: 4,
          title: "Paste into ReachAI",
          description: "Use the generated password in ReachAI",
          details: ["Paste the 16-character password in the 'Password' field"],
        },
      ],
      warning: "Never share your app password with anyone",
    },
    outlook: {
      title: "Connect Your Outlook Account",
      description: "Step-by-step guide to connect using Outlook credentials",
      steps: [
        {
          number: 1,
          title: "Visit Outlook Security Settings",
          description: "Go to https://account.microsoft.com/security",
          details: ["Click 'Security' on the left menu", "Find 'App passwords' or 'Password' section"],
        },
        {
          number: 2,
          title: "Create an App Password (if available)",
          description: "Some Outlook accounts support app passwords",
          details: [
            "Select 'Mail' as the app type",
            "Select 'Windows' as the device type",
            "Microsoft will generate a new password",
            "Copy this password",
          ],
        },
        {
          number: 3,
          title: "Use Your Regular Password",
          description: "If app passwords aren't available, use your Outlook password",
          details: ["Use your regular Outlook/Microsoft password", "Ensure 2FA is enabled on your account"],
        },
        {
          number: 4,
          title: "Enter Details in ReachAI",
          description: "Fill in the form with your credentials",
          details: [
            "Email: Your full Outlook email address",
            "Password: Your app password or regular password",
            "Other fields will auto-fill for Outlook",
          ],
        },
      ],
      warning: "Keep your password secure and never share it",
    },
    yahoo: {
      title: "Connect Your Yahoo Account",
      description: "Step-by-step guide to connect using Yahoo credentials",
      steps: [
        {
          number: 1,
          title: "Create an App Password",
          description: "Yahoo requires an app password for third-party access",
          details: [
            "Go to Yahoo Account Security: https://login.yahoo.com",
            "Sign in if needed",
            "Click on 'Account Security' tab",
          ],
        },
        {
          number: 2,
          title: "Generate App Password",
          description: "Generate a special password for ReachAI",
          details: [
            "Look for 'Generate app password'",
            "Select 'Mail' as the app",
            "Select 'Other App' as the device type",
            "Type 'ReachAI' as the device name",
            "Yahoo will generate a 16-character password",
          ],
        },
        {
          number: 3,
          title: "Copy Your Password",
          description: "Copy the generated app password exactly",
          details: [
            "The password will be displayed once",
            "Copy it immediately to a safe place",
            "Do not close the window until you've copied it",
          ],
        },
        {
          number: 4,
          title: "Paste into ReachAI",
          description: "Enter your credentials in ReachAI",
          details: [
            "Email: Your full Yahoo email address",
            "Password: The 16-character app password you generated",
            "Server details will auto-fill",
          ],
        },
      ],
      warning: "Store your app password safely - Yahoo won't show it again",
    },
  }

  const guide = guides[provider]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{guide?.title}</DialogTitle>
          <DialogDescription>{guide?.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {guide?.steps.map((step: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-lg">
                    Step {step.number}
                  </Badge>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {step.details.map((detail: string, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p>{detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {guide?.warning && (
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">{guide.warning}</p>
            </div>
          )}

          <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              Once you've completed these steps, paste your credentials into the form below and click 'Test Connection'
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
