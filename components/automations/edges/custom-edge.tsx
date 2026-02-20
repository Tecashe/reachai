'use client'

import { memo, useState, useCallback } from 'react'
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    type EdgeProps,
    type Edge,
} from '@xyflow/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// ANIMATED CUSTOM EDGE COMPONENT
// Smooth step routing with inline theme colors
// ============================================================

export interface CustomEdgeData {
    label?: string
    delay?: number
    deletable?: boolean
    [key: string]: unknown
}

// Edge color constant — defined once, used everywhere
const EDGE_COLOR = 'hsl(var(--primary))'
const EDGE_COLOR_ACTIVE = 'hsl(var(--chart-1, var(--primary)))'

const CustomEdge = memo(function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
}: EdgeProps<Edge<CustomEdgeData>>) {
    const { setEdges } = useReactFlow()
    const [isHovered, setIsHovered] = useState(false)

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
    })

    const onEdgeClick = useCallback((evt: React.MouseEvent) => {
        evt.stopPropagation()
        setEdges((edges) => edges.filter((edge) => edge.id !== id))
    }, [id, setEdges])

    const showDeleteButton = isHovered || selected
    const label = data?.label
    const delay = data?.delay
    const active = isHovered || selected
    const strokeColor = active ? EDGE_COLOR_ACTIVE : EDGE_COLOR

    return (
        <>
            {/* Invisible wider path for easier hover detection */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={30}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ cursor: 'pointer' }}
            />

            {/* Glow effect layer (visible on hover/selected) */}
            <path
                d={edgePath}
                fill="none"
                stroke={EDGE_COLOR}
                strokeWidth={active ? 10 : 0}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-width 0.2s ease-out',
                    filter: 'blur(6px)',
                    opacity: 0.4,
                }}
            />

            {/* Main edge path — using inline style with stroke */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: strokeColor,
                    strokeWidth: active ? 3 : 2,
                    strokeLinecap: 'round',
                    transition: 'stroke-width 0.2s ease-out, stroke 0.2s ease-out',
                }}
            />

            {/* Animated flow particles overlay */}
            <path
                d={edgePath}
                fill="none"
                stroke={EDGE_COLOR}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="8 12"
                style={{
                    animation: 'edgeFlow 1.5s linear infinite',
                    opacity: active ? 0.7 : 0.4,
                }}
            />

            {/* Edge label and delete button */}
            <EdgeLabelRenderer>
                <div
                    className={cn(
                        "absolute pointer-events-auto nodrag nopan flex items-center gap-2 transition-all duration-200",
                        showDeleteButton ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    )}
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        onClick={onEdgeClick}
                        className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full",
                            "bg-destructive/90 hover:bg-destructive text-white",
                            "shadow-lg shadow-destructive/25 hover:shadow-destructive/40",
                            "backdrop-blur-sm border border-destructive/20",
                            "transform hover:scale-110 active:scale-95",
                            "transition-all duration-150"
                        )}
                        title="Delete connection"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    {(label || (delay && delay > 0)) && (
                        <div className={cn(
                            "px-2 py-1 rounded-md text-xs font-medium",
                            "bg-card/95 backdrop-blur-sm border border-border shadow-md",
                            "text-foreground"
                        )}>
                            {delay && delay > 0 ? `${delay}min delay` : label}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    )
})

export default CustomEdge

// ============================================================
// EDGE STYLES
// ============================================================

export const edgeStyles = `
@keyframes edgeFlow {
    0% { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 0; }
}

.react-flow__edge:hover {
    cursor: pointer;
}

.react-flow__edge.selected .react-flow__edge-path {
    stroke-width: 3;
}
`
