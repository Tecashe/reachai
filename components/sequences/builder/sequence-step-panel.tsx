"use client"

import * as React from "react"
import {
  Mail,
  Clock,
  X,
  Trash2,
  ChevronDown,
  Variable,
  Linkedin,
  Phone,
  CheckSquare,
  ArrowRight,
  Settings2,
  TestTube,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  DEFAULT_PERSONALIZATION_VARIABLES,
  type SequenceStep,
  type StepType,
  type DelayUnit,
  type SequenceStepVariant,
} from "@/lib/types/sequence"
import { EmailComposer } from "./email-composer"
import { ABTestPanel } from "./ab-test-panel"

interface SequenceStepPanelProps {
  step: SequenceStep
  sequenceId: string
  userId: string
  onUpdate: (updates: Partial<SequenceStep>) => void
  onClose: () => void
  onDelete: () => void
}

const STEP_TYPE_CONFIG: Record<StepType, { icon: React.ElementType; label: string; color: string }> = {
  EMAIL: { icon: Mail, label: "Email", color: "text-blue-500" },
  LINKEDIN_VIEW: { icon: Linkedin, label: "LinkedIn View", color: "text-blue-600" },
  LINKEDIN_CONNECT: { icon: Linkedin, label: "LinkedIn Connect", color: "text-blue-600" },
  LINKEDIN_MESSAGE: { icon: Linkedin, label: "LinkedIn Message", color: "text-blue-600" },
  CALL: { icon: Phone, label: "Phone Call", color: "text-green-500" },
  TASK: { icon: CheckSquare, label: "Manual Task", color: "text-purple-500" },
  DELAY: { icon: Clock, label: "Delay", color: "text-orange-500" },
  CONDITION: { icon: ArrowRight, label: "Condition", color: "text-yellow-500" },
}

