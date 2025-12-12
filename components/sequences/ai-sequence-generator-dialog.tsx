"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Building2,
  Users,
  Target,
  MessageSquare,
  Lightbulb,
  Award,
  Linkedin,
  Phone,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Check,
  Wand2,
  Zap,
  X,
  Plus,
  Trash2,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { generateAISequence, type ICPInput } from "@/lib/actions/ai-sequence-generator"

interface AISequenceGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
}

type WizardStep = "audience" | "pain_points" | "value" | "customize" | "generating"

const COMPANY_SIZES = [
  { value: "startup", label: "Startup", description: "1-50 employees" },
  { value: "smb", label: "SMB", description: "50-200 employees" },
  { value: "mid_market", label: "Mid-Market", description: "200-1000 employees" },
  { value: "enterprise", label: "Enterprise", description: "1000+ employees" },
  { value: "any", label: "Any Size", description: "All company sizes" },
]

const TONES = [
  { value: "professional", label: "Professional", icon: Building2, description: "Formal and business-focused" },
  { value: "casual", label: "Casual", icon: MessageSquare, description: "Relaxed and conversational" },
  { value: "friendly", label: "Friendly", icon: Users, description: "Warm and approachable" },
  { value: "authoritative", label: "Authoritative", icon: Award, description: "Expert and thought-leading" },
  { value: "consultative", label: "Consultative", icon: Lightbulb, description: "Helpful and advisory" },
]

const COMMON_ROLES = [
  "CEO",
  "CTO",
  "CFO",
  "CMO",
  "COO",
  "VP of Sales",
  "VP of Marketing",
  "VP of Engineering",
  "Director of Sales",
  "Director of Marketing",
  "Director of Operations",
  "Sales Manager",
  "Marketing Manager",
  "Product Manager",
  "Head of Growth",
  "Head of Revenue",
  "Head of Partnerships",
]

const COMMON_PAIN_POINTS = [
  "Struggling to generate qualified leads",
  "Low email response rates",
  "Long sales cycles",
  "Difficulty reaching decision makers",
  "High customer acquisition costs",
  "Inefficient sales processes",
  "Lack of personalization at scale",
  "Poor data quality in CRM",
  "Team productivity challenges",
  "Difficulty differentiating from competitors",
]

