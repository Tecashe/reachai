'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Save,
    Play,
    Plus,
    GripVertical,
    Trash2,
    ChevronDown,
    ChevronUp,
    Settings,
    Zap,
    Mail,
    Users,
    Clock,
    Tag,
    Send,
    Webhook,
    MessageSquare,
    Bell,
    Pause,
    ArrowRight,
    Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import type { AutomationAction, AutomationActionType } from '@/lib/types/automation-types'

// Trigger definitions
const TRIGGERS = [
    {
        category: 'Email Events',
        items: [
            { type: 'EMAIL_SENT', label: 'Email Sent', icon: Send, description: 'When an email is sent to a prospect' },
            { type: 'EMAIL_OPENED', label: 'Email Opened', icon: Mail, description: 'When a prospect opens an email' },
            { type: 'EMAIL_CLICKED', label: 'Link Clicked', icon: Mail, description: 'When a prospect clicks a link' },
            { type: 'EMAIL_REPLIED', label: 'Email Replied', icon: MessageSquare, description: 'When a prospect replies' },
            { type: 'POSITIVE_REPLY_RECEIVED', label: 'Positive Reply', icon: MessageSquare, description: 'When a positive reply is detected' },
        ]
    },
    {
        category: 'Sequence Events',
        items: [
            { type: 'SEQUENCE_ENROLLED', label: 'Enrolled in Sequence', icon: Users, description: 'When a prospect is enrolled' },
            { type: 'SEQUENCE_COMPLETED', label: 'Sequence Completed', icon: Users, description: 'When a prospect completes a sequence' },
            { type: 'SEQUENCE_EXITED', label: 'Exited Sequence', icon: Users, description: 'When a prospect exits early' },
        ]
    },
    {
        category: 'Prospect Events',
        items: [
            { type: 'PROSPECT_CREATED', label: 'Prospect Created', icon: Users, description: 'When a new prospect is added' },
            { type: 'PROSPECT_TAG_ADDED', label: 'Tag Added', icon: Tag, description: 'When a tag is added to prospect' },
            { type: 'PROSPECT_STATUS_CHANGED', label: 'Status Changed', icon: Users, description: 'When prospect status changes' },
        ]
    },
    {
        category: 'External Events',
        items: [
            { type: 'WEBHOOK_RECEIVED', label: 'Webhook Received', icon: Webhook, description: 'When external webhook is received' },
            { type: 'SCHEDULE_TRIGGERED', label: 'Schedule', icon: Clock, description: 'Run on a schedule' },
        ]
    }
]

// Action definitions
const ACTIONS = [
    {
        category: 'Email',
        items: [
            { type: 'SEND_EMAIL', label: 'Send Email', icon: Send, description: 'Send an email to the prospect' },
            { type: 'SCHEDULE_EMAIL', label: 'Schedule Email', icon: Clock, description: 'Schedule an email for later' },
            { type: 'PAUSE_SEQUENCE', label: 'Pause Sequence', icon: Pause, description: 'Pause the current sequence' },
            { type: 'RESUME_SEQUENCE', label: 'Resume Sequence', icon: Play, description: 'Resume a paused sequence' },
            { type: 'MOVE_TO_SEQUENCE', label: 'Move to Sequence', icon: ArrowRight, description: 'Move to a different sequence' },
        ]
    },
    {
        category: 'Prospect',
        items: [
            { type: 'ADD_TAG', label: 'Add Tag', icon: Tag, description: 'Add a tag to the prospect' },
            { type: 'REMOVE_TAG', label: 'Remove Tag', icon: Tag, description: 'Remove a tag from prospect' },
            { type: 'CHANGE_STATUS', label: 'Change Status', icon: Users, description: 'Update prospect status' },
        ]
    },
    {
        category: 'Integrations',
        items: [
            { type: 'SYNC_TO_CRM', label: 'Sync to CRM', icon: Users, description: 'Sync prospect to connected CRM' },
            { type: 'SEND_SLACK_MESSAGE', label: 'Send Slack Message', icon: MessageSquare, description: 'Send a Slack notification' },
            { type: 'SEND_WEBHOOK', label: 'Send Webhook', icon: Webhook, description: 'Send data to external URL' },
        ]
    },
    {
        category: 'Notifications',
        items: [
            { type: 'SEND_NOTIFICATION', label: 'Send Notification', icon: Bell, description: 'Send an in-app notification' },
        ]
    },
    {
        category: 'Logic',
        items: [
            { type: 'DELAY', label: 'Wait / Delay', icon: Clock, description: 'Wait before next action' },
        ]
    }
]

