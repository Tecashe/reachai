'use client'

import { useCallback, useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    ReactFlowProvider,
    BackgroundVariant,
    Panel,
    MarkerType,
    Handle,
    Position,
    Connection,
    ConnectionMode,
    useReactFlow,
    reconnectEdge,
    type OnConnectStart,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Plus, Zap, Settings, Trash2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NodeConfigPanel } from './node-config-panel'
import CustomEdge, { edgeStyles } from './edges/custom-edge'
import ConditionNodeComponent from './nodes/condition-node'
import type { AutomationAction, AutomationActionType } from '@/lib/types/automation-types'

// ============================================================
// TYPES
// ============================================================

export interface WorkflowNode extends Node {
    data: {
        label: string
        type: string
        config?: Record<string, unknown>
        delayMinutes?: number
        isConfigured?: boolean
    }
}

interface WorkflowCanvasProps {
    initialNodes?: WorkflowNode[]
    initialEdges?: Edge[]
    onDataChange?: (data: { nodes: WorkflowNode[]; edges: Edge[]; triggerType: string | null; triggerConfig: Record<string, unknown> }) => void
}

export interface WorkflowCanvasRef {
    getWorkflowData: () => { nodes: WorkflowNode[]; edges: Edge[]; triggerType: string | null; triggerConfig: Record<string, unknown> }
}

// ============================================================
// TRIGGER & ACTION DEFINITIONS
// ============================================================

const TRIGGERS = [
    { type: 'EMAIL_SENT', label: 'Email Sent', category: 'Email' },
    { type: 'EMAIL_OPENED', label: 'Email Opened', category: 'Email' },
    { type: 'EMAIL_CLICKED', label: 'Link Clicked', category: 'Email' },
    { type: 'EMAIL_REPLIED', label: 'Reply Received', category: 'Email' },
    { type: 'PROSPECT_CREATED', label: 'Prospect Created', category: 'Prospect' },
    { type: 'PROSPECT_UPDATED', label: 'Prospect Updated', category: 'Prospect' },
    { type: 'SEQUENCE_ENROLLED', label: 'Sequence Started', category: 'Sequence' },
    { type: 'SEQUENCE_COMPLETED', label: 'Sequence Completed', category: 'Sequence' },
    { type: 'WEBHOOK_RECEIVED', label: 'Webhook Received', category: 'Communication' },
]

const ACTIONS: { type: string; label: string; category: string; provider?: string }[] = [
    { type: 'SEND_EMAIL', label: 'Send Email', category: 'Email' },
    { type: 'SCHEDULE_EMAIL', label: 'Schedule Email', category: 'Email' },
    { type: 'ADD_TAG', label: 'Add Tag', category: 'Prospect' },
    { type: 'REMOVE_TAG', label: 'Remove Tag', category: 'Prospect' },
    { type: 'CHANGE_STATUS', label: 'Change Status', category: 'Prospect' },
    { type: 'MOVE_TO_FOLDER', label: 'Move to Folder', category: 'Prospect' },
    { type: 'MOVE_TO_SEQUENCE', label: 'Add to Sequence', category: 'Sequence' },
    { type: 'REMOVE_FROM_SEQUENCE', label: 'Remove from Sequence', category: 'Sequence' },
    { type: 'PAUSE_SEQUENCE', label: 'Pause Sequence', category: 'Sequence' },
    { type: 'RESUME_SEQUENCE', label: 'Resume Sequence', category: 'Sequence' },

    // CRM
    { type: 'SYNC_TO_HUBSPOT', label: 'Sync to HubSpot', category: 'CRM', provider: 'HUBSPOT' },
    { type: 'SYNC_TO_SALESFORCE', label: 'Sync to Salesforce', category: 'CRM', provider: 'SALESFORCE' },
    { type: 'SYNC_TO_PIPEDRIVE', label: 'Sync to Pipedrive', category: 'CRM', provider: 'PIPEDRIVE' },

    // Communication
    { type: 'SEND_SLACK_MESSAGE', label: 'Send Slack Message', category: 'Communication', provider: 'SLACK' },
    { type: 'SEND_WEBHOOK', label: 'Send Webhook', category: 'Communication' },

    // Productivity
    { type: 'ADD_TO_NOTION', label: 'Add to Notion', category: 'Productivity', provider: 'NOTION' },
    { type: 'ADD_TO_AIRTABLE', label: 'Add to Airtable', category: 'Productivity', provider: 'AIRTABLE' },
    { type: 'CREATE_TRELLO_CARD', label: 'Create Trello Card', category: 'Productivity', provider: 'TRELLO' },
    { type: 'CREATE_ASANA_TASK', label: 'Create Asana Task', category: 'Productivity', provider: 'ASANA' },

    // Other
    { type: 'SEND_NOTIFICATION', label: 'Send Notification', category: 'Notification' },
    { type: 'CREATE_TASK', label: 'Create Task', category: 'Task' },
    { type: 'DELAY', label: 'Wait / Delay', category: 'Logic' },
    { type: 'CONDITION_BRANCH', label: 'If / Else Branch', category: 'Logic' },
]