export function AISequenceGeneratorDialog({ open, onOpenChange, userId }: AISequenceGeneratorDialogProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<WizardStep>("audience")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationProgress, setGenerationProgress] = React.useState(0)
  const [generationMessage, setGenerationMessage] = React.useState("")

  // Form state
  const [formData, setFormData] = React.useState<Partial<ICPInput>>({
    targetIndustry: "",
    companySize: "mid_market",
    targetRoles: [],
    painPoints: [],
    valueProposition: "",
    productService: "",
    tone: "professional",
    sequenceLength: 5,
    includeLinkedIn: false,
    includeCalls: false,
    includeTasks: false,
    companyName: "",
    caseStudyIndustry: "",
    socialProofMetric: "",
    competitorDifferentiator: "",
  })

  // Role input state
  const [roleInput, setRoleInput] = React.useState("")
  const [painPointInput, setPainPointInput] = React.useState("")

  const steps: { id: WizardStep; title: string; icon: React.ElementType }[] = [
    { id: "audience", title: "Target Audience", icon: Target },
    { id: "pain_points", title: "Pain Points", icon: Zap },
    { id: "value", title: "Value Proposition", icon: Lightbulb },
    { id: "customize", title: "Customize", icon: Wand2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const updateFormData = (updates: Partial<ICPInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const addRole = (role: string) => {
    if (role && !formData.targetRoles?.includes(role)) {
      updateFormData({ targetRoles: [...(formData.targetRoles || []), role] })
    }
    setRoleInput("")
  }

  const removeRole = (role: string) => {
    updateFormData({ targetRoles: formData.targetRoles?.filter((r) => r !== role) || [] })
  }

  const addPainPoint = (painPoint: string) => {
    if (painPoint && !formData.painPoints?.includes(painPoint)) {
      updateFormData({ painPoints: [...(formData.painPoints || []), painPoint] })
    }
    setPainPointInput("")
  }

  const removePainPoint = (painPoint: string) => {
    updateFormData({ painPoints: formData.painPoints?.filter((p) => p !== painPoint) || [] })
  }

  const canProceed = () => {
    switch (currentStep) {
      case "audience":
        return formData.targetIndustry && formData.targetRoles && formData.targetRoles.length > 0
      case "pain_points":
        return formData.painPoints && formData.painPoints.length > 0
      case "value":
        return formData.valueProposition && formData.productService
      case "customize":
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep === "customize") {
      handleGenerate()
    } else {
      const nextIndex = currentStepIndex + 1
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id)
      }
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleGenerate = async () => {
    setCurrentStep("generating")
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationMessage("Analyzing your target audience...")

    // Simulate progress updates
    const progressSteps = [
      { progress: 15, message: "Understanding your ICP..." },
      { progress: 30, message: "Crafting compelling subject lines..." },
      { progress: 50, message: "Writing personalized email copy..." },
      { progress: 70, message: "Optimizing sequence timing..." },
      { progress: 85, message: "Finalizing your sequence..." },
    ]

    let stepIndex = 0
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setGenerationProgress(progressSteps[stepIndex].progress)
        setGenerationMessage(progressSteps[stepIndex].message)
        stepIndex++
      }
    }, 1500)

    try {
      const result = await generateAISequence(userId, formData as ICPInput)

      clearInterval(progressInterval)

      if (result.success && result.sequenceId) {
        setGenerationProgress(100)
        setGenerationMessage("Sequence created successfully!")

        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success("Your AI-generated sequence is ready!")
        onOpenChange(false)
        router.push(`/dashboard/sequences/${result.sequenceId}`)
      } else {
        throw new Error(result.error || "Failed to generate sequence")
      }
    } catch (error) {
      clearInterval(progressInterval)
      toast.error(error instanceof Error ? error.message : "Failed to generate sequence")
      setCurrentStep("customize")
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setCurrentStep("audience")
    setFormData({
      targetIndustry: "",
      companySize: "mid_market",
      targetRoles: [],
      painPoints: [],
      valueProposition: "",
      productService: "",
      tone: "professional",
      sequenceLength: 5,
      includeLinkedIn: false,
      includeCalls: false,
      includeTasks: false,
      companyName: "",
      caseStudyIndustry: "",
      socialProofMetric: "",
      competitorDifferentiator: "",
    })
    setGenerationProgress(0)
    setGenerationMessage("")
  }

  React.useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 backdrop-blur-2xl bg-background/95 dark:bg-background/90 border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <TooltipProvider>
          {currentStep !== "generating" && (
            <>
              <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-r from-muted/80 to-muted/40 backdrop-blur-xl">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.1)_inset]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">AI Sequence Generator</DialogTitle>
                      <DialogDescription>
                        Tell us about your ideal customer and we'll create a personalized outreach sequence
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="mt-6 flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = step.id === currentStep
                    const isCompleted = index < currentStepIndex

                    return (
                      <React.Fragment key={step.id}>
                        <button
                          onClick={() => index < currentStepIndex && setCurrentStep(step.id)}
                          disabled={index > currentStepIndex}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                            isActive &&
                              "bg-background/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.1)_inset]",
                            isCompleted && "cursor-pointer hover:bg-background/50",
                            !isActive && !isCompleted && "opacity-50",
                          )}
                        >
                          <div
                            className={cn(
                              "p-1.5 rounded-full",
                              isActive && "bg-primary/10 text-primary dark:bg-primary/20",
                              isCompleted && "bg-success/10 text-success dark:bg-success/20",
                              !isActive && !isCompleted && "bg-muted text-muted-foreground",
                            )}
                          >
                            {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <span
                            className={cn(
                              "text-sm font-medium hidden sm:inline",
                              isActive && "text-foreground",
                              !isActive && "text-muted-foreground",
                            )}
                          >
                            {step.title}
                          </span>
                        </button>
                        {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-border flex-shrink-0" />}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 overflow-y-auto max-h-[50vh]">
                <AnimatePresence mode="wait">
                  {/* Step 1: Target Audience */}
                  {currentStep === "audience" && (
                    <motion.div
                      key="audience"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="industry">Target Industry *</Label>
                        <Input
                          id="industry"
                          placeholder="e.g., SaaS, E-commerce, Healthcare, Financial Services"
                          value={formData.targetIndustry}
                          onChange={(e) => updateFormData({ targetIndustry: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Company Size *</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {COMPANY_SIZES.map((size) => (
                            <button
                              key={size.value}
                              onClick={() => updateFormData({ companySize: size.value as ICPInput["companySize"] })}
                              className={cn(
                                "p-3 rounded-lg border text-left transition-all",
                                formData.companySize === size.value
                                  ? "border-primary bg-primary/5 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.5)_inset] dark:bg-primary/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                                  : "border-border hover:border-border/80 hover:bg-muted/50",
                              )}
                            >
                              <div className="font-medium text-sm">{size.label}</div>
                              <div className="text-xs text-muted-foreground">{size.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Target Roles *</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type a role and press Enter"
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addRole(roleInput)
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => addRole(roleInput)}
                            className="shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.5)_inset] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-shadow"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {formData.targetRoles && formData.targetRoles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.targetRoles.map((role) => (
                              <Badge key={role} variant="secondary" className="gap-1">
                                {role}
                                <button onClick={() => removeRole(role)}>
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="mt-3">
                          <Label className="text-xs text-muted-foreground">Quick add:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {COMMON_ROLES.filter((r) => !formData.targetRoles?.includes(r))
                              .slice(0, 8)
                              .map((role) => (
                                <button
                                  key={role}
                                  onClick={() => addRole(role)}
                                  className="px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
                                >
                                  + {role}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Pain Points */}
                  {currentStep === "pain_points" && (
                    <motion.div
                      key="pain_points"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label>Pain Points Your Product Solves *</Label>
                        <p className="text-sm text-muted-foreground">
                          What problems does your target audience face that your product/service solves?
                        </p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g., Struggling to convert leads into customers"
                            value={painPointInput}
                            onChange={(e) => setPainPointInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addPainPoint(painPointInput)
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => addPainPoint(painPointInput)}
                            className="shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.5)_inset] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-shadow"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {formData.painPoints && formData.painPoints.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {formData.painPoints.map((painPoint, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 backdrop-blur-sm border border-border/30"
                              >
                                <Zap className="h-4 w-4 text-warning flex-shrink-0" />
                                <span className="flex-1 text-sm">{painPoint}</span>
                                <button onClick={() => removePainPoint(painPoint)}>
                                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-4">
                          <Label className="text-xs text-muted-foreground">Common pain points (click to add):</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {COMMON_PAIN_POINTS.filter((p) => !formData.painPoints?.includes(p)).map((painPoint) => (
                              <button
                                key={painPoint}
                                onClick={() => addPainPoint(painPoint)}
                                className="px-3 py-1.5 text-xs rounded-md border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                              >
                                {painPoint}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Value Proposition */}
                  {currentStep === "value" && (
                    <motion.div
                      key="value"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="product">Your Product/Service Name *</Label>
                        <Input
                          id="product"
                          placeholder="e.g., Acme Sales Intelligence Platform"
                          value={formData.productService}
                          onChange={(e) => updateFormData({ productService: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Your Company Name (Optional)</Label>
                        <Input
                          id="company"
                          placeholder="e.g., Acme Inc."
                          value={formData.companyName}
                          onChange={(e) => updateFormData({ companyName: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="value">
                          Value Proposition *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 inline ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              Describe what makes your product valuable and different. Include specific outcomes or
                              results.
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Textarea
                          id="value"
                          placeholder="e.g., We help B2B sales teams increase response rates by 3x using AI-powered personalization, saving 10+ hours per week on manual research."
                          value={formData.valueProposition}
                          onChange={(e) => updateFormData({ valueProposition: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="social">Social Proof / Key Metric (Optional)</Label>
                        <Input
                          id="social"
                          placeholder="e.g., Trusted by 500+ companies including Stripe and Notion"
                          value={formData.socialProofMetric}
                          onChange={(e) => updateFormData({ socialProofMetric: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="differentiator">Competitive Differentiator (Optional)</Label>
                        <Input
                          id="differentiator"
                          placeholder="e.g., Unlike legacy CRMs, we integrate directly with your workflow"
                          value={formData.competitorDifferentiator}
                          onChange={(e) => updateFormData({ competitorDifferentiator: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Customize */}
                  {currentStep === "customize" && (
                    <motion.div
                      key="customize"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <Label>Email Tone</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {TONES.map((tone) => {
                            const Icon = tone.icon
                            return (
                              <button
                                key={tone.value}
                                onClick={() => updateFormData({ tone: tone.value as ICPInput["tone"] })}
                                className={cn(
                                  "p-3 rounded-lg border text-left transition-all",
                                  formData.tone === tone.value
                                    ? "border-primary bg-primary/5 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.5)_inset] dark:bg-primary/10"
                                    : "border-border hover:border-border/80 hover:bg-muted/50",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium text-sm">{tone.label}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">{tone.description}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Sequence Length: {formData.sequenceLength} steps</Label>
                        </div>
                        <Slider
                          value={[formData.sequenceLength || 5]}
                          onValueChange={([value]) => updateFormData({ sequenceLength: value })}
                          min={3}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>3 (Quick)</span>
                          <span>10 (Comprehensive)</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Multi-channel Options</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-secondary shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                                <Linkedin className="h-4 w-4 text-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">LinkedIn Steps</div>
                                <div className="text-xs text-muted-foreground">
                                  Profile views, connections, messages
                                </div>
                              </div>
                            </div>
                            <Switch
                              checked={formData.includeLinkedIn}
                              onCheckedChange={(checked) => updateFormData({ includeLinkedIn: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-secondary shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                                <Phone className="h-4 w-4 text-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Phone Calls</div>
                                <div className="text-xs text-muted-foreground">Call tasks with scripts</div>
                              </div>
                            </div>
                            <Switch
                              checked={formData.includeCalls}
                              onCheckedChange={(checked) => updateFormData({ includeCalls: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-secondary shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                                <ClipboardList className="h-4 w-4 text-foreground" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Manual Tasks</div>
                                <div className="text-xs text-muted-foreground">Custom research tasks</div>
                              </div>
                            </div>
                            <Switch
                              checked={formData.includeTasks}
                              onCheckedChange={(checked) => updateFormData({ includeTasks: checked })}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="px-6 py-4 border-t border-border/50 bg-muted/30 backdrop-blur-xl flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStepIndex === 0}
                  className="gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-shadow"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all"
                >
                  {currentStep === "customize" ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Sequence
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {currentStep === "generating" && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                <div className="p-6 rounded-full bg-muted/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.5)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <Sparkles className="h-12 w-12 text-foreground" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-primary/30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Creating Your Sequence</h3>
                <p className="text-muted-foreground mb-6">{generationMessage}</p>

                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${generationProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{generationProgress}% complete</p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is writing personalized emails for your ICP...
              </div>
            </div>
          )}
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  )
}