interface ActionItem extends AutomationAction {
    name?: string
}

export default function NewAutomationPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
    const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>({})
    const [actions, setActions] = useState<ActionItem[]>([])
    const [expandedAction, setExpandedAction] = useState<string | null>(null)
    const [showActionSheet, setShowActionSheet] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Settings
    const [runOnce, setRunOnce] = useState(false)
    const [cooldownMin, setCooldownMin] = useState<number | undefined>()
    const [maxRuns, setMaxRuns] = useState<number | undefined>()

    const addAction = useCallback((actionType: AutomationActionType) => {
        const actionDef = ACTIONS.flatMap(c => c.items).find(a => a.type === actionType)
        if (!actionDef) return

        const newAction: ActionItem = {
            id: `action_${Date.now()}`,
            type: actionType,
            order: actions.length,
            name: actionDef.label,
            config: {},
            delayMinutes: 0,
            continueOnError: false
        }
        setActions([...actions, newAction])
        setShowActionSheet(false)
        setExpandedAction(newAction.id)
    }, [actions])

    const removeAction = useCallback((actionId: string) => {
        setActions(actions.filter(a => a.id !== actionId))
        if (expandedAction === actionId) {
            setExpandedAction(null)
        }
    }, [actions, expandedAction])

    const updateAction = useCallback((actionId: string, updates: Partial<ActionItem>) => {
        setActions(actions.map(a =>
            a.id === actionId ? { ...a, ...updates } : a
        ))
    }, [actions])

    const moveAction = useCallback((actionId: string, direction: 'up' | 'down') => {
        const index = actions.findIndex(a => a.id === actionId)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === actions.length - 1) return

        const newActions = [...actions]
        const swapIndex = direction === 'up' ? index - 1 : index + 1
            ;[newActions[index], newActions[swapIndex]] = [newActions[swapIndex], newActions[index]]

        // Update order values
        newActions.forEach((a, i) => { a.order = i })
        setActions(newActions)
    }, [actions])

    const handleSave = async (activate: boolean = false) => {
        if (!name.trim()) {
            toast.error('Please enter a name for the automation')
            return
        }
        if (!selectedTrigger) {
            toast.error('Please select a trigger')
            return
        }
        if (actions.length === 0) {
            toast.error('Please add at least one action')
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch('/api/automations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    triggerType: selectedTrigger,
                    triggerConfig,
                    actions,
                    runOnce,
                    cooldownMin,
                    maxRuns
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create automation')
            }

            const { automation } = await response.json()

            if (activate) {
                await fetch(`/api/automations/${automation.id}/activate`, { method: 'POST' })
                toast.success('Automation created and activated!')
            } else {
                toast.success('Automation saved as draft')
            }

            router.push('/dashboard/automations')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to save automation')
        } finally {
            setIsSaving(false)
        }
    }

    const getTriggerIcon = (type: string) => {
        const trigger = TRIGGERS.flatMap(c => c.items).find(t => t.type === type)
        return trigger?.icon || Zap
    }

    const getActionIcon = (type: string) => {
        const action = ACTIONS.flatMap(c => c.items).find(a => a.type === type)
        return action?.icon || Zap
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/dashboard/automations')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">New Automation</h1>
                            <p className="text-muted-foreground text-sm">Build your automation workflow</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleSave(false)}
                            disabled={isSaving}
                            className="border-border text-foreground hover:bg-accent"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Save & Activate
                        </Button>
                    </div>
                </div>

                {/* Basic Info */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-foreground">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Follow up on positive replies"
                                className="mt-1.5 bg-background border-input text-foreground"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-foreground">Description (optional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What does this automation do?"
                                className="mt-1.5 bg-background border-input text-foreground resize-none"
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Trigger Selection */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <Zap className="h-4 w-4" />
                            </div>
                            Trigger
                        </CardTitle>
                        <CardDescription>What event should start this automation?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedTrigger ? (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/30">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const Icon = getTriggerIcon(selectedTrigger)
                                        return <Icon className="h-5 w-5 text-primary" />
                                    })()}
                                    <div>
                                        <div className="font-medium text-foreground">
                                            {TRIGGERS.flatMap(c => c.items).find(t => t.type === selectedTrigger)?.label}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {TRIGGERS.flatMap(c => c.items).find(t => t.type === selectedTrigger)?.description}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTrigger(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {TRIGGERS.map((category) => (
                                    <div key={category.category}>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">{category.category}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {category.items.map((trigger) => (
                                                <button
                                                    key={trigger.type}
                                                    onClick={() => setSelectedTrigger(trigger.type)}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-accent border border-transparent hover:border-primary/50 text-left transition-all"
                                                >
                                                    <trigger.icon className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <div className="font-medium text-foreground text-sm">{trigger.label}</div>
                                                        <div className="text-xs text-muted-foreground">{trigger.description}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                                Actions
                            </CardTitle>
                            <CardDescription>What should happen when triggered?</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowActionSheet(true)}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Action
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {actions.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                                <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground mb-4">No actions yet</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowActionSheet(true)}
                                    className="border-border text-foreground"
                                >
                                    Add your first action
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {actions.map((action, index) => {
                                    const ActionIcon = getActionIcon(action.type)
                                    const isExpanded = expandedAction === action.id

                                    return (
                                        <div
                                            key={action.id}
                                            className={`rounded-xl border transition-all ${isExpanded
                                                ? 'bg-accent/50 border-primary/50'
                                                : 'bg-muted/30 border-border hover:border-muted-foreground/50'
                                                }`}
                                        >
                                            <div
                                                className="flex items-center gap-3 p-4 cursor-pointer"
                                                onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                                            >
                                                <div className="p-1 text-muted-foreground cursor-grab">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                                                    {index + 1}
                                                </Badge>
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                    <ActionIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-foreground">{action.name}</div>
                                                    {action.delayMinutes && action.delayMinutes > 0 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Wait {action.delayMinutes} minutes before executing
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); moveAction(action.id, 'up') }}
                                                        disabled={index === 0}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); moveAction(action.id, 'down') }}
                                                        disabled={index === actions.length - 1}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); removeAction(action.id) }}
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                                                    <ActionConfigPanel
                                                        action={action}
                                                        onUpdate={(updates) => updateAction(action.id, updates)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Settings */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Advanced Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-foreground">Run Once Per Prospect</Label>
                                <p className="text-sm text-muted-foreground">Only trigger once for each prospect</p>
                            </div>
                            <Switch checked={runOnce} onCheckedChange={setRunOnce} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-foreground">Cooldown (minutes)</Label>
                                <Input
                                    type="number"
                                    value={cooldownMin || ''}
                                    onChange={(e) => setCooldownMin(e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="No cooldown"
                                    className="mt-1.5 bg-background border-input text-foreground"
                                />
                            </div>
                            <div>
                                <Label className="text-foreground">Max Runs (total)</Label>
                                <Input
                                    type="number"
                                    value={maxRuns || ''}
                                    onChange={(e) => setMaxRuns(e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="Unlimited"
                                    className="mt-1.5 bg-background border-input text-foreground"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Selection Sheet */}
                <Sheet open={showActionSheet} onOpenChange={setShowActionSheet}>
                    <SheetContent className="bg-card border-border w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-foreground">Add Action</SheetTitle>
                            <SheetDescription>Choose an action to add to your workflow</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            {ACTIONS.map((category) => (
                                <div key={category.category}>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-3">{category.category}</h4>
                                    <div className="space-y-2">
                                        {category.items.map((action) => (
                                            <button
                                                key={action.type}
                                                onClick={() => addAction(action.type as AutomationActionType)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-accent border border-transparent hover:border-primary/50 text-left transition-all"
                                            >
                                                <action.icon className="h-5 w-5 text-primary" />
                                                <div>
                                                    <div className="font-medium text-foreground text-sm">{action.label}</div>
                                                    <div className="text-xs text-muted-foreground">{action.description}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

// Action Configuration Panel
function ActionConfigPanel({
    action,
    onUpdate
}: {
    action: ActionItem
    onUpdate: (updates: Partial<ActionItem>) => void
}) {
    const updateConfig = (key: string, value: unknown) => {
        onUpdate({ config: { ...action.config, [key]: value } })
    }

    return (
        <div className="space-y-4">
            {/* Delay setting for all actions */}
            <div>
                <Label className="text-foreground">Delay before action (minutes)</Label>
                <Input
                    type="number"
                    value={action.delayMinutes || ''}
                    onChange={(e) => onUpdate({ delayMinutes: e.target.value ? parseInt(e.target.value) : 0 })}
                    placeholder="0 (immediate)"
                    className="mt-1.5 bg-background border-input text-foreground"
                />
            </div>

            {/* Action-specific config */}
            {action.type === 'SEND_EMAIL' && (
                <>
                    <div>
                        <Label className="text-foreground">Email Template</Label>
                        <Select
                            value={(action.config as any)?.templateId || ''}
                            onValueChange={(v) => updateConfig('templateId', v)}
                        >
                            <SelectTrigger className="mt-1.5 bg-background border-input text-foreground">
                                <SelectValue placeholder="Select a template..." />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="custom">Custom email</SelectItem>
                                {/* Templates would be loaded dynamically */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-foreground">Or enter custom subject</Label>
                        <Input
                            value={(action.config as any)?.subject || ''}
                            onChange={(e) => updateConfig('subject', e.target.value)}
                            placeholder="Leave blank to use template"
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                </>
            )}

            {action.type === 'ADD_TAG' && (
                <div>
                    <Label className="text-foreground">Tags to add</Label>
                    <Input
                        value={(action.config as any)?.tags?.join(', ') || ''}
                        onChange={(e) => updateConfig('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                        placeholder="tag1, tag2, tag3"
                        className="mt-1.5 bg-background border-input text-foreground"
                    />
                </div>
            )}

            {action.type === 'REMOVE_TAG' && (
                <div>
                    <Label className="text-foreground">Tags to remove</Label>
                    <Input
                        value={(action.config as any)?.tags?.join(', ') || ''}
                        onChange={(e) => updateConfig('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                        placeholder="tag1, tag2, tag3"
                        className="mt-1.5 bg-background border-input text-foreground"
                    />
                </div>
            )}

            {action.type === 'CHANGE_STATUS' && (
                <div>
                    <Label className="text-foreground">New Status</Label>
                    <Select
                        value={(action.config as any)?.status || ''}
                        onValueChange={(v) => updateConfig('status', v)}
                    >
                        <SelectTrigger className="mt-1.5 bg-background border-input text-foreground">
                            <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="REPLIED">Replied</SelectItem>
                            <SelectItem value="INTERESTED">Interested</SelectItem>
                            <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {action.type === 'SEND_SLACK_MESSAGE' && (
                <>
                    <div>
                        <Label className="text-foreground">Slack Channel</Label>
                        <Input
                            value={(action.config as any)?.channel || ''}
                            onChange={(e) => updateConfig('channel', e.target.value)}
                            placeholder="#general"
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                    <div>
                        <Label className="text-foreground">Message</Label>
                        <Textarea
                            value={(action.config as any)?.message || ''}
                            onChange={(e) => updateConfig('message', e.target.value)}
                            placeholder="Use {{prospect.firstName}} for variables"
                            className="mt-1.5 bg-background border-input text-foreground resize-none"
                            rows={3}
                        />
                    </div>
                </>
            )}

            {action.type === 'SEND_WEBHOOK' && (
                <>
                    <div>
                        <Label className="text-foreground">Webhook URL</Label>
                        <Input
                            value={(action.config as any)?.url || ''}
                            onChange={(e) => updateConfig('url', e.target.value)}
                            placeholder="https://..."
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                    <div>
                        <Label className="text-foreground">Method</Label>
                        <Select
                            value={(action.config as any)?.method || 'POST'}
                            onValueChange={(v) => updateConfig('method', v)}
                        >
                            <SelectTrigger className="mt-1.5 bg-background border-input text-foreground">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            {action.type === 'DELAY' && (
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label className="text-foreground">Minutes</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.minutes || ''}
                            onChange={(e) => updateConfig('minutes', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                    <div>
                        <Label className="text-foreground">Hours</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.hours || ''}
                            onChange={(e) => updateConfig('hours', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                    <div>
                        <Label className="text-foreground">Days</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.days || ''}
                            onChange={(e) => updateConfig('days', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-background border-input text-foreground"
                        />
                    </div>
                </div>
            )}

            {/* Continue on error toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                    <Label className="text-foreground text-sm">Continue on Error</Label>
                    <p className="text-xs text-muted-foreground">Continue automation if this action fails</p>
                </div>
                <Switch
                    checked={action.continueOnError || false}
                    onCheckedChange={(v) => onUpdate({ continueOnError: v })}
                />
            </div>
        </div>
    )
}
