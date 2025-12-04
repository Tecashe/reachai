"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarInitialsProps {
  name: string
  email?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function stringToColor(str: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function AvatarInitials({ name, email, size = "md", className }: AvatarInitialsProps) {
  const initials = getInitials(name || email || "?")
  const colorClass = stringToColor(email || name || "")

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  // Try to get Gravatar or Clearbit logo
  const domain = email?.split("@")[1]
  const clearbitUrl = domain ? `https://logo.clearbit.com/${domain}` : undefined

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {clearbitUrl && <AvatarImage src={clearbitUrl || "/placeholder.svg"} alt={name} />}
      <AvatarFallback className={cn(colorClass, "text-white font-medium")}>{initials}</AvatarFallback>
    </Avatar>
  )
}
