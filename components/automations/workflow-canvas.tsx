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
    { type: 'WEBHOOK_RECEIVED', label: 'Webhook Received', category: 'Integration' },
]

const ACTIONS = [
    { type: 'SEND_EMAIL', label: 'Send Email', category: 'Email' },
    { type: 'SCHEDULE_EMAIL', label: 'Schedule Email', category: 'Email' },
    { type: 'ADD_TAG', label: 'Add Tag', category: 'Prospect' },
    { type: 'REMOVE_TAG', label: 'Remove Tag', category: 'Prospect' },
    { type: 'CHANGE_STATUS', label: 'Change Status', category: 'Prospect' },
    { type: 'MOVE_TO_SEQUENCE', label: 'Add to Sequence', category: 'Sequence' },
    { type: 'REMOVE_FROM_SEQUENCE', label: 'Remove from Sequence', category: 'Sequence' },
    { type: 'PAUSE_SEQUENCE', label: 'Pause Sequence', category: 'Sequence' },
    { type: 'SEND_SLACK', label: 'Send Slack Message', category: 'Integration' },
    { type: 'SEND_WEBHOOK', label: 'Send Webhook', category: 'Integration' },
    { type: 'SYNC_TO_CRM', label: 'Sync to CRM', category: 'Integration' },
    { type: 'SEND_NOTIFICATION', label: 'Send Notification', category: 'Notification' },
    { type: 'CREATE_TASK', label: 'Create Task', category: 'Task' },
    { type: 'DELAY', label: 'Wait / Delay', category: 'Logic' },
]

// ============================================================
// CUSTOM NODE COMPONENTS
// ============================================================

