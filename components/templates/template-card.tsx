"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"

interface TemplateCardProps {
  template: EnhancedEmailTemplate
  onToggleFavorite: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPreview: (template: EnhancedEmailTemplate) => void
  viewMode?: "grid" | "list"
}

export function TemplateCard({
  template,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onPreview,
  viewMode = "grid",
}: TemplateCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavoriteAnimating, setIsFavoriteAnimating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavoriteAnimating(true)
    await onToggleFavorite(template.id)
    setTimeout(() => setIsFavoriteAnimating(false), 300)
  }

  const handleEdit = () => {
    router.push(`/dashboard/templates/${template.id}/edit`)
  }

  const handleView = () => {
    router.push(`/dashboard/templates/${template.id}`)
  }

  const openRate = template.avgOpenRate ?? 0
  const clickRate = template.avgReplyRate ?? 0

  const getPerformanceColor = (score: number) => {
    if (score >= 40) return "text-emerald-500"
    if (score >= 25) return "text-amber-500"
    return "text-muted-foreground"
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      newsletter: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      promotional: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      transactional: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      followup: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      notification: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    }
    return colors[category.toLowerCase()] || "bg-muted text-muted-foreground"
  }

  if (viewMode === "list") {
    return (
      <div
        ref={cardRef}
        className={cn(
          "group relative flex items-center gap-4 p-4 rounded-xl",
          "bg-card/50 backdrop-blur-sm border border-border/50",
          "transition-all duration-300 ease-out",
          "hover:bg-card hover:border-border hover:shadow-lg",
          "cursor-pointer",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleView}
      >
        {/* Template content for list view */}
        <div className="flex flex-col flex-1">
          <div className="text-lg font-semibold">{template.name}</div>
          <div className="text-sm text-muted-foreground">{template.description}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={handleFavorite}>
            {isFavoriteAnimating ? <span className="animate-pulse">❤️</span> : template.isFavorite ? "❤️" : "♡"}
          </button>
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => onDuplicate(template.id)}
          >
            Duplicate
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => onDelete(template.id)}>
            Delete
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => onPreview(template)}>
            Preview
          </button>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        "transition-all duration-300 ease-out",
        "hover:bg-card hover:border-border",
        "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20",
        "hover:-translate-y-1",
        "cursor-pointer",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Template content for grid view */}
      <div className="p-4">
        <div className="text-lg font-semibold">{template.name}</div>
        <div className="text-sm text-muted-foreground mt-2">{template.description}</div>
      </div>
      <div className="flex items-center justify-between p-4 bg-background">
        <div className={getCategoryColor(template.category || "general")}>
          {(template.category || "general").charAt(0).toUpperCase() + (template.category || "general").slice(1)}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={handleFavorite}>
            {isFavoriteAnimating ? <span className="animate-pulse">❤️</span> : template.isFavorite ? "❤️" : "♡"}
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={handleEdit}>
            Edit
          </button>
          <button
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => onDuplicate(template.id)}
          >
            Duplicate
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => onDelete(template.id)}>
            Delete
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => onPreview(template)}>
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}
