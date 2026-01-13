
"use client"

import { useId } from 'react'
import * as React from "react"
import {
  Mail,
  Clock,
  Trash2,
  ChevronDown,
  Variable,
  Linkedin,
  Phone,
  CheckSquare,
  Settings2,
  TestTube,
  User,
  Building2,
  Briefcase,
  AtSign,
  Hash,
  Plus,
  AlertTriangle,
  Timer,
  LogOut,
  UserCheck,
  Info,
  Wand2,
  GitBranch,
  Shuffle,
  FileText,
  Voicemail,
  MailOpen,
  Zap,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type {
  SequenceStep,
  SequenceStepVariant,
  WaitConditionType,
  WaitFallbackAction,
  ExitCondition,
  CallOutcome,
  BehaviorCondition,
  StepType,
  MultiChannelTouch,
} from "@/lib/types/sequence"
import { STEP_TYPE_CONFIG } from "@/lib/types/sequence"
import { EmailBodyPreview } from "@/components/templates/email-body-preview"
import { EmailComposerClient } from './email-composer-client'

interface SequenceStepPanelProps {
  step: SequenceStep
  sequenceId: string
  userId: string
  onUpdate: (updates: Partial<SequenceStep>) => void
  onClose: () => void
  onDelete: () => void
}

const PERSONALIZATION_VARIABLES = {
  prospect: {
    label: "Prospect",
    icon: User,
    variables: [
      { key: "firstName", label: "First Name", fallback: "there" },
      { key: "lastName", label: "Last Name", fallback: "" },
      { key: "fullName", label: "Full Name", fallback: "there" },
      { key: "email", label: "Email", fallback: "" },
      { key: "phoneNumber", label: "Phone", fallback: "" },
    ],
  },
  company: {
    label: "Company",
    icon: Building2,
    variables: [
      { key: "company", label: "Company Name", fallback: "your company" },
      { key: "industry", label: "Industry", fallback: "" },
      { key: "companySize", label: "Company Size", fallback: "" },
      { key: "websiteUrl", label: "Website", fallback: "" },
    ],
  },
  job: {
    label: "Job Info",
    icon: Briefcase,
    variables: [
      { key: "jobTitle", label: "Job Title", fallback: "" },
      { key: "department", label: "Department", fallback: "" },
    ],
  },
  sender: {
    label: "Sender",
    icon: AtSign,
    variables: [
      { key: "senderName", label: "Your Name", fallback: "" },
      { key: "senderCompany", label: "Your Company", fallback: "" },
      { key: "senderTitle", label: "Your Title", fallback: "" },
    ],
  },
  custom: {
    label: "Custom",
    icon: Hash,
    variables: [
      { key: "customField1", label: "Custom Field 1", fallback: "" },
      { key: "customField2", label: "Custom Field 2", fallback: "" },
    ],
  },
}

export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
  const { toast } = useToast()
  const uniqueId = useId()




  const config = STEP_TYPE_CONFIG[step.stepType]
  const [activeTab, setActiveTab] = React.useState("content")
  const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
  const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])
  const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)
  const [showEmailComposer, setShowEmailComposer] = React.useState(false)

  const subjectRef = React.useRef<HTMLInputElement>(null)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    setVariants(step.variants || [])
  }, [step.variants])

  const insertVariable = (variable: string, field: "subject" | "body") => {
    const targetRef = field === "subject" ? subjectRef : bodyRef
    const target = targetRef.current
    if (!target) return

    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const currentValue = target.value
    const variableText = `{{${variable}}}`
    const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

    if (field === "subject") {
      onUpdate({ subject: newValue })
    } else {
      onUpdate({ body: newValue })
    }

    setTimeout(() => {
      target.focus()
      target.setSelectionRange(start + variableText.length, start + variableText.length)
    }, 0)
  }

  const handleVariantsChange = (newVariants: SequenceStepVariant[]) => {
    setVariants(newVariants)
    onUpdate({ variants: newVariants })
  }

  const handleEmailComposerSave = (subject: string, body: string) => {
    onUpdate({ subject, body })
    setShowEmailComposer(false)
    toast({ title: "Email content updated" })
  }

  const getSpamScore = () => {
    let score = 0
    const body = step.body?.toLowerCase() || ""
    const subject = step.subject?.toLowerCase() || ""

    const spamTriggers = ["free", "act now", "limited time", "click here", "urgent", "guarantee", "winner"]
    spamTriggers.forEach((trigger) => {
      if (body.includes(trigger) || subject.includes(trigger)) score += 2
    })

    if (subject.toUpperCase() === subject && subject.length > 5) score += 2
    if (body.includes("!!!") || subject.includes("!!!")) score += 1

    return Math.min(score, 10)
  }

  const getWordCount = () => {
    return (step.body || "").split(/\s+/).filter(Boolean).length
  }

  const VariableQuickInsert = ({ field }: { field: "subject" | "body" }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs shadow-sm border-border/60 hover:bg-muted/80 bg-transparent"
        >
          <Variable className="h-3.5 w-3.5" />
          Insert Variable
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg border-border/60" align="end" sideOffset={4}>
        <div className="p-3 border-b bg-muted/30">
          <h4 className="font-medium text-sm">Personalization Variables</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Click to insert at cursor position</p>
        </div>
        <ScrollArea className="h-72">
          <div className="p-2">
            {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
              const CategoryIcon = category.icon
              return (
                <div key={categoryKey} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <CategoryIcon className="h-3.5 w-3.5" />
                    {category.label}
                  </div>
                  <div className="space-y-0.5">
                    {category.variables.map((v) => (
                      <button
                        key={v.key}
                        className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted/80 transition-colors group"
                        onClick={() => insertVariable(v.key, field)}
                      >
                        <div className="flex items-center gap-2">
                          <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
                            {`{{${v.key}}}`}
                          </code>
                          <span className="text-sm text-muted-foreground">{v.label}</span>
                        </div>
                        <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )

  









  const renderEmailContent = () => {
    const spamScore = getSpamScore()
    const wordCount = getWordCount()
    const isWordCountGood = wordCount >= 50 && wordCount <= 125
    const hasHtmlContent = /<[^>]+>/.test(step.body || "")

    return (
      <>
        {/* Spam Score & Word Count Indicators */}
        <div className="flex gap-2 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                  spamScore <= 3
                    ? "bg-green-500/10 text-green-600"
                    : spamScore <= 6
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-600",
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                Spam: {spamScore}/10
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {spamScore <= 3
                ? "Good - Low spam risk"
                : spamScore <= 6
                  ? "Fair - Some spam triggers detected"
                  : "Poor - High spam risk"}
            </TooltipContent>
          </Tooltip>

          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
              isWordCountGood ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600",
            )}
          >
            {wordCount} words
          </div>
        </div>

        {/* Pre-header text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Pre-header Text</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">Preview text shown in inbox before opening</TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={step.preHeaderText || ""}
            onChange={(e) => onUpdate({ preHeaderText: e.target.value })}
            placeholder="Preview text..."
            className="text-sm"
          />
        </div>

        {/* Subject Line */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
            <VariableQuickInsert field="subject" />
          </div>
          <Input
            ref={subjectRef}
            value={step.subject || ""}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            onFocus={() => setActiveField("subject")}
            placeholder="Enter subject line..."
            className="text-sm"
          />
          <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
            <VariableQuickInsert field="body" />
          </div>

          {hasHtmlContent ? (
            // Show rich HTML preview when body contains HTML
            <EmailBodyPreview htmlContent={step.body || ""} onOpenEditor={() => setShowEmailComposer(true)} />
          ) : (
            // Show plain textarea for simple text with "Use Rich Editor" button
            <>
              <div className="flex justify-end mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
                  onClick={() => setShowEmailComposer(true)}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Use Rich Editor
                </Button>
              </div>
              <Textarea
                ref={bodyRef}
                value={step.body || ""}
                onChange={(e) => onUpdate({ body: e.target.value })}
                onFocus={() => setActiveField("body")}
                placeholder="Write your email content..."
                className="min-h-[200px] text-sm resize-none font-mono"
              />
            </>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
            <p className="text-[10px] text-muted-foreground">
              {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
            </p>
          </div>
        </div>

        {/* Custom From Name & Reply To */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-8 text-xs">
              Advanced email settings
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Custom From Name</Label>
                <Input
                  value={step.customFromName || ""}
                  onChange={(e) => onUpdate({ customFromName: e.target.value })}
                  placeholder="Your Name"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reply-to Address</Label>
                <Input
                  value={step.replyToAddress || ""}
                  onChange={(e) => onUpdate({ replyToAddress: e.target.value })}
                  placeholder="reply@example.com"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">AI Optimize Send Time</span>
              <Switch
                checked={step.aiOptimizeSendTime || false}
                onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </>
    )
  }
















  const renderEmailContentOLD = () => {
    const spamScore = getSpamScore()
    const wordCount = getWordCount()
    const isWordCountGood = wordCount >= 50 && wordCount <= 125
    const hasHtmlContent = /<[^>]+>/.test(step.body || "")

    return (
      <>
        <div className="flex gap-2 mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                  spamScore <= 3
                    ? "bg-green-500/10 text-green-600"
                    : spamScore <= 6
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-red-500/10 text-red-600",
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                Spam: {spamScore}/10
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {spamScore <= 3
                ? "Good - Low spam risk"
                : spamScore <= 6
                  ? "Fair - Some spam triggers detected"
                  : "Poor - High spam risk"}
            </TooltipContent>
          </Tooltip>

          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
              isWordCountGood ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600",
            )}
          >
            {wordCount} words
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Pre-header Text</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">Preview text shown in inbox before opening</TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={step.preHeaderText || ""}
            onChange={(e) => onUpdate({ preHeaderText: e.target.value })}
            placeholder="Preview text..."
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
            <VariableQuickInsert field="subject" />
          </div>
          <Input
            ref={subjectRef}
            value={step.subject || ""}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            onFocus={() => setActiveField("subject")}
            placeholder="Enter subject line..."
            className="text-sm"
          />
          <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
            <VariableQuickInsert field="body" />
          </div>

          {hasHtmlContent ? (
            <EmailBodyPreview htmlContent={step.body || ""} onOpenEditor={() => setShowEmailComposer(true)} />
          ) : (
            <>
              <div className="flex justify-end mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
                  onClick={() => setShowEmailComposer(true)}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Use Rich Editor
                </Button>
              </div>
              <Textarea
                ref={bodyRef}
                value={step.body || ""}
                onChange={(e) => onUpdate({ body: e.target.value })}
                onFocus={() => setActiveField("body")}
                placeholder="Write your email content..."
                className="min-h-[200px] text-sm resize-none font-mono"
              />
            </>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
            <p className="text-[10px] text-muted-foreground">
              {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
            </p>
          </div>
        </div>

        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-8 text-xs">
              Advanced email settings
              <ChevronDown className="h-3 w-3" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Custom From Name</Label>
                <Input
                  value={step.customFromName || ""}
                  onChange={(e) => onUpdate({ customFromName: e.target.value })}
                  placeholder="Your Name"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reply-to Address</Label>
                <Input
                  value={step.replyToAddress || ""}
                  onChange={(e) => onUpdate({ replyToAddress: e.target.value })}
                  placeholder="reply@example.com"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">AI Optimize Send Time</span>
              <Switch
                checked={step.aiOptimizeSendTime || false}
                onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </>
    )
  }

  const renderDelayContent = () => (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Business days only</span>
          <Switch
            checked={step.businessDaysOnly || false}
            onCheckedChange={(checked) => onUpdate({ businessDaysOnly: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Randomize delay</span>
            <p className="text-xs text-muted-foreground">Add natural variation</p>
          </div>
          <Switch
            checked={step.randomizeDelay || false}
            onCheckedChange={(checked) => onUpdate({ randomizeDelay: checked })}
          />
        </div>

        {step.randomizeDelay && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Min delay</Label>
              <Input
                type="number"
                min={1}
                value={step.delayRandomMin || step.delayValue}
                onChange={(e) => onUpdate({ delayRandomMin: Number.parseInt(e.target.value) || 1 })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max delay</Label>
              <Input
                type="number"
                min={1}
                value={step.delayRandomMax || step.delayValue + 1}
                onChange={(e) => onUpdate({ delayRandomMax: Number.parseInt(e.target.value) || 2 })}
                className="h-8"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">Send at specific time</Label>
          <Input
            type="time"
            value={step.sendAtTime || ""}
            onChange={(e) => onUpdate({ sendAtTime: e.target.value })}
            className="h-8"
          />
          <p className="text-xs text-muted-foreground">Leave empty to send anytime during business hours</p>
        </div>
      </div>
    </>
  )

  const renderWaitUntilContent = () => {
    const config = step.waitUntilConfig || {
      conditionType: "EMAIL_OPENED" as WaitConditionType,
      maxWaitDays: 3,
      fallbackAction: "CONTINUE" as WaitFallbackAction,
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Wait condition</Label>
          <Select
            value={config.conditionType}
            onValueChange={(v) =>
              onUpdate({
                waitUntilConfig: { ...config, conditionType: v as WaitConditionType },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EMAIL_OPENED">Email is opened</SelectItem>
              <SelectItem value="LINK_CLICKED">Link is clicked</SelectItem>
              <SelectItem value="LINKEDIN_VIEWED">LinkedIn profile viewed back</SelectItem>
              <SelectItem value="SPECIFIC_TIME">Specific time of day</SelectItem>
              <SelectItem value="SPECIFIC_DAYS">Specific days only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Max wait days</Label>
            <span className="text-xs text-muted-foreground">{config.maxWaitDays} days</span>
          </div>
          <Slider
            value={[config.maxWaitDays]}
            onValueChange={([v]) => onUpdate({ waitUntilConfig: { ...config, maxWaitDays: v } })}
            max={14}
            min={1}
            step={1}
          />
        </div>

        {config.conditionType === "SPECIFIC_TIME" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Start time</Label>
              <Input
                type="time"
                value={config.specificTimeStart || "09:00"}
                onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeStart: e.target.value } })}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End time</Label>
              <Input
                type="time"
                value={config.specificTimeEnd || "11:00"}
                onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeEnd: e.target.value } })}
                className="h-8"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs">If condition not met</Label>
          <Select
            value={config.fallbackAction}
            onValueChange={(v) =>
              onUpdate({
                waitUntilConfig: { ...config, fallbackAction: v as WaitFallbackAction },
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SKIP">Skip this step</SelectItem>
              <SelectItem value="CONTINUE">Continue anyway</SelectItem>
              <SelectItem value="EXIT_SEQUENCE">Exit sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Use prospect timezone</span>
          <Switch
            checked={config.useProspectTimezone || false}
            onCheckedChange={(checked) => onUpdate({ waitUntilConfig: { ...config, useProspectTimezone: checked } })}
          />
        </div>
      </div>
    )
  }

  const renderExitTriggerContent = () => {
    const config = step.exitTriggerConfig || {
      conditions: [],
      actions: [],
    }

    const allConditions: ExitCondition[] = [
      "ANY_REPLY",
      "POSITIVE_REPLY",
      "NEGATIVE_REPLY",
      "MEETING_BOOKED",
      "PAGE_VISITED",
      "EMAIL_BOUNCED",
      "UNSUBSCRIBED",
      "LINK_CLICKED",
    ]

    const toggleCondition = (condition: ExitCondition) => {
      const conditions = config.conditions.includes(condition)
        ? config.conditions.filter((c) => c !== condition)
        : [...config.conditions, condition]
      onUpdate({ exitTriggerConfig: { ...config, conditions } })
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Exit when</Label>
          <div className="flex flex-wrap gap-2">
            {allConditions.map((condition) => (
              <Badge
                key={condition}
                variant={config.conditions.includes(condition) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleCondition(condition)}
              >
                {condition.toLowerCase().replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>

        {config.conditions.includes("PAGE_VISITED") && (
          <div className="space-y-2">
            <Label className="text-xs">Page URL to track</Label>
            <Input
              value={config.pageVisitedUrl || ""}
              onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, pageVisitedUrl: e.target.value } })}
              placeholder="https://example.com/pricing"
              className="text-sm"
            />
          </div>
        )}

        {config.conditions.includes("LINK_CLICKED") && (
          <div className="space-y-2">
            <Label className="text-xs">Link URL to track</Label>
            <Input
              value={config.linkClickedUrl || ""}
              onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, linkClickedUrl: e.target.value } })}
              placeholder="https://example.com/demo"
              className="text-sm"
            />
          </div>
        )}
      </div>
    )
  }

  const renderManualReviewContent = () => {
    const config = step.manualReviewConfig || {}

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Notify email</Label>
          <Input
            value={config.notifyEmail || ""}
            onChange={(e) => onUpdate({ manualReviewConfig: { ...config, notifyEmail: e.target.value } })}
            placeholder="team@example.com"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Review instructions</Label>
          <Textarea
            value={config.reviewInstructions || ""}
            onChange={(e) => onUpdate({ manualReviewConfig: { ...config, reviewInstructions: e.target.value } })}
            placeholder="What should the reviewer look for?"
            className="min-h-[80px] text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Auto-approve after (days)</Label>
          <Input
            type="number"
            min={0}
            value={config.autoApproveAfterDays || ""}
            onChange={(e) =>
              onUpdate({
                manualReviewConfig: { ...config, autoApproveAfterDays: Number.parseInt(e.target.value) || undefined },
              })
            }
            placeholder="Leave empty for no auto-approve"
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground">Set to 0 to require manual approval</p>
        </div>
      </div>
    )
  }

  const renderCallContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Call Script</Label>
        <Textarea
          value={step.callScript || ""}
          onChange={(e) => onUpdate({ callScript: e.target.value })}
          placeholder="Write your call script or talking points..."
          className="min-h-[200px] text-sm resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Expected Duration (minutes)</Label>
        <Input
          type="number"
          min={1}
          value={step.callDuration || 5}
          onChange={(e) => onUpdate({ callDuration: Number.parseInt(e.target.value) || 5 })}
          className="h-8 w-24"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Best time to call predictor</span>
        <Switch
          checked={step.callBestTimeEnabled || false}
          onCheckedChange={(checked) => onUpdate({ callBestTimeEnabled: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Call outcome tracking</Label>
        <Select value={step.callOutcome || ""} onValueChange={(v) => onUpdate({ callOutcome: v as CallOutcome })}>
          <SelectTrigger>
            <SelectValue placeholder="Select outcome..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONNECTED">Connected</SelectItem>
            <SelectItem value="VOICEMAIL">Voicemail</SelectItem>
            <SelectItem value="NO_ANSWER">No Answer</SelectItem>
            <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
            <SelectItem value="GATEKEEPER">Gatekeeper</SelectItem>
            <SelectItem value="BUSY">Busy</SelectItem>
            <SelectItem value="CALLBACK_REQUESTED">Callback Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderTaskContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
        <Input
          value={step.taskTitle || ""}
          onChange={(e) => onUpdate({ taskTitle: e.target.value })}
          placeholder="Enter task title..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Description</Label>
        <Textarea
          value={step.taskDescription || ""}
          onChange={(e) => onUpdate({ taskDescription: e.target.value })}
          placeholder="Describe what needs to be done..."
          className="min-h-[100px] text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
          <Select value={step.taskPriority || "MEDIUM"} onValueChange={(v) => onUpdate({ taskPriority: v as any })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Est. Time (min)</Label>
          <Input
            type="number"
            min={1}
            value={step.taskEstimatedTime || ""}
            onChange={(e) => onUpdate({ taskEstimatedTime: Number.parseInt(e.target.value) || undefined })}
            placeholder="15"
            className="h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Require completion proof</span>
          <p className="text-xs text-muted-foreground">Screenshot or note before marking done</p>
        </div>
        <Switch
          checked={step.taskRequiresProof || false}
          onCheckedChange={(checked) => onUpdate({ taskRequiresProof: checked })}
        />
      </div>
    </div>
  )

  const renderLinkedInContent = () => (
    <div className="space-y-4">
      {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {step.stepType === "LINKEDIN_CONNECT" ? "Connection Note" : "LinkedIn Message"}
          </Label>
          <Textarea
            value={
              step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || ""
            }
            onChange={(e) =>
              onUpdate(
                step.stepType === "LINKEDIN_CONNECT"
                  ? { linkedInConnectionNote: e.target.value }
                  : { linkedInMessage: e.target.value },
              )
            }
            placeholder={
              step.stepType === "LINKEDIN_CONNECT"
                ? "Hi {{firstName}}, I'd love to connect..."
                : "Write your LinkedIn message..."
            }
            className="min-h-[150px] text-sm resize-none"
          />
          <p className="text-[10px] text-muted-foreground">
            {
              (step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || "")
                .length
            }
            /300 characters
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm">Safety limits</span>
          <p className="text-xs text-muted-foreground">Respect LinkedIn rate limits</p>
        </div>
        <Switch
          checked={step.linkedInSafetyLimits !== false}
          onCheckedChange={(checked) => onUpdate({ linkedInSafetyLimits: checked })}
        />
      </div>

      {step.stepType === "LINKEDIN_MESSAGE" && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Use InMail</span>
            <p className="text-xs text-muted-foreground">Use InMail credits if not connected</p>
          </div>
          <Switch
            checked={step.linkedInInMailEnabled || false}
            onCheckedChange={(checked) => onUpdate({ linkedInInMailEnabled: checked })}
          />
        </div>
      )}
    </div>
  )

  const renderABSplitContent = () => {
    const config = step.abSplitConfig || {
      branches: [],
      autoSelectWinner: true,
      winnerThreshold: 100,
      mergeAfter: true,
    }

   

    const addBranch = () => {
      const newBranch = {
        id: `${uniqueId}-branch-${config.branches.length}`,
        name: `Variant ${config.branches.length + 1}`,
        trafficPercent: 0,
        targetStepId: null,
        stats: { entered: 0, converted: 0 },
      }

      const newBranches = [...config.branches, newBranch]
      const equalPercent = Math.floor(100 / newBranches.length)
      const redistributed = newBranches.map((b, i) => ({
        ...b,
        trafficPercent: i === newBranches.length - 1 ? 100 - equalPercent * (newBranches.length - 1) : equalPercent,
      }))

      onUpdate({ abSplitConfig: { ...config, branches: redistributed } })
    }

    const removeBranch = (branchId: string) => {
      const newBranches = config.branches.filter((b) => b.id !== branchId)
      if (newBranches.length === 0) return

      const equalPercent = Math.floor(100 / newBranches.length)
      const redistributed = newBranches.map((b, i) => ({
        ...b,
        trafficPercent: i === newBranches.length - 1 ? 100 - equalPercent * (newBranches.length - 1) : equalPercent,
      }))

      onUpdate({ abSplitConfig: { ...config, branches: redistributed } })
    }

    const updateBranch = (branchId: string, updates: any) => {
      const updated = config.branches.map((b) => (b.id === branchId ? { ...b, ...updates } : b))
      onUpdate({ abSplitConfig: { ...config, branches: updated } })
    }

    const totalPercent = config.branches.reduce((sum, b) => sum + b.trafficPercent, 0)

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <Info className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">A/B Split Testing</p>
            <p className="text-xs">Split prospects into different paths to test which performs better.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Test Variants</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={addBranch}
              className="h-7 gap-1.5 px-2 bg-transparent"
              disabled={config.branches.length >= 5}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Variant
            </Button>
          </div>

          {config.branches.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No variants yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config.branches.map((branch, index) => {
                const conversionRate =
                  branch.stats.entered > 0 ? ((branch.stats.converted / branch.stats.entered) * 100).toFixed(1) : "0.0"

                return (
                  <Card key={branch.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
                          <Input
                            value={branch.name}
                            onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
                            className="h-7 w-32 text-sm"
                            placeholder="Variant name"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeBranch(branch.id)}
                          className="h-7 w-7 text-destructive"
                          disabled={config.branches.length <= 1}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Traffic %</Label>
                          <span className="text-xs font-mono">{branch.trafficPercent}%</span>
                        </div>
                        <Slider
                          value={[branch.trafficPercent]}
                          onValueChange={([val]) => updateBranch(branch.id, { trafficPercent: val })}
                          max={100}
                          step={5}
                        />
                      </div>
                      {branch.stats.entered > 0 && (
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                          <div>
                            <p className="text-[10px] text-muted-foreground">Entered</p>
                            <p className="text-sm font-semibold">{branch.stats.entered}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Converted</p>
                            <p className="text-sm font-semibold">{branch.stats.converted}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Rate</p>
                            <p className="text-sm font-semibold">{conversionRate}%</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {totalPercent !== 100 && config.branches.length > 0 && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              <p className="text-xs text-amber-600">Traffic must total 100% (currently {totalPercent}%)</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Auto-select winner</Label>
              <p className="text-xs text-muted-foreground">Automatically choose best performing variant</p>
            </div>
            <Switch
              checked={config.autoSelectWinner}
              onCheckedChange={(checked) => onUpdate({ abSplitConfig: { ...config, autoSelectWinner: checked } })}
            />
          </div>

          {config.autoSelectWinner && (
            <div className="space-y-2">
              <Label className="text-xs">Winner threshold (sends)</Label>
              <Input
                type="number"
                min={50}
                step={50}
                value={config.winnerThreshold}
                onChange={(e) =>
                  onUpdate({ abSplitConfig: { ...config, winnerThreshold: Number.parseInt(e.target.value) || 100 } })
                }
                className="h-8"
              />
              <p className="text-xs text-muted-foreground">
                After {config.winnerThreshold} total sends, best variant wins
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Merge paths after winner</Label>
              <p className="text-xs text-muted-foreground">All variants continue to same next step</p>
            </div>
            <Switch
              checked={config.mergeAfter}
              onCheckedChange={(checked) => onUpdate({ abSplitConfig: { ...config, mergeAfter: checked } })}
            />
          </div>
        </div>
      </div>
    )
  }

  const renderBehaviorBranchContent = () => {
    const config = step.behaviorBranchConfig || {
      branches: [],
      evaluationPeriodDays: 3,
      defaultBranchId: null,
    }

    const addBranch = () => {
      const newBranch = {
       id: `${uniqueId}-branch-${config.branches.length}`,
        name: `Path ${config.branches.length + 1}`,
        condition: "OPENED_EMAIL" as BehaviorCondition,
        daysToWait: 1,
        targetStepId: null,
        stats: { entered: 0, converted: 0 },
      }
      onUpdate({ behaviorBranchConfig: { ...config, branches: [...config.branches, newBranch] } })
    }

    const removeBranch = (branchId: string) => {
      const newBranches = config.branches.filter((b) => b.id !== branchId)
      const newDefaultId = config.defaultBranchId === branchId ? null : config.defaultBranchId
      onUpdate({ behaviorBranchConfig: { ...config, branches: newBranches, defaultBranchId: newDefaultId } })
    }

    const updateBranch = (branchId: string, updates: any) => {
      const updated = config.branches.map((b) => (b.id === branchId ? { ...b, ...updates } : b))
      onUpdate({ behaviorBranchConfig: { ...config, branches: updated } })
    }

    const conditionLabels: Record<BehaviorCondition, string> = {
      OPENED_EMAIL: "Opened email",
      NOT_OPENED: "Did not open",
      CLICKED_LINK: "Clicked link",
      NOT_CLICKED: "Did not click",
      NO_ACTION: "No action taken",
      REPLIED: "Replied",
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Behavior-Based Branching</p>
            <p className="text-xs">Send prospects down different paths based on their engagement.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Evaluation period</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={14}
              value={config.evaluationPeriodDays}
              onChange={(e) =>
                onUpdate({
                  behaviorBranchConfig: { ...config, evaluationPeriodDays: Number.parseInt(e.target.value) || 3 },
                })
              }
              className="h-8 w-20"
            />
            <span className="text-sm text-muted-foreground">days to wait before evaluating</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Behavior Paths</Label>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Behavior Paths</Label>
            <Button size="sm" variant="outline" onClick={addBranch} className="h-7 gap-1.5 px-2 bg-transparent">
              <Plus className="h-3.5 w-3.5" />
              Add Path
            </Button>
          </div>

          {config.branches.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No behavior paths yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config.branches.map((branch, index) => {
                const isDefault = config.defaultBranchId === branch.id
                const conversionRate =
                  branch.stats.entered > 0 ? ((branch.stats.converted / branch.stats.entered) * 100).toFixed(1) : "0.0"

                return (
                  <Card key={branch.id} className={cn(isDefault && "border-primary")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant={isDefault ? "default" : "outline"}>{index + 1}</Badge>
                          <Input
                            value={branch.name}
                            onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
                            className="h-7 flex-1 text-sm"
                            placeholder="Path name"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeBranch(branch.id)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">When prospect...</Label>
                        <Select
                          value={branch.condition}
                          onValueChange={(v) => updateBranch(branch.id, { condition: v as BehaviorCondition })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(conditionLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                        <span className="text-xs">Default fallback path</span>
                        <Switch
                          checked={isDefault}
                          onCheckedChange={(checked) =>
                            onUpdate({
                              behaviorBranchConfig: { ...config, defaultBranchId: checked ? branch.id : null },
                            })
                          }
                        />
                      </div>
                      {branch.stats.entered > 0 && (
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                          <div>
                            <p className="text-[10px] text-muted-foreground">Entered</p>
                            <p className="text-sm font-semibold">{branch.stats.entered}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Converted</p>
                            <p className="text-sm font-semibold">{branch.stats.converted}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Rate</p>
                            <p className="text-sm font-semibold">{conversionRate}%</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {!config.defaultBranchId && config.branches.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-xs text-amber-600">Set a default path for prospects who don't match any condition</p>
          </div>
        )}
      </div>
    )
  }

  // ============================================
  // RANDOM_VARIANT Configuration
  // ============================================
  const renderRandomVariantContent = () => {
    const config = step.randomVariantConfig || {
      variants: [],
      variationType: "subject",
    }

    const addVariant = () => {
      const newVariant = {
       id: `${uniqueId}-variant-${config.variants.length}`,
        content: "",
        usageCount: 0,
      }
      onUpdate({ randomVariantConfig: { ...config, variants: [...config.variants, newVariant] } })
    }

    const removeVariant = (variantId: string) => {
      const newVariants = config.variants.filter((v) => v.id !== variantId)
      onUpdate({ randomVariantConfig: { ...config, variants: newVariants } })
    }

    const updateVariant = (variantId: string, content: string) => {
      const updated = config.variants.map((v) => (v.id === variantId ? { ...v, content } : v))
      onUpdate({ randomVariantConfig: { ...config, variants: updated } })
    }

    const typeLabels = {
      subject: "Subject Lines",
      opening: "Opening Lines",
      signoff: "Email Sign-offs",
      full_email: "Full Email Bodies",
    }

    const placeholders = {
      subject: "Re: Quick question about {{company}}",
      opening: "Hi {{firstName}}, I noticed...",
      signoff: "Looking forward to hearing from you!",
      full_email: "Full email body with personalization...",
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20">
          <Info className="h-4 w-4 text-fuchsia-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Random Variation</p>
            <p className="text-xs">
              Add natural variation to avoid spam filters. One variant is randomly selected per prospect.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">What to vary</Label>
          <Select
            value={config.variationType}
            onValueChange={(v) =>
              onUpdate({ randomVariantConfig: { ...config, variationType: v as typeof config.variationType } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subject">Subject Lines</SelectItem>
              <SelectItem value="opening">Opening Lines</SelectItem>
              <SelectItem value="signoff">Email Sign-offs</SelectItem>
              <SelectItem value="full_email">Full Email Bodies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium">{typeLabels[config.variationType]}</Label>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{typeLabels[config.variationType]}</Label>
            <Button size="sm" variant="outline" onClick={addVariant} className="h-7 gap-1.5 px-2 bg-transparent">
              <Plus className="h-3.5 w-3.5" />
              Add Variant
            </Button>
          </div>

          {config.variants.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              <Shuffle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No variants yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config.variants.map((variant, index) => (
                <Card key={variant.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Variant {index + 1}</Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeVariant(variant.id)}
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {config.variationType === "full_email" ? (
                        <Textarea
                          value={variant.content}
                          onChange={(e) => updateVariant(variant.id, e.target.value)}
                          placeholder={placeholders[config.variationType]}
                          className="min-h-[100px] text-sm font-mono"
                        />
                      ) : (
                        <Input
                          value={variant.content}
                          onChange={(e) => updateVariant(variant.id, e.target.value)}
                          placeholder={placeholders[config.variationType]}
                          className="text-sm"
                        />
                      )}
                      {variant.usageCount > 0 && (
                        <p className="text-xs text-muted-foreground">Used {variant.usageCount} times</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {config.variants.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <Shuffle className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Each prospect randomly receives one of these {config.variants.length} variants
            </p>
          </div>
        )}
      </div>
    )
  }

  // ============================================
  // CONTENT_REFERENCE Configuration
  // ============================================
  const renderContentReferenceContent = () => {
    const config = step.contentReferenceConfig || {
      resourceType: "blog",
      resourceUrl: "",
      resourceTitle: "",
      trackingEnabled: true,
      followUpTriggers: {
        onClicked: null,
        onDownloaded: null,
        onTimeSpent: null,
      },
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-500/5 border border-teal-500/20">
          <Info className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Content Reference</p>
            <p className="text-xs">Share content and track engagement. Trigger follow-ups based on interactions.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Resource Type</Label>
          <Select
            value={config.resourceType}
            onValueChange={(v) =>
              onUpdate({ contentReferenceConfig: { ...config, resourceType: v as typeof config.resourceType } })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog Post</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="case_study">Case Study</SelectItem>
              <SelectItem value="whitepaper">Whitepaper</SelectItem>
              <SelectItem value="custom">Custom Resource</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Resource Title</Label>
          <Input
            value={config.resourceTitle}
            onChange={(e) => onUpdate({ contentReferenceConfig: { ...config, resourceTitle: e.target.value } })}
            placeholder="How to 10x Your Sales Pipeline"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Resource URL</Label>
          <Input
            value={config.resourceUrl}
            onChange={(e) => onUpdate({ contentReferenceConfig: { ...config, resourceUrl: e.target.value } })}
            placeholder="https://example.com/resource"
            className="text-sm"
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Track engagement</Label>
            <p className="text-xs text-muted-foreground">Monitor clicks, downloads, and time spent</p>
          </div>
          <Switch
            checked={config.trackingEnabled}
            onCheckedChange={(checked) => onUpdate({ contentReferenceConfig: { ...config, trackingEnabled: checked } })}
          />
        </div>

        {config.trackingEnabled && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Follow-up Triggers</Label>

              <div className="space-y-2">
                <Label className="text-xs">When content is clicked</Label>
                <Select
                  value={config.followUpTriggers.onClicked || "none"}
                  onValueChange={(v) =>
                    onUpdate({
                      contentReferenceConfig: {
                        ...config,
                        followUpTriggers: { ...config.followUpTriggers, onClicked: v === "none" ? null : v },
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No action</SelectItem>
                    <SelectItem value="next_step">Continue to next step</SelectItem>
                    <SelectItem value="high_interest">Mark as high interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">When content is downloaded</Label>
                <Select
                  value={config.followUpTriggers.onDownloaded || "none"}
                  onValueChange={(v) =>
                    onUpdate({
                      contentReferenceConfig: {
                        ...config,
                        followUpTriggers: { ...config.followUpTriggers, onDownloaded: v === "none" ? null : v },
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No action</SelectItem>
                    <SelectItem value="send_followup">Send follow-up email</SelectItem>
                    <SelectItem value="notify_sales">Notify sales rep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">When time threshold reached</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={30}
                    step={30}
                    value={config.followUpTriggers.onTimeSpent?.seconds || 120}
                    onChange={(e) =>
                      onUpdate({
                        contentReferenceConfig: {
                          ...config,
                          followUpTriggers: {
                            ...config.followUpTriggers,
                            onTimeSpent: { seconds: Number.parseInt(e.target.value) || 120, stepId: "" },
                          },
                        },
                      })
                    }
                    className="h-8 w-24"
                    placeholder="120"
                  />
                  <span className="text-xs text-muted-foreground flex items-center">seconds</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // ============================================
  // VOICEMAIL_DROP Configuration
  // ============================================
  const renderVoicemailDropContent = () => {
    const config = step.voicemailDropConfig || {
      audioUrl: null,
      ttsMessage: null,
      useTts: true,
      personalizeWithVariables: true,
      integrationId: null,
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
          <Info className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Ringless Voicemail Drop</p>
            <p className="text-xs">Leave voicemail without ringing the phone. Requires integration setup.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Message Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={config.useTts ? "default" : "outline"}
              className="h-auto py-3 flex-col items-start"
              onClick={() => onUpdate({ voicemailDropConfig: { ...config, useTts: true, audioUrl: null } })}
            >
              <Voicemail className="h-5 w-5 mb-2" />
              <div className="text-left">
                <p className="font-medium text-sm">Text-to-Speech</p>
                <p className="text-xs opacity-80">AI voice reads message</p>
              </div>
            </Button>
            <Button
              variant={!config.useTts ? "default" : "outline"}
              className="h-auto py-3 flex-col items-start"
              onClick={() => onUpdate({ voicemailDropConfig: { ...config, useTts: false, ttsMessage: null } })}
            >
              <Phone className="h-5 w-5 mb-2" />
              <div className="text-left">
                <p className="font-medium text-sm">Pre-recorded</p>
                <p className="text-xs opacity-80">Upload audio file</p>
              </div>
            </Button>
          </div>
        </div>

        {config.useTts ? (
          <div className="space-y-2">
            <Label className="text-sm">Voicemail Message</Label>
            <Textarea
              value={config.ttsMessage || ""}
              onChange={(e) => onUpdate({ voicemailDropConfig: { ...config, ttsMessage: e.target.value } })}
              placeholder="Hi {{firstName}}, this is John from Acme Corp. I wanted to reach out about..."
              className="min-h-[120px] text-sm"
            />
            <p className="text-xs text-muted-foreground">Message will be read by AI voice. Keep it under 30 seconds.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-sm">Audio File URL</Label>
            <Input
              value={config.audioUrl || ""}
              onChange={(e) => onUpdate({ voicemailDropConfig: { ...config, audioUrl: e.target.value } })}
              placeholder="https://example.com/voicemail.mp3"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Upload your pre-recorded voicemail (MP3, WAV). Max 30 seconds.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Personalize with variables</Label>
            {/* <p className="text-xs text-muted-foreground">Use {{firstName}}, {{company}}, etc.</p> */}
          </div>
          <Switch
            checked={config.personalizeWithVariables}
            onCheckedChange={(checked) =>
              onUpdate({ voicemailDropConfig: { ...config, personalizeWithVariables: checked } })
            }
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm">Integration</Label>
          <Select
            value={config.integrationId || "none"}
            onValueChange={(v) =>
              onUpdate({ voicemailDropConfig: { ...config, integrationId: v === "none" ? null : v } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select integration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No integration connected</SelectItem>
              <SelectItem value="slybroadcast">Slybroadcast</SelectItem>
              <SelectItem value="ringlessvoicemail">RinglessVoicemail.com</SelectItem>
              <SelectItem value="drop_cowboy">Drop Cowboy</SelectItem>
            </SelectContent>
          </Select>
          {!config.integrationId && (
            <p className="text-xs text-amber-600">⚠️ Connect an integration to use voicemail drops</p>
          )}
        </div>
      </div>
    )
  }

  // ============================================
  // DIRECT_MAIL Configuration
  // ============================================
  const renderDirectMailContent = () => {
    const config = step.directMailConfig || {
      mailType: "postcard",
      message: "",
      integrationId: null,
      useProspectAddress: true,
      followUpEmailEnabled: true,
      followUpDelay: 3,
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
          <Info className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Direct Mail Campaign</p>
            <p className="text-xs">Send physical mail to prospects. Stands out in a digital world.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Mail Type</Label>
          <Select
            value={config.mailType}
            onValueChange={(v) => onUpdate({ directMailConfig: { ...config, mailType: v as typeof config.mailType } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postcard">Postcard</SelectItem>
              <SelectItem value="handwritten_note">Handwritten Note</SelectItem>
              <SelectItem value="lumpy_mail">Lumpy Mail (Gift)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {config.mailType === "postcard" && "Standard 4x6 or 6x9 postcard"}
            {config.mailType === "handwritten_note" && "Personal handwritten card in envelope"}
            {config.mailType === "lumpy_mail" && "Package with small gift or dimensional item"}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Message</Label>
          <Textarea
            value={config.message}
            onChange={(e) => onUpdate({ directMailConfig: { ...config, message: e.target.value } })}
            placeholder="Hi {{firstName}},

I wanted to send you something memorable...

Best regards,
{{senderName}}"
            className="min-h-[120px] text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {/* Use {{firstName}}, {{company}}, and other variables for personalization */}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Use prospect's address</Label>
            <p className="text-xs text-muted-foreground">Send to address in prospect record</p>
          </div>
          <Switch
            checked={config.useProspectAddress}
            onCheckedChange={(checked) => onUpdate({ directMailConfig: { ...config, useProspectAddress: checked } })}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Email follow-up</Label>
              <p className="text-xs text-muted-foreground">Send email after mail is delivered</p>
            </div>
            <Switch
              checked={config.followUpEmailEnabled}
              onCheckedChange={(checked) =>
                onUpdate({ directMailConfig: { ...config, followUpEmailEnabled: checked } })
              }
            />
          </div>

          {config.followUpEmailEnabled && (
            <div className="space-y-2">
              <Label className="text-xs">Follow-up delay (days after delivery)</Label>
              <Input
                type="number"
                min={1}
                max={14}
                value={config.followUpDelay}
                onChange={(e) =>
                  onUpdate({ directMailConfig: { ...config, followUpDelay: Number.parseInt(e.target.value) || 3 } })
                }
                className="h-8 w-20"
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm">Integration</Label>
          <Select
            value={config.integrationId || "none"}
            onValueChange={(v) => onUpdate({ directMailConfig: { ...config, integrationId: v === "none" ? null : v } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select integration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No integration connected</SelectItem>
              <SelectItem value="lob">Lob</SelectItem>
              <SelectItem value="postpilot">PostPilot</SelectItem>
              <SelectItem value="reachdesk">Reachdesk</SelectItem>
              <SelectItem value="sendoso">Sendoso</SelectItem>
            </SelectContent>
          </Select>
          {!config.integrationId && (
            <p className="text-xs text-amber-600">⚠️ Connect an integration to send direct mail</p>
          )}
        </div>

        {config.mailType === "lumpy_mail" && (
          <div className="p-3 rounded-lg bg-muted border">
            <p className="text-xs text-muted-foreground">
              💡 Popular lumpy mail ideas: branded mug, book, USB drive, stress ball, or local treat
            </p>
          </div>
        )}
      </div>
    )
  }

  // ============================================
  // MULTI_CHANNEL_TOUCH Configuration
  // ============================================
  const renderMultiChannelContent = () => {
    const config = step.multiChannelConfig || {
      touches: [],
      executeSimultaneously: false,
      delayBetweenTouches: 60,
    }

    const addTouch = (type: MultiChannelTouch["type"]) => {
      const newTouch: MultiChannelTouch = {
       id: `${uniqueId}-touch-${config.touches.length}`,
        type,
        order: config.touches.length,
        delayFromPrevious: 0,
        config: {},
      }
      onUpdate({ multiChannelConfig: { ...config, touches: [...config.touches, newTouch] } })
    }

    const removeTouch = (touchId: string) => {
      const newTouches = config.touches.filter((t) => t.id !== touchId).map((t, i) => ({ ...t, order: i }))
      onUpdate({ multiChannelConfig: { ...config, touches: newTouches } })
    }

    const touchIcons = {
      EMAIL: Mail,
      LINKEDIN_VIEW: Linkedin,
      LINKEDIN_CONNECT: Linkedin,
      LINKEDIN_MESSAGE: Linkedin,
      CALL: Phone,
    }

    const touchLabels = {
      EMAIL: "Email",
      LINKEDIN_VIEW: "LinkedIn View",
      LINKEDIN_CONNECT: "LinkedIn Connect",
      LINKEDIN_MESSAGE: "LinkedIn Message",
      CALL: "Call Task",
    }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
          <Info className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Multi-Channel Touch</p>
            <p className="text-xs">Reach prospects across multiple channels in coordinated sequence.</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Execute simultaneously</Label>
            <p className="text-xs text-muted-foreground">Send all touches at once vs. staggered</p>
          </div>
          <Switch
            checked={config.executeSimultaneously}
            onCheckedChange={(checked) =>
              onUpdate({ multiChannelConfig: { ...config, executeSimultaneously: checked } })
            }
          />
        </div>

        {!config.executeSimultaneously && (
          <div className="space-y-2">
            <Label className="text-xs">Delay between touches (minutes)</Label>
            <Input
              type="number"
              min={15}
              step={15}
              value={config.delayBetweenTouches}
              onChange={(e) =>
                onUpdate({
                  multiChannelConfig: { ...config, delayBetweenTouches: Number.parseInt(e.target.value) || 60 },
                })
              }
              className="h-8 w-24"
            />
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Channel Touches</Label>

          {config.touches.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No touches configured</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config.touches.map((touch, index) => {
                const Icon = touchIcons[touch.type]
                return (
                  <Card key={touch.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{index + 1}</Badge>
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{touchLabels[touch.type]}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeTouch(touch.id)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => addTouch("EMAIL")} className="h-8 gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Add Email
            </Button>
            <Button size="sm" variant="outline" onClick={() => addTouch("LINKEDIN_VIEW")} className="h-8 gap-1.5">
              <Linkedin className="h-3.5 w-3.5" />
              Add LinkedIn
            </Button>
            <Button size="sm" variant="outline" onClick={() => addTouch("CALL")} className="h-8 gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Add Call
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Continuation of CONDITION Configuration
  const renderConditionContent = () => {
    const conditions = step.conditions || { sendIf: {}, logicOperator: "AND" }

    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <Info className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Conditional Logic</p>
            <p className="text-xs">Only proceed if prospect meets certain conditions.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Condition Rules</Label>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm">Has not opened previous email</span>
            <Switch
              checked={conditions.sendIf?.notOpened || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, notOpened: checked } },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm">Has not replied</span>
            <Switch
              checked={conditions.sendIf?.notReplied || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, notReplied: checked } },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm">Has not clicked any link</span>
            <Switch
              checked={conditions.sendIf?.notClicked || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, notClicked: checked } },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm">Has opened previous email</span>
            <Switch
              checked={conditions.sendIf?.hasOpened || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, hasOpened: checked } },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm">Has clicked a link</span>
            <Switch
              checked={conditions.sendIf?.hasClicked || false}
              onCheckedChange={(checked) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, hasClicked: checked } },
                })
              }
            />
          </div>

          <div className="space-y-2 p-3 rounded-lg border">
            <Label className="text-xs">Job title contains</Label>
            <Input
              value={conditions.sendIf?.jobTitleContains || ""}
              onChange={(e) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, jobTitleContains: e.target.value } },
                })
              }
              placeholder="VP, Director, Manager"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2 p-3 rounded-lg border">
            <Label className="text-xs">Company size greater than</Label>
            <Input
              type="number"
              value={conditions.sendIf?.companySizeGreaterThan || ""}
              onChange={(e) =>
                onUpdate({
                  conditions: {
                    ...conditions,
                    sendIf: { ...conditions.sendIf, companySizeGreaterThan: Number.parseInt(e.target.value) },
                  },
                })
              }
              placeholder="50"
              className="h-8 w-32"
            />
          </div>

          <div className="space-y-2 p-3 rounded-lg border">
            <Label className="text-xs">Lead score greater than</Label>
            <Input
              type="number"
              value={conditions.sendIf?.leadScoreGreaterThan || ""}
              onChange={(e) =>
                onUpdate({
                  conditions: {
                    ...conditions,
                    sendIf: { ...conditions.sendIf, leadScoreGreaterThan: Number.parseInt(e.target.value) },
                  },
                })
              }
              placeholder="70"
              className="h-8 w-32"
            />
          </div>

          <div className="space-y-2 p-3 rounded-lg border">
            <Label className="text-xs">CRM stage equals</Label>
            <Input
              value={conditions.sendIf?.crmStageEquals || ""}
              onChange={(e) =>
                onUpdate({
                  conditions: { ...conditions, sendIf: { ...conditions.sendIf, crmStageEquals: e.target.value } },
                })
              }
              placeholder="Qualified Lead"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2 p-3 rounded-lg border">
            <Label className="text-xs">Days in current step</Label>
            <Input
              type="number"
              value={conditions.sendIf?.daysInStep || ""}
              onChange={(e) =>
                onUpdate({
                  conditions: {
                    ...conditions,
                    sendIf: { ...conditions.sendIf, daysInStep: Number.parseInt(e.target.value) },
                  },
                })
              }
              placeholder="3"
              className="h-8 w-32"
            />
            <p className="text-xs text-muted-foreground">Only proceed after this many days</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm">Logic Operator</Label>
          <Select
            value={conditions.logicOperator}
            onValueChange={(v) => onUpdate({ conditions: { ...conditions, logicOperator: v as "AND" | "OR" } })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">Match ALL conditions (AND)</SelectItem>
              <SelectItem value="OR">Match ANY condition (OR)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {conditions.logicOperator === "AND"
              ? "Prospect must meet all selected conditions"
              : "Prospect must meet at least one condition"}
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // UPDATE THE MAIN renderStepContent() FUNCTION
  // Add these cases to your switch statement:
  // ============================================

  const renderStepContent = () => {
    switch (step.stepType) {
      case "EMAIL":
        return renderEmailContent()
      case "DELAY":
        return renderDelayContent()
      case "WAIT_UNTIL":
        return renderWaitUntilContent()
      case "EXIT_TRIGGER":
        return renderExitTriggerContent()
      case "MANUAL_REVIEW":
        return renderManualReviewContent()
      case "CALL":
        return renderCallContent()
      case "TASK":
        return renderTaskContent()
      case "LINKEDIN_VIEW":
      case "LINKEDIN_CONNECT":
      case "LINKEDIN_MESSAGE":
        return renderLinkedInContent()

      // NEW IMPLEMENTATIONS
      case "AB_SPLIT":
        return renderABSplitContent()
      case "BEHAVIOR_BRANCH":
        return renderBehaviorBranchContent()
      case "RANDOM_VARIANT":
        return renderRandomVariantContent()
      case "CONTENT_REFERENCE":
        return renderContentReferenceContent()
      case "VOICEMAIL_DROP":
        return renderVoicemailDropContent()
      case "DIRECT_MAIL":
        return renderDirectMailContent()
      case "MULTI_CHANNEL_TOUCH":
        return renderMultiChannelContent()
      case "CONDITION":
        return renderConditionContent()

      default:
        return <p className="text-sm text-muted-foreground">Configuration for {step.stepType} coming soon.</p>
    }
  }

  // ============================================
  // ADDITIONAL ICON MAPPINGS
  // Add these to your header rendering section where you map icons:
  // ============================================

  const getStepIcon = (stepType: StepType) => {
    switch (stepType) {
      case "EMAIL":
        return <Mail className={cn("h-4 w-4", config.color)} />
      case "DELAY":
        return <Clock className={cn("h-4 w-4", config.color)} />
      case "WAIT_UNTIL":
        return <Timer className={cn("h-4 w-4", config.color)} />
      case "EXIT_TRIGGER":
        return <LogOut className={cn("h-4 w-4", config.color)} />
      case "MANUAL_REVIEW":
        return <UserCheck className={cn("h-4 w-4", config.color)} />
      case "CALL":
        return <Phone className={cn("h-4 w-4", config.color)} />
      case "TASK":
        return <CheckSquare className={cn("h-4 w-4", config.color)} />
      case "LINKEDIN_VIEW":
      case "LINKEDIN_CONNECT":
      case "LINKEDIN_MESSAGE":
        return <Linkedin className={cn("h-4 w-4", config.color)} />
      case "AB_SPLIT":
        return <TestTube className={cn("h-4 w-4", config.color)} />
      case "BEHAVIOR_BRANCH":
        return <GitBranch className={cn("h-4 w-4", config.color)} />
      case "RANDOM_VARIANT":
        return <Shuffle className={cn("h-4 w-4", config.color)} />
      case "CONTENT_REFERENCE":
        return <FileText className={cn("h-4 w-4", config.color)} />
      case "VOICEMAIL_DROP":
        return <Voicemail className={cn("h-4 w-4", config.color)} />
      case "DIRECT_MAIL":
        return <MailOpen className={cn("h-4 w-4", config.color)} />
      case "MULTI_CHANNEL_TOUCH":
        return <Zap className={cn("h-4 w-4", config.color)} />
      case "CONDITION":
        return <Target className={cn("h-4 w-4", config.color)} />
      default:
        return <Settings2 className={cn("h-4 w-4", config.color)} />
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6 max-h-[90vh] overflow-y-auto">{renderStepContent()}</div>
       {showEmailComposer && (
      <EmailComposerClient
        step={step}
        userId={userId}
        onSave={handleEmailComposerSave}
        onClose={() => setShowEmailComposer(false)}
      />
    )}
    </TooltipProvider>
  )
}

// "use client"

// import * as React from "react"
// import {
//   Mail,
//   Clock,
//   Trash2,
//   ChevronDown,
//   Variable,
//   Linkedin,
//   Phone,
//   CheckSquare,
//   Settings2,
//   TestTube,
//   User,
//   Building2,
//   Briefcase,
//   AtSign,
//   Hash,
//   Plus,
//   AlertTriangle,
//   Timer,
//   LogOut,
//   UserCheck,
//   Info,
//   Wand2,
//   GitBranch,
//   Shuffle,
//   FileText,
//   Voicemail,
//   MailOpen,
//   Zap,
//   Target,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { Separator } from "@/components/ui/separator"
// import { Badge } from "@/components/ui/badge"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Slider } from "@/components/ui/slider"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type {
//   SequenceStep,
//   SequenceStepVariant,
//   WaitConditionType,
//   WaitFallbackAction,
//   ExitCondition,
//   CallOutcome,
//   BehaviorCondition,
//   StepType,
//   MultiChannelTouch,
// } from "@/lib/types/sequence"
// import { STEP_TYPE_CONFIG } from "@/lib/types/sequence"
// import { EmailBodyPreview } from "@/components/templates/email-body-preview"

// interface SequenceStepPanelProps {
//   step: SequenceStep
//   sequenceId: string
//   userId: string
//   onUpdate: (updates: Partial<SequenceStep>) => void
//   onClose: () => void
//   onDelete: () => void
// }

// let idCounter = 0
// const generateUniqueId = (prefix: string, sequenceId?: string) => {
//   idCounter++
//   return sequenceId ? `${prefix}_${sequenceId}_${idCounter}` : `${prefix}_${idCounter}`
// }

// const PERSONALIZATION_VARIABLES = {
//   prospect: {
//     label: "Prospect",
//     icon: User,
//     variables: [
//       { key: "firstName", label: "First Name", fallback: "there" },
//       { key: "lastName", label: "Last Name", fallback: "" },
//       { key: "fullName", label: "Full Name", fallback: "there" },
//       { key: "email", label: "Email", fallback: "" },
//       { key: "phoneNumber", label: "Phone", fallback: "" },
//     ],
//   },
//   company: {
//     label: "Company",
//     icon: Building2,
//     variables: [
//       { key: "company", label: "Company Name", fallback: "your company" },
//       { key: "industry", label: "Industry", fallback: "" },
//       { key: "companySize", label: "Company Size", fallback: "" },
//       { key: "websiteUrl", label: "Website", fallback: "" },
//     ],
//   },
//   job: {
//     label: "Job Info",
//     icon: Briefcase,
//     variables: [
//       { key: "jobTitle", label: "Job Title", fallback: "" },
//       { key: "department", label: "Department", fallback: "" },
//     ],
//   },
//   sender: {
//     label: "Sender",
//     icon: AtSign,
//     variables: [
//       { key: "senderName", label: "Your Name", fallback: "" },
//       { key: "senderCompany", label: "Your Company", fallback: "" },
//       { key: "senderTitle", label: "Your Title", fallback: "" },
//     ],
//   },
//   custom: {
//     label: "Custom",
//     icon: Hash,
//     variables: [
//       { key: "customField1", label: "Custom Field 1", fallback: "" },
//       { key: "customField2", label: "Custom Field 2", fallback: "" },
//     ],
//   },
// }

// export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
//   const { toast } = useToast()

//   const config = STEP_TYPE_CONFIG[step.stepType]
//   const [activeTab, setActiveTab] = React.useState("content")
//   const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
//   const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])
//   const [activeField, setActiveField] = React.useState<"subject" | "body" | null>(null)
//   const [showEmailComposer, setShowEmailComposer] = React.useState(false)

//   const subjectRef = React.useRef<HTMLInputElement>(null)
//   const bodyRef = React.useRef<HTMLTextAreaElement>(null)

//   React.useEffect(() => {
//     setVariants(step.variants || [])
//   }, [step.variants])

//   const insertVariable = (variable: string, field: "subject" | "body") => {
//     const targetRef = field === "subject" ? subjectRef : bodyRef
//     const target = targetRef.current
//     if (!target) return

//     const start = target.selectionStart || 0
//     const end = target.selectionEnd || 0
//     const currentValue = target.value
//     const variableText = `{{${variable}}}`
//     const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

//     if (field === "subject") {
//       onUpdate({ subject: newValue })
//     } else {
//       onUpdate({ body: newValue })
//     }

//     setTimeout(() => {
//       target.focus()
//       target.setSelectionRange(start + variableText.length, start + variableText.length)
//     }, 0)
//   }

//   const handleVariantsChange = (newVariants: SequenceStepVariant[]) => {
//     setVariants(newVariants)
//     onUpdate({ variants: newVariants })
//   }

//   const handleEmailComposerSave = (subject: string, body: string) => {
//     onUpdate({ subject, body })
//     setShowEmailComposer(false)
//     toast({ title: "Email content updated" })
//   }

//   const getSpamScore = () => {
//     let score = 0
//     const body = step.body?.toLowerCase() || ""
//     const subject = step.subject?.toLowerCase() || ""

//     const spamTriggers = ["free", "act now", "limited time", "click here", "urgent", "guarantee", "winner"]
//     spamTriggers.forEach((trigger) => {
//       if (body.includes(trigger) || subject.includes(trigger)) score += 2
//     })

//     if (subject.toUpperCase() === subject && subject.length > 5) score += 2
//     if (body.includes("!!!") || subject.includes("!!!")) score += 1

//     return Math.min(score, 10)
//   }

//   const getWordCount = () => {
//     return (step.body || "").split(/\s+/).filter(Boolean).length
//   }

//   const VariableQuickInsert = ({ field }: { field: "subject" | "body" }) => (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="h-7 gap-1.5 px-2 text-xs shadow-sm border-border/60 hover:bg-muted/80 bg-transparent"
//         >
//           <Variable className="h-3.5 w-3.5" />
//           Insert Variable
//           <ChevronDown className="h-3 w-3 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-80 p-0 shadow-lg border-border/60" align="end" sideOffset={4}>
//         <div className="p-3 border-b bg-muted/30">
//           <h4 className="font-medium text-sm">Personalization Variables</h4>
//           <p className="text-xs text-muted-foreground mt-0.5">Click to insert at cursor position</p>
//         </div>
//         <ScrollArea className="h-72">
//           <div className="p-2">
//             {Object.entries(PERSONALIZATION_VARIABLES).map(([categoryKey, category]) => {
//               const CategoryIcon = category.icon
//               return (
//                 <div key={categoryKey} className="mb-3 last:mb-0">
//                   <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                     <CategoryIcon className="h-3.5 w-3.5" />
//                     {category.label}
//                   </div>
//                   <div className="space-y-0.5">
//                     {category.variables.map((v) => (
//                       <button
//                         key={v.key}
//                         className="w-full flex items-center justify-between px-3 py-2 text-left rounded-md hover:bg-muted/80 transition-colors group"
//                         onClick={() => insertVariable(v.key, field)}
//                       >
//                         <div className="flex items-center gap-2">
//                           <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-mono">
//                             {`{{${v.key}}}`}
//                           </code>
//                           <span className="text-sm text-muted-foreground">{v.label}</span>
//                         </div>
//                         <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </ScrollArea>
//       </PopoverContent>
//     </Popover>
//   )

//   const renderEmailContent = () => {
//     const spamScore = getSpamScore()
//     const wordCount = getWordCount()
//     const isWordCountGood = wordCount >= 50 && wordCount <= 125
//     const hasHtmlContent = /<[^>]+>/.test(step.body || "")

//     return (
//       <>
//         <div className="flex gap-2 mb-4">
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <div
//                 className={cn(
//                   "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
//                   spamScore <= 3
//                     ? "bg-green-500/10 text-green-600"
//                     : spamScore <= 6
//                       ? "bg-amber-500/10 text-amber-600"
//                       : "bg-red-500/10 text-red-600",
//                 )}
//               >
//                 <AlertTriangle className="h-3 w-3" />
//                 Spam: {spamScore}/10
//               </div>
//             </TooltipTrigger>
//             <TooltipContent>
//               {spamScore <= 3
//                 ? "Good - Low spam risk"
//                 : spamScore <= 6
//                   ? "Fair - Some spam triggers detected"
//                   : "Poor - High spam risk"}
//             </TooltipContent>
//           </Tooltip>

//           <div
//             className={cn(
//               "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
//               isWordCountGood ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600",
//             )}
//           >
//             {wordCount} words
//           </div>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Pre-header Text</Label>
//             <Tooltip>
//               <TooltipTrigger>
//                 <Info className="h-3.5 w-3.5 text-muted-foreground" />
//               </TooltipTrigger>
//               <TooltipContent className="max-w-xs">Preview text shown in inbox before opening</TooltipContent>
//             </Tooltip>
//           </div>
//           <Input
//             value={step.preHeaderText || ""}
//             onChange={(e) => onUpdate({ preHeaderText: e.target.value })}
//             placeholder="Preview text..."
//             className="text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
//             <VariableQuickInsert field="subject" />
//           </div>
//           <Input
//             ref={subjectRef}
//             value={step.subject || ""}
//             onChange={(e) => onUpdate({ subject: e.target.value })}
//             onFocus={() => setActiveField("subject")}
//             placeholder="Enter subject line..."
//             className="text-sm"
//           />
//           <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
//             <VariableQuickInsert field="body" />
//           </div>

//           {hasHtmlContent ? (
//             <EmailBodyPreview htmlContent={step.body || ""} onOpenEditor={() => setShowEmailComposer(true)} />
//           ) : (
//             <>
//               <div className="flex justify-end mb-1">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-7 gap-1.5 px-2 text-xs shadow-sm bg-transparent"
//                   onClick={() => setShowEmailComposer(true)}
//                 >
//                   <Wand2 className="h-3.5 w-3.5" />
//                   Use Rich Editor
//                 </Button>
//               </div>
//               <Textarea
//                 ref={bodyRef}
//                 value={step.body || ""}
//                 onChange={(e) => onUpdate({ body: e.target.value })}
//                 onFocus={() => setActiveField("body")}
//                 placeholder="Write your email content..."
//                 className="min-h-[200px] text-sm resize-none font-mono"
//               />
//             </>
//           )}

//           <div className="flex items-center justify-between">
//             <p className="text-[10px] text-muted-foreground">{(step.body || "").length} characters</p>
//             <p className="text-[10px] text-muted-foreground">
//               {((step.body || "").match(/\{\{[^}]+\}\}/g) || []).length} variables used
//             </p>
//           </div>
//         </div>

//         <Collapsible>
//           <CollapsibleTrigger asChild>
//             <Button variant="ghost" className="w-full justify-between h-8 text-xs">
//               Advanced email settings
//               <ChevronDown className="h-3 w-3" />
//             </Button>
//           </CollapsibleTrigger>
//           <CollapsibleContent className="space-y-3 pt-2">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1">
//                 <Label className="text-xs">Custom From Name</Label>
//                 <Input
//                   value={step.customFromName || ""}
//                   onChange={(e) => onUpdate({ customFromName: e.target.value })}
//                   placeholder="Your Name"
//                   className="h-8 text-xs"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <Label className="text-xs">Reply-to Address</Label>
//                 <Input
//                   value={step.replyToAddress || ""}
//                   onChange={(e) => onUpdate({ replyToAddress: e.target.value })}
//                   placeholder="reply@example.com"
//                   className="h-8 text-xs"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-sm">AI Optimize Send Time</span>
//               <Switch
//                 checked={step.aiOptimizeSendTime || false}
//                 onCheckedChange={(checked) => onUpdate({ aiOptimizeSendTime: checked })}
//               />
//             </div>
//           </CollapsibleContent>
//         </Collapsible>
//       </>
//     )
//   }

//   const renderDelayContent = () => (
//     <>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm">Business days only</span>
//           <Switch
//             checked={step.businessDaysOnly || false}
//             onCheckedChange={(checked) => onUpdate({ businessDaysOnly: checked })}
//           />
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-sm">Randomize delay</span>
//             <p className="text-xs text-muted-foreground">Add natural variation</p>
//           </div>
//           <Switch
//             checked={step.randomizeDelay || false}
//             onCheckedChange={(checked) => onUpdate({ randomizeDelay: checked })}
//           />
//         </div>

//         {step.randomizeDelay && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label className="text-xs">Min delay</Label>
//               <Input
//                 type="number"
//                 min={1}
//                 value={step.delayRandomMin || step.delayValue}
//                 onChange={(e) => onUpdate({ delayRandomMin: Number.parseInt(e.target.value) || 1 })}
//                 className="h-8"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs">Max delay</Label>
//               <Input
//                 type="number"
//                 min={1}
//                 value={step.delayRandomMax || step.delayValue + 1}
//                 onChange={(e) => onUpdate({ delayRandomMax: Number.parseInt(e.target.value) || 2 })}
//                 className="h-8"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-2">
//           <Label className="text-xs">Send at specific time</Label>
//           <Input
//             type="time"
//             value={step.sendAtTime || ""}
//             onChange={(e) => onUpdate({ sendAtTime: e.target.value })}
//             className="h-8"
//           />
//           <p className="text-xs text-muted-foreground">Leave empty to send anytime during business hours</p>
//         </div>
//       </div>
//     </>
//   )

//   const renderWaitUntilContent = () => {
//     const config = step.waitUntilConfig || {
//       conditionType: "EMAIL_OPENED" as WaitConditionType,
//       maxWaitDays: 3,
//       fallbackAction: "CONTINUE" as WaitFallbackAction,
//     }

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Wait condition</Label>
//           <Select
//             value={config.conditionType}
//             onValueChange={(v) =>
//               onUpdate({
//                 waitUntilConfig: { ...config, conditionType: v as WaitConditionType },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="EMAIL_OPENED">Email is opened</SelectItem>
//               <SelectItem value="LINK_CLICKED">Link is clicked</SelectItem>
//               <SelectItem value="LINKEDIN_VIEWED">LinkedIn profile viewed back</SelectItem>
//               <SelectItem value="SPECIFIC_TIME">Specific time of day</SelectItem>
//               <SelectItem value="SPECIFIC_DAYS">Specific days only</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center justify-between">
//             <Label className="text-xs">Max wait days</Label>
//             <span className="text-xs text-muted-foreground">{config.maxWaitDays} days</span>
//           </div>
//           <Slider
//             value={[config.maxWaitDays]}
//             onValueChange={([v]) => onUpdate({ waitUntilConfig: { ...config, maxWaitDays: v } })}
//             max={14}
//             min={1}
//             step={1}
//           />
//         </div>

//         {config.conditionType === "SPECIFIC_TIME" && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <Label className="text-xs">Start time</Label>
//               <Input
//                 type="time"
//                 value={config.specificTimeStart || "09:00"}
//                 onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeStart: e.target.value } })}
//                 className="h-8"
//               />
//             </div>
//             <div className="space-y-1">
//               <Label className="text-xs">End time</Label>
//               <Input
//                 type="time"
//                 value={config.specificTimeEnd || "11:00"}
//                 onChange={(e) => onUpdate({ waitUntilConfig: { ...config, specificTimeEnd: e.target.value } })}
//                 className="h-8"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-2">
//           <Label className="text-xs">If condition not met</Label>
//           <Select
//             value={config.fallbackAction}
//             onValueChange={(v) =>
//               onUpdate({
//                 waitUntilConfig: { ...config, fallbackAction: v as WaitFallbackAction },
//               })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="SKIP">Skip this step</SelectItem>
//               <SelectItem value="CONTINUE">Continue anyway</SelectItem>
//               <SelectItem value="EXIT_SEQUENCE">Exit sequence</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center justify-between">
//           <span className="text-sm">Use prospect timezone</span>
//           <Switch
//             checked={config.useProspectTimezone || false}
//             onCheckedChange={(checked) => onUpdate({ waitUntilConfig: { ...config, useProspectTimezone: checked } })}
//           />
//         </div>
//       </div>
//     )
//   }

//   const renderExitTriggerContent = () => {
//     const config = step.exitTriggerConfig || {
//       conditions: [],
//       actions: [],
//     }

//     const allConditions: ExitCondition[] = [
//       "ANY_REPLY",
//       "POSITIVE_REPLY",
//       "NEGATIVE_REPLY",
//       "MEETING_BOOKED",
//       "PAGE_VISITED",
//       "EMAIL_BOUNCED",
//       "UNSUBSCRIBED",
//       "LINK_CLICKED",
//     ]

//     const toggleCondition = (condition: ExitCondition) => {
//       const conditions = config.conditions.includes(condition)
//         ? config.conditions.filter((c) => c !== condition)
//         : [...config.conditions, condition]
//       onUpdate({ exitTriggerConfig: { ...config, conditions } })
//     }

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Exit when</Label>
//           <div className="flex flex-wrap gap-2">
//             {allConditions.map((condition) => (
//               <Badge
//                 key={condition}
//                 variant={config.conditions.includes(condition) ? "default" : "outline"}
//                 className="cursor-pointer"
//                 onClick={() => toggleCondition(condition)}
//               >
//                 {condition.toLowerCase().replace(/_/g, " ")}
//               </Badge>
//             ))}
//           </div>
//         </div>

//         {config.conditions.includes("PAGE_VISITED") && (
//           <div className="space-y-2">
//             <Label className="text-xs">Page URL to track</Label>
//             <Input
//               value={config.pageVisitedUrl || ""}
//               onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, pageVisitedUrl: e.target.value } })}
//               placeholder="https://example.com/pricing"
//               className="text-sm"
//             />
//           </div>
//         )}

//         {config.conditions.includes("LINK_CLICKED") && (
//           <div className="space-y-2">
//             <Label className="text-xs">Link URL to track</Label>
//             <Input
//               value={config.linkClickedUrl || ""}
//               onChange={(e) => onUpdate({ exitTriggerConfig: { ...config, linkClickedUrl: e.target.value } })}
//               placeholder="https://example.com/demo"
//               className="text-sm"
//             />
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderManualReviewContent = () => {
//     const config = step.manualReviewConfig || {}

//     return (
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <Label className="text-xs">Notify email</Label>
//           <Input
//             value={config.notifyEmail || ""}
//             onChange={(e) => onUpdate({ manualReviewConfig: { ...config, notifyEmail: e.target.value } })}
//             placeholder="team@example.com"
//             className="text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs">Review instructions</Label>
//           <Textarea
//             value={config.reviewInstructions || ""}
//             onChange={(e) => onUpdate({ manualReviewConfig: { ...config, reviewInstructions: e.target.value } })}
//             placeholder="What should the reviewer look for?"
//             className="min-h-[80px] text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs">Auto-approve after (days)</Label>
//           <Input
//             type="number"
//             min={0}
//             value={config.autoApproveAfterDays || ""}
//             onChange={(e) =>
//               onUpdate({
//                 manualReviewConfig: { ...config, autoApproveAfterDays: Number.parseInt(e.target.value) || undefined },
//               })
//             }
//             placeholder="Leave empty for no auto-approve"
//             className="text-sm"
//           />
//           <p className="text-xs text-muted-foreground">Set to 0 to require manual approval</p>
//         </div>
//       </div>
//     )
//   }

//   const renderCallContent = () => (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Call Script</Label>
//         <Textarea
//           value={step.callScript || ""}
//           onChange={(e) => onUpdate({ callScript: e.target.value })}
//           placeholder="Write your call script or talking points..."
//           className="min-h-[200px] text-sm resize-none"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Expected Duration (minutes)</Label>
//         <Input
//           type="number"
//           min={1}
//           value={step.callDuration || 5}
//           onChange={(e) => onUpdate({ callDuration: Number.parseInt(e.target.value) || 5 })}
//           className="h-8 w-24"
//         />
//       </div>

//       <div className="flex items-center justify-between">
//         <span className="text-sm">Best time to call predictor</span>
//         <Switch
//           checked={step.callBestTimeEnabled || false}
//           onCheckedChange={(checked) => onUpdate({ callBestTimeEnabled: checked })}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs">Call outcome tracking</Label>
//         <Select value={step.callOutcome || ""} onValueChange={(v) => onUpdate({ callOutcome: v as CallOutcome })}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select outcome..." />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="CONNECTED">Connected</SelectItem>
//             <SelectItem value="VOICEMAIL">Voicemail</SelectItem>
//             <SelectItem value="NO_ANSWER">No Answer</SelectItem>
//             <SelectItem value="WRONG_NUMBER">Wrong Number</SelectItem>
//             <SelectItem value="GATEKEEPER">Gatekeeper</SelectItem>
//             <SelectItem value="BUSY">Busy</SelectItem>
//             <SelectItem value="CALLBACK_REQUESTED">Callback Requested</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   )

//   const renderTaskContent = () => (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Task Title</Label>
//         <Input
//           value={step.taskTitle || ""}
//           onChange={(e) => onUpdate({ taskTitle: e.target.value })}
//           placeholder="Enter task title..."
//         />
//       </div>

//       <div className="space-y-2">
//         <Label className="text-xs font-medium text-muted-foreground">Description</Label>
//         <Textarea
//           value={step.taskDescription || ""}
//           onChange={(e) => onUpdate({ taskDescription: e.target.value })}
//           placeholder="Describe what needs to be done..."
//           className="min-h-[100px] text-sm resize-none"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
//           <Select value={step.taskPriority || "MEDIUM"} onValueChange={(v) => onUpdate({ taskPriority: v as any })}>
//             <SelectTrigger className="w-full">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="LOW">Low</SelectItem>
//               <SelectItem value="MEDIUM">Medium</SelectItem>
//               <SelectItem value="HIGH">High</SelectItem>
//               <SelectItem value="URGENT">Urgent</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">Est. Time (min)</Label>
//           <Input
//             type="number"
//             min={1}
//             value={step.taskEstimatedTime || ""}
//             onChange={(e) => onUpdate({ taskEstimatedTime: Number.parseInt(e.target.value) || undefined })}
//             placeholder="15"
//             className="h-9"
//           />
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm">Require completion proof</span>
//           <p className="text-xs text-muted-foreground">Screenshot or note before marking done</p>
//         </div>
//         <Switch
//           checked={step.taskRequiresProof || false}
//           onCheckedChange={(checked) => onUpdate({ taskRequiresProof: checked })}
//         />
//       </div>
//     </div>
//   )

//   const renderLinkedInContent = () => (
//     <div className="space-y-4">
//       {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
//         <div className="space-y-2">
//           <Label className="text-xs font-medium text-muted-foreground">
//             {step.stepType === "LINKEDIN_CONNECT" ? "Connection Note" : "LinkedIn Message"}
//           </Label>
//           <Textarea
//             value={
//               step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || ""
//             }
//             onChange={(e) =>
//               onUpdate(
//                 step.stepType === "LINKEDIN_CONNECT"
//                   ? { linkedInConnectionNote: e.target.value }
//                   : { linkedInMessage: e.target.value },
//               )
//             }
//             placeholder={
//               step.stepType === "LINKEDIN_CONNECT"
//                 ? "Hi {{firstName}}, I'd love to connect..."
//                 : "Write your LinkedIn message..."
//             }
//             className="min-h-[150px] text-sm resize-none"
//           />
//           <p className="text-[10px] text-muted-foreground">
//             {
//               (step.stepType === "LINKEDIN_CONNECT" ? step.linkedInConnectionNote || "" : step.linkedInMessage || "")
//                 .length
//             }
//             /300 characters
//           </p>
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <div>
//           <span className="text-sm">Safety limits</span>
//           <p className="text-xs text-muted-foreground">Respect LinkedIn rate limits</p>
//         </div>
//         <Switch
//           checked={step.linkedInSafetyLimits !== false}
//           onCheckedChange={(checked) => onUpdate({ linkedInSafetyLimits: checked })}
//         />
//       </div>

//       {step.stepType === "LINKEDIN_MESSAGE" && (
//         <div className="flex items-center justify-between">
//           <div>
//             <span className="text-sm">Use InMail</span>
//             <p className="text-xs text-muted-foreground">Use InMail credits if not connected</p>
//           </div>
//           <Switch
//             checked={step.linkedInInMailEnabled || false}
//             onCheckedChange={(checked) => onUpdate({ linkedInInMailEnabled: checked })}
//           />
//         </div>
//       )}
//     </div>
//   )

//   const renderABSplitContent = () => {
//     const config = step.abSplitConfig || {
//       branches: [],
//       autoSelectWinner: true,
//       winnerThreshold: 100,
//       mergeAfter: true,
//     }

//     const addBranch = () => {
//       const newBranch = {
//         id: generateUniqueId("ab_split_branch", sequenceId),
//         name: `Variant ${config.branches.length + 1}`,
//         trafficPercent: 0,
//         targetStepId: null,
//         stats: { entered: 0, converted: 0 },
//       }

//       const newBranches = [...config.branches, newBranch]
//       const equalPercent = Math.floor(100 / newBranches.length)
//       const redistributed = newBranches.map((b, i) => ({
//         ...b,
//         trafficPercent: i === newBranches.length - 1 ? 100 - equalPercent * (newBranches.length - 1) : equalPercent,
//       }))

//       onUpdate({ abSplitConfig: { ...config, branches: redistributed } })
//     }

//     const removeBranch = (branchId: string) => {
//       const newBranches = config.branches.filter((b) => b.id !== branchId)
//       if (newBranches.length === 0) return

//       const equalPercent = Math.floor(100 / newBranches.length)
//       const redistributed = newBranches.map((b, i) => ({
//         ...b,
//         trafficPercent: i === newBranches.length - 1 ? 100 - equalPercent * (newBranches.length - 1) : equalPercent,
//       }))

//       onUpdate({ abSplitConfig: { ...config, branches: redistributed } })
//     }

//     const updateBranch = (branchId: string, updates: any) => {
//       const updated = config.branches.map((b) => (b.id === branchId ? { ...b, ...updates } : b))
//       onUpdate({ abSplitConfig: { ...config, branches: updated } })
//     }

//     const totalPercent = config.branches.reduce((sum, b) => sum + b.trafficPercent, 0)

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
//           <Info className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">A/B Split Testing</p>
//             <p className="text-xs">Split prospects into different paths to test which performs better.</p>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <Label className="text-sm font-medium">Test Variants</Label>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={addBranch}
//               className="h-7 gap-1.5 px-2 bg-transparent"
//               disabled={config.branches.length >= 5}
//             >
//               <Plus className="h-3.5 w-3.5" />
//               Add Variant
//             </Button>
//           </div>

//           {config.branches.length === 0 ? (
//             <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
//               <TestTube className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p>No variants yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {config.branches.map((branch, index) => {
//                 const conversionRate =
//                   branch.stats.entered > 0 ? ((branch.stats.converted / branch.stats.entered) * 100).toFixed(1) : "0.0"

//                 return (
//                   <Card key={branch.id}>
//                     <CardHeader className="pb-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline">{String.fromCharCode(65 + index)}</Badge>
//                           <Input
//                             value={branch.name}
//                             onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
//                             className="h-7 w-32 text-sm"
//                             placeholder="Variant name"
//                           />
//                         </div>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => removeBranch(branch.id)}
//                           className="h-7 w-7 text-destructive"
//                           disabled={config.branches.length <= 1}
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <Label className="text-xs">Traffic %</Label>
//                           <span className="text-xs font-mono">{branch.trafficPercent}%</span>
//                         </div>
//                         <Slider
//                           value={[branch.trafficPercent]}
//                           onValueChange={([val]) => updateBranch(branch.id, { trafficPercent: val })}
//                           max={100}
//                           step={5}
//                         />
//                       </div>
//                       {branch.stats.entered > 0 && (
//                         <div className="grid grid-cols-3 gap-2 pt-2 border-t">
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Entered</p>
//                             <p className="text-sm font-semibold">{branch.stats.entered}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Converted</p>
//                             <p className="text-sm font-semibold">{branch.stats.converted}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Rate</p>
//                             <p className="text-sm font-semibold">{conversionRate}%</p>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           )}

//           {totalPercent !== 100 && config.branches.length > 0 && (
//             <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
//               <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
//               <p className="text-xs text-amber-600">Traffic must total 100% (currently {totalPercent}%)</p>
//             </div>
//           )}
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <Label className="text-sm">Auto-select winner</Label>
//               <p className="text-xs text-muted-foreground">Automatically choose best performing variant</p>
//             </div>
//             <Switch
//               checked={config.autoSelectWinner}
//               onCheckedChange={(checked) => onUpdate({ abSplitConfig: { ...config, autoSelectWinner: checked } })}
//             />
//           </div>

//           {config.autoSelectWinner && (
//             <div className="space-y-2">
//               <Label className="text-xs">Winner threshold (sends)</Label>
//               <Input
//                 type="number"
//                 min={50}
//                 step={50}
//                 value={config.winnerThreshold}
//                 onChange={(e) =>
//                   onUpdate({ abSplitConfig: { ...config, winnerThreshold: Number.parseInt(e.target.value) || 100 } })
//                 }
//                 className="h-8"
//               />
//               <p className="text-xs text-muted-foreground">
//                 After {config.winnerThreshold} total sends, best variant wins
//               </p>
//             </div>
//           )}

//           <div className="flex items-center justify-between">
//             <div>
//               <Label className="text-sm">Merge paths after winner</Label>
//               <p className="text-xs text-muted-foreground">All variants continue to same next step</p>
//             </div>
//             <Switch
//               checked={config.mergeAfter}
//               onCheckedChange={(checked) => onUpdate({ abSplitConfig: { ...config, mergeAfter: checked } })}
//             />
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const renderBehaviorBranchContent = () => {
//     const config = step.behaviorBranchConfig || {
//       branches: [],
//       evaluationPeriodDays: 3,
//       defaultBranchId: null,
//     }

//     const addBranch = () => {
//       const newBranch = {
//         id: generateUniqueId("behavior_branch", sequenceId),
//         name: `Path ${config.branches.length + 1}`,
//         condition: "OPENED_EMAIL" as BehaviorCondition,
//         daysToWait: 1,
//         targetStepId: null,
//         stats: { entered: 0, converted: 0 },
//       }
//       onUpdate({ behaviorBranchConfig: { ...config, branches: [...config.branches, newBranch] } })
//     }

//     const removeBranch = (branchId: string) => {
//       const newBranches = config.branches.filter((b) => b.id !== branchId)
//       const newDefaultId = config.defaultBranchId === branchId ? null : config.defaultBranchId
//       onUpdate({ behaviorBranchConfig: { ...config, branches: newBranches, defaultBranchId: newDefaultId } })
//     }

//     const updateBranch = (branchId: string, updates: any) => {
//       const updated = config.branches.map((b) => (b.id === branchId ? { ...b, ...updates } : b))
//       onUpdate({ behaviorBranchConfig: { ...config, branches: updated } })
//     }

//     const conditionLabels: Record<BehaviorCondition, string> = {
//       OPENED_EMAIL: "Opened email",
//       NOT_OPENED: "Did not open",
//       CLICKED_LINK: "Clicked link",
//       NOT_CLICKED: "Did not click",
//       NO_ACTION: "No action taken",
//       REPLIED: "Replied",
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
//           <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Behavior-Based Branching</p>
//             <p className="text-xs">Send prospects down different paths based on their engagement.</p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Evaluation period</Label>
//           <div className="flex items-center gap-2">
//             <Input
//               type="number"
//               min={1}
//               max={14}
//               value={config.evaluationPeriodDays}
//               onChange={(e) =>
//                 onUpdate({
//                   behaviorBranchConfig: { ...config, evaluationPeriodDays: Number.parseInt(e.target.value) || 3 },
//                 })
//               }
//               className="h-8 w-20"
//             />
//             <span className="text-sm text-muted-foreground">days to wait before evaluating</span>
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Behavior Paths</Label>

//           <div className="flex items-center justify-between">
//             <Label className="text-sm font-medium">Behavior Paths</Label>
//             <Button size="sm" variant="outline" onClick={addBranch} className="h-7 gap-1.5 px-2 bg-transparent">
//               <Plus className="h-3.5 w-3.5" />
//               Add Path
//             </Button>
//           </div>

//           {config.branches.length === 0 ? (
//             <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
//               <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p>No behavior paths yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {config.branches.map((branch, index) => {
//                 const isDefault = config.defaultBranchId === branch.id
//                 const conversionRate =
//                   branch.stats.entered > 0 ? ((branch.stats.converted / branch.stats.entered) * 100).toFixed(1) : "0.0"

//                 return (
//                   <Card key={branch.id} className={cn(isDefault && "border-primary")}>
//                     <CardHeader className="pb-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2 flex-1">
//                           <Badge variant={isDefault ? "default" : "outline"}>{index + 1}</Badge>
//                           <Input
//                             value={branch.name}
//                             onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
//                             className="h-7 flex-1 text-sm"
//                             placeholder="Path name"
//                           />
//                         </div>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => removeBranch(branch.id)}
//                           className="h-7 w-7 text-destructive"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       <div className="space-y-1.5">
//                         <Label className="text-xs">When prospect...</Label>
//                         <Select
//                           value={branch.condition}
//                           onValueChange={(v) => updateBranch(branch.id, { condition: v as BehaviorCondition })}
//                         >
//                           <SelectTrigger className="h-8">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {Object.entries(conditionLabels).map(([value, label]) => (
//                               <SelectItem key={value} value={value}>
//                                 {label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
//                         <span className="text-xs">Default fallback path</span>
//                         <Switch
//                           checked={isDefault}
//                           onCheckedChange={(checked) =>
//                             onUpdate({
//                               behaviorBranchConfig: { ...config, defaultBranchId: checked ? branch.id : null },
//                             })
//                           }
//                         />
//                       </div>
//                       {branch.stats.entered > 0 && (
//                         <div className="grid grid-cols-3 gap-2 pt-2 border-t">
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Entered</p>
//                             <p className="text-sm font-semibold">{branch.stats.entered}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Converted</p>
//                             <p className="text-sm font-semibold">{branch.stats.converted}</p>
//                           </div>
//                           <div>
//                             <p className="text-[10px] text-muted-foreground">Rate</p>
//                             <p className="text-sm font-semibold">{conversionRate}%</p>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {!config.defaultBranchId && config.branches.length > 0 && (
//           <div className="flex items-center gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20">
//             <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
//             <p className="text-xs text-amber-600">Set a default path for prospects who don't match any condition</p>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // ============================================
//   // RANDOM_VARIANT Configuration
//   // ============================================
//   const renderRandomVariantContent = () => {
//     const config = step.randomVariantConfig || {
//       variants: [],
//       variationType: "subject",
//     }

//     const addVariant = () => {
//       const newVariant = {
//         id: generateUniqueId("random_variant", sequenceId),
//         content: "",
//         usageCount: 0,
//       }
//       onUpdate({ randomVariantConfig: { ...config, variants: [...config.variants, newVariant] } })
//     }

//     const removeVariant = (variantId: string) => {
//       const newVariants = config.variants.filter((v) => v.id !== variantId)
//       onUpdate({ randomVariantConfig: { ...config, variants: newVariants } })
//     }

//     const updateVariant = (variantId: string, content: string) => {
//       const updated = config.variants.map((v) => (v.id === variantId ? { ...v, content } : v))
//       onUpdate({ randomVariantConfig: { ...config, variants: updated } })
//     }

//     const typeLabels = {
//       subject: "Subject Lines",
//       opening: "Opening Lines",
//       signoff: "Email Sign-offs",
//       full_email: "Full Email Bodies",
//     }

//     const placeholders = {
//       subject: "Re: Quick question about {{company}}",
//       opening: "Hi {{firstName}}, I noticed...",
//       signoff: "Looking forward to hearing from you!",
//       full_email: "Full email body with personalization...",
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-fuchsia-500/5 border border-fuchsia-500/20">
//           <Info className="h-4 w-4 text-fuchsia-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Random Variation</p>
//             <p className="text-xs">
//               Add natural variation to avoid spam filters. One variant is randomly selected per prospect.
//             </p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">What to vary</Label>
//           <Select
//             value={config.variationType}
//             onValueChange={(v) =>
//               onUpdate({ randomVariantConfig: { ...config, variationType: v as typeof config.variationType } })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="subject">Subject Lines</SelectItem>
//               <SelectItem value="opening">Opening Lines</SelectItem>
//               <SelectItem value="signoff">Email Sign-offs</SelectItem>
//               <SelectItem value="full_email">Full Email Bodies</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">{typeLabels[config.variationType]}</Label>
//           <div className="flex items-center justify-between">
//             <Label className="text-sm font-medium">{typeLabels[config.variationType]}</Label>
//             <Button size="sm" variant="outline" onClick={addVariant} className="h-7 gap-1.5 px-2 bg-transparent">
//               <Plus className="h-3.5 w-3.5" />
//               Add Variant
//             </Button>
//           </div>

//           {config.variants.length === 0 ? (
//             <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
//               <Shuffle className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p>No variants yet</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {config.variants.map((variant, index) => (
//                 <Card key={variant.id}>
//                   <CardContent className="pt-4">
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between mb-2">
//                         <Badge variant="outline">Variant {index + 1}</Badge>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => removeVariant(variant.id)}
//                           className="h-6 w-6 text-destructive"
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                       {config.variationType === "full_email" ? (
//                         <Textarea
//                           value={variant.content}
//                           onChange={(e) => updateVariant(variant.id, e.target.value)}
//                           placeholder={placeholders[config.variationType]}
//                           className="min-h-[100px] text-sm font-mono"
//                         />
//                       ) : (
//                         <Input
//                           value={variant.content}
//                           onChange={(e) => updateVariant(variant.id, e.target.value)}
//                           placeholder={placeholders[config.variationType]}
//                           className="text-sm"
//                         />
//                       )}
//                       {variant.usageCount > 0 && (
//                         <p className="text-xs text-muted-foreground">Used {variant.usageCount} times</p>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>

//         {config.variants.length > 0 && (
//           <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
//             <Shuffle className="h-4 w-4 text-muted-foreground" />
//             <p className="text-xs text-muted-foreground">
//               Each prospect randomly receives one of these {config.variants.length} variants
//             </p>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // ============================================
//   // CONTENT_REFERENCE Configuration
//   // ============================================
//   const renderContentReferenceContent = () => {
//     const config = step.contentReferenceConfig || {
//       resourceType: "blog",
//       resourceUrl: "",
//       resourceTitle: "",
//       trackingEnabled: true,
//       followUpTriggers: {
//         onClicked: null,
//         onDownloaded: null,
//         onTimeSpent: null,
//       },
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-teal-500/5 border border-teal-500/20">
//           <Info className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Content Reference</p>
//             <p className="text-xs">Share content and track engagement. Trigger follow-ups based on interactions.</p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Resource Type</Label>
//           <Select
//             value={config.resourceType}
//             onValueChange={(v) =>
//               onUpdate({ contentReferenceConfig: { ...config, resourceType: v as typeof config.resourceType } })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="blog">Blog Post</SelectItem>
//               <SelectItem value="video">Video</SelectItem>
//               <SelectItem value="case_study">Case Study</SelectItem>
//               <SelectItem value="whitepaper">Whitepaper</SelectItem>
//               <SelectItem value="custom">Custom Resource</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Resource Title</Label>
//           <Input
//             value={config.resourceTitle}
//             onChange={(e) => onUpdate({ contentReferenceConfig: { ...config, resourceTitle: e.target.value } })}
//             placeholder="How to 10x Your Sales Pipeline"
//             className="text-sm"
//           />
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Resource URL</Label>
//           <Input
//             value={config.resourceUrl}
//             onChange={(e) => onUpdate({ contentReferenceConfig: { ...config, resourceUrl: e.target.value } })}
//             placeholder="https://example.com/resource"
//             className="text-sm"
//           />
//         </div>

//         <Separator />

//         <div className="flex items-center justify-between">
//           <div>
//             <Label className="text-sm">Track engagement</Label>
//             <p className="text-xs text-muted-foreground">Monitor clicks, downloads, and time spent</p>
//           </div>
//           <Switch
//             checked={config.trackingEnabled}
//             onCheckedChange={(checked) => onUpdate({ contentReferenceConfig: { ...config, trackingEnabled: checked } })}
//           />
//         </div>

//         {config.trackingEnabled && (
//           <>
//             <Separator />
//             <div className="space-y-3">
//               <Label className="text-sm font-medium">Follow-up Triggers</Label>

//               <div className="space-y-2">
//                 <Label className="text-xs">When content is clicked</Label>
//                 <Select
//                   value={config.followUpTriggers.onClicked || "none"}
//                   onValueChange={(v) =>
//                     onUpdate({
//                       contentReferenceConfig: {
//                         ...config,
//                         followUpTriggers: { ...config.followUpTriggers, onClicked: v === "none" ? null : v },
//                       },
//                     })
//                   }
//                 >
//                   <SelectTrigger className="h-8">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">No action</SelectItem>
//                     <SelectItem value="next_step">Continue to next step</SelectItem>
//                     <SelectItem value="high_interest">Mark as high interest</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-xs">When content is downloaded</Label>
//                 <Select
//                   value={config.followUpTriggers.onDownloaded || "none"}
//                   onValueChange={(v) =>
//                     onUpdate({
//                       contentReferenceConfig: {
//                         ...config,
//                         followUpTriggers: { ...config.followUpTriggers, onDownloaded: v === "none" ? null : v },
//                       },
//                     })
//                   }
//                 >
//                   <SelectTrigger className="h-8">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">No action</SelectItem>
//                     <SelectItem value="send_followup">Send follow-up email</SelectItem>
//                     <SelectItem value="notify_sales">Notify sales rep</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-xs">When time threshold reached</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     type="number"
//                     min={30}
//                     step={30}
//                     value={config.followUpTriggers.onTimeSpent?.seconds || 120}
//                     onChange={(e) =>
//                       onUpdate({
//                         contentReferenceConfig: {
//                           ...config,
//                           followUpTriggers: {
//                             ...config.followUpTriggers,
//                             onTimeSpent: { seconds: Number.parseInt(e.target.value) || 120, stepId: "" },
//                           },
//                         },
//                       })
//                     }
//                     className="h-8 w-24"
//                     placeholder="120"
//                   />
//                   <span className="text-xs text-muted-foreground flex items-center">seconds</span>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     )
//   }

//   // ============================================
//   // VOICEMAIL_DROP Configuration
//   // ============================================
//   const renderVoicemailDropContent = () => {
//     const config = step.voicemailDropConfig || {
//       audioUrl: null,
//       ttsMessage: null,
//       useTts: true,
//       personalizeWithVariables: true,
//       integrationId: null,
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
//           <Info className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Ringless Voicemail Drop</p>
//             <p className="text-xs">Leave voicemail without ringing the phone. Requires integration setup.</p>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Message Type</Label>
//           <div className="grid grid-cols-2 gap-2">
//             <Button
//               variant={config.useTts ? "default" : "outline"}
//               className="h-auto py-3 flex-col items-start"
//               onClick={() => onUpdate({ voicemailDropConfig: { ...config, useTts: true, audioUrl: null } })}
//             >
//               <Voicemail className="h-5 w-5 mb-2" />
//               <div className="text-left">
//                 <p className="font-medium text-sm">Text-to-Speech</p>
//                 <p className="text-xs opacity-80">AI voice reads message</p>
//               </div>
//             </Button>
//             <Button
//               variant={!config.useTts ? "default" : "outline"}
//               className="h-auto py-3 flex-col items-start"
//               onClick={() => onUpdate({ voicemailDropConfig: { ...config, useTts: false, ttsMessage: null } })}
//             >
//               <Phone className="h-5 w-5 mb-2" />
//               <div className="text-left">
//                 <p className="font-medium text-sm">Pre-recorded</p>
//                 <p className="text-xs opacity-80">Upload audio file</p>
//               </div>
//             </Button>
//           </div>
//         </div>

//         {config.useTts ? (
//           <div className="space-y-2">
//             <Label className="text-sm">Voicemail Message</Label>
//             <Textarea
//               value={config.ttsMessage || ""}
//               onChange={(e) => onUpdate({ voicemailDropConfig: { ...config, ttsMessage: e.target.value } })}
//               placeholder="Hi {{firstName}}, this is John from Acme Corp. I wanted to reach out about..."
//               className="min-h-[120px] text-sm"
//             />
//             <p className="text-xs text-muted-foreground">Message will be read by AI voice. Keep it under 30 seconds.</p>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             <Label className="text-sm">Audio File URL</Label>
//             <Input
//               value={config.audioUrl || ""}
//               onChange={(e) => onUpdate({ voicemailDropConfig: { ...config, audioUrl: e.target.value } })}
//               placeholder="https://example.com/voicemail.mp3"
//               className="text-sm"
//             />
//             <p className="text-xs text-muted-foreground">
//               Upload your pre-recorded voicemail (MP3, WAV). Max 30 seconds.
//             </p>
//           </div>
//         )}

//         <div className="flex items-center justify-between">
//           <div>
//             <Label className="text-sm">Personalize with variables</Label>
//             {/* <p className="text-xs text-muted-foreground">Use {{firstName}}, {{company}}, etc.</p> */}
//           </div>
//           <Switch
//             checked={config.personalizeWithVariables}
//             onCheckedChange={(checked) =>
//               onUpdate({ voicemailDropConfig: { ...config, personalizeWithVariables: checked } })
//             }
//           />
//         </div>

//         <Separator />

//         <div className="space-y-2">
//           <Label className="text-sm">Integration</Label>
//           <Select
//             value={config.integrationId || "none"}
//             onValueChange={(v) =>
//               onUpdate({ voicemailDropConfig: { ...config, integrationId: v === "none" ? null : v } })
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select integration" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">No integration connected</SelectItem>
//               <SelectItem value="slybroadcast">Slybroadcast</SelectItem>
//               <SelectItem value="ringlessvoicemail">RinglessVoicemail.com</SelectItem>
//               <SelectItem value="drop_cowboy">Drop Cowboy</SelectItem>
//             </SelectContent>
//           </Select>
//           {!config.integrationId && (
//             <p className="text-xs text-amber-600">⚠️ Connect an integration to use voicemail drops</p>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // ============================================
//   // DIRECT_MAIL Configuration
//   // ============================================
//   const renderDirectMailContent = () => {
//     const config = step.directMailConfig || {
//       mailType: "postcard",
//       message: "",
//       integrationId: null,
//       useProspectAddress: true,
//       followUpEmailEnabled: true,
//       followUpDelay: 3,
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
//           <Info className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Direct Mail Campaign</p>
//             <p className="text-xs">Send physical mail to prospects. Stands out in a digital world.</p>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Mail Type</Label>
//           <Select
//             value={config.mailType}
//             onValueChange={(v) => onUpdate({ directMailConfig: { ...config, mailType: v as typeof config.mailType } })}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="postcard">Postcard</SelectItem>
//               <SelectItem value="handwritten_note">Handwritten Note</SelectItem>
//               <SelectItem value="lumpy_mail">Lumpy Mail (Gift)</SelectItem>
//             </SelectContent>
//           </Select>
//           <p className="text-xs text-muted-foreground">
//             {config.mailType === "postcard" && "Standard 4x6 or 6x9 postcard"}
//             {config.mailType === "handwritten_note" && "Personal handwritten card in envelope"}
//             {config.mailType === "lumpy_mail" && "Package with small gift or dimensional item"}
//           </p>
//         </div>

//         <div className="space-y-2">
//           <Label className="text-sm">Message</Label>
//           <Textarea
//             value={config.message}
//             onChange={(e) => onUpdate({ directMailConfig: { ...config, message: e.target.value } })}
//             placeholder="Hi {{firstName}},

// I wanted to send you something memorable...

// Best regards,
// {{senderName}}"
//             className="min-h-[120px] text-sm font-mono"
//           />
//           <p className="text-xs text-muted-foreground">
//             {/* Use {{firstName}}, {{company}}, and other variables for personalization */}
//           </p>
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <Label className="text-sm">Use prospect's address</Label>
//             <p className="text-xs text-muted-foreground">Send to address in prospect record</p>
//           </div>
//           <Switch
//             checked={config.useProspectAddress}
//             onCheckedChange={(checked) => onUpdate({ directMailConfig: { ...config, useProspectAddress: checked } })}
//           />
//         </div>

//         <Separator />

//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <Label className="text-sm">Email follow-up</Label>
//               <p className="text-xs text-muted-foreground">Send email after mail is delivered</p>
//             </div>
//             <Switch
//               checked={config.followUpEmailEnabled}
//               onCheckedChange={(checked) =>
//                 onUpdate({ directMailConfig: { ...config, followUpEmailEnabled: checked } })
//               }
//             />
//           </div>

//           {config.followUpEmailEnabled && (
//             <div className="space-y-2">
//               <Label className="text-xs">Follow-up delay (days after delivery)</Label>
//               <Input
//                 type="number"
//                 min={1}
//                 max={14}
//                 value={config.followUpDelay}
//                 onChange={(e) =>
//                   onUpdate({ directMailConfig: { ...config, followUpDelay: Number.parseInt(e.target.value) || 3 } })
//                 }
//                 className="h-8 w-20"
//               />
//             </div>
//           )}
//         </div>

//         <Separator />

//         <div className="space-y-2">
//           <Label className="text-sm">Integration</Label>
//           <Select
//             value={config.integrationId || "none"}
//             onValueChange={(v) => onUpdate({ directMailConfig: { ...config, integrationId: v === "none" ? null : v } })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select integration" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="none">No integration connected</SelectItem>
//               <SelectItem value="lob">Lob</SelectItem>
//               <SelectItem value="postpilot">PostPilot</SelectItem>
//               <SelectItem value="reachdesk">Reachdesk</SelectItem>
//               <SelectItem value="sendoso">Sendoso</SelectItem>
//             </SelectContent>
//           </Select>
//           {!config.integrationId && (
//             <p className="text-xs text-amber-600">⚠️ Connect an integration to send direct mail</p>
//           )}
//         </div>

//         {config.mailType === "lumpy_mail" && (
//           <div className="p-3 rounded-lg bg-muted border">
//             <p className="text-xs text-muted-foreground">
//               💡 Popular lumpy mail ideas: branded mug, book, USB drive, stress ball, or local treat
//             </p>
//           </div>
//         )}
//       </div>
//     )
//   }

//   // ============================================
//   // MULTI_CHANNEL_TOUCH Configuration
//   // ============================================
//   const renderMultiChannelContent = () => {
//     const config = step.multiChannelConfig || {
//       touches: [],
//       executeSimultaneously: false,
//       delayBetweenTouches: 60,
//     }

//     const addTouch = (type: MultiChannelTouch["type"]) => {
//       const newTouch: MultiChannelTouch = {
//         id: generateUniqueId("touch"), // CHANGED: Replaced Date.now() with unique ID generator
//         type,
//         order: config.touches.length,
//         delayFromPrevious: 0,
//         config: {},
//       }
//       onUpdate({ multiChannelConfig: { ...config, touches: [...config.touches, newTouch] } })
//     }

//     const removeTouch = (touchId: string) => {
//       const newTouches = config.touches.filter((t) => t.id !== touchId).map((t, i) => ({ ...t, order: i }))
//       onUpdate({ multiChannelConfig: { ...config, touches: newTouches } })
//     }

//     const touchIcons = {
//       EMAIL: Mail,
//       LINKEDIN_VIEW: Linkedin,
//       LINKEDIN_CONNECT: Linkedin,
//       LINKEDIN_MESSAGE: Linkedin,
//       CALL: Phone,
//     }

//     const touchLabels = {
//       EMAIL: "Email",
//       LINKEDIN_VIEW: "LinkedIn View",
//       LINKEDIN_CONNECT: "LinkedIn Connect",
//       LINKEDIN_MESSAGE: "LinkedIn Message",
//       CALL: "Call Task",
//     }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
//           <Info className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Multi-Channel Touch</p>
//             <p className="text-xs">Reach prospects across multiple channels in coordinated sequence.</p>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div>
//             <Label className="text-sm">Execute simultaneously</Label>
//             <p className="text-xs text-muted-foreground">Send all touches at once vs. staggered</p>
//           </div>
//           <Switch
//             checked={config.executeSimultaneously}
//             onCheckedChange={(checked) =>
//               onUpdate({ multiChannelConfig: { ...config, executeSimultaneously: checked } })
//             }
//           />
//         </div>

//         {!config.executeSimultaneously && (
//           <div className="space-y-2">
//             <Label className="text-xs">Delay between touches (minutes)</Label>
//             <Input
//               type="number"
//               min={15}
//               step={15}
//               value={config.delayBetweenTouches}
//               onChange={(e) =>
//                 onUpdate({
//                   multiChannelConfig: { ...config, delayBetweenTouches: Number.parseInt(e.target.value) || 60 },
//                 })
//               }
//               className="h-8 w-24"
//             />
//           </div>
//         )}

//         <Separator />

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Channel Touches</Label>

//           {config.touches.length === 0 ? (
//             <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
//               <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p>No touches configured</p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {config.touches.map((touch, index) => {
//                 const Icon = touchIcons[touch.type]
//                 return (
//                   <Card key={touch.id}>
//                     <CardContent className="pt-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                           <Badge variant="outline">{index + 1}</Badge>
//                           <Icon className="h-4 w-4" />
//                           <span className="text-sm font-medium">{touchLabels[touch.type]}</span>
//                         </div>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           onClick={() => removeTouch(touch.id)}
//                           className="h-7 w-7 text-destructive"
//                         >
//                           <Trash2 className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           )}

//           <div className="flex flex-wrap gap-2">
//             <Button size="sm" variant="outline" onClick={() => addTouch("EMAIL")} className="h-8 gap-1.5">
//               <Mail className="h-3.5 w-3.5" />
//               Add Email
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => addTouch("LINKEDIN_VIEW")} className="h-8 gap-1.5">
//               <Linkedin className="h-3.5 w-3.5" />
//               Add LinkedIn
//             </Button>
//             <Button size="sm" variant="outline" onClick={() => addTouch("CALL")} className="h-8 gap-1.5">
//               <Phone className="h-3.5 w-3.5" />
//               Add Call
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Continuation of CONDITION Configuration
//   const renderConditionContent = () => {
//     const conditions = step.conditions || { sendIf: {}, logicOperator: "AND" }

//     return (
//       <div className="space-y-4">
//         <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
//           <Info className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
//           <div className="text-sm text-muted-foreground">
//             <p className="font-medium text-foreground mb-1">Conditional Logic</p>
//             <p className="text-xs">Only proceed if prospect meets certain conditions.</p>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <Label className="text-sm font-medium">Condition Rules</Label>

//           <div className="flex items-center justify-between p-3 rounded-lg border">
//             <span className="text-sm">Has not opened previous email</span>
//             <Switch
//               checked={conditions.sendIf?.notOpened || false}
//               onCheckedChange={(checked) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, notOpened: checked } },
//                 })
//               }
//             />
//           </div>

//           <div className="flex items-center justify-between p-3 rounded-lg border">
//             <span className="text-sm">Has not replied</span>
//             <Switch
//               checked={conditions.sendIf?.notReplied || false}
//               onCheckedChange={(checked) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, notReplied: checked } },
//                 })
//               }
//             />
//           </div>

//           <div className="flex items-center justify-between p-3 rounded-lg border">
//             <span className="text-sm">Has not clicked any link</span>
//             <Switch
//               checked={conditions.sendIf?.notClicked || false}
//               onCheckedChange={(checked) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, notClicked: checked } },
//                 })
//               }
//             />
//           </div>

//           <div className="flex items-center justify-between p-3 rounded-lg border">
//             <span className="text-sm">Has opened previous email</span>
//             <Switch
//               checked={conditions.sendIf?.hasOpened || false}
//               onCheckedChange={(checked) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, hasOpened: checked } },
//                 })
//               }
//             />
//           </div>

//           <div className="flex items-center justify-between p-3 rounded-lg border">
//             <span className="text-sm">Has clicked a link</span>
//             <Switch
//               checked={conditions.sendIf?.hasClicked || false}
//               onCheckedChange={(checked) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, hasClicked: checked } },
//                 })
//               }
//             />
//           </div>

//           <div className="space-y-2 p-3 rounded-lg border">
//             <Label className="text-xs">Job title contains</Label>
//             <Input
//               value={conditions.sendIf?.jobTitleContains || ""}
//               onChange={(e) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, jobTitleContains: e.target.value } },
//                 })
//               }
//               placeholder="VP, Director, Manager"
//               className="h-8 text-sm"
//             />
//           </div>

//           <div className="space-y-2 p-3 rounded-lg border">
//             <Label className="text-xs">Company size greater than</Label>
//             <Input
//               type="number"
//               value={conditions.sendIf?.companySizeGreaterThan || ""}
//               onChange={(e) =>
//                 onUpdate({
//                   conditions: {
//                     ...conditions,
//                     sendIf: { ...conditions.sendIf, companySizeGreaterThan: Number.parseInt(e.target.value) },
//                   },
//                 })
//               }
//               placeholder="50"
//               className="h-8 w-32"
//             />
//           </div>

//           <div className="space-y-2 p-3 rounded-lg border">
//             <Label className="text-xs">Lead score greater than</Label>
//             <Input
//               type="number"
//               value={conditions.sendIf?.leadScoreGreaterThan || ""}
//               onChange={(e) =>
//                 onUpdate({
//                   conditions: {
//                     ...conditions,
//                     sendIf: { ...conditions.sendIf, leadScoreGreaterThan: Number.parseInt(e.target.value) },
//                   },
//                 })
//               }
//               placeholder="70"
//               className="h-8 w-32"
//             />
//           </div>

//           <div className="space-y-2 p-3 rounded-lg border">
//             <Label className="text-xs">CRM stage equals</Label>
//             <Input
//               value={conditions.sendIf?.crmStageEquals || ""}
//               onChange={(e) =>
//                 onUpdate({
//                   conditions: { ...conditions, sendIf: { ...conditions.sendIf, crmStageEquals: e.target.value } },
//                 })
//               }
//               placeholder="Qualified Lead"
//               className="h-8 text-sm"
//             />
//           </div>

//           <div className="space-y-2 p-3 rounded-lg border">
//             <Label className="text-xs">Days in current step</Label>
//             <Input
//               type="number"
//               value={conditions.sendIf?.daysInStep || ""}
//               onChange={(e) =>
//                 onUpdate({
//                   conditions: {
//                     ...conditions,
//                     sendIf: { ...conditions.sendIf, daysInStep: Number.parseInt(e.target.value) },
//                   },
//                 })
//               }
//               placeholder="3"
//               className="h-8 w-32"
//             />
//             <p className="text-xs text-muted-foreground">Only proceed after this many days</p>
//           </div>
//         </div>

//         <Separator />

//         <div className="space-y-2">
//           <Label className="text-sm">Logic Operator</Label>
//           <Select
//             value={conditions.logicOperator}
//             onValueChange={(v) => onUpdate({ conditions: { ...conditions, logicOperator: v as "AND" | "OR" } })}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="AND">Match ALL conditions (AND)</SelectItem>
//               <SelectItem value="OR">Match ANY condition (OR)</SelectItem>
//             </SelectContent>
//           </Select>
//           <p className="text-xs text-muted-foreground">
//             {conditions.logicOperator === "AND"
//               ? "Prospect must meet all selected conditions"
//               : "Prospect must meet at least one condition"}
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // ============================================
//   // UPDATE THE MAIN renderStepContent() FUNCTION
//   // Add these cases to your switch statement:
//   // ============================================

//   const renderStepContent = () => {
//     switch (step.stepType) {
//       case "EMAIL":
//         return renderEmailContent()
//       case "DELAY":
//         return renderDelayContent()
//       case "WAIT_UNTIL":
//         return renderWaitUntilContent()
//       case "EXIT_TRIGGER":
//         return renderExitTriggerContent()
//       case "MANUAL_REVIEW":
//         return renderManualReviewContent()
//       case "CALL":
//         return renderCallContent()
//       case "TASK":
//         return renderTaskContent()
//       case "LINKEDIN_VIEW":
//       case "LINKEDIN_CONNECT":
//       case "LINKEDIN_MESSAGE":
//         return renderLinkedInContent()

//       // NEW IMPLEMENTATIONS
//       case "AB_SPLIT":
//         return renderABSplitContent()
//       case "BEHAVIOR_BRANCH":
//         return renderBehaviorBranchContent()
//       case "RANDOM_VARIANT":
//         return renderRandomVariantContent()
//       case "CONTENT_REFERENCE":
//         return renderContentReferenceContent()
//       case "VOICEMAIL_DROP":
//         return renderVoicemailDropContent()
//       case "DIRECT_MAIL":
//         return renderDirectMailContent()
//       case "MULTI_CHANNEL_TOUCH":
//         return renderMultiChannelContent()
//       case "CONDITION":
//         return renderConditionContent()

//       default:
//         return <p className="text-sm text-muted-foreground">Configuration for {step.stepType} coming soon.</p>
//     }
//   }

//   // ============================================
//   // ADDITIONAL ICON MAPPINGS
//   // Add these to your header rendering section where you map icons:
//   // ============================================

//   const getStepIcon = (stepType: StepType) => {
//     switch (stepType) {
//       case "EMAIL":
//         return <Mail className={cn("h-4 w-4", config.color)} />
//       case "DELAY":
//         return <Clock className={cn("h-4 w-4", config.color)} />
//       case "WAIT_UNTIL":
//         return <Timer className={cn("h-4 w-4", config.color)} />
//       case "EXIT_TRIGGER":
//         return <LogOut className={cn("h-4 w-4", config.color)} />
//       case "MANUAL_REVIEW":
//         return <UserCheck className={cn("h-4 w-4", config.color)} />
//       case "CALL":
//         return <Phone className={cn("h-4 w-4", config.color)} />
//       case "TASK":
//         return <CheckSquare className={cn("h-4 w-4", config.color)} />
//       case "LINKEDIN_VIEW":
//       case "LINKEDIN_CONNECT":
//       case "LINKEDIN_MESSAGE":
//         return <Linkedin className={cn("h-4 w-4", config.color)} />
//       case "AB_SPLIT":
//         return <TestTube className={cn("h-4 w-4", config.color)} />
//       case "BEHAVIOR_BRANCH":
//         return <GitBranch className={cn("h-4 w-4", config.color)} />
//       case "RANDOM_VARIANT":
//         return <Shuffle className={cn("h-4 w-4", config.color)} />
//       case "CONTENT_REFERENCE":
//         return <FileText className={cn("h-4 w-4", config.color)} />
//       case "VOICEMAIL_DROP":
//         return <Voicemail className={cn("h-4 w-4", config.color)} />
//       case "DIRECT_MAIL":
//         return <MailOpen className={cn("h-4 w-4", config.color)} />
//       case "MULTI_CHANNEL_TOUCH":
//         return <Zap className={cn("h-4 w-4", config.color)} />
//       case "CONDITION":
//         return <Target className={cn("h-4 w-4", config.color)} />
//       default:
//         return <Settings2 className={cn("h-4 w-4", config.color)} />
//     }
//   }

//   return (
//     <TooltipProvider>
//       <div className="space-y-6 p-6 max-h-[90vh] overflow-y-auto">{renderStepContent()}</div>
//     </TooltipProvider>
//   )
// }
