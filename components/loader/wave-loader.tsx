"use client"

interface WaveLoaderProps {
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  speed?: "slow" | "normal" | "fast"
  bars?: number
  gap?: "tight" | "normal" | "wide"
}

const sizeConfig = {
  sm: { height: "h-4", width: "w-1" },
  md: { height: "h-8", width: "w-1.5" },
  lg: { height: "h-12", width: "w-2" },
  xl: { height: "h-16", width: "w-2.5" },
}

const speedConfig = {
  slow: 1.2,
  normal: 0.8,
  fast: 0.4,
}

const gapConfig = {
  tight: "gap-0.5",
  normal: "gap-1",
  wide: "gap-2",
}

export function WaveLoader({
  color = "bg-foreground",
  size = "md",
  speed = "normal",
  bars = 5,
  gap = "normal",
}: WaveLoaderProps) {
  const { height, width } = sizeConfig[size]
  const duration = speedConfig[speed]

  return (
    <div className={`flex items-end ${gapConfig[gap]} ${height}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`${width} rounded-full ${color}`}
          style={{
            animation: `waveBar ${duration}s ease-in-out infinite`,
            animationDelay: `${i * (duration / bars)}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveBar {
          0%, 100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
      `}</style>
    </div>
  )
}
