'use client'

import { useState, useEffect, useCallback, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import {
    ArrowLeft,
    Save,
    Play,
    Layers,
    List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { AutomationAction } from '@/lib/types/automation-types'

// Dynamic import for workflow canvas (prevents SSR issues with React Flow)
const WorkflowCanvasWithProvider = dynamic(
    () => import('@/components/automations/workflow-canvas').then((mod) => mod.WorkflowCanvasWithProvider),
    { ssr: false, loading: () => <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg">Loading canvas...</div> }
)

// Import types and helpers
import type { WorkflowCanvasRef, WorkflowNode } from '@/components/automations/workflow-canvas'
import { actionsToNodes, nodesToActions } from '@/components/automations/workflow-canvas'
import type { Edge } from '@xyflow/react'

interface Automation {
    id: string
    name: string
    description: string | null
    status: string
    triggerType: string
    triggerConfig: Record<string, unknown>
    actions: AutomationAction[]
}

export default function EditAutomationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [automation, setAutomation] = useState<Automation | null>(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [initialNodes, setInitialNodes] = useState<WorkflowNode[]>([])
    const [initialEdges, setInitialEdges] = useState<Edge[]>([])

    // Canvas ref for extracting workflow data
    const canvasRef = useRef<WorkflowCanvasRef>(null)

    useEffect(() => {
        fetchAutomation()
    }, [resolvedParams.id])

    async function fetchAutomation() {
        try {
            const response = await fetch(`/api/automations/${resolvedParams.id}`)
            if (!response.ok) throw new Error('Failed to fetch')
            const data = await response.json()
            const auto = data.automation
            setAutomation(auto)
            setName(auto.name)
            setDescription(auto.description || '')

            // Convert automation data to canvas nodes/edges
            const { nodes, edges } = actionsToNodes(
                auto.triggerType,
                auto.triggerConfig || {},
                auto.actions || []
            )
            setInitialNodes(nodes)
            setInitialEdges(edges)
        } catch (error) {
            toast.error('Failed to load automation')
            router.push('/dashboard/automations')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (activate: boolean = false) => {
        if (!canvasRef.current) {
            toast.error('Canvas not ready')
            return
        }

        const canvasData = canvasRef.current.getWorkflowData()

        if (!canvasData.triggerType) {
            toast.error('Please add a trigger to your workflow')
            return
        }

        const extractedActions = nodesToActions(canvasData.nodes, canvasData.edges)
        if (extractedActions.length === 0) {
            toast.error('Please add at least one action to your workflow')
            return
        }

        if (!name.trim()) {
            toast.error('Please enter a name for the automation')
            return
        }

        setIsSaving(true)
        try {
            // Update the automation
            const response = await fetch(`/api/automations/${resolvedParams.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim() || undefined,
                    triggerType: canvasData.triggerType,
                    triggerConfig: canvasData.triggerConfig,
                    actions: extractedActions.map((a, idx) => ({
                        ...a,
                        id: a.id || `action_${idx}`,
                        order: idx,
                        continueOnError: false,
                    })),
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to update automation')
            }

            if (activate && automation?.status !== 'ACTIVE') {
                await fetch(`/api/automations/${resolvedParams.id}/activate`, { method: 'POST' })
                toast.success('Automation updated and activated!')
            } else {
                toast.success('Automation updated!')
            }

            router.push(`/dashboard/automations/${resolvedParams.id}`)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to save automation')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <div className="text-muted-foreground">Loading automation...</div>
            </div>
        )
    }

    if (!automation) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="p-3 space-y-2 h-screen flex flex-col">
                {/* Compact Header */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/automations/${resolvedParams.id}`)}
                            className="text-muted-foreground hover:text-foreground h-8 px-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                        <div className="h-6 w-px bg-border" />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Automation name..."
                            className="bg-background border-input text-foreground font-medium h-8 w-64 text-sm"
                        />
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description (optional)"
                            className="bg-background border-input text-foreground h-8 w-48 text-sm hidden md:block"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                            <Layers className="h-3.5 w-3.5 mr-1" />
                            Canvas Editor
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(false)}
                            disabled={isSaving}
                            className="border-border text-foreground hover:bg-accent h-8 text-xs"
                        >
                            <Save className="h-3.5 w-3.5 mr-1" />
                            Save
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
                        >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Save & Activate
                        </Button>
                    </div>
                </div>

                {/* Workflow Canvas - Takes remaining space */}
                <div className="flex-1 min-h-0">
                    {initialNodes.length > 0 && (
                        <WorkflowCanvasWithProvider
                            ref={canvasRef}
                            initialNodes={initialNodes}
                            initialEdges={initialEdges}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
