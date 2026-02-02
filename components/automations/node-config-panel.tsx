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

        case 'ADD_TAG':
        case 'REMOVE_TAG':
            return (
                <div className="space-y-1.5">
                    <Label>Tag Name</Label>
                    <Input
                        value={(config.tag as string) || ''}
                        onChange={(e) => updateConfig({ tag: e.target.value })}
                        placeholder="e.g., interested, contacted"
                    />
                </div>
            )

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
                </div>
            )

        case 'DELAY':
            return (
                <div className="space-y-1.5">
                    <Label>Duration (minutes)</Label>
                    <Input
                        type="number"
                        min={1}
                        value={(config.durationMinutes as number) || 60}
                        onChange={(e) => updateConfig({ durationMinutes: parseInt(e.target.value) || 60 })}
                    />
                    <p className="text-xs text-muted-foreground">
                        Pause workflow for this duration
                    </p>
                </div>
            )

        case 'MOVE_TO_SEQUENCE':
            return (
                <div className="space-y-1.5">
                    <Label>Sequence ID</Label>
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

        default:
            return (
                <p className="text-sm text-muted-foreground">
                    No additional configuration for this {type.toLowerCase().replace(/_/g, ' ')}.
                </p>
            )
    }
}