export function SequenceStepPanel({ step, sequenceId, userId, onUpdate, onClose, onDelete }: SequenceStepPanelProps) {
  const { toast } = useToast()

  const config = STEP_TYPE_CONFIG[step.stepType]
  const [activeTab, setActiveTab] = React.useState("content")
  const [isConditionsOpen, setIsConditionsOpen] = React.useState(false)
  const [showEmailComposer, setShowEmailComposer] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [variants, setVariants] = React.useState<SequenceStepVariant[]>(step.variants || [])

  const subjectRef = React.useRef<HTMLInputElement>(null)
  const bodyRef = React.useRef<HTMLTextAreaElement>(null)

  // Sync variants when step changess
  React.useEffect(() => {
    setVariants(step.variants || [])
  }, [step.variants])

  const insertVariable = (
    variable: string,
    targetRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  ) => {
    const target = targetRef.current
    if (!target) return

    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const currentValue = target.value
    const variableText = `{{${variable}}}`
    const newValue = currentValue.substring(0, start) + variableText + currentValue.substring(end)

    if (targetRef === subjectRef) {
      onUpdate({ subject: newValue })
    } else if (targetRef === bodyRef) {
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

  return (
    <TooltipProvider>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", "bg-primary/10")}>
              <config.icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
              <p className="text-xs text-muted-foreground">Step {step.order}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete step</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 h-10">
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Settings2 className="mr-1.5 h-3.5 w-3.5" />
              Settings
            </TabsTrigger>
            {step.stepType === "EMAIL" && (
              <TabsTrigger
                value="ab-test"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <TestTube className="mr-1.5 h-3.5 w-3.5" />
                A/B Test
                {variants.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                    {variants.length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="flex-1 overflow-auto mt-0">
            <div className="p-4 space-y-4">
              {/* Timing */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Timing</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Wait</span>
                  <Input
                    type="number"
                    min={0}
                    value={step.delayValue}
                    onChange={(e) => onUpdate({ delayValue: Number.parseInt(e.target.value) || 0 })}
                    className="h-8 w-16 text-center"
                  />
                  <Select value={step.delayUnit} onValueChange={(v) => onUpdate({ delayUnit: v as DelayUnit })}>
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINUTES">minutes</SelectItem>
                      <SelectItem value="HOURS">hours</SelectItem>
                      <SelectItem value="DAYS">days</SelectItem>
                      <SelectItem value="WEEKS">weeks</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">before sending</span>
                </div>
              </div>

              <Separator />

              {/* Email content */}
              {step.stepType === "EMAIL" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Subject Line</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-xs">
                            <Variable className="h-3 w-3" />
                            Insert Variable
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {Object.entries(DEFAULT_PERSONALIZATION_VARIABLES).map(([category, vars]) => (
                            <DropdownMenuSub key={category}>
                              <DropdownMenuSubTrigger className="text-xs capitalize">{category}</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {vars.map((v) => (
                                  <DropdownMenuItem
                                    key={v.key}
                                    className="text-xs"
                                    onClick={() => insertVariable(v.key, subjectRef)}
                                  >
                                    <span className="font-mono text-primary">{`{{${v.key}}}`}</span>
                                    <span className="ml-2 text-muted-foreground">{v.label}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Input
                      ref={subjectRef}
                      value={step.subject || ""}
                      onChange={(e) => onUpdate({ subject: e.target.value })}
                      placeholder="Enter subject line..."
                      className="text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground">{(step.subject || "").length} characters</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-muted-foreground">Email Body</Label>
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-xs">
                              <Variable className="h-3 w-3" />
                              Variable
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            {Object.entries(DEFAULT_PERSONALIZATION_VARIABLES).map(([category, vars]) => (
                              <DropdownMenuSub key={category}>
                                <DropdownMenuSubTrigger className="text-xs capitalize">
                                  {category}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {vars.map((v) => (
                                    <DropdownMenuItem
                                      key={v.key}
                                      className="text-xs"
                                      onClick={() => insertVariable(v.key, bodyRef)}
                                    >
                                      <span className="font-mono text-primary">{`{{${v.key}}}`}</span>
                                      <span className="ml-2 text-muted-foreground">{v.label}</span>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1 px-2 text-xs"
                          onClick={() => setShowEmailComposer(true)}
                        >
                          <Wand2 className="h-3 w-3" />
                          Full Editor
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      ref={bodyRef}
                      value={step.body || ""}
                      onChange={(e) => onUpdate({ body: e.target.value })}
                      placeholder="Write your email content..."
                      className="min-h-[200px] text-sm resize-none"
                    />
                  </div>
                </>
              )}

              {/* LinkedIn content */}
              {(step.stepType === "LINKEDIN_MESSAGE" || step.stepType === "LINKEDIN_CONNECT") && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">LinkedIn Message</Label>
                  <Textarea
                    value={step.linkedInMessage || ""}
                    onChange={(e) => onUpdate({ linkedInMessage: e.target.value })}
                    placeholder="Write your LinkedIn message..."
                    className="min-h-[150px] text-sm resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {(step.linkedInMessage || "").length}/300 characters
                  </p>
                </div>
              )}

              {/* Call script */}
              {step.stepType === "CALL" && (
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
                </div>
              )}

              {/* Task content */}
              {step.stepType === "TASK" && (
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
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
                    <Select
                      value={step.taskPriority || "MEDIUM"}
                      onValueChange={(v) => onUpdate({ taskPriority: v as any })}
                    >
                      <SelectTrigger className="w-32">
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
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
            <div className="p-4 space-y-4">
              {/* Conditions */}
              <Collapsible open={isConditionsOpen} onOpenChange={setIsConditionsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between h-auto py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Send Conditions</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isConditionsOpen && "rotate-180",
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Skip if replied</p>
                      <p className="text-xs text-muted-foreground">Don't send if prospect has already replied</p>
                    </div>
                    <Switch
                      checked={step.skipIfReplied}
                      onCheckedChange={(checked) => onUpdate({ skipIfReplied: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">Skip if bounced</p>
                      <p className="text-xs text-muted-foreground">Don't send if previous email bounced</p>
                    </div>
                    <Switch
                      checked={step.skipIfBounced}
                      onCheckedChange={(checked) => onUpdate({ skipIfBounced: checked })}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Internal notes */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Internal Notes</Label>
                <Textarea
                  value={step.internalNotes || ""}
                  onChange={(e) => onUpdate({ internalNotes: e.target.value })}
                  placeholder="Add notes for your team..."
                  className="min-h-[100px] text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">Notes are only visible to your team, not to prospects.</p>
              </div>
            </div>
          </TabsContent>

          {/* A/B Test Tab */}
          {step.stepType === "EMAIL" && (
            <TabsContent value="ab-test" className="flex-1 overflow-auto mt-0">
              <ABTestPanel
                step={{ ...step, variants }}
                sequenceId={sequenceId}
                userId={userId}
                onUpdate={onUpdate}
                onVariantsChange={handleVariantsChange}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Email Composer Modal */}
        {showEmailComposer && (
          <EmailComposer step={step} onSave={handleEmailComposerSave} onClose={() => setShowEmailComposer(false)} />
        )}
      </div>
    </TooltipProvider>
  )
}
