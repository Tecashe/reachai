

"use client"

import type React from "react"
import { stripHtml, truncateText } from "@/lib/utils/emails"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { EnhancedEmailTemplate } from "@/lib/types"
import { Heart, MoreVertical, Eye, Edit, Copy, Trash2, ArrowRight, Mail, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface TemplateCardProps {
  template: EnhancedEmailTemplate
  onToggleFavorite: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onPreview: (template: EnhancedEmailTemplate) => void
  onSelect?: (template: EnhancedEmailTemplate) => void
  viewMode?: "grid" | "list"
  isEmbedded?: boolean
}

export function TemplateCard({
  template,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onPreview,
  onSelect,
  viewMode = "grid",
  isEmbedded = false,
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (template.isSystemTemplate || !template.userId) {
      router.push(`/dashboard/templates/${template.id}/use`)
    } else {
      router.push(`/dashboard/templates/${template.id}/edit`)
    }
  }

  const handleView = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onSelect) {
      onSelect(template)
    } else {
      router.push(`/dashboard/templates/${template.id}`)
    }
  }

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPreview(template)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDuplicate(template.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(template.id)
  }

  const openRate = template.avgOpenRate ?? 0
  const replyRate = template.avgReplyRate ?? 0

  const getPerformanceColor = (score: number) => {
    if (score >= 40) return "text-emerald-500"
    if (score >= 25) return "text-amber-500"
    return "text-muted-foreground"
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      welcome: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      newsletter: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      promotional: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      transactional: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      followup: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      notification: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      "cold-outreach": "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    }
    return colors[category.toLowerCase()] || "bg-muted text-muted-foreground border-border"
  }

  const cleanBody = stripHtml(template.body, false)
  const bodyPreview = truncateText(cleanBody, isEmbedded ? 150 : 200)

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-card border-2 border-border/60",
        "transition-all duration-300 ease-out",
        "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5",
        "cursor-pointer",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div
        className={cn(
          "relative bg-gradient-to-br from-muted/50 to-muted/20 border-b border-border/50",
          isEmbedded ? "p-6 pb-5" : "p-8 pb-6",
        )}
      >
        {template.isSystemTemplate && (
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30 shadow-sm">
              <Mail className="h-3 w-3" />
              Pre-built Template
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-bold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors",
                isEmbedded ? "text-xl" : "text-2xl",
              )}
            >
              {template.name}
            </h3>
            {template.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{template.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full transition-all",
                template.isFavorite && "text-red-500 bg-red-500/10 hover:bg-red-500/20",
                !template.isFavorite && "hover:bg-background/80",
              )}
              onClick={handleFavorite}
              title={template.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-5 w-5 transition-transform", template.isFavorite && "fill-current scale-110")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-background/80">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                {!onSelect && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    {template.isSystemTemplate ? "Use Template" : "Edit"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                {template.userId && !template.isSystemTemplate && (
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className={cn("flex-1 space-y-6", isEmbedded ? "p-6" : "p-8")}>
        {/* Subject Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject Line</span>
          </div>
          <div className="text-base font-semibold leading-relaxed text-foreground/90 line-clamp-2 pl-3 border-l-2 border-primary/30">
            {template.subject}
          </div>
        </div>

        {/* Body Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Content</span>
          </div>
          <div
            className={cn(
              "text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap break-words",
              isEmbedded ? "line-clamp-4" : "line-clamp-6",
            )}
          >
            {bodyPreview}
          </div>
        </div>
      </div>

      <div className={cn("mt-auto border-t-2 border-border/50 bg-muted/30", isEmbedded ? "p-5 pt-4" : "p-6 pt-5")}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {template.category && (
              <span
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold border",
                  getCategoryColor(template.category),
                )}
              >
                {template.category}
              </span>
            )}
            {template.industry && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background/60 text-muted-foreground border border-border">
                {template.industry}
              </span>
            )}
          </div>
          {(openRate > 0 || replyRate > 0) && (
            <div className="flex items-center gap-4">
              {openRate > 0 && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={cn("text-sm font-bold", getPerformanceColor(openRate))}>{openRate.toFixed(0)}%</span>
                  <span className="text-xs text-muted-foreground">open</span>
                </div>
              )}
              {replyRate > 0 && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={cn("text-sm font-bold", getPerformanceColor(replyRate))}>
                    {replyRate.toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground">reply</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {onSelect && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-background/98 via-background/96 to-primary/5 backdrop-blur-md",
            "flex items-center justify-center",
            "transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={handleView}
        >
          <Button size="lg" className="h-14 px-12 text-base font-bold shadow-2xl shadow-primary/20 gap-3 group/btn">
            {template.isSystemTemplate ? "Use This Template" : "Select Template"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
