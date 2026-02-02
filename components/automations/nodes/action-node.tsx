'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import {
    Mail,
    Send,
    Clock,
    Tag,
    Users,
    Webhook,
    Bell,
    MessageSquare,
    Zap,
    Briefcase,
} from 'lucide-react'

const ACTION_ICONS: Record<string, React.ElementType> = {
    SEND_EMAIL: Send,
    SCHEDULE_EMAIL: Clock,
    PAUSE_SEQUENCE: Clock,
    RESUME_SEQUENCE: Zap,
    REMOVE_FROM_SEQUENCE: Users,
    MOVE_TO_SEQUENCE: Users,
    ADD_TAG: Tag,
    REMOVE_TAG: Tag,
    CHANGE_STATUS: Users,
    UPDATE_PROSPECT: Users,
    MOVE_TO_FOLDER: Briefcase,
    SYNC_TO_CRM: Briefcase,
    CREATE_CRM_DEAL: Briefcase,
    SEND_SLACK: MessageSquare,
    SEND_WEBHOOK: Webhook,
    SEND_NOTIFICATION: Bell,
    CREATE_TASK: Briefcase,
    DELAY: Clock,
    DEFAULT: Zap,
}

const ACTION_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
    SEND_EMAIL: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30', icon: 'text-blue-500' },
    SCHEDULE_EMAIL: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/30', icon: 'text-blue-500' },
    DELAY: { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/30', icon: 'text-amber-500' },
    ADD_TAG: { bg: 'from-green-500/10 to-green-500/5', border: 'border-green-500/30', icon: 'text-green-500' },
    REMOVE_TAG: { bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/30', icon: 'text-red-500' },
    SEND_SLACK: { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/30', icon: 'text-purple-500' },
    SEND_WEBHOOK: { bg: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/30', icon: 'text-orange-500' },
    SYNC_TO_CRM: { bg: 'from-teal-500/10 to-teal-500/5', border: 'border-teal-500/30', icon: 'text-teal-500' },
    DEFAULT: { bg: 'from-muted to-muted/50', border: 'border-border', icon: 'text-muted-foreground' },
}

interface ActionNodeData {
    label: string
    type: string
    config?: Record<string, unknown>
    delayMinutes?: number
}

function ActionNodeComponent({ data, selected }: NodeProps<ActionNodeData>) {
    const Icon = ACTION_ICONS[data.type] || ACTION_ICONS.DEFAULT
    const colors = ACTION_COLORS[data.type] || ACTION_COLORS.DEFAULT

    return (
        <div
            className={`
                px-4 py-3 rounded-xl border-2 min-w-[180px]
                bg-gradient-to-br ${colors.bg}
                ${selected
                    ? `${colors.border.replace('/30', '')} shadow-lg`
                    : colors.border
                }
                transition-all duration-200
            `}
        >
            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Top}
                className={`!bg-muted-foreground !w-3 !h-3 !border-2 !border-background`}
            />

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <div className={`p-1.5 rounded-lg bg-background/50`}>
                    <Icon className={`h-4 w-4 ${colors.icon}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Action
                </span>
            </div>

            {/* Label */}
            <div className="text-sm font-semibold text-foreground">
                {data.label}
            </div>

            {/* Delay indicator */}
            {data.delayMinutes && data.delayMinutes > 0 && (
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Wait {data.delayMinutes}m
                </div>
            )}

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className={`!bg-muted-foreground !w-3 !h-3 !border-2 !border-background`}
            />
        </div>
    )
}

export const ActionNode = memo(ActionNodeComponent)
