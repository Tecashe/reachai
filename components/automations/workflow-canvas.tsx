'use client'

import { useCallback, useRef, useState } from 'react'
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
    ReactFlowInstance,
    BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { TriggerNode } from './nodes/trigger-node'
import { ActionNode } from './nodes/action-node'
import { WorkflowSidebar } from './workflow-sidebar'
import { NodeConfigPanel } from './node-config-panel'
import type { AutomationAction } from '@/lib/types/automation-types'

// Custom node types
const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
}

export interface WorkflowNode extends Node {
    data: {
        label: string
        type: string
        config?: Record<string, unknown>
        delayMinutes?: number
    }
}

interface WorkflowCanvasProps {
    initialNodes?: WorkflowNode[]
    initialEdges?: Edge[]
    onSave?: (nodes: WorkflowNode[], edges: Edge[]) => void
    automationName?: string
}

let nodeId = 0
const getNodeId = () => `node_${nodeId++}`

export function WorkflowCanvas({
    initialNodes = [],
    initialEdges = [],
    onSave,
}: WorkflowCanvasProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

    // Handle new connections
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge({
                ...params,
                type: 'smoothstep',
                animated: true,
                style: { stroke: 'hsl(var(--primary))' },
            }, eds))
        },
        [setEdges]
    )

    // Handle drag over for dropping new nodes
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    // Handle dropping new nodes from sidebar
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault()

            if (!reactFlowWrapper.current || !reactFlowInstance) return

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'))

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            })

            const newNode: WorkflowNode = {
                id: getNodeId(),
                type: nodeData.nodeType, // 'trigger' or 'action'
                position,
                data: {
                    label: nodeData.label,
                    type: nodeData.type, // e.g., 'EMAIL_SENT', 'SEND_EMAIL'
                    config: {},
                },
            }

            setNodes((nds) => nds.concat(newNode))
        },
        [reactFlowInstance, setNodes]
    )

    // Handle node selection
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node as WorkflowNode)
    }, [])

    // Handle clicking on canvas (deselect)
    const onPaneClick = useCallback(() => {
        setSelectedNode(null)
    }, [])

    // Update node configuration
    const updateNodeConfig = useCallback((nodeId: string, updates: Partial<WorkflowNode['data']>) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
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
        // Update selected node state too
        setSelectedNode((prev) => {
            if (prev && prev.id === nodeId) {
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        ...updates,
                    },
                }
            }
            return prev
        })
    }, [setNodes])

    // Delete selected node
    const deleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((n) => n.id !== nodeId))
        setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
        setSelectedNode(null)
    }, [setNodes, setEdges])

    // Get nodes and edges for saving
    const getWorkflowData = useCallback(() => {
        return { nodes, edges }
    }, [nodes, edges])

    // Export function to parent
    if (onSave) {
        // Parent can call onSave with current data
    }

    return (
        <div className="flex h-[calc(100vh-200px)] min-h-[500px]">
            {/* Sidebar */}
            <WorkflowSidebar />

            {/* Canvas */}
            <div ref={reactFlowWrapper} className="flex-1 bg-muted/30 border border-border rounded-lg">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-background"
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                    }}
                >
                    <Controls className="bg-card border-border" />
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="hsl(var(--muted-foreground) / 0.2)"
                    />
                </ReactFlow>
            </div>

            {/* Config panel */}
            {selectedNode && (
                <NodeConfigPanel
                    node={selectedNode}
                    onUpdate={(updates) => updateNodeConfig(selectedNode.id, updates)}
                    onDelete={() => deleteNode(selectedNode.id)}
                    onClose={() => setSelectedNode(null)}
                />
            )}
        </div>
    )
}

// Wrapper with provider
export function WorkflowCanvasWithProvider(props: WorkflowCanvasProps) {
    return (
        <ReactFlowProvider>
            <WorkflowCanvas {...props} />
        </ReactFlowProvider>
    )
}

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
            type: nextNode.data.type as any,
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
    const triggerNode: WorkflowNode = {
        id: 'trigger_0',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: {
            label: triggerType.replace(/_/g, ' '),
            type: triggerType,
            config: triggerConfig,
        },
    }
    nodes.push(triggerNode)

    // Create action nodes
    let prevNodeId = triggerNode.id
    actions.forEach((action, index) => {
        const actionNode: WorkflowNode = {
            id: action.id || `action_${index}`,
            type: 'action',
            position: { x: 250, y: 150 + index * 100 },
            data: {
                label: action.name || action.type.replace(/_/g, ' '),
                type: action.type,
                config: action.config,
                delayMinutes: action.delayMinutes,
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
