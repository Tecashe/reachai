'use client'

import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { GitBranch, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ============================================================
// CONDITION BRANCH NODE (Diamond-style IF/ELSE)
// Supports multiple output branches
// ============================================================

interface ConditionNodeData {
    label: string
    type: string
    config?: Record<string, unknown>
    branches?: { id: string; name: string }[]
    isConfigured?: boolean
    onConfigure?: (id: string) => void
    onDelete?: (id: string) => void
    onAddBranch?: (id: string) => void
    onRemoveBranch?: (id: string, branchId: string) => void
}

function ConditionNodeComponent({ data, id, selected }: { data: ConditionNodeData; id: string; selected?: boolean }) {
    const { onConfigure, onDelete, onAddBranch, onRemoveBranch } = data

    // Default branches: True and False
    const branches = data.branches || [
        { id: 'true', name: 'True' },
        { id: 'false', name: 'False' },
    ]

    const branchColors: Record<string, string> = {
        true: 'bg-emerald-500',
        false: 'bg-red-500',
    }

    return (
        <div className={cn(
            "relative w-52 rounded-xl border-2 bg-card shadow-md transition-shadow duration-200",
            selected
                ? "border-violet-500 ring-2 ring-violet-500/20 shadow-lg shadow-violet-500/10"
                : "border-violet-500/50",
            "hover:shadow-lg"
        )}>
            {/* Target Handle (Left) */}
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                className={cn(
                    "!w-3 !h-3 !bg-violet-500 !border-2 !border-background",
                    "!-left-1.5 !top-1/2 !-translate-y-1/2",
                    "transition-shadow duration-200",
                    "hover:!shadow-lg hover:!shadow-violet-500/50"
                )}
                style={{ zIndex: 10 }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-t-lg border-b border-border">
                <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-violet-500/20">
                        <GitBranch className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                        Condition
                    </span>
                </div>
                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-violet-500/20"
                        onClick={(e) => { e.stopPropagation(); onConfigure?.(id) }}
                    >
                        <GitBranch className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 hover:bg-destructive/20 hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete?.(id) }}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-2.5">
                <span className="font-medium text-foreground text-sm truncate block">
                    {data.label || 'If / Else'}
                </span>
            </div>

            {/* Branch handles on the right side */}
            <div className="px-2.5 pb-2.5 space-y-1">
                {branches.map((branch, index) => {
                    // Calculate vertical position percentage for each branch handle
                    const handleColor = branchColors[branch.id] || 'bg-primary'

                    return (
                        <div key={branch.id} className="flex items-center justify-between">
                            <span className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                branch.id === 'true'
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : branch.id === 'false'
                                        ? "bg-red-500/10 text-red-600"
                                        : "bg-violet-500/10 text-violet-600"
                            )}>
                                {branch.name}
                            </span>
                            {/* Remove branch button (only for extra branches, not true/false) */}
                            {branch.id !== 'true' && branch.id !== 'false' && (
                                <button
                                    className="h-4 w-4 flex items-center justify-center rounded hover:bg-destructive/20 transition-colors"
                                    onClick={(e) => { e.stopPropagation(); onRemoveBranch?.(id, branch.id) }}
                                >
                                    <X className="h-2.5 w-2.5 text-muted-foreground" />
                                </button>
                            )}
                        </div>
                    )
                })}

                {/* Add Branch button */}
                <button
                    className="w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-violet-600 py-1 rounded border border-dashed border-border hover:border-violet-500/50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onAddBranch?.(id) }}
                >
                    <Plus className="h-2.5 w-2.5" />
                    Add Branch
                </button>
            </div>

            {/* Source handles for each branch - positioned on the right edge */}
            {branches.map((branch, index) => {
                // Spread handles vertically along the right edge
                const totalHandles = branches.length
                const spacing = 100 / (totalHandles + 1)
                const topPercent = spacing * (index + 1)

                return (
                    <Handle
                        key={branch.id}
                        type="source"
                        position={Position.Right}
                        id={`branch-${branch.id}`}
                        className={cn(
                            "!w-3 !h-3 !border-2 !border-background",
                            "!-right-1.5",
                            "transition-shadow duration-200",
                            "hover:!shadow-lg",
                            branch.id === 'true'
                                ? "!bg-emerald-500 hover:!shadow-emerald-500/50"
                                : branch.id === 'false'
                                    ? "!bg-red-500 hover:!shadow-red-500/50"
                                    : "!bg-violet-500 hover:!shadow-violet-500/50",
                            "after:content-[''] after:absolute after:inset-0 after:rounded-full",
                            "after:animate-ping",
                            "after:pointer-events-none",
                            branch.id === 'true'
                                ? "after:bg-emerald-500/30"
                                : branch.id === 'false'
                                    ? "after:bg-red-500/30"
                                    : "after:bg-violet-500/30"
                        )}
                        style={{
                            zIndex: 10,
                            top: `${topPercent}%`,
                        }}
                    />
                )
            })}
        </div>
    )
}

export const ConditionNode = memo(ConditionNodeComponent)
export default ConditionNodeComponent
