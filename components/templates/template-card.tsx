"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Star,
  Copy,
  Trash2,
  MoreHorizontal,
  Mail,
  Eye,
  TrendingUp,
  Clock,
  Pencil,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
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
  const performanceScore = (openRate + clickRate) / 2

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
        {/* Favorite indicator line */}
        {template.isFavorite && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-r-full" />
        )}

        {/* Template icon/preview */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
          <Mail className="w-5 h-5 text-muted-foreground" />
          {template.aiGenerated && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate">{template.name}</h3>
            {template.category && (
              <Badge
                variant="secondary"
                className={cn("text-[10px] px-1.5 py-0 h-4 font-medium", getCategoryColor(template.category))}
              >
                {template.category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{template.subject || "No subject"}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={getPerformanceColor(openRate)}>{openRate.toFixed(1)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Open rate</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={getPerformanceColor(clickRate)}>{clickRate.toFixed(1)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Reply rate</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">
              {new Date(template.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-lg", template.isFavorite && "text-amber-500")}
                  onClick={handleFavorite}
                >
                  <Star
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isFavoriteAnimating && "scale-125",
                      template.isFavorite && "fill-current",
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{template.isFavorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(template)
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit template
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(template.id)
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(template.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      {/* Favorite indicator */}
      {template.isFavorite && (
        <div className="absolute top-3 left-3 z-10">
          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
        </div>
      )}

      {/* AI badge */}
      {template.aiGenerated && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-primary">AI</span>
          </div>
        </div>
      )}

      {/* Preview area */}
      <div className="relative h-36 bg-muted/30 overflow-hidden">
        {/* Email preview mockup */}
        <div className="absolute inset-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 p-3 overflow-hidden">
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-muted" />
            <div className="h-2 w-1/2 rounded-full bg-muted" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-muted/60" />
              <div className="h-1.5 w-full rounded-full bg-muted/60" />
              <div className="h-1.5 w-2/3 rounded-full bg-muted/60" />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm",
            "flex items-center justify-center gap-2",
            "transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            className="h-8 rounded-lg shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              onPreview(template)
            }}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-lg shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              handleEdit()
            }}
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {template.category && (
              <Badge
                variant="secondary"
                className={cn("text-[10px] px-1.5 py-0 h-4 font-medium mb-2", getCategoryColor(template.category))}
              >
                {template.category}
              </Badge>
            )}
            <h3 className="font-semibold text-foreground truncate leading-tight">{template.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 rounded-lg flex-shrink-0 -mr-1 -mt-1", template.isFavorite && "text-amber-500")}
            onClick={handleFavorite}
          >
            <Star
              className={cn(
                "w-4 h-4 transition-transform",
                isFavoriteAnimating && "scale-125",
                template.isFavorite && "fill-current",
              )}
            />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{template.subject || "No subject line"}</p>

        {/* Performance metrics */}
        <div className="flex items-center gap-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                openRate >= 40 ? "bg-emerald-500" : openRate >= 25 ? "bg-amber-500" : "bg-muted-foreground",
              )}
            />
            <span className="text-xs text-muted-foreground">{openRate.toFixed(0)}% opens</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                clickRate >= 40 ? "bg-emerald-500" : clickRate >= 25 ? "bg-amber-500" : "bg-muted-foreground",
              )}
            />
            <span className="text-xs text-muted-foreground">{clickRate.toFixed(0)}% replies</span>
          </div>
        </div>
      </div>

      {/* Quick actions footer */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/30",
          "transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-[11px] text-muted-foreground">
          Updated{" "}
          {new Date(template.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded"
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(template.id)
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate(template.id)
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(template.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
