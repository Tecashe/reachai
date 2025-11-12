// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { submitOnboardingQuestionnaire } from "@/lib/actions/onboarding"
// import { toast } from "sonner"
// import { Loader2, Sparkles } from "lucide-react"

// export function OnboardingQuestionnaire() {
//   const router = useRouter()
//   const [step, setStep] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     companyName: "",
//     userRole: "",
//     useCase: "",
//     monthlyVolume: "",
//   })

//   const handleSubmit = async () => {
//     if (!formData.companyName || !formData.userRole || !formData.useCase || !formData.monthlyVolume) {
//       toast.error("Please complete all fields")
//       return
//     }

//     setLoading(true)
//     const result = await submitOnboardingQuestionnaire(formData)

//     if (result.success) {
//       toast.success("Welcome to ReachAI! Let's get started.")
//       router.push("/dashboard")
//     } else {
//       toast.error(result.error || "Failed to save your information")
//       setLoading(false)
//     }
//   }

//   const totalSteps = 4

//   return (
//     <Card className="w-full max-w-2xl shadow-2xl border-2">
//       <CardHeader className="text-center space-y-2">
//         <div className="flex items-center justify-center gap-2 mb-2">
//           <Sparkles className="h-6 w-6 text-primary" />
//           <CardTitle className="text-3xl">Welcome to ReachAI</CardTitle>
//         </div>
//         <CardDescription className="text-base">
//           Let's personalize your experience. This will only take 2 minutes.
//         </CardDescription>
//         <div className="flex gap-2 justify-center mt-4">
//           {Array.from({ length: totalSteps }).map((_, i) => (
//             <div
//               key={i}
//               className={`h-2 rounded-full transition-all ${i + 1 <= step ? "w-12 bg-primary" : "w-8 bg-muted"}`}
//             />
//           ))}
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {step === 1 && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="space-y-2">
//               <Label htmlFor="companyName" className="text-base">
//                 What's your company name?
//               </Label>
//               <Input
//                 id="companyName"
//                 placeholder="Acme Corp"
//                 value={formData.companyName}
//                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                 className="text-base h-12"
//                 autoFocus
//               />
//             </div>
//             <Button onClick={() => setStep(2)} className="w-full h-12 text-base" disabled={!formData.companyName}>
//               Continue
//             </Button>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="space-y-3">
//               <Label className="text-base">What's your role?</Label>
//               <RadioGroup
//                 value={formData.userRole}
//                 onValueChange={(value) => setFormData({ ...formData, userRole: value })}
//               >
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="founder" id="founder" />
//                   <Label htmlFor="founder" className="flex-1 cursor-pointer text-base">
//                     Founder / CEO
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="sales" id="sales" />
//                   <Label htmlFor="sales" className="flex-1 cursor-pointer text-base">
//                     Sales
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="marketing" id="marketing" />
//                   <Label htmlFor="marketing" className="flex-1 cursor-pointer text-base">
//                     Marketing
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="other" id="other" />
//                   <Label htmlFor="other" className="flex-1 cursor-pointer text-base">
//                     Other
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
//                 Back
//               </Button>
//               <Button onClick={() => setStep(3)} className="flex-1 h-12" disabled={!formData.userRole}>
//                 Continue
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="space-y-3">
//               <Label className="text-base">What's your primary use case?</Label>
//               <RadioGroup
//                 value={formData.useCase}
//                 onValueChange={(value) => setFormData({ ...formData, useCase: value })}
//               >
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="finding_customers" id="finding_customers" />
//                   <Label htmlFor="finding_customers" className="flex-1 cursor-pointer text-base">
//                     Finding customers
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="partnerships" id="partnerships" />
//                   <Label htmlFor="partnerships" className="flex-1 cursor-pointer text-base">
//                     Building partnerships
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="recruiting" id="recruiting" />
//                   <Label htmlFor="recruiting" className="flex-1 cursor-pointer text-base">
//                     Recruiting talent
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="other" id="use_other" />
//                   <Label htmlFor="use_other" className="flex-1 cursor-pointer text-base">
//                     Other
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
//                 Back
//               </Button>
//               <Button onClick={() => setStep(4)} className="flex-1 h-12" disabled={!formData.useCase}>
//                 Continue
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 4 && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="space-y-3">
//               <Label className="text-base">How many emails do you plan to send per month?</Label>
//               <RadioGroup
//                 value={formData.monthlyVolume}
//                 onValueChange={(value) => setFormData({ ...formData, monthlyVolume: value })}
//               >
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="under_500" id="under_500" />
//                   <Label htmlFor="under_500" className="flex-1 cursor-pointer">
//                     <div className="text-base font-medium">Under 500</div>
//                     <div className="text-sm text-muted-foreground">Perfect for getting started</div>
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="500_2000" id="500_2000" />
//                   <Label htmlFor="500_2000" className="flex-1 cursor-pointer">
//                     <div className="text-base font-medium">500 - 2,000</div>
//                     <div className="text-sm text-muted-foreground">Growing your outreach</div>
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors">
//                   <RadioGroupItem value="over_2000" id="over_2000" />
//                   <Label htmlFor="over_2000" className="flex-1 cursor-pointer">
//                     <div className="text-base font-medium">Over 2,000</div>
//                     <div className="text-sm text-muted-foreground">High-volume campaigns</div>
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12">
//                 Back
//               </Button>
//               <Button onClick={handleSubmit} className="flex-1 h-12" disabled={!formData.monthlyVolume || loading}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Setting up...
//                   </>
//                 ) : (
//                   "Complete Setup"
//                 )}
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }


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
import { Loader2, Sparkles, Mail, ArrowRight, Zap } from "lucide-react"

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
      // Don't redirect to dashboard yet - move to email connection step
      setLoading(false)
      setStep(5)
    } else {
      toast.error(result.error || "Failed to save your information")
      setLoading(false)
    }
  }

  const handleSkipEmailSetup = () => {
    toast.success("Welcome to ReachAI! You can connect your email later from Settings.")
    router.push("/dashboard")
  }

  const handleConnectEmail = (provider: "gmail" | "outlook") => {
    toast.info(`Redirecting to ${provider === "gmail" ? "Google" : "Microsoft"} OAuth...`)
    // Redirect to OAuth flow with onboarding return URL
    window.location.href = `/api/oauth/${provider}?redirect=/dashboard&onboarding=true`
  }

  const totalSteps = 5

  return (
    <Card className="w-full max-w-2xl shadow-2xl border-2">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-3xl">Welcome to ReachAI</CardTitle>
        </div>
        <CardDescription className="text-base">
          {step < 5
            ? "Let's personalize your experience. This will only take 2 minutes."
            : "One last step to get you started"}
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
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Connect Your Email</h3>
              <p className="text-muted-foreground">
                Choose how you want to send emails. You can always change this later.
              </p>
            </div>

            <div className="space-y-3">
              <div className="border-2 border-primary/20 rounded-lg p-6 space-y-4 bg-primary/5">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">Quick Start (Recommended)</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect Gmail or Outlook in 30 seconds. No DNS setup required.
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={() => handleConnectEmail("gmail")} variant="default" className="flex-1 h-11">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                        </svg>
                        Connect Gmail
                      </Button>
                      <Button onClick={() => handleConnectEmail("outlook")} variant="default" className="flex-1 h-11">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.62q0-.48.33-.8.33-.33.8-.33h13.75q.46 0 .8.33.32.32.32.8V12zm-3 0V3.12H8.5v3.88H18q.41 0 .7.3.3.29.3.7v7.5h1.5zm-15 2.62q.14-.14.14-.35V8.87q0-.21-.14-.34-.15-.14-.35-.14H1.5v9.23h4.62q.21 0 .35-.15zm14.38-4.87l-4.88-4.88v4.88h4.88z" />
                        </svg>
                        Connect Outlook
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">Custom Domain (Advanced)</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your own domain with SMTP. Requires DNS configuration.
                    </p>
                    <Button
                      onClick={() => {
                        toast.success("Welcome to ReachAI! Complete email setup from Settings.")
                        router.push("/dashboard/email-setup")
                      }}
                      variant="outline"
                      className="w-full h-11"
                    >
                      Setup Custom Domain
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={handleSkipEmailSetup} variant="ghost" className="w-full">
                Skip for now - I'll set this up later
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
