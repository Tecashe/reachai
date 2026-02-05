'use client'

import { useCallback, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
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

const ACTIONS = [
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
]

// Add these imports at the top if missing
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
            {/* Source Handle (Right) - Connection point for outgoing edges */}
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
            {/* Target Handle (Left) - Connection point for incoming edges */}
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

            {/* Source Handle (Right) - Connection point for outgoing edges */}
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
    // Initialize with default trigger node if no initial nodes
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
                        data: {
                            ...node.data,
                            type: triggerType,
                            label,
                            isConfigured: true,
                        },
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

        // Find all nodes connected below this parent
        const childEdges = edges.filter(e => e.source === parentNodeId)
        const childCount = childEdges.length

        // Calculate position for new node
        const newNodeId = generateNodeId()
        const xOffset = 220 // Horizontal spacing between nodes

        // Find the rightmost x position of existing children
        let maxChildX = parentNode.position.x
        childEdges.forEach(edge => {
            const childNode = nodes.find(n => n.id === edge.target)
            if (childNode && childNode.position.x > maxChildX) {
                maxChildX = childNode.position.x
            }
        })

        const newNode: WorkflowNode = {
            id: newNodeId,
            type: 'action',
            position: {
                x: maxChildX + xOffset,
                y: parentNode.position.y,
            },
            data: {
                label,
                type: actionType,
                config: {},
                isConfigured: true,
            },
        }

        // Create edge from parent to new node with smooth step styling
        const newEdge: Edge = {
            id: `edge_${parentNodeId}_${newNodeId}`,
            source: parentNodeId,
            sourceHandle: 'source',
            target: newNodeId,
            targetHandle: 'target',
            type: 'smoothstep',
            data: {
                deletable: true,
            },
        }

        setNodes((nds) => [...nds, newNode])
        setEdges((eds) => [...eds, newEdge])
    }, [nodes, edges, setNodes, setEdges])

    // Handle configuring a node
    const handleConfigure = useCallback((nodeId: string) => {
        setSelectedNodeId(nodeId)
        setShowConfigPanel(true)
    }, [])

    // Handle deleting an action node
    const handleDeleteNode = useCallback((nodeId: string) => {
        // Don't allow deleting the trigger node
        const node = nodes.find(n => n.id === nodeId)
        if (!node || node.type === 'trigger') return

        // Remove the node and its edges
        setNodes((nds) => nds.filter((n) => n.id !== nodeId))
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))

        if (selectedNodeId === nodeId) {
            setSelectedNodeId(null)
            setShowConfigPanel(false)
        }
    }, [nodes, selectedNodeId, setNodes, setEdges])

    // Update node config
    const updateNodeConfig = useCallback((updates: Partial<WorkflowNode['data']>) => {
        if (!selectedNodeId) return
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...updates,
                        },
                    }
                }
                return node
            })
        )
    }, [selectedNodeId, setNodes])

    // Inject handlers into node data
    const nodesWithHandlers = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            onSelectTrigger: handleSelectTrigger,
            onAddAction: handleAddAction,
            onConfigure: handleConfigure,
            onDelete: handleDeleteNode,
        },
    }))

    const selectedNode = nodes.find(n => n.id === selectedNodeId) as WorkflowNode | undefined

    return (
        <div className="flex h-full bg-muted/20 rounded-lg border border-border overflow-hidden">
            {/* Inject edge animation styles */}
            <style dangerouslySetInnerHTML={{ __html: edgeStyles }} />

            {/* Main Canvas */}
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
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
                            <span className="opacity-80">Click nodes to configure • Hover connections to delete</span>
                        </div>
                    </Panel>
                </ReactFlow>
            </div>

            {/* Config Panel */}
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
 * Convert workflow nodes/edges to automation actions array
 */
export function nodesToActions(nodes: WorkflowNode[], edges: Edge[]): AutomationAction[] {
    // Find the trigger node
    const triggerNode = nodes.find((n) => n.type === 'trigger')
    if (!triggerNode) return []

    // Build action order from edges
    const actionNodes = nodes.filter((n) => n.type === 'action')
    const sortedActions: AutomationAction[] = []

    // Simple linear chain for now
    let currentNodeId = triggerNode.id
    const visited = new Set<string>()

    while (true) {
        // Find edge from current node
        const nextEdge = edges.find((e) => e.source === currentNodeId)
        if (!nextEdge || visited.has(nextEdge.target)) break

        visited.add(nextEdge.target)
        const nextNode = actionNodes.find((n) => n.id === nextEdge.target)
        if (!nextNode) break

        sortedActions.push({
            id: nextNode.id,
            type: nextNode.data.type as AutomationActionType,
            name: nextNode.data.label,
            order: sortedActions.length,
            config: nextNode.data.config || {},
            delayMinutes: nextNode.data.delayMinutes || 0,
            continueOnError: false,
        })

        currentNodeId = nextNode.id
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
        const actionNode: WorkflowNode = {
            id: action.id || `action_${index}`,
            type: 'action',
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
