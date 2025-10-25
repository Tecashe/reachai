"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitOnboardingQuestionnaire } from "@/lib/actions/onboarding"
import { toast } from "sonner"
import { Loader2, Sparkles } from "lucide-react"

export function OnboardingQuestionnaire() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    userRole: "",
    useCase: "",
    monthlyVolume: "",
  })

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.userRole || !formData.useCase || !formData.monthlyVolume) {
      toast.error("Please complete all fields")
      return
    }

    setLoading(true)
    const result = await submitOnboardingQuestionnaire(formData)

    if (result.success) {
      toast.success("Welcome to ReachAI! Let's get started.")
      router.push("/dashboard")
    } else {
      toast.error(result.error || "Failed to save your information")
      setLoading(false)
    }
  }

  const totalSteps = 4

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-3xl">Welcome to ReachAI</CardTitle>
        </div>
        <CardDescription className="text-base">
          Let's personalize your experience. This will only take 2 minutes.
        </CardDescription>
        <div className="flex gap-2 justify-center mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i + 1 <= step ? "w-12 bg-primary" : "w-8 bg-muted"}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-base">
                What's your company name?
              </Label>
              <Input
                id="companyName"
                placeholder="Acme Corp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="text-base h-12"
                autoFocus
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full h-12 text-base" disabled={!formData.companyName}>
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <Label className="text-base">What's your role?</Label>
              <RadioGroup
                value={formData.userRole}
                onValueChange={(value) => setFormData({ ...formData, userRole: value })}
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="founder" id="founder" />
                  <Label htmlFor="founder" className="flex-1 cursor-pointer text-base">
                    Founder / CEO
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="sales" id="sales" />
                  <Label htmlFor="sales" className="flex-1 cursor-pointer text-base">
                    Sales
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="marketing" id="marketing" />
                  <Label htmlFor="marketing" className="flex-1 cursor-pointer text-base">
                    Marketing
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer text-base">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 h-12" disabled={!formData.userRole}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <Label className="text-base">What's your primary use case?</Label>
              <RadioGroup
                value={formData.useCase}
                onValueChange={(value) => setFormData({ ...formData, useCase: value })}
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="finding_customers" id="finding_customers" />
                  <Label htmlFor="finding_customers" className="flex-1 cursor-pointer text-base">
                    Finding customers
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="partnerships" id="partnerships" />
                  <Label htmlFor="partnerships" className="flex-1 cursor-pointer text-base">
                    Building partnerships
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="recruiting" id="recruiting" />
                  <Label htmlFor="recruiting" className="flex-1 cursor-pointer text-base">
                    Recruiting talent
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="other" id="use_other" />
                  <Label htmlFor="use_other" className="flex-1 cursor-pointer text-base">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={() => setStep(4)} className="flex-1 h-12" disabled={!formData.useCase}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3">
              <Label className="text-base">How many emails do you plan to send per month?</Label>
              <RadioGroup
                value={formData.monthlyVolume}
                onValueChange={(value) => setFormData({ ...formData, monthlyVolume: value })}
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="under_500" id="under_500" />
                  <Label htmlFor="under_500" className="flex-1 cursor-pointer">
                    <div className="text-base font-medium">Under 500</div>
                    <div className="text-sm text-muted-foreground">Perfect for getting started</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="500_2000" id="500_2000" />
                  <Label htmlFor="500_2000" className="flex-1 cursor-pointer">
                    <div className="text-base font-medium">500 - 2,000</div>
                    <div className="text-sm text-muted-foreground">Growing your outreach</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <RadioGroupItem value="over_2000" id="over_2000" />
                  <Label htmlFor="over_2000" className="flex-1 cursor-pointer">
                    <div className="text-base font-medium">Over 2,000</div>
                    <div className="text-sm text-muted-foreground">High-volume campaigns</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 h-12" disabled={!formData.monthlyVolume || loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
