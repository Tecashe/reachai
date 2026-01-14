
"use client"

import * as React from "react"
import {
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  Archive,
  Pencil,
  Mail,
  Linkedin,
  Phone,
  Users,
  TrendingUp,
  Clock,
  TestTube,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { Sequence, SequenceStatus } from "@/lib/types/sequence"
import {
  updateSequenceStatus,
  duplicateSequence,
  archiveSequence,
  deleteSequence,
} from "@/lib/actions/sequence-actions"
import { toast } from "sonner"
import { WaveLoader } from "../loader/wave-loader"

interface SequenceCardProps {
  sequence: Sequence
  userId: string
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onUpdated: (sequence: Sequence) => void
  onDeleted: () => void
}

const STATUS_CONFIG: Record<SequenceStatus, { label: string; className: string; dotClassName: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
    dotClassName: "bg-muted-foreground",
  },
  ACTIVE: {
    label: "Active",
    className: "bg-success/10 text-success border-success/20",
    dotClassName: "bg-success animate-pulse",
  },
  PAUSED: {
    label: "Paused",
    className: "bg-warning/10 text-warning border-warning/20",
    dotClassName: "bg-warning",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-primary/10 text-primary border-primary/20",
    dotClassName: "bg-primary",
  },
  ARCHIVED: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
    dotClassName: "bg-muted-foreground",
  },
}

export function SequenceCard({
  sequence,
  userId,
  isSelected,
  onSelect,
  onEdit,
  onUpdated,
  onDeleted,
}: SequenceCardProps) {
  const statusConfig = STATUS_CONFIG[sequence.status]
  const [isHovered, setIsHovered] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return new Date(date).toLocaleDateString()
  }

  const handleStatusChange = async (newStatus: SequenceStatus) => {
    setIsLoading(true)
    try {
      await updateSequenceStatus(sequence.id, userId, newStatus)
      // Update with new status locally since action returns void
      onUpdated({ ...sequence, status: newStatus })
      toast.success(`Sequence ${newStatus === "ACTIVE" ? "activated" : newStatus === "PAUSED" ? "paused" : "updated"}`)
    } catch (error) {
      toast.error("Failed to update sequence")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async () => {
    setIsLoading(true)
    try {
      await duplicateSequence(sequence.id, userId)
      toast.success("Sequence duplicated!")
      // Page will refresh via revalidation
    } catch (error) {
      toast.error("Failed to duplicate sequence")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async () => {
    setIsLoading(true)
    try {
      await archiveSequence(sequence.id, userId)
      onUpdated({ ...sequence, status: "ARCHIVED" })
      toast.success("Sequence archived")
    } catch (error) {
      toast.error("Failed to archive sequence")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteSequence(sequence.id, userId)
      onDeleted()
      toast.success("Sequence deleted")
    } catch (error) {
      toast.error("Failed to delete sequence")
      console.error(error)
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative flex flex-col rounded-xl border border-border bg-card transition-all duration-200",
          isSelected && "border-primary ring-1 ring-primary",
          isHovered && !isSelected && "border-border/80 shadow-md",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
            <WaveLoader size="sm" bars={8} gap="tight" />
          </div>
        )}

        {/* Selection checkbox */}
        <div
          className={cn(
            "absolute left-3 top-3 z-10 transition-opacity",
            isSelected || isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="h-4 w-4 border-muted-foreground/40 bg-background/80 backdrop-blur"
          />
        </div>

        {/* Card content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1 pr-8">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1 text-[10px] font-medium", statusConfig.className)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dotClassName)} />
                  {statusConfig.label}
                </Badge>
                {sequence.enableABTesting && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px]">
                        <TestTube className="h-3 w-3" />
                        A/B
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>A/B testing enabled</TooltipContent>
                  </Tooltip>
                )}
                {sequence.aiPersonalization && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px]">
                        <Sparkles className="h-3 w-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>AI personalization enabled</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-foreground">{sequence.name}</h3>
              {sequence.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{sequence.description}</p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit sequence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {sequence.status === "ACTIVE" ? (
                  <DropdownMenuItem onClick={() => handleStatusChange("PAUSED")}>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause sequence
                  </DropdownMenuItem>
                ) : sequence.status !== "COMPLETED" && sequence.status !== "ARCHIVED" ? (
                  <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")}>
                    <Play className="mr-2 h-4 w-4" />
                    Activate sequence
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Channel indicators */}
          <div className="mb-3 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Email steps</TooltipContent>
            </Tooltip>
            {sequence.enableLinkedIn && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                    <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>LinkedIn steps</TooltipContent>
              </Tooltip>
            )}
            {sequence.enableCalls && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Call steps</TooltipContent>
              </Tooltip>
            )}
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {sequence.totalSteps} steps
            </div>
          </div>

          {/* Tags */}
          {sequence.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {sequence.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {tag}
                </Badge>
              ))}
              {sequence.tags.length > 3 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  +{sequence.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{sequence.totalEnrolled.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Enrolled</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {sequence.avgOpenRate?.toFixed(1) ?? "-"}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Open Rate</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {sequence.avgReplyRate?.toFixed(1) ?? "-"}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Reply Rate</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <span className="text-[10px] text-muted-foreground">Updated {formatDate(sequence.updatedAt)}</span>
          <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-xs" onClick={onEdit}>
            Open
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sequence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sequence.name}"? This action cannot be undone and will remove all
              associated steps and enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
}
