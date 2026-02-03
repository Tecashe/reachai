'use client'

import { X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { WorkflowNode } from './workflow-canvas'

interface NodeConfigPanelProps {
    node: WorkflowNode
    onUpdate: (updates: Partial<WorkflowNode['data']>) => void
    onDelete: () => void
    onClose: () => void
}

export function NodeConfigPanel({ node, onUpdate, onDelete, onClose }: NodeConfigPanelProps) {
    const isTrigger = node.type === 'trigger'

    return (
        <div className="w-80 border-l border-border bg-card overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        {isTrigger ? 'Trigger' : 'Action'}
                    </span>
                    <h3 className="text-sm font-semibold">{node.data.label}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Configuration */}
            <div className="p-4 space-y-4">
                {/* Node Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="node-label">Name</Label>
                    <Input
                        id="node-label"
                        value={node.data.label}
                        onChange={(e) => onUpdate({ label: e.target.value })}
                        placeholder="Node name"
                    />
                </div>

                {/* Action-specific: Delay */}
                {!isTrigger && (
                    <div className="space-y-1.5">
                        <Label htmlFor="delay">Delay Before (minutes)</Label>
                        <Input
                            id="delay"
                            type="number"
                            min={0}
                            value={node.data.delayMinutes || 0}
                            onChange={(e) => onUpdate({ delayMinutes: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                        />
                        <p className="text-xs text-muted-foreground">
                            Wait this many minutes before executing
                        </p>
                    </div>
                )}

                {/* Type-specific configuration */}
                {renderTypeConfig(node.data.type, node.data.config || {}, (config) =>
                    onUpdate({ config: { ...node.data.config, ...config } })
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={onDelete}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Node
                </Button>
            </div>
        </div>
    )
}

function renderTypeConfig(
    type: string,
    config: Record<string, unknown>,
    updateConfig: (updates: Record<string, unknown>) => void
) {
    switch (type) {
        // ====== EMAIL ACTIONS ======
        case 'SEND_EMAIL':
        case 'SCHEDULE_EMAIL':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Subject</Label>
                        <Input
                            value={(config.subject as string) || ''}
                            onChange={(e) => updateConfig({ subject: e.target.value })}
                            placeholder="Email subject"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Body</Label>
                        <Textarea
                            value={(config.body as string) || ''}
                            onChange={(e) => updateConfig({ body: e.target.value })}
                            placeholder="Email body (supports variables like {{firstName}})"
                            rows={4}
                        />
                    </div>
                </div>
            )

        // ====== TAG ACTIONS ======
        case 'ADD_TAG':
        case 'REMOVE_TAG':
            return (
                <div className="space-y-1.5">
                    <Label>Tags (comma-separated)</Label>
                    <Input
                        value={(config.tags as string[])?.join(', ') || (config.tag as string) || ''}
                        onChange={(e) => {
                            const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                            updateConfig({ tags, tag: tags[0] || '' })
                        }}
                        placeholder="e.g., interested, contacted"
                    />
                </div>
            )

        // ====== STATUS ACTION ======
        case 'CHANGE_STATUS':
            return (
                <div className="space-y-1.5">
                    <Label>New Status</Label>
                    <Select
                        value={(config.status as string) || ''}
                        onValueChange={(value) => updateConfig({ status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="CONTACTED">Contacted</SelectItem>
                            <SelectItem value="INTERESTED">Interested</SelectItem>
                            <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                            <SelectItem value="CONVERTED">Converted</SelectItem>
                            <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )

        // ====== SEQUENCE ACTIONS ======
        case 'MOVE_TO_SEQUENCE':
            return (
                <div className="space-y-1.5">
                    <Label>Target Sequence ID</Label>
                    <Input
                        value={(config.sequenceId as string) || ''}
                        onChange={(e) => updateConfig({ sequenceId: e.target.value })}
                        placeholder="Enter sequence ID"
                    />
                    <p className="text-xs text-muted-foreground">
                        The sequence to add the prospect to
                    </p>
                </div>
            )

        case 'REMOVE_FROM_SEQUENCE':
            return (
                <div className="space-y-1.5">
                    <Label>Sequence ID (optional)</Label>
                    <Input
                        value={(config.sequenceId as string) || ''}
                        onChange={(e) => updateConfig({ sequenceId: e.target.value })}
                        placeholder="Leave empty to remove from current sequence"
                    />
                </div>
            )

        case 'PAUSE_SEQUENCE':
        case 'RESUME_SEQUENCE':
            return (
                <p className="text-sm text-muted-foreground">
                    This action will {type === 'PAUSE_SEQUENCE' ? 'pause' : 'resume'} the current sequence for this prospect.
                </p>
            )

        // ====== PROSPECT ACTIONS ======
        case 'MOVE_TO_FOLDER':
            return (
                <div className="space-y-1.5">
                    <Label>Folder Name</Label>
                    <Input
                        value={(config.folder as string) || ''}
                        onChange={(e) => updateConfig({ folder: e.target.value })}
                        placeholder="e.g., Hot Leads, Qualified"
                    />
                </div>
            )

        // ====== INTEGRATION ACTIONS ======
        case 'SYNC_TO_CRM':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>CRM Platform</Label>
                        <Select
                            value={(config.platform as string) || ''}
                            onValueChange={(value) => updateConfig({ platform: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select CRM" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HUBSPOT">HubSpot</SelectItem>
                                <SelectItem value="SALESFORCE">Salesforce</SelectItem>
                                <SelectItem value="PIPEDRIVE">Pipedrive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Sync Mode</Label>
                        <Select
                            value={(config.mode as string) || 'upsert'}
                            onValueChange={(value) => updateConfig({ mode: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upsert">Create or Update</SelectItem>
                                <SelectItem value="create">Create Only</SelectItem>
                                <SelectItem value="update">Update Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )

        case 'SEND_SLACK':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Channel</Label>
                        <Input
                            value={(config.channel as string) || ''}
                            onChange={(e) => updateConfig({ channel: e.target.value })}
                            placeholder="#channel or channel ID"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Message</Label>
                        <Textarea
                            value={(config.message as string) || ''}
                            onChange={(e) => updateConfig({ message: e.target.value })}
                            placeholder="Slack message (supports {{variables}})"
                            rows={3}
                        />
                    </div>
                </div>
            )

        case 'SEND_WEBHOOK':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Webhook URL</Label>
                        <Input
                            value={(config.url as string) || ''}
                            onChange={(e) => updateConfig({ url: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Method</Label>
                        <Select
                            value={(config.method as string) || 'POST'}
                            onValueChange={(value) => updateConfig({ method: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Headers (JSON, optional)</Label>
                        <Textarea
                            value={(config.headers as string) || ''}
                            onChange={(e) => updateConfig({ headers: e.target.value })}
                            placeholder='{"Authorization": "Bearer ..."}'
                            rows={2}
                        />
                    </div>
                </div>
            )

        // ====== NOTIFICATION ACTIONS ======
        case 'SEND_NOTIFICATION':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Input
                            value={(config.title as string) || ''}
                            onChange={(e) => updateConfig({ title: e.target.value })}
                            placeholder="Notification title"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Message</Label>
                        <Textarea
                            value={(config.message as string) || ''}
                            onChange={(e) => updateConfig({ message: e.target.value })}
                            placeholder="Notification message (supports {{variables}})"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Type</Label>
                        <Select
                            value={(config.type as string) || 'info'}
                            onValueChange={(value) => updateConfig({ type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )

        case 'CREATE_TASK':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Task Title</Label>
                        <Input
                            value={(config.title as string) || ''}
                            onChange={(e) => updateConfig({ title: e.target.value })}
                            placeholder="Follow up with {{firstName}}"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea
                            value={(config.description as string) || ''}
                            onChange={(e) => updateConfig({ description: e.target.value })}
                            placeholder="Task details..."
                            rows={2}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Due In (days)</Label>
                        <Input
                            type="number"
                            min={0}
                            value={(config.dueDays as number) || 1}
                            onChange={(e) => updateConfig({ dueDays: parseInt(e.target.value) || 1 })}
                        />
                    </div>
                </div>
            )

        // ====== LOGIC ACTIONS ======
        case 'DELAY':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Duration</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Input
                                    type="number"
                                    min={0}
                                    value={(config.days as number) || 0}
                                    onChange={(e) => updateConfig({ days: parseInt(e.target.value) || 0 })}
                                    placeholder="Days"
                                />
                                <span className="text-xs text-muted-foreground">Days</span>
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    min={0}
                                    value={(config.hours as number) || 0}
                                    onChange={(e) => updateConfig({ hours: parseInt(e.target.value) || 0 })}
                                    placeholder="Hours"
                                />
                                <span className="text-xs text-muted-foreground">Hours</span>
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    min={0}
                                    value={(config.minutes as number) || 0}
                                    onChange={(e) => updateConfig({ minutes: parseInt(e.target.value) || 0 })}
                                    placeholder="Mins"
                                />
                                <span className="text-xs text-muted-foreground">Minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            )

        // ====== TRIGGER CONFIGURATIONS ======
        case 'EMAIL_SENT':
        case 'EMAIL_OPENED':
        case 'EMAIL_CLICKED':
        case 'EMAIL_REPLIED':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Campaign Filter (optional)</Label>
                        <Input
                            value={(config.campaignId as string) || ''}
                            onChange={(e) => updateConfig({ campaignId: e.target.value })}
                            placeholder="Leave empty for all campaigns"
                        />
                    </div>
                    {type === 'EMAIL_CLICKED' && (
                        <div className="space-y-1.5">
                            <Label>Link URL Contains (optional)</Label>
                            <Input
                                value={(config.urlContains as string) || ''}
                                onChange={(e) => updateConfig({ urlContains: e.target.value })}
                                placeholder="e.g., pricing, demo"
                            />
                        </div>
                    )}
                </div>
            )

        case 'PROSPECT_CREATED':
        case 'PROSPECT_UPDATED':
            return (
                <div className="space-y-1.5">
                    <Label>Source Filter (optional)</Label>
                    <Input
                        value={(config.source as string) || ''}
                        onChange={(e) => updateConfig({ source: e.target.value })}
                        placeholder="e.g., csv_import, manual"
                    />
                </div>
            )

        case 'WEBHOOK_RECEIVED':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Platform Filter</Label>
                        <Select
                            value={(config.platform as string) || ''}
                            onValueChange={(value) => updateConfig({ platform: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Any platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Any Platform</SelectItem>
                                <SelectItem value="STRIPE">Stripe</SelectItem>
                                <SelectItem value="CALENDLY">Calendly</SelectItem>
                                <SelectItem value="TYPEFORM">Typeform</SelectItem>
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Event Type Filter (optional)</Label>
                        <Input
                            value={(config.eventType as string) || ''}
                            onChange={(e) => updateConfig({ eventType: e.target.value })}
                            placeholder="e.g., payment.success"
                        />
                    </div>
                </div>
            )

        case 'SCHEDULE_TRIGGERED':
            return (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Schedule Type</Label>
                        <Select
                            value={(config.scheduleType as string) || 'daily'}
                            onValueChange={(value) => updateConfig({ scheduleType: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hourly">Every Hour</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Time (for daily/weekly/monthly)</Label>
                        <Input
                            type="time"
                            value={(config.time as string) || '09:00'}
                            onChange={(e) => updateConfig({ time: e.target.value })}
                        />
                    </div>
                </div>
            )

        case 'SEQUENCE_ENROLLED':
        case 'SEQUENCE_COMPLETED':
        case 'SEQUENCE_EXITED':
            return (
                <div className="space-y-1.5">
                    <Label>Sequence Filter (optional)</Label>
                    <Input
                        value={(config.sequenceId as string) || ''}
                        onChange={(e) => updateConfig({ sequenceId: e.target.value })}
                        placeholder="Leave empty for all sequences"
                    />
                </div>
            )

        default:
            return (
                <p className="text-sm text-muted-foreground">
                    No additional configuration for this {type.toLowerCase().replace(/_/g, ' ')}.
                </p>
            )
    }
}
