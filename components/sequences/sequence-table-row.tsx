

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
  Sparkles,
  TestTube,
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

interface SequenceTableRowProps {
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

export function SequenceTableRow({
  sequence,
  userId,
  isSelected,
  onSelect,
  onEdit,
  onUpdated,
  onDeleted,
}: SequenceTableRowProps) {
  const statusConfig = STATUS_CONFIG[sequence.status]
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleStatusChange = async (newStatus: SequenceStatus) => {
    setIsLoading(true)
    try {
      await updateSequenceStatus(sequence.id, userId, newStatus)
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
    <>
      <div
        className={cn(
          "group grid grid-cols-[auto_1fr_120px_120px_100px_100px_100px_48px] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
          isSelected && "bg-primary/5",
          isLoading && "opacity-50 pointer-events-none",
        )}
      >
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />

        {/* Name and channels */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="truncate text-sm font-medium text-foreground hover:underline">
                {sequence.name}
              </button>
              {sequence.enableABTesting && (
                <Badge variant="secondary" className="h-4 gap-0.5 px-1 text-[9px]">
                  <TestTube className="h-2.5 w-2.5" />
                  A/B
                </Badge>
              )}
              {sequence.aiPersonalization && <Sparkles className="h-3 w-3 text-muted-foreground" />}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                {sequence.enableLinkedIn && <Linkedin className="h-3 w-3 text-muted-foreground" />}
                {sequence.enableCalls && <Phone className="h-3 w-3 text-muted-foreground" />}
              </div>
              <span className="text-xs text-muted-foreground">{sequence.totalSteps} steps</span>
              {sequence.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <div className="flex gap-1">
                    {sequence.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="h-4 px-1 text-[9px]">
                        {tag}
                      </Badge>
                    ))}
                    {sequence.tags.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{sequence.tags.length - 2}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <Badge variant="outline" className={cn("gap-1 text-[10px] font-medium", statusConfig.className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dotClassName)} />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Enrolled */}
        <div className="text-sm font-medium text-foreground">{sequence.totalEnrolled.toLocaleString()}</div>

        {/* Open Rate */}
        <div className="text-sm text-foreground">
          {sequence.avgOpenRate != null ? (
            <span className={cn(sequence.avgOpenRate >= 50 && "text-success")}>{sequence.avgOpenRate.toFixed(1)}%</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>

        {/* Reply Rate */}
        <div className="text-sm text-foreground">
          {sequence.avgReplyRate != null ? (
            <span className={cn(sequence.avgReplyRate >= 10 && "text-success")}>
              {sequence.avgReplyRate.toFixed(1)}%
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>

        {/* Updated */}
        <div className="text-xs text-muted-foreground">{formatDate(sequence.updatedAt)}</div>

        {/* Actions */}
        <div className="flex justify-end">
          {isLoading ? (
            <WaveLoader size="sm" bars={8} gap="tight" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
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
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sequence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sequence.name}"? This action cannot be undone.
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
    </>
  )
}
