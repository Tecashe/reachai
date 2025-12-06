"use client"

interface DomainHealthRingProps {
  value: number
}

export function DomainHealthRing({ value }: DomainHealthRingProps) {
  const radius = 70
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const progress = (value / 100) * circumference
  const offset = circumference - progress

  // Determine color based on health score
  const getHealthColor = (score: number) => {
    if (score >= 80) return "hsl(var(--chart-2))" // Good - green-ish
    if (score >= 50) return "hsl(var(--chart-3))" // Medium - yellow-ish
    return "hsl(var(--destructive))" // Poor - red
  }

  const healthColor = getHealthColor(value)
  const healthLabel = value >= 80 ? "Excellent" : value >= 50 ? "Good" : "Needs Attention"

  return (
    <div className="relative">
      <svg width="180" height="180" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          className="opacity-50"
        />
        {/* Progress ring */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={healthColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${healthColor.replace(")", " / 0.3)")})`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{value}%</span>
        <span className="text-sm text-muted-foreground">{healthLabel}</span>
      </div>
    </div>
  )
}
