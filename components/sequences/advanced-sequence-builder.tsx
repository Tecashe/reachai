"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, GitBranch, Mail, Clock, Eye, MousePointerClick, Reply, TrendingUp, Zap, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SequenceAutomationRule {
  id: string
  name: string
  trigger: {
    type: "opened" | "clicked" | "replied" | "not_opened" | "not_replied" | "link_clicked" | "time_elapsed"
    value?: number | string
    timeWindow?: number
  }
  conditions: Array<{
    field: string
    operator: string
    value: any
  }>
  actions: Array<{
    type: "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"
    value?: string
    delay?: number
  }>
  isActive: boolean
}

interface AdvancedSequenceBuilderProps {
  campaignId: string
}

export function AdvancedSequenceBuilder({ campaignId }: AdvancedSequenceBuilderProps) {
  const [rules, setRules] = useState<SequenceAutomationRule[]>([])
  const [showAddRule, setShowAddRule] = useState(false)

  const triggerTypes = [
    { value: "opened", label: "Email Opened", icon: Eye, color: "text-blue-600" },
    { value: "clicked", label: "Link Clicked", icon: MousePointerClick, color: "text-purple-600" },
    { value: "replied", label: "Replied to Email", icon: Reply, color: "text-green-600" },
    { value: "not_opened", label: "Not Opened (after X days)", icon: Clock, color: "text-yellow-600" },
    { value: "not_replied", label: "No Reply (after X days)", icon: Clock, color: "text-orange-600" },
    { value: "link_clicked", label: "Specific Link Clicked", icon: TrendingUp, color: "text-indigo-600" },
    { value: "time_elapsed", label: "Time Elapsed", icon: Clock, color: "text-gray-600" },
  ]

  const actionTypes = [
    { value: "send_email", label: "Send Email", icon: Mail },
    { value: "add_tag", label: "Add Tag", icon: Plus },
    { value: "change_sequence", label: "Move to Different Sequence", icon: GitBranch },
    { value: "notify", label: "Send Notification", icon: Zap },
    { value: "pause", label: "Pause Sequence", icon: Clock },
    { value: "move_to_crm", label: "Create CRM Deal", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Sequence Automation Rules
              </CardTitle>
              <CardDescription>Create conditional logic to automate actions based on prospect behavior</CardDescription>
            </div>
            <Dialog open={showAddRule} onOpenChange={setShowAddRule}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Automation Rule</DialogTitle>
                  <DialogDescription>Define what triggers this rule and what actions to take</DialogDescription>
                </DialogHeader>
                <AddRuleForm
                  triggerTypes={triggerTypes}
                  actionTypes={actionTypes}
                  onSave={(rule) => {
                    setRules([...rules, rule])
                    setShowAddRule(false)
                  }}
                  onCancel={() => setShowAddRule(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No automation rules yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first rule to automate your sequences based on prospect behavior
              </p>
              <Button onClick={() => setShowAddRule(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {rules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    triggerTypes={triggerTypes}
                    actionTypes={actionTypes}
                    onDelete={() => setRules(rules.filter((r) => r.id !== rule.id))}
                    onToggle={() => {
                      setRules(rules.map((r) => (r.id === rule.id ? { ...r, isActive: !r.isActive } : r)))
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Examples Section */}
      <Card>
        <CardHeader>
          <CardTitle>Common Automation Patterns</CardTitle>
          <CardDescription>Get inspired by these proven automation strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ExamplePattern
            title="Hot Lead Detection"
            description="If prospect opens email 3+ times AND clicks link, send immediate booking link email"
            icon={TrendingUp}
          />
          <ExamplePattern
            title="Re-engagement"
            description="If no reply after 7 days, send different angle email with case study"
            icon={Clock}
          />
          <ExamplePattern
            title="Interest Signal"
            description="If prospect clicks pricing link, notify sales team and send pricing details"
            icon={MousePointerClick}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function AddRuleForm({
  triggerTypes,
  actionTypes,
  onSave,
  onCancel,
}: {
  triggerTypes: any[]
  actionTypes: any[]
  onSave: (rule: SequenceAutomationRule) => void
  onCancel: () => void
}) {
  const [ruleName, setRuleName] = useState("")
  const [triggerType, setTriggerType] = useState("")
  const [triggerValue, setTriggerValue] = useState("")
  const [timeWindow, setTimeWindow] = useState("48")
  const [selectedActions, setSelectedActions] = useState<
    Array<{
      type: "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"
      value?: string
      delay?: number
    }>
  >([])

  const handleSave = () => {
    const newRule: SequenceAutomationRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: ruleName,
      trigger: {
        type: triggerType as any,
        value: triggerValue,
        timeWindow: Number.parseInt(timeWindow),
      },
      conditions: [],
      actions: selectedActions,
      isActive: true,
    }
    onSave(newRule)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Rule Name</Label>
        <Input placeholder="e.g., Hot Lead Detection" value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4" />
          When this happens...
        </h4>
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <Label>Trigger Event</Label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select trigger" />
              </SelectTrigger>
              <SelectContent>
                {triggerTypes.map((trigger) => {
                  const Icon = trigger.icon
                  return (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${trigger.color}`} />
                        {trigger.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {(triggerType === "not_opened" || triggerType === "not_replied" || triggerType === "time_elapsed") && (
            <div className="space-y-2">
              <Label>Time Window (hours)</Label>
              <Input
                type="number"
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                placeholder="48"
              />
            </div>
          )}

          {triggerType === "link_clicked" && (
            <div className="space-y-2">
              <Label>Link URL (contains)</Label>
              <Input
                value={triggerValue}
                onChange={(e) => setTriggerValue(e.target.value)}
                placeholder="pricing, demo, calendly"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Then do this...
        </h4>
        <div className="space-y-3">
          {selectedActions.map((action, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
              <div className="flex-1 space-y-3">
                    <Select
                    value={action.type}
                    onValueChange={(value) => {
                        const newActions = [...selectedActions]
                        newActions[index].type = value as "send_email" | "add_tag" | "change_sequence" | "notify" | "pause" | "move_to_crm"
                        setSelectedActions(newActions)
                    }}
                    >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((act) => {
                      const Icon = act.icon
                      return (
                        <SelectItem key={act.value} value={act.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {act.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                {action.type === "send_email" && (
                  <Input
                    placeholder="Select template..."
                    value={action.value || ""}
                    onChange={(e) => {
                      const newActions = [...selectedActions]
                      newActions[index].value = e.target.value
                      setSelectedActions(newActions)
                    }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <Label className="text-sm">Delay (hours):</Label>
                  <Input
                    type="number"
                    className="w-24"
                    value={action.delay || 0}
                    onChange={(e) => {
                      const newActions = [...selectedActions]
                      newActions[index].delay = Number.parseInt(e.target.value)
                      setSelectedActions(newActions)
                    }}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedActions(selectedActions.filter((_, i) => i !== index))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setSelectedActions([...selectedActions, { type: "send_email", delay: 0 }])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={handleSave} disabled={!ruleName || !triggerType || selectedActions.length === 0}>
          Create Rule
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function RuleCard({
  rule,
  triggerTypes,
  actionTypes,
  onDelete,
  onToggle,
}: {
  rule: SequenceAutomationRule
  triggerTypes: any[]
  actionTypes: any[]
  onDelete: () => void
  onToggle: () => void
}) {
  const trigger = triggerTypes.find((t) => t.value === rule.trigger.type)
  const TriggerIcon = trigger?.icon || Zap

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`border-2 rounded-lg p-4 ${rule.isActive ? "border-primary/30 bg-primary/5" : "border-muted bg-muted/30"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${rule.isActive ? "bg-primary/20" : "bg-muted"}`}>
            <GitBranch className={`h-5 w-5 ${rule.isActive ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h4 className="font-semibold">{rule.name}</h4>
            <Badge variant={rule.isActive ? "default" : "secondary"} className="mt-1">
              {rule.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={rule.isActive} onCheckedChange={onToggle} />
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-blue-500/10 rounded">
              <TriggerIcon className={`h-4 w-4 ${trigger?.color}`} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">When:</p>
            <p className="text-sm text-muted-foreground">{trigger?.label}</p>
            {rule.trigger.timeWindow && (
              <p className="text-xs text-muted-foreground mt-1">Within {rule.trigger.timeWindow} hours</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-green-500/10 rounded">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Then:</p>
            <div className="space-y-1 mt-1">
              {rule.actions.map((action, index) => {
                const actionType = actionTypes.find((a) => a.value === action.type)
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                    <span>{actionType?.label}</span>
                    {action.delay && action.delay > 0 && <span className="text-xs">(after {action.delay}h)</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExamplePattern({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 p-2 bg-primary/10 rounded">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}