import Image from 'next/image'
import {
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'

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

// ============================================================
// CUSTOM NODE COMPONENTS
// ============================================================

function TriggerNodeComponent({ data, id, selected }: { data: WorkflowNode['data']; id: string; selected?: boolean }) {
    const { onSelectTrigger, onConfigure, onAddAction, isConfigured, type, label, provider } = data as any

    const categories = ['Email', 'Prospect', 'Sequence', 'Communication', 'CRM', 'Productivity', 'Other']

    return (
        <div className={cn(
            "w-44 rounded-lg border-2 bg-card shadow-md transition-all duration-200 relative",
            selected ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10" : "border-amber-500/50",
            "hover:shadow-lg hover:scale-[1.02]"
        )}>
            {/* Source Handle (Right) */}
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                className={cn(
                    "!w-3 !h-3 !bg-primary !border-2 !border-background",
                    "!-right-1.5 !top-1/2 !-translate-y-1/2",
                    "transition-all duration-200",
                    "hover:!w-4 hover:!h-4 hover:!shadow-lg hover:!shadow-primary/50",
                    "after:content-[''] after:absolute after:inset-0 after:rounded-full",
                    "after:animate-ping after:bg-primary/30"
                )}
                style={{ zIndex: 10 }}
            />
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-t-md border-b border-border">
                <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-amber-500/20">
                        <Zap className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Trigger</span>
                </div>
                {isConfigured && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-amber-500/20"
                        onClick={(e) => { e.stopPropagation(); onConfigure?.(id) }}
                    >
                        <Settings className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-2.5">
                {!isConfigured ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full justify-between text-xs h-8">
                                Select a trigger...
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="start">
                            {categories.map((category) => {
                                const categoryTriggers = TRIGGERS.filter(t => t.category === category)
                                if (categoryTriggers.length === 0) return null
                                return (
                                    <DropdownMenuSub key={category}>
                                        <DropdownMenuSubTrigger className="text-xs">
                                            {category}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="w-48">
                                                {categoryTriggers.map((trigger) => (
                                                    <DropdownMenuItem
                                                        key={trigger.type}
                                                        onClick={() => onSelectTrigger?.(id, trigger.type, trigger.label)}
                                                        className="text-xs"
                                                    >
                                                        {trigger.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="space-y-1.5 text-center">
                        <span className="font-medium text-foreground text-sm truncate block px-1">{label}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] opacity-50 hover:opacity-100">
                                    Change Trigger
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="center">
                                {categories.map((category) => {
                                    const categoryTriggers = TRIGGERS.filter(t => t.category === category)
                                    if (categoryTriggers.length === 0) return null
                                    return (
                                        <DropdownMenuSub key={category}>
                                            <DropdownMenuSubTrigger className="text-xs">
                                                {category}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="w-48">
                                                    {categoryTriggers.map((trigger) => (
                                                        <DropdownMenuItem
                                                            key={trigger.type}
                                                            onClick={() => onSelectTrigger?.(id, trigger.type, trigger.label)}
                                                            className="text-xs"
                                                        >
                                                            {trigger.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Add Action Button */}
            {isConfigured && (
                <div className="px-2.5 pb-2.5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-7 text-xs border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Action
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="center">
                            {['Email', 'Prospect', 'Sequence', 'Communication', 'CRM', 'Productivity', 'Notification', 'Task', 'Logic'].map((category) => {
                                const categoryActions = ACTIONS.filter(a => a.category === category)
                                if (categoryActions.length === 0) return null
                                return (
                                    <DropdownMenuSub key={category}>
                                        <DropdownMenuSubTrigger className="text-xs">
                                            {category}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="w-56">
                                                {categoryActions.map((action) => (
                                                    <DropdownMenuItem
                                                        key={action.type}
                                                        onClick={() => onAddAction?.(id, action.type, action.label)}
                                                        className="py-2 px-3"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {action.provider && PROVIDER_ICON_MAP[action.provider] ? (
                                                                <Image
                                                                    src={`/icons/${PROVIDER_ICON_MAP[action.provider]}.svg`}
                                                                    alt={action.provider}
                                                                    width={14}
                                                                    height={14}
                                                                    className="object-contain"
                                                                />
                                                            ) : (
                                                                <Plus className="h-3 w-3 text-muted-foreground opacity-50" />
                                                            )}
                                                            <span className="text-xs">{action.label}</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
}

function ActionNodeComponent({ data, id, selected }: { data: WorkflowNode['data']; id: string; selected?: boolean }) {
    const { onConfigure, onDelete, onAddAction, type, label, provider } = data as any

    // Color based on category
    const actionDef = ACTIONS.find(a => a.type === type)
    const category = actionDef?.category || 'Action'
    const currentProvider = provider || actionDef?.provider

    const colors = {
        Email: 'from-blue-500/10 to-cyan-500/10 border-blue-500/50 text-blue-600',
        Prospect: 'from-green-500/10 to-emerald-500/10 border-green-500/50 text-green-600',
        Sequence: 'from-purple-500/10 to-violet-500/10 border-purple-500/50 text-purple-600',
        Communication: 'from-pink-500/10 to-rose-500/10 border-pink-500/50 text-pink-600',
        CRM: 'from-orange-500/10 to-amber-500/10 border-orange-500/50 text-orange-600',
        Productivity: 'from-stone-500/10 to-neutral-500/10 border-stone-500/50 text-stone-600',
        Notification: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/50 text-yellow-600',
        Task: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/50 text-indigo-600',
        Logic: 'from-slate-500/10 to-gray-500/10 border-slate-500/50 text-slate-600',
    }
    const colorClass = colors[category as keyof typeof colors] || colors.Logic
    const borderColor = colorClass.split(' ')[2]
    const textColor = colorClass.split(' ')[3]

    return (
        <div className={cn(
            "w-44 rounded-lg border-2 bg-card shadow-md transition-all duration-200 relative",
            selected ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10" : borderColor,
            "hover:shadow-lg hover:scale-[1.02]"
        )}>
            {/* Target Handle (Left) */}
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                className={cn(
                    "!w-3 !h-3 !bg-primary !border-2 !border-background",
                    "!-left-1.5 !top-1/2 !-translate-y-1/2",
                    "transition-all duration-200",
                    "hover:!w-4 hover:!h-4 hover:!shadow-lg hover:!shadow-primary/50"
                )}
                style={{ zIndex: 10 }}
            />

            {/* Source Handle (Right) */}
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                className={cn(
                    "!w-3 !h-3 !bg-primary !border-2 !border-background",
                    "!-right-1.5 !top-1/2 !-translate-y-1/2",
                    "transition-all duration-200",
                    "hover:!w-4 hover:!h-4 hover:!shadow-lg hover:!shadow-primary/50",
                    "after:content-[''] after:absolute after:inset-0 after:rounded-full",
                    "after:animate-ping after:bg-primary/30"
                )}
                style={{ zIndex: 10 }}
            />
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between px-3 py-2 rounded-t-md border-b border-border bg-gradient-to-r",
                colorClass.split(' ').slice(0, 2).join(' ')
            )}>
                <div className="flex items-center gap-1.5">
                    {currentProvider && PROVIDER_ICON_MAP[currentProvider] ? (
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                            <Image
                                src={`/icons/${PROVIDER_ICON_MAP[currentProvider]}.svg`}
                                alt={currentProvider}
                                width={14}
                                height={14}
                                className="object-contain"
                            />
                        </div>
                    ) : (
                        <Zap className={cn("h-3.5 w-3.5", textColor)} />
                    )}
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", textColor)}>
                        {category}
                    </span>
                </div>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-white/20"
                        onClick={(e) => { e.stopPropagation(); onConfigure?.(id) }}
                    >
                        <Settings className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-destructive/20 hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete?.(id) }}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-2.5">
                <span className="font-medium text-foreground text-sm truncate block">{label}</span>
            </div>

            {/* Add Next Action Button */}
            <div className="px-2.5 pb-2.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-7 text-xs border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Next
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="center">
                        {['Email', 'Prospect', 'Sequence', 'Communication', 'CRM', 'Productivity', 'Notification', 'Task', 'Logic'].map((category) => {
                            const categoryActions = ACTIONS.filter(a => a.category === category)
                            if (categoryActions.length === 0) return null
                            return (
                                <DropdownMenuSub key={category}>
                                    <DropdownMenuSubTrigger className="text-xs">
                                        {category}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="w-56">
                                            {categoryActions.map((action) => (
                                                <DropdownMenuItem
                                                    key={action.type}
                                                    onClick={() => onAddAction?.(id, action.type, action.label)}
                                                    className="py-2 px-3"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {action.provider && PROVIDER_ICON_MAP[action.provider] ? (
                                                            <Image
                                                                src={`/icons/${PROVIDER_ICON_MAP[action.provider]}.svg`}
                                                                alt={action.provider}
                                                                width={14}
                                                                height={14}
                                                                className="object-contain"
                                                            />
                                                        ) : (
                                                            <Plus className="h-3 w-3 text-muted-foreground opacity-50" />
                                                        )}
                                                        <span className="text-xs">{action.label}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

// Node types for ReactFlow
const nodeTypes = {
    trigger: TriggerNodeComponent,
    action: ActionNodeComponent,
    condition: ConditionNodeComponent,
}

// Edge types for ReactFlow
const edgeTypes = {
    custom: CustomEdge,
}

// ============================================================
// MAIN CANVAS COMPONENT
// ============================================================

let nodeIdCounter = 0
const generateNodeId = () => `node_${Date.now()}_${nodeIdCounter++}`

// Default trigger node
const createDefaultTriggerNode = (): WorkflowNode => ({
    id: 'trigger_main',
    type: 'trigger',
    position: { x: 50, y: 150 },
    data: {
        label: 'Select a trigger',
        type: '',
        config: {},
        isConfigured: false,
    },
})

export const WorkflowCanvas = forwardRef<WorkflowCanvasRef, WorkflowCanvasProps>(function WorkflowCanvas({
    initialNodes = [],
    initialEdges = [],
}, ref) {
    const defaultNodes = initialNodes.length > 0 ? initialNodes : [createDefaultTriggerNode()]

    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [showConfigPanel, setShowConfigPanel] = useState(false)

    // Get trigger info from nodes
    const getTriggerInfo = useCallback(() => {
        const triggerNode = nodes.find((n) => n.type === 'trigger')
        if (!triggerNode || !triggerNode.data.isConfigured) {
            return { type: null, config: {} }
        }
        return {
            type: triggerNode.data.type || null,
            config: triggerNode.data.config || {},
        }
    }, [nodes])

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getWorkflowData: () => {
            const trigger = getTriggerInfo()
            return {
                nodes: nodes as WorkflowNode[],
                edges,
                triggerType: trigger.type,
                triggerConfig: trigger.config,
            }
        },
    }), [nodes, edges, getTriggerInfo])

    // Handle selecting a trigger type
    const handleSelectTrigger = useCallback((nodeId: string, triggerType: string, label: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: { ...node.data, type: triggerType, label, isConfigured: true },
                    }
                }
                return node
            })
        )
    }, [setNodes])

    // Handle adding an action after a node
    const handleAddAction = useCallback((parentNodeId: string, actionType: string, label: string) => {
        const parentNode = nodes.find(n => n.id === parentNodeId)
        if (!parentNode) return

        const childEdges = edges.filter(e => e.source === parentNodeId)
        const childCount = childEdges.length
        const newNodeId = generateNodeId()
        const xOffset = 220

        let maxChildX = parentNode.position.x
        childEdges.forEach(edge => {
            const childNode = nodes.find(n => n.id === edge.target)
            if (childNode && childNode.position.x > maxChildX) {
                maxChildX = childNode.position.x
            }
        })

        const isCondition = actionType === 'CONDITION_BRANCH'

        const newNode: WorkflowNode = {
            id: newNodeId,
            type: isCondition ? 'condition' : 'action',
            position: {
                x: maxChildX + xOffset,
                y: parentNode.position.y + (childCount > 0 ? 120 * childCount : 0),
            },
            data: {
                label: isCondition ? 'If / Else' : label,
                type: actionType,
                config: {},
                isConfigured: true,
                ...(isCondition ? {
                    branches: [
                        { id: 'true', name: 'True' },
                        { id: 'false', name: 'False' },
                    ],
                } : {}),
            },
        }

        const newEdge: Edge = {
            id: `edge_${parentNodeId}_${newNodeId}`,
            source: parentNodeId,
            sourceHandle: 'source',
            target: newNodeId,
            targetHandle: 'target',
            type: 'smoothstep',
            data: { deletable: true },
        }

        setNodes((nds) => [...nds, newNode])
        setEdges((eds) => [...eds, newEdge])
    }, [nodes, edges, setNodes, setEdges])

    // Handle configuring a node
    const handleConfigure = useCallback((nodeId: string) => {
        setSelectedNodeId(nodeId)
        setShowConfigPanel(true)
    }, [])

    // ============================================================
    // INTELLIGENT NODE DELETION (auto-reconnection)
    // ============================================================

    const handleDeleteNode = useCallback((nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId)
        if (!node || node.type === 'trigger') return

        // Find all incoming and outgoing edges
        const incomingEdges = edges.filter(e => e.target === nodeId)
        const outgoingEdges = edges.filter(e => e.source === nodeId)

        // Bridge: connect each parent to each child
        const bridgeEdges: Edge[] = []
        for (const incoming of incomingEdges) {
            for (const outgoing of outgoingEdges) {
                const exists = edges.some(
                    e => e.source === incoming.source && e.target === outgoing.target
                )
                if (!exists) {
                    bridgeEdges.push({
                        id: `edge_${incoming.source}_${outgoing.target}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                        source: incoming.source,
                        sourceHandle: incoming.sourceHandle || 'source',
                        target: outgoing.target,
                        targetHandle: outgoing.targetHandle || 'target',
                        type: 'smoothstep',
                        data: { deletable: true },
                    })
                }
            }
        }

        setNodes((nds) => nds.filter((n) => n.id !== nodeId))
        setEdges((eds) => [
            ...eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
            ...bridgeEdges,
        ])

        if (selectedNodeId === nodeId) {
            setSelectedNodeId(null)
            setShowConfigPanel(false)
        }
    }, [nodes, edges, selectedNodeId, setNodes, setEdges])

    // Update node config
    const updateNodeConfig = useCallback((updates: Partial<WorkflowNode['data']>) => {
        if (!selectedNodeId) return
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNodeId) {
                    return { ...node, data: { ...node.data, ...updates } }
                }
                return node
            })
        )
    }, [selectedNodeId, setNodes])

    // ============================================================
    // CONNECTION HANDLING (Voiceflow-style)
    // ============================================================

    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const { screenToFlowPosition } = useReactFlow()
    const connectionMadeRef = useRef(false)

    // Track pending connection source for action picker
    const [pendingConnection, setPendingConnection] = useState<{
        sourceNodeId: string
        sourceHandleId: string | null
    } | null>(null)

    // Floating action picker state
    const [actionPickerPos, setActionPickerPos] = useState<{ x: number; y: number } | null>(null)
    const [actionPickerFlowPos, setActionPickerFlowPos] = useState<{ x: number; y: number } | null>(null)

    // Handle manual connection (drag handle to target handle)
    const onConnect = useCallback((connection: Connection) => {
        connectionMadeRef.current = true
        if (!connection.source || !connection.target) return
        const exists = edges.some(
            e => e.source === connection.source && e.target === connection.target
                && e.sourceHandle === (connection.sourceHandle || 'source')
        )
        if (exists) return

        const newEdge: Edge = {
            id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
            source: connection.source,
            sourceHandle: connection.sourceHandle || 'source',
            target: connection.target,
            targetHandle: connection.targetHandle || 'target',
            type: 'smoothstep',
            data: { deletable: true },
        }
        setEdges((eds) => [...eds, newEdge])
    }, [edges, setEdges])

    // Track connection start
    const onConnectStart: OnConnectStart = useCallback((_event, params) => {
        setPendingConnection({
            sourceNodeId: params.nodeId || '',
            sourceHandleId: params.handleId || null,
        })
    }, [])

    // Connection drop on empty canvas -> show floating action picker
    const onConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
        if (!pendingConnection) return

        // If a valid connection was just made via onConnect, skip the picker
        if (connectionMadeRef.current) {
            connectionMadeRef.current = false
            setPendingConnection(null)
            return
        }

        const targetElement = (event as MouseEvent).target as HTMLElement
        // Check if the drop target is a node or handle — if not, it's an empty canvas drop
        const isOnNode = !!targetElement.closest('.react-flow__node')
        const isOnHandle = targetElement.classList.contains('react-flow__handle')
            || !!targetElement.closest('.react-flow__handle')
        const isInsideFlow = !!targetElement.closest('.react-flow')
        const isEmptyDrop = isInsideFlow && !isOnNode && !isOnHandle

        if (isEmptyDrop) {
            const clientX = (event as MouseEvent).clientX
            const clientY = (event as MouseEvent).clientY
            const flowPosition = screenToFlowPosition({ x: clientX, y: clientY })
            setActionPickerFlowPos(flowPosition)
            setActionPickerPos({ x: clientX, y: clientY })
        } else {
            setPendingConnection(null)
        }
    }, [pendingConnection, screenToFlowPosition])

    // Handle action selection from floating picker
    const handlePickerActionSelect = useCallback((actionType: string, label: string) => {
        if (!pendingConnection || !actionPickerFlowPos) return

        const isCondition = actionType === 'CONDITION_BRANCH'
        const newNodeId = generateNodeId()

        const newNode: WorkflowNode = {
            id: newNodeId,
            type: isCondition ? 'condition' : 'action',
            position: {
                x: actionPickerFlowPos.x,
                y: actionPickerFlowPos.y - 40,
            },
            data: {
                label: isCondition ? 'If / Else' : label,
                type: actionType,
                config: {},
                isConfigured: true,
                ...(isCondition ? {
                    branches: [
                        { id: 'true', name: 'True' },
                        { id: 'false', name: 'False' },
                    ],
                } : {}),
            },
        }

        const newEdge: Edge = {
            id: `edge_${pendingConnection.sourceNodeId}_${newNodeId}`,
            source: pendingConnection.sourceNodeId,
            sourceHandle: pendingConnection.sourceHandleId || 'source',
            target: newNodeId,
            targetHandle: 'target',
            type: 'smoothstep',
            data: { deletable: true },
        }

        setNodes((nds) => [...nds, newNode])
        setEdges((eds) => [...eds, newEdge])

        setActionPickerPos(null)
        setActionPickerFlowPos(null)
        setPendingConnection(null)
    }, [pendingConnection, actionPickerFlowPos, setNodes, setEdges])

    const closeActionPicker = useCallback(() => {
        setActionPickerPos(null)
        setActionPickerFlowPos(null)
        setPendingConnection(null)
    }, [])

    // Validate connections: no self-loops, no duplicate edges
    const isValidConnection = useCallback((connection: Edge | Connection) => {
        if (connection.source === connection.target) return false
        return !edges.some(
            e => e.source === connection.source && e.target === connection.target
        )
    }, [edges])

    // Edge reconnection (drag edge endpoints to new nodes)
    const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds))
    }, [setEdges])

    // ============================================================
    // CONDITION NODE BRANCH MANAGEMENT
    // ============================================================

    const handleAddBranch = useCallback((nodeId: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId && node.type === 'condition') {
                    const currentBranches = (node.data as any).branches || [
                        { id: 'true', name: 'True' },
                        { id: 'false', name: 'False' },
                    ]
                    const newBranchId = `branch_${Date.now()}`
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            branches: [
                                ...currentBranches,
                                { id: newBranchId, name: `Branch ${currentBranches.length + 1}` },
                            ],
                        },
                    }
                }
                return node
            })
        )
    }, [setNodes])

    const handleRemoveBranch = useCallback((nodeId: string, branchId: string) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId && node.type === 'condition') {
                    const currentBranches = (node.data as any).branches || []
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            branches: currentBranches.filter((b: any) => b.id !== branchId),
                        },
                    }
                }
                return node
            })
        )
        const handleId = `branch-${branchId}`
        setEdges((eds) =>
            eds.filter((e) => !(e.source === nodeId && e.sourceHandle === handleId))
        )
    }, [setNodes, setEdges])

    // Inject handlers into node data
    const nodesWithHandlers = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            onSelectTrigger: handleSelectTrigger,
            onAddAction: handleAddAction,
            onConfigure: handleConfigure,
            onDelete: handleDeleteNode,
            onAddBranch: handleAddBranch,
            onRemoveBranch: handleRemoveBranch,
        },
    }))

    const selectedNode = nodes.find(n => n.id === selectedNodeId) as WorkflowNode | undefined

    return (
        <div className="flex h-full bg-muted/20 rounded-lg border border-border overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: edgeStyles }} />

            <div className="flex-1 relative" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectStart={onConnectStart}
                    onConnectEnd={onConnectEnd}
                    onReconnect={onReconnect}
                    isValidConnection={isValidConnection}
                    connectionMode={ConnectionMode.Loose}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.4 }}
                    className="bg-background"
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        data: { deletable: true },
                    }}
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={true}
                    nodesConnectable={true}
                    elementsSelectable={true}
                    panOnScroll={true}
                    zoomOnScroll={true}
                    minZoom={0.3}
                    maxZoom={2}
                    deleteKeyCode={['Backspace', 'Delete']}
                    selectNodesOnDrag={false}
                    onPaneClick={closeActionPicker}
                    connectionLineStyle={{
                        stroke: 'hsl(var(--primary))',
                        strokeWidth: 2,
                        strokeDasharray: '8 4',
                    }}
                >
                    <Controls
                        className="bg-card/90 backdrop-blur-sm border-border shadow-md"
                        position="bottom-left"
                        style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 50 }}
                    />
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="hsl(var(--muted-foreground) / 0.1)"
                    />
                    <Panel position="top-right" className="!m-2">
                        <div className="bg-card/70 backdrop-blur-md rounded-md px-2 py-1.5 shadow-sm border border-border/50 text-[10px] text-muted-foreground">
                            <span className="opacity-80">Drag handles to connect &bull; Drop on empty to add &bull; Hover edges to delete</span>
                        </div>
                    </Panel>
                </ReactFlow>

                {/* Floating Action Picker */}
                {actionPickerPos && (
                    <FloatingActionPicker
                        position={actionPickerPos}
                        onSelect={handlePickerActionSelect}
                        onClose={closeActionPicker}
                    />
                )}
            </div>

            {showConfigPanel && selectedNode && (
                <NodeConfigPanel
                    node={selectedNode}
                    onUpdate={updateNodeConfig}
                    onDelete={() => handleDeleteNode(selectedNode.id)}
                    onClose={() => {
                        setShowConfigPanel(false)
                        setSelectedNodeId(null)
                    }}
                />
            )}
        </div>
    )
})

// ============================================================
// FLOATING ACTION PICKER (appears on connection drop)
// ============================================================

function FloatingActionPicker({
    position,
    onSelect,
    onClose,
}: {
    position: { x: number; y: number }
    onSelect: (actionType: string, label: string) => void
    onClose: () => void
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const categories = ['Email', 'Prospect', 'Sequence', 'Communication', 'CRM', 'Productivity', 'Notification', 'Task', 'Logic']

    const filteredActions = searchTerm
        ? ACTIONS.filter(a => a.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : ACTIONS

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    const adjustedX = Math.min(position.x, window.innerWidth - 280)
    const adjustedY = Math.min(position.y, window.innerHeight - 400)

    return (
        <>
            <div className="fixed inset-0 z-[100]" onClick={onClose} />
            <div
                className={cn(
                    "fixed z-[101] w-64 max-h-80 overflow-hidden",
                    "bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/20",
                    "animate-in fade-in-0 zoom-in-95 duration-150"
                )}
                style={{ left: adjustedX, top: adjustedY }}
            >
                <div className="p-2 border-b border-border">
                    <input
                        type="text"
                        placeholder="Search actions..."
                        autoFocus
                        className={cn(
                            "w-full px-2.5 py-1.5 text-xs rounded-md",
                            "bg-muted/50 border border-border/50",
                            "placeholder:text-muted-foreground/50",
                            "focus:outline-none focus:ring-1 focus:ring-primary/50"
                        )}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-y-auto max-h-64 p-1">
                    {searchTerm ? (
                        filteredActions.length > 0 ? (
                            filteredActions.map((action) => (
                                <button
                                    key={action.type}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left",
                                        "hover:bg-primary/10 transition-colors text-xs text-foreground"
                                    )}
                                    onClick={() => onSelect(action.type, action.label)}
                                >
                                    {action.provider && PROVIDER_ICON_MAP[action.provider] ? (
                                        <Image
                                            src={`/icons/${PROVIDER_ICON_MAP[action.provider]}.svg`}
                                            alt={action.provider}
                                            width={14}
                                            height={14}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <Plus className="h-3 w-3 text-muted-foreground opacity-50" />
                                    )}
                                    <span>{action.label}</span>
                                    <span className="ml-auto text-[10px] text-muted-foreground">{action.category}</span>
                                </button>
                            ))
                        ) : (
                            <div className="p-3 text-center text-xs text-muted-foreground">No actions found</div>
                        )
                    ) : (
                        categories.map((category) => {
                            const categoryActions = filteredActions.filter(a => a.category === category)
                            if (categoryActions.length === 0) return null
                            return (
                                <div key={category}>
                                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                        {category}
                                    </div>
                                    {categoryActions.map((action) => (
                                        <button
                                            key={action.type}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left",
                                                "hover:bg-primary/10 transition-colors text-xs text-foreground"
                                            )}
                                            onClick={() => onSelect(action.type, action.label)}
                                        >
                                            {action.provider && PROVIDER_ICON_MAP[action.provider] ? (
                                                <Image
                                                    src={`/icons/${PROVIDER_ICON_MAP[action.provider]}.svg`}
                                                    alt={action.provider}
                                                    width={14}
                                                    height={14}
                                                    className="object-contain"
                                                />
                                            ) : (
                                                <Plus className="h-3 w-3 text-muted-foreground opacity-50" />
                                            )}
                                            <span>{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </>
    )
}

// Wrapper with provider that forwards ref
export const WorkflowCanvasWithProvider = forwardRef<WorkflowCanvasRef, WorkflowCanvasProps>(
    function WorkflowCanvasWithProvider(props, ref) {
        return (
            <ReactFlowProvider>
                <WorkflowCanvas ref={ref} {...props} />
            </ReactFlowProvider>
        )
    }
)

/**
 * Convert workflow nodes/edges to automation actions array (graph-aware BFS)
 */
export function nodesToActions(nodes: WorkflowNode[], edges: Edge[]): AutomationAction[] {
    const triggerNode = nodes.find((n) => n.type === 'trigger')
    if (!triggerNode) return []

    const actionNodes = nodes.filter((n) => n.type === 'action' || n.type === 'condition')
    const sortedActions: AutomationAction[] = []
    const visited = new Set<string>()

    // BFS from trigger node
    const queue: string[] = [triggerNode.id]

    while (queue.length > 0) {
        const currentId = queue.shift()!
        if (visited.has(currentId)) continue
        visited.add(currentId)

        // Find all outgoing edges from current node
        const outEdges = edges.filter(e => e.source === currentId)
        for (const edge of outEdges) {
            const targetNode = actionNodes.find(n => n.id === edge.target)
            if (!targetNode || visited.has(targetNode.id)) continue

            sortedActions.push({
                id: targetNode.id,
                type: targetNode.data.type as AutomationActionType,
                name: targetNode.data.label,
                order: sortedActions.length,
                config: targetNode.data.config || {},
                delayMinutes: targetNode.data.delayMinutes || 0,
                continueOnError: false,
            })

            queue.push(targetNode.id)
        }
    }

    return sortedActions
}

/**
 * Convert automation actions to workflow nodes/edges
 */
export function actionsToNodes(
    triggerType: string,
    triggerConfig: Record<string, unknown>,
    actions: AutomationAction[]
): { nodes: WorkflowNode[]; edges: Edge[] } {
    const nodes: WorkflowNode[] = []
    const edges: Edge[] = []

    // Create trigger node
    const triggerLabel = TRIGGERS.find(t => t.type === triggerType)?.label || triggerType.replace(/_/g, ' ')
    const triggerNode: WorkflowNode = {
        id: 'trigger_main',
        type: 'trigger',
        position: { x: 50, y: 150 },
        data: {
            label: triggerLabel,
            type: triggerType,
            config: triggerConfig,
            isConfigured: true,
        },
    }
    nodes.push(triggerNode)

    // Create action nodes - positioned horizontally
    let prevNodeId = triggerNode.id
    actions.forEach((action, index) => {
        const actionLabel = ACTIONS.find(a => a.type === action.type)?.label || action.name || action.type.replace(/_/g, ' ')
        const isCondition = action.type === 'CONDITION_BRANCH'
        const actionNode: WorkflowNode = {
            id: action.id || `action_${index}`,
            type: isCondition ? 'condition' : 'action',
            position: { x: 270 + index * 220, y: 150 },
            data: {
                label: actionLabel,
                type: action.type,
                config: action.config as Record<string, unknown>,
                delayMinutes: action.delayMinutes,
                isConfigured: true,
            },
        }
        nodes.push(actionNode)

        // Create edge from previous node
        edges.push({
            id: `edge_${prevNodeId}_${actionNode.id}`,
            source: prevNodeId,
            sourceHandle: 'source',
            target: actionNode.id,
            targetHandle: 'target',
            type: 'smoothstep',
            data: {
                deletable: true,
                delay: action.delayMinutes,
            },
        })

        prevNodeId = actionNode.id
    })

    return { nodes, edges }
}