function TriggerNodeComponent({ data, id, selected }: { data: WorkflowNode['data']; id: string; selected?: boolean }) {
    const { onSelectTrigger, onConfigure, onAddAction, isConfigured, type, label } = data as any

    return (
        <div className={cn(
            "w-72 rounded-xl border-2 bg-card shadow-lg transition-all",
            selected ? "border-primary ring-2 ring-primary/20" : "border-amber-500/50",
            "hover:shadow-xl"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-t-lg border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-amber-500/20">
                        <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Trigger</span>
                </div>
                {isConfigured && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); onConfigure?.(id) }}
                    >
                        <Settings className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {!isConfigured ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between">
                                Select a trigger...
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" align="start">
                            {['Email', 'Prospect', 'Sequence', 'Integration'].map((category) => (
                                <div key={category}>
                                    <DropdownMenuLabel>{category}</DropdownMenuLabel>
                                    {TRIGGERS.filter(t => t.category === category).map((trigger) => (
                                        <DropdownMenuItem
                                            key={trigger.type}
                                            onClick={() => onSelectTrigger?.(id, trigger.type, trigger.label)}
                                        >
                                            {trigger.label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{label}</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                        Change
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64" align="end">
                                    {TRIGGERS.map((trigger) => (
                                        <DropdownMenuItem
                                            key={trigger.type}
                                            onClick={() => onSelectTrigger?.(id, trigger.type, trigger.label)}
                                        >
                                            {trigger.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            When this event occurs, run the actions below
                        </p>
                    </div>
                )}
            </div>

            {/* Add Action Button */}
            {isConfigured && (
                <div className="px-4 pb-4">
                    <div className="border-t border-dashed border-border pt-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-dashed hover:border-primary hover:bg-primary/5"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Action
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="center">
                                {['Email', 'Prospect', 'Sequence', 'Integration', 'Notification', 'Task', 'Logic'].map((category) => {
                                    const categoryActions = ACTIONS.filter(a => a.category === category)
                                    if (categoryActions.length === 0) return null
                                    return (
                                        <div key={category}>
                                            <DropdownMenuLabel>{category}</DropdownMenuLabel>
                                            {categoryActions.map((action) => (
                                                <DropdownMenuItem
                                                    key={action.type}
                                                    onClick={() => onAddAction?.(id, action.type, action.label)}
                                                >
                                                    {action.label}
                                                </DropdownMenuItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                        </div>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </div>
    )
}

function ActionNodeComponent({ data, id, selected }: { data: WorkflowNode['data']; id: string; selected?: boolean }) {
    const { onConfigure, onDelete, onAddAction, type, label } = data as any

    // Color based on category
    const actionDef = ACTIONS.find(a => a.type === type)
    const colors = {
        Email: 'from-blue-500/10 to-cyan-500/10 border-blue-500/50',
        Prospect: 'from-green-500/10 to-emerald-500/10 border-green-500/50',
        Sequence: 'from-purple-500/10 to-violet-500/10 border-purple-500/50',
        Integration: 'from-pink-500/10 to-rose-500/10 border-pink-500/50',
        Notification: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/50',
        Task: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/50',
        Logic: 'from-slate-500/10 to-gray-500/10 border-slate-500/50',
    }
    const colorClass = colors[actionDef?.category as keyof typeof colors] || colors.Logic

    return (
        <div className={cn(
            "w-72 rounded-xl border-2 bg-card shadow-lg transition-all",
            selected ? "border-primary ring-2 ring-primary/20" : colorClass.split(' ')[2],
            "hover:shadow-xl"
        )}>
            {/* Connector line to parent */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-primary/50 to-primary" />

            {/* Header */}
            <div className={cn(
                "flex items-center justify-between px-4 py-3 rounded-t-lg border-b border-border bg-gradient-to-r",
                colorClass.split(' ').slice(0, 2).join(' ')
            )}>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {actionDef?.category || 'Action'}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); onConfigure?.(id) }}
                    >
                        <Settings className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete?.(id) }}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <span className="font-medium text-foreground">{label}</span>
                <p className="text-xs text-muted-foreground mt-1">
                    Click settings to configure this action
                </p>
            </div>

            {/* Add Next Action Button */}
            <div className="px-4 pb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed hover:border-primary hover:bg-primary/5"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Next Action
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="center">
                        {['Email', 'Prospect', 'Sequence', 'Integration', 'Notification', 'Task', 'Logic'].map((category) => {
                            const categoryActions = ACTIONS.filter(a => a.category === category)
                            if (categoryActions.length === 0) return null
                            return (
                                <div key={category}>
                                    <DropdownMenuLabel>{category}</DropdownMenuLabel>
                                    {categoryActions.map((action) => (
                                        <DropdownMenuItem
                                            key={action.type}
                                            onClick={() => onAddAction?.(id, action.type, action.label)}
                                        >
                                            {action.label}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                </div>
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

// ============================================================
// MAIN CANVAS COMPONENT
// ============================================================

let nodeIdCounter = 0
const generateNodeId = () => `node_${Date.now()}_${nodeIdCounter++}`

// Default trigger node
const createDefaultTriggerNode = (): WorkflowNode => ({
    id: 'trigger_main',
    type: 'trigger',
    position: { x: 250, y: 50 },
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
        const yOffset = 180 // Vertical spacing between nodes

        // Find the lowest y position of existing children
        let maxChildY = parentNode.position.y
        childEdges.forEach(edge => {
            const childNode = nodes.find(n => n.id === edge.target)
            if (childNode && childNode.position.y > maxChildY) {
                maxChildY = childNode.position.y
            }
        })

        const newNode: WorkflowNode = {
            id: newNodeId,
            type: 'action',
            position: {
                x: parentNode.position.x,
                y: maxChildY + yOffset,
            },
            data: {
                label,
                type: actionType,
                config: {},
                isConfigured: true,
            },
        }

        // Create edge from parent to new node
        const newEdge: Edge = {
            id: `edge_${parentNodeId}_${newNodeId}`,
            source: parentNodeId,
            target: newNodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'hsl(var(--primary))' },
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
        <div className="flex h-[calc(100vh-180px)] min-h-[600px] bg-muted/30 rounded-xl border border-border overflow-hidden">
            {/* Main Canvas */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodesWithHandlers}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    className="bg-background"
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                    }}
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={true}
                    nodesConnectable={false}
                    elementsSelectable={true}
                    panOnScroll={true}
                    zoomOnScroll={true}
                >
                    <Controls className="bg-card border-border shadow-lg" />
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={24}
                        size={1.5}
                        color="hsl(var(--muted-foreground) / 0.15)"
                    />
                    <Panel position="top-right" className="bg-card/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>• Click trigger to select event type</p>
                            <p>• Use + buttons to add actions</p>
                            <p>• Click ⚙️ to configure nodes</p>
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
        position: { x: 250, y: 50 },
        data: {
            label: triggerLabel,
            type: triggerType,
            config: triggerConfig,
            isConfigured: true,
        },
    }
    nodes.push(triggerNode)

    // Create action nodes
    let prevNodeId = triggerNode.id
    actions.forEach((action, index) => {
        const actionLabel = ACTIONS.find(a => a.type === action.type)?.label || action.name || action.type.replace(/_/g, ' ')
        const actionNode: WorkflowNode = {
            id: action.id || `action_${index}`,
            type: 'action',
            position: { x: 250, y: 230 + index * 180 },
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
            target: actionNode.id,
            type: 'smoothstep',
            animated: true,
        })

        prevNodeId = actionNode.id
    })

    return { nodes, edges }
}
