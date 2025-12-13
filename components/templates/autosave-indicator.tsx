import { Check, Cloud, CloudOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type SaveStatus = "idle" | "saving" | "saved" | "error" | "offline"

interface AutosaveIndicatorProps {
  status: SaveStatus
  lastSaved?: Date
  error?: string
}

export function AutosaveIndicator({ status, lastSaved, error }: AutosaveIndicatorProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "saving":
        return {
          icon: <Cloud className="h-4 w-4 animate-pulse" />,
          text: "Saving...",
          color: "text-blue-600",
        }
      case "saved":
        return {
          icon: <Check className="h-4 w-4" />,
          text: lastSaved ? `Saved ${formatRelativeTime(lastSaved)}` : "Saved",
          color: "text-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: error || "Save failed",
          color: "text-red-600",
        }
      case "offline":
        return {
          icon: <CloudOff className="h-4 w-4" />,
          text: "Offline - changes saved locally",
          color: "text-yellow-600",
        }
      default:
        return null
    }
  }

  const display = getStatusDisplay()
  if (!display) return null

  return (
    <div className={cn("flex items-center gap-2 text-sm", display.color)}>
      {display.icon}
      <span>{display.text}</span>
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 10) return "just now"
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  return date.toLocaleDateString()
}
