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
// ============================================================

export interface CustomEdgeData {
    label?: string
    delay?: number
    deletable?: boolean
    [key: string]: unknown
}

// Primary orange that matches the theme (oklch(0.646 0.222 41.116))
const PRIMARY = '#e8622a'
const PRIMARY_ACTIVE = '#f97316'

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

    const onEdgeDelete = useCallback((evt: React.MouseEvent) => {
        evt.stopPropagation()
        setEdges((eds) => eds.filter((e) => e.id !== id))
    }, [id, setEdges])

    const active = isHovered || !!selected
    const color = active ? PRIMARY_ACTIVE : PRIMARY

    return (
        <>
            {/* Wide invisible hit area for hover */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={28}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ cursor: 'pointer' }}
            />

            {/* Glow halo on hover */}
            {active && (
                <path
                    d={edgePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={8}
                    strokeLinecap="round"
                    style={{ filter: 'blur(5px)', opacity: 0.35, pointerEvents: 'none' }}
                />
            )}

            {/* Main visible edge */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: color,
                    strokeWidth: active ? 3 : 2,
                }}
            />

            {/* Animated dash overlay */}
            <path
                d={edgePath}
                fill="none"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray="6 10"
                strokeOpacity={active ? 0.6 : 0.35}
                style={{ animation: 'edgeFlow 1.5s linear infinite', pointerEvents: 'none' }}
            />

            {/* Delete button shown on hover/select */}
            <EdgeLabelRenderer>
                <div
                    className={cn(
                        'absolute nodrag nopan pointer-events-auto',
                        'transition-all duration-150',
                        (isHovered || selected) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    )}
                    style={{
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        onClick={onEdgeDelete}
                        title="Delete connection"
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: '#ef4444',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        }}
                    >
                        <X size={12} />
                    </button>

                    {data?.label && (
                        <div className="ml-1 px-1.5 py-0.5 text-[10px] rounded bg-card border border-border text-foreground shadow-sm">
                            {data.label}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    )
})

export default CustomEdge

export const edgeStyles = `
@keyframes edgeFlow {
    from { stroke-dashoffset: 32; }
    to   { stroke-dashoffset: 0; }
}
`
