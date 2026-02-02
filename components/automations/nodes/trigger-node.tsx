'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import {
    Zap,
    Mail,
    Users,
    Webhook,
    Clock,
    CheckCircle,
} from 'lucide-react'

const TRIGGER_ICONS: Record<string, React.ElementType> = {
    EMAIL_SENT: Mail,
    EMAIL_OPENED: Mail,
    EMAIL_CLICKED: Mail,
    EMAIL_REPLIED: Mail,
    EMAIL_BOUNCED: Mail,
    SEQUENCE_ENROLLED: Users,
    SEQUENCE_COMPLETED: CheckCircle,
    SEQUENCE_EXITED: Users,
    PROSPECT_CREATED: Users,
    PROSPECT_UPDATED: Users,
    PROSPECT_TAG_ADDED: Users,
    PROSPECT_STATUS_CHANGED: Users,
    WEBHOOK_RECEIVED: Webhook,
    SCHEDULE_TRIGGERED: Clock,
    DEFAULT: Zap,
}

interface TriggerNodeData {
    label: string
    type: string
    config?: Record<string, unknown>
}

function TriggerNodeComponent({ data, selected }: NodeProps<TriggerNodeData>) {
    const Icon = TRIGGER_ICONS[data.type] || TRIGGER_ICONS.DEFAULT

    return (
        <div
            className={`
                px-4 py-3 rounded-xl border-2 min-w-[180px]
                bg-gradient-to-br from-primary/10 to-primary/5
                ${selected
                    ? 'border-primary shadow-lg shadow-primary/20'
                    : 'border-primary/30'
                }
                transition-all duration-200
            `}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-primary/20">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    Trigger
                </span>
            </div>

            {/* Label */}
            <div className="text-sm font-semibold text-foreground">
                {data.label}
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-primary !w-3 !h-3 !border-2 !border-background"
            />
        </div>
    )
}

export const TriggerNode = memo(TriggerNodeComponent)
