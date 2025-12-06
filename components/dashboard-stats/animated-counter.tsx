"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  formatValue?: (value: number) => string
  className?: string
}

export function AnimatedCounter({ value, duration = 1000, formatValue, className }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  const startTime = useRef<number | null>(null)
  const animationFrame = useRef<number | null>(null)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    previousValue.current = value

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const progress = Math.min((timestamp - startTime.current) / duration, 1)

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart

      setDisplayValue(Math.round(currentValue))

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    startTime.current = null
    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [value, duration])

  const formatted = formatValue ? formatValue(displayValue) : displayValue.toLocaleString()

  return <span className={className}>{formatted}</span>
}
