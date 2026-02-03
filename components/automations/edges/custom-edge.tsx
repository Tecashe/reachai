'use client'

import { memo, useState, useCallback } from 'react'
import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    type EdgeProps,
    type Edge,
} from '@xyflow/react'
import { X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================
// ANIMATED CUSTOM EDGE COMPONENT
// Professional workflow connection with animations & delete
// ============================================================

export interface CustomEdgeData {
    label?: string
    delay?: number
    deletable?: boolean
    // Index signature required for React Flow's Edge<Record<string, unknown>> constraint
    [key: string]: unknown
}

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

    // Calculate bezier path for smooth curve
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.25,
    })

    // Handle edge deletion
    const onEdgeClick = useCallback((evt: React.MouseEvent) => {
        evt.stopPropagation()
        setEdges((edges) => edges.filter((edge) => edge.id !== id))
    }, [id, setEdges])

    const showDeleteButton = isHovered || selected
    const label = data?.label
    const delay = data?.delay

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

            {/* Glow effect layer (visible on hover) */}
            <path
                d={edgePath}
                fill="none"
                stroke="url(#edge-glow-gradient)"
                strokeWidth={isHovered || selected ? 8 : 0}
                strokeLinecap="round"
                style={{
                    transition: 'stroke-width 0.2s ease-out',
                    filter: 'blur(4px)',
                    opacity: 0.6,
                }}
            />

            {/* Main animated edge path */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: isHovered || selected ? 'url(#edge-gradient-active)' : 'url(#edge-gradient)',
                    strokeWidth: isHovered || selected ? 3 : 2,
                    strokeLinecap: 'round',
                    transition: 'stroke-width 0.2s ease-out',
                }}
            />

            {/* Animated flow particles overlay */}
            <path
                d={edgePath}
                fill="none"
                stroke="url(#edge-flow-gradient)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="8 12"
                className="animate-edge-flow"
                style={{
                    opacity: isHovered || selected ? 0.9 : 0.6,
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
                    {/* Delete button */}
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

                    {/* Optional label */}
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

            {/* SVG gradient definitions */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    {/* Main edge gradient */}
                    <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    </linearGradient>

                    {/* Active/hover gradient */}
                    <linearGradient id="edge-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="50%" stopColor="hsl(var(--chart-1))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" />
                    </linearGradient>

                    {/* Flow animation gradient */}
                    <linearGradient id="edge-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="40%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    {/* Glow effect gradient */}
                    <linearGradient id="edge-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    )
})

export default CustomEdge

// ============================================================
// EDGE STYLES (to be added to global CSS or component styles)
// ============================================================

export const edgeStyles = `
@keyframes edgeFlow {
    0% {
        stroke-dashoffset: 40;
    }
    100% {
        stroke-dashoffset: 0;
    }
}

.animate-edge-flow {
    animation: edgeFlow 1.5s linear infinite;
}

.react-flow__edge:hover {
    cursor: pointer;
}

.react-flow__edge.selected .react-flow__edge-path {
    stroke-width: 3;
}
`
