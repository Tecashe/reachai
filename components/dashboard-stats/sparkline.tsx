"use client"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
}

export function Sparkline({ data, width = 80, height = 24, strokeWidth = 1.5, className }: SparklineProps) {
  if (!data.length) return null

  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  // Determine trend color
  const isPositive = data[data.length - 1] >= data[0]

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            stopOpacity="1"
          />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#sparkline-gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End dot */}
      <circle
        cx={((data.length - 1) / (data.length - 1)) * width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r={2}
        fill={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
      />
    </svg>
  )
}
