"use client"

import * as React from "react"
import { format, isToday, isYesterday, isThisWeek } from "date-fns"

interface SmartTimeProps {
  date: Date | string
  className?: string
}

export function SmartTime({ date, className }: SmartTimeProps) {
  const [mounted, setMounted] = React.useState(false)
  const d = React.useMemo(() => new Date(date), [date])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Server render: just show formatted date (stable)
  if (!mounted) {
    return (
      <time dateTime={d.toISOString()} className={className}>
        {format(d, "MMM d, yyyy")}
      </time>
    )
  }

  // Client render: show relative time
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  let display: string

  if (diffMins < 1) {
    display = "Just now"
  } else if (diffMins < 60) {
    display = `${diffMins}m ago`
  } else if (diffHours < 24 && isToday(d)) {
    display = `${diffHours}h ago`
  } else if (isYesterday(d)) {
    display = `Yesterday ${format(d, "h:mm a")}`
  } else if (isThisWeek(d)) {
    display = format(d, "EEEE h:mm a")
  } else {
    display = format(d, "MMM d, yyyy")
  }

  return (
    <time dateTime={d.toISOString()} title={format(d, "PPpp")} className={className}>
      {display}
    </time>
  )
}
