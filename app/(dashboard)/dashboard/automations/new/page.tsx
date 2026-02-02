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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/dashboard/automations')}
                            className="text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">New Automation</h1>
                            <p className="text-slate-400 text-sm">Build your automation workflow</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleSave(false)}
                            disabled={isSaving}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Save & Activate
                        </Button>
                    </div>
                </div>

                {/* Basic Info */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-slate-300">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Follow up on positive replies"
                                className="mt-1.5 bg-slate-900/50 border-slate-600 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-slate-300">Description (optional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What does this automation do?"
                                className="mt-1.5 bg-slate-900/50 border-slate-600 text-white resize-none"
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Trigger Selection */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                                <Zap className="h-4 w-4" />
                            </div>
                            Trigger
                        </CardTitle>
                        <CardDescription>What event should start this automation?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedTrigger ? (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const Icon = getTriggerIcon(selectedTrigger)
                                        return <Icon className="h-5 w-5 text-amber-400" />
                                    })()}
                                    <div>
                                        <div className="font-medium text-white">
                                            {TRIGGERS.flatMap(c => c.items).find(t => t.type === selectedTrigger)?.label}
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {TRIGGERS.flatMap(c => c.items).find(t => t.type === selectedTrigger)?.description}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedTrigger(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {TRIGGERS.map((category) => (
                                    <div key={category.category}>
                                        <h4 className="text-sm font-medium text-slate-400 mb-3">{category.category}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {category.items.map((trigger) => (
                                                <button
                                                    key={trigger.type}
                                                    onClick={() => setSelectedTrigger(trigger.type)}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700/50 border border-transparent hover:border-violet-500/50 text-left transition-all"
                                                >
                                                    <trigger.icon className="h-5 w-5 text-slate-400" />
                                                    <div>
                                                        <div className="font-medium text-white text-sm">{trigger.label}</div>
                                                        <div className="text-xs text-slate-500">{trigger.description}</div>
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
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                                Actions
                            </CardTitle>
                            <CardDescription>What should happen when triggered?</CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowActionSheet(true)}
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Action
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {actions.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                                <Plus className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                                <p className="text-slate-400 mb-4">No actions yet</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowActionSheet(true)}
                                    className="border-slate-600 text-slate-300"
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
                                                    ? 'bg-slate-700/30 border-violet-500/50'
                                                    : 'bg-slate-900/30 border-slate-700/50 hover:border-slate-600'
                                                }`}
                                        >
                                            <div
                                                className="flex items-center gap-3 p-4 cursor-pointer"
                                                onClick={() => setExpandedAction(isExpanded ? null : action.id)}
                                            >
                                                <div className="p-1 text-slate-500 cursor-grab">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                                <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-600">
                                                    {index + 1}
                                                </Badge>
                                                <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                                                    <ActionIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-white">{action.name}</div>
                                                    {action.delayMinutes && action.delayMinutes > 0 && (
                                                        <div className="text-xs text-slate-400">
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
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                                    >
                                                        <ChevronUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); moveAction(action.id, 'down') }}
                                                        disabled={index === actions.length - 1}
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                                    >
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => { e.stopPropagation(); removeAction(action.id) }}
                                                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 space-y-4">
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
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Advanced Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-white">Run Once Per Prospect</Label>
                                <p className="text-sm text-slate-400">Only trigger once for each prospect</p>
                            </div>
                            <Switch checked={runOnce} onCheckedChange={setRunOnce} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-slate-300">Cooldown (minutes)</Label>
                                <Input
                                    type="number"
                                    value={cooldownMin || ''}
                                    onChange={(e) => setCooldownMin(e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="No cooldown"
                                    className="mt-1.5 bg-slate-900/50 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <Label className="text-slate-300">Max Runs (total)</Label>
                                <Input
                                    type="number"
                                    value={maxRuns || ''}
                                    onChange={(e) => setMaxRuns(e.target.value ? parseInt(e.target.value) : undefined)}
                                    placeholder="Unlimited"
                                    className="mt-1.5 bg-slate-900/50 border-slate-600 text-white"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Selection Sheet */}
                <Sheet open={showActionSheet} onOpenChange={setShowActionSheet}>
                    <SheetContent className="bg-slate-900 border-slate-700 w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="text-white">Add Action</SheetTitle>
                            <SheetDescription>Choose an action to add to your workflow</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            {ACTIONS.map((category) => (
                                <div key={category.category}>
                                    <h4 className="text-sm font-medium text-slate-400 mb-3">{category.category}</h4>
                                    <div className="space-y-2">
                                        {category.items.map((action) => (
                                            <button
                                                key={action.type}
                                                onClick={() => addAction(action.type as AutomationActionType)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-transparent hover:border-violet-500/50 text-left transition-all"
                                            >
                                                <action.icon className="h-5 w-5 text-violet-400" />
                                                <div>
                                                    <div className="font-medium text-white text-sm">{action.label}</div>
                                                    <div className="text-xs text-slate-500">{action.description}</div>
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
                <Label className="text-slate-300">Delay before action (minutes)</Label>
                <Input
                    type="number"
                    value={action.delayMinutes || ''}
                    onChange={(e) => onUpdate({ delayMinutes: e.target.value ? parseInt(e.target.value) : 0 })}
                    placeholder="0 (immediate)"
                    className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                />
            </div>

            {/* Action-specific config */}
            {action.type === 'SEND_EMAIL' && (
                <>
                    <div>
                        <Label className="text-slate-300">Email Template</Label>
                        <Select
                            value={(action.config as any)?.templateId || ''}
                            onValueChange={(v) => updateConfig('templateId', v)}
                        >
                            <SelectTrigger className="mt-1.5 bg-slate-900 border-slate-600 text-white">
                                <SelectValue placeholder="Select a template..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="custom">Custom email</SelectItem>
                                {/* Templates would be loaded dynamically */}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-slate-300">Or enter custom subject</Label>
                        <Input
                            value={(action.config as any)?.subject || ''}
                            onChange={(e) => updateConfig('subject', e.target.value)}
                            placeholder="Leave blank to use template"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                </>
            )}

            {action.type === 'ADD_TAG' && (
                <div>
                    <Label className="text-slate-300">Tags to add</Label>
                    <Input
                        value={(action.config as any)?.tags?.join(', ') || ''}
                        onChange={(e) => updateConfig('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                        placeholder="tag1, tag2, tag3"
                        className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                    />
                </div>
            )}

            {action.type === 'REMOVE_TAG' && (
                <div>
                    <Label className="text-slate-300">Tags to remove</Label>
                    <Input
                        value={(action.config as any)?.tags?.join(', ') || ''}
                        onChange={(e) => updateConfig('tags', e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                        placeholder="tag1, tag2, tag3"
                        className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                    />
                </div>
            )}

            {action.type === 'CHANGE_STATUS' && (
                <div>
                    <Label className="text-slate-300">New Status</Label>
                    <Select
                        value={(action.config as any)?.status || ''}
                        onValueChange={(v) => updateConfig('status', v)}
                    >
                        <SelectTrigger className="mt-1.5 bg-slate-900 border-slate-600 text-white">
                            <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
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
                        <Label className="text-slate-300">Slack Channel</Label>
                        <Input
                            value={(action.config as any)?.channel || ''}
                            onChange={(e) => updateConfig('channel', e.target.value)}
                            placeholder="#general"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-300">Message</Label>
                        <Textarea
                            value={(action.config as any)?.message || ''}
                            onChange={(e) => updateConfig('message', e.target.value)}
                            placeholder="Use {{prospect.firstName}} for variables"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white resize-none"
                            rows={3}
                        />
                    </div>
                </>
            )}

            {action.type === 'SEND_WEBHOOK' && (
                <>
                    <div>
                        <Label className="text-slate-300">Webhook URL</Label>
                        <Input
                            value={(action.config as any)?.url || ''}
                            onChange={(e) => updateConfig('url', e.target.value)}
                            placeholder="https://..."
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-300">Method</Label>
                        <Select
                            value={(action.config as any)?.method || 'POST'}
                            onValueChange={(v) => updateConfig('method', v)}
                        >
                            <SelectTrigger className="mt-1.5 bg-slate-900 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
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
                        <Label className="text-slate-300">Minutes</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.minutes || ''}
                            onChange={(e) => updateConfig('minutes', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-300">Hours</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.hours || ''}
                            onChange={(e) => updateConfig('hours', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                    <div>
                        <Label className="text-slate-300">Days</Label>
                        <Input
                            type="number"
                            value={(action.config as any)?.days || ''}
                            onChange={(e) => updateConfig('days', e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="0"
                            className="mt-1.5 bg-slate-900 border-slate-600 text-white"
                        />
                    </div>
                </div>
            )}

            {/* Continue on error toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div>
                    <Label className="text-white text-sm">Continue on Error</Label>
                    <p className="text-xs text-slate-500">Continue automation if this action fails</p>
                </div>
                <Switch
                    checked={action.continueOnError || false}
                    onCheckedChange={(v) => onUpdate({ continueOnError: v })}
                />
            </div>
        </div>
    )
}
