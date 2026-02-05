'use client'

import {
    Mail,
    Send,
    Clock,
    Tag,
    Users,
    Webhook,
    Bell,
    Zap,
    Briefcase,
    CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface DraggableItem {
    nodeType: 'trigger' | 'action'
    type: string
    label: string
    icon?: React.ElementType
    category: string
    provider?: string // For integration actions
}

// Provider icon file mapping
const PROVIDER_ICON_MAP: Record<string, string> = {
    'HUBSPOT': 'hubspot',
    'SALESFORCE': 'salesforce',
    'PIPEDRIVE': 'pipedrive',
    'SLACK': 'slack',
    'NOTION': 'notion',
    'AIRTABLE': 'airtable',
    'TRELLO': 'trello',
    'ASANA': 'asana',
    'ZOHO_CRM': 'zoho_crm',
    'CLICKUP': 'clickup',
    'GOOGLE_SHEETS': 'google_sheets',
}

const TRIGGERS: DraggableItem[] = [
    { nodeType: 'trigger', type: 'EMAIL_SENT', label: 'Email Sent', icon: Send, category: 'Email' },
    { nodeType: 'trigger', type: 'EMAIL_OPENED', label: 'Email Opened', icon: Mail, category: 'Email' },
    { nodeType: 'trigger', type: 'EMAIL_CLICKED', label: 'Email Clicked', icon: Mail, category: 'Email' },
    { nodeType: 'trigger', type: 'EMAIL_REPLIED', label: 'Email Replied', icon: Mail, category: 'Email' },
    { nodeType: 'trigger', type: 'SEQUENCE_ENROLLED', label: 'Sequence Enrolled', icon: Users, category: 'Sequence' },
    { nodeType: 'trigger', type: 'SEQUENCE_COMPLETED', label: 'Sequence Completed', icon: CheckCircle, category: 'Sequence' },
    { nodeType: 'trigger', type: 'PROSPECT_CREATED', label: 'Prospect Created', icon: Users, category: 'Prospect' },
    { nodeType: 'trigger', type: 'PROSPECT_UPDATED', label: 'Prospect Updated', icon: Users, category: 'Prospect' },
    { nodeType: 'trigger', type: 'WEBHOOK_RECEIVED', label: 'Webhook Received', icon: Webhook, category: 'Integration' },
]

const ACTIONS: DraggableItem[] = [
    // Email
    { nodeType: 'action', type: 'SEND_EMAIL', label: 'Send Email', icon: Send, category: 'Email' },
    { nodeType: 'action', type: 'SCHEDULE_EMAIL', label: 'Schedule Email', icon: Clock, category: 'Email' },
    // Sequence
    { nodeType: 'action', type: 'MOVE_TO_SEQUENCE', label: 'Add to Sequence', icon: Users, category: 'Sequence' },
    { nodeType: 'action', type: 'REMOVE_FROM_SEQUENCE', label: 'Remove from Sequence', icon: Users, category: 'Sequence' },
    { nodeType: 'action', type: 'PAUSE_SEQUENCE', label: 'Pause Sequence', icon: Clock, category: 'Sequence' },
    { nodeType: 'action', type: 'RESUME_SEQUENCE', label: 'Resume Sequence', icon: Zap, category: 'Sequence' },
    // Prospect
    { nodeType: 'action', type: 'ADD_TAG', label: 'Add Tag', icon: Tag, category: 'Prospect' },
    { nodeType: 'action', type: 'REMOVE_TAG', label: 'Remove Tag', icon: Tag, category: 'Prospect' },
    { nodeType: 'action', type: 'CHANGE_STATUS', label: 'Change Status', icon: Users, category: 'Prospect' },
    { nodeType: 'action', type: 'MOVE_TO_FOLDER', label: 'Move to Folder', icon: Briefcase, category: 'Prospect' },

    // CRM Integrations (with provider icons)
    { nodeType: 'action', type: 'SYNC_TO_HUBSPOT', label: 'Sync to HubSpot', category: 'CRM', provider: 'HUBSPOT' },
    { nodeType: 'action', type: 'SYNC_TO_SALESFORCE', label: 'Sync to Salesforce', category: 'CRM', provider: 'SALESFORCE' },
    { nodeType: 'action', type: 'SYNC_TO_PIPEDRIVE', label: 'Sync to Pipedrive', category: 'CRM', provider: 'PIPEDRIVE' },

    // Communication Integrations
    { nodeType: 'action', type: 'SEND_SLACK_MESSAGE', label: 'Send Slack Message', category: 'Communication', provider: 'SLACK' },

    // Productivity Integrations
    { nodeType: 'action', type: 'ADD_TO_NOTION', label: 'Add to Notion', category: 'Productivity', provider: 'NOTION' },
    { nodeType: 'action', type: 'ADD_TO_AIRTABLE', label: 'Add to Airtable', category: 'Productivity', provider: 'AIRTABLE' },
    { nodeType: 'action', type: 'CREATE_TRELLO_CARD', label: 'Create Trello Card', category: 'Productivity', provider: 'TRELLO' },
    { nodeType: 'action', type: 'CREATE_ASANA_TASK', label: 'Create Asana Task', category: 'Productivity', provider: 'ASANA' },

    // Other Integrations
    { nodeType: 'action', type: 'SEND_WEBHOOK', label: 'Send Webhook', icon: Webhook, category: 'Other' },

    // Notifications
    { nodeType: 'action', type: 'SEND_NOTIFICATION', label: 'Send Notification', icon: Bell, category: 'Notification' },
    { nodeType: 'action', type: 'CREATE_TASK', label: 'Create Task', icon: Briefcase, category: 'Task' },
    // Logic
    { nodeType: 'action', type: 'DELAY', label: 'Wait / Delay', icon: Clock, category: 'Logic' },
]

function DraggableNodeItem({ item }: { item: DraggableItem }) {
    const onDragStart = (event: React.DragEvent) => {
        event.dataTransfer.setData(
            'application/reactflow',
            JSON.stringify({
                nodeType: item.nodeType,
                type: item.type,
                label: item.label,
                provider: item.provider,
            })
        )
        event.dataTransfer.effectAllowed = 'move'
    }

    // Render provider icon for integration actions
    const renderIcon = () => {
        if (item.provider && PROVIDER_ICON_MAP[item.provider]) {
            const iconFileName = PROVIDER_ICON_MAP[item.provider]
            return (
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    <Image
                        src={`/icons/${iconFileName}.svg`}
                        alt={`${item.provider} icon`}
                        width={16}
                        height={16}
                        className="object-contain"
                    />
                </div>
            )
        }

        // Fallback to Lucide icon
        if (item.icon) {
            const IconComponent = item.icon
            return <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        }

        return <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    }

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab",
                "bg-card border border-border hover:border-primary/50",
                "transition-all duration-200 hover:shadow-sm",
                "active:cursor-grabbing"
            )}
            draggable
            onDragStart={onDragStart}
        >
            {renderIcon()}
            <span className="text-sm">{item.label}</span>
        </div>
    )
}

export function WorkflowSidebar() {
    const triggerCategories = [...new Set(TRIGGERS.map((t) => t.category))]
    const actionCategories = [...new Set(ACTIONS.map((a) => a.category))]

    return (
        <div className="w-64 border-r border-border bg-card/50 overflow-y-auto p-4 space-y-6">
            {/* Triggers Section */}
            <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Triggers
                </h3>
                {triggerCategories.map((category) => (
                    <div key={category} className="mb-3">
                        <span className="text-xs text-muted-foreground mb-1 block">
                            {category}
                        </span>
                        <div className="space-y-1.5">
                            {TRIGGERS.filter((t) => t.category === category).map((trigger) => (
                                <DraggableNodeItem key={trigger.type} item={trigger} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions Section */}
            <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Actions
                </h3>
                {actionCategories.map((category) => (
                    <div key={category} className="mb-3">
                        <span className="text-xs text-muted-foreground mb-1 block">
                            {category}
                        </span>
                        <div className="space-y-1.5">
                            {ACTIONS.filter((a) => a.category === category).map((action) => (
                                <DraggableNodeItem key={action.type} item={action} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
