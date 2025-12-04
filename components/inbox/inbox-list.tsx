"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Paperclip,
  Reply,
  Sparkles,
  StickyNote,
  Clock,
  Inbox,
  FileText,
  Zap,
  Activity,
} from "lucide-react"
import type { InboxMessage } from "@/lib/services/unified-inbox"
import { AttachmentList } from "./attachment-list"
import { QuickReplyDialog } from "./quick-reply-dialog"
import { InboxActions } from "./inbox-actions"
import { MessageContextMenu } from "./message-context-menu"
import { CommandPalette } from "./command-palette"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"
import { QuickFilters } from "./quick-filters"
import { HoverPreview } from "./hover-preview"
import { AvatarInitials } from "./avatar-initials"
import { SmartTime } from "./smart-time"
import { SnoozePopover } from "./snooze-popover"
import { AddNoteDialog } from "./add-note-dialog"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { isThisWeek } from "date-fns"
import { SmartReplies } from "./smart-replies"
import { EmailSummary } from "./email-summary"
import { ActivitySidebar } from "./activity-sidebar"
import { TemplatesDrawer } from "./templates-drawer"

interface InboxListProps {
  messages: InboxMessage[]
}

export function InboxList({ messages }: InboxListProps) {
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [showAiReplyDialog, setShowAiReplyDialog] = useState(false)
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [localMessages, setLocalMessages] = useState(messages)
  const [showActivitySidebar, setShowActivitySidebar] = useState(false)

  // Filter counts for quick filters
  const filterCounts = useMemo(
    () => ({
      all: localMessages.length,
      unread: localMessages.filter((m) => !m.isRead).length,
      starred: localMessages.filter((m) => m.isStarred).length,
      highPriority: localMessages.filter((m) => m.priority === "HIGH").length,
      interested: localMessages.filter((m) => m.category === "INTERESTED").length,
      questions: localMessages.filter((m) => m.category === "QUESTION").length,
      thisWeek: localMessages.filter((m) => isThisWeek(new Date(m.receivedAt))).length,
    }),
    [localMessages],
  )

  const filteredMessages = useMemo(() => {
    return localMessages.filter((msg) => {
      if (filter === "all") return true
      if (filter === "unread") return !msg.isRead
      if (filter === "starred") return msg.isStarred
      if (filter === "high") return msg.priority === "HIGH"
      if (filter === "interested") return msg.category === "INTERESTED"
      if (filter === "question") return msg.category === "QUESTION"
      if (filter === "thisWeek") return isThisWeek(new Date(msg.receivedAt))
      return msg.category?.toLowerCase() === filter.toLowerCase()
    })
  }, [localMessages, filter])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(filteredMessages.map((m) => m.id))
  }, [filteredMessages])

  const deselectAll = useCallback(() => {
    setSelectedIds([])
  }, [])

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      deselectAll()
    } else {
      selectAll()
    }
  }

  // Utility functions
  const getSentimentConfig = (sentiment?: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
          text: "text-emerald-700 dark:text-emerald-300",
          border: "border-emerald-500/20",
        }
      case "NEUTRAL":
        return {
          bg: "bg-blue-500/10 dark:bg-blue-500/20",
          text: "text-blue-700 dark:text-blue-300",
          border: "border-blue-500/20",
        }
      case "NEGATIVE":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20",
          text: "text-red-700 dark:text-red-300",
          border: "border-red-500/20",
        }
      default:
        return { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" }
    }
  }

  const getCategoryConfig = (category?: string) => {
    const configs: Record<string, { bg: string; dot: string }> = {
      INTERESTED: { bg: "bg-emerald-500/10", dot: "bg-emerald-500" },
      QUESTION: { bg: "bg-amber-500/10", dot: "bg-amber-500" },
      NOT_INTERESTED: { bg: "bg-red-500/10", dot: "bg-red-500" },
      OUT_OF_OFFICE: { bg: "bg-gray-500/10", dot: "bg-gray-500" },
      UNSUBSCRIBE: { bg: "bg-red-700/10", dot: "bg-red-700" },
      REFERRAL: { bg: "bg-purple-500/10", dot: "bg-purple-500" },
    }
    return configs[category || ""] || { bg: "bg-muted", dot: "bg-gray-400" }
  }

  // Action handlers
  const handleStar = async (messageId: string, currentlyStarred: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsProcessing(true)
    try {
      const response = await fetch("/api/inbox/actions/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId], starred: !currentlyStarred }),
      })

      if (!response.ok) throw new Error()

      setLocalMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isStarred: !currentlyStarred } : m)))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, isStarred: !currentlyStarred })
      }

      toast.success(currentlyStarred ? "Unstarred" : "Starred")
    } catch {
      toast.error("Failed to update star")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleArchive = async (messageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsProcessing(true)

    const archivedMessage = localMessages.find((m) => m.id === messageId)

    try {
      setLocalMessages((prev) => prev.filter((m) => m.id !== messageId))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }

      const response = await fetch("/api/inbox/actions/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId], archive: true }),
      })

      if (!response.ok) throw new Error()

      toast.success("Archived", {
        action: {
          label: "Undo",
          onClick: async () => {
            await fetch("/api/inbox/actions/archive", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ replyIds: [messageId], archive: false }),
            })
            if (archivedMessage) {
              setLocalMessages((prev) => [archivedMessage, ...prev])
            }
            toast.success("Restored")
          },
        },
      })
    } catch {
      if (archivedMessage) {
        setLocalMessages((prev) => [archivedMessage, ...prev])
      }
      toast.error("Failed to archive")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async (messageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm("Are you sure you want to delete this message?")) return

    setIsProcessing(true)
    try {
      setLocalMessages((prev) => prev.filter((m) => m.id !== messageId))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }

      const response = await fetch("/api/inbox/actions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId] }),
      })

      if (!response.ok) throw new Error()
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
      window.location.reload()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkRead = async (messageId: string, read: boolean) => {
    try {
      setLocalMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isRead: read } : m)))
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, isRead: read })
      }

      await fetch("/api/inbox/actions/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [messageId], read }),
      })
    } catch {
      toast.error("Failed to update")
    }
  }

  const handleSelectMessage = async (message: InboxMessage | null) => {
    if (!message) {
      setSelectedMessage(null) // Clear selection
      return
    }
    
    setSelectedMessage(message)

    if (!message.isRead) {
      handleMarkRead(message.id, true)
    }
  }

  const handleSnooze = async (until: Date) => {
    if (!selectedMessage) return
    try {
      await fetch("/api/inbox/actions/snooze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyIds: [selectedMessage.id], snoozeUntil: until.toISOString() }),
      })
      setLocalMessages((prev) => prev.filter((m) => m.id !== selectedMessage.id))
      setSelectedMessage(null)
      toast.success(`Snoozed until ${until.toLocaleDateString()}`)
    } catch {
      toast.error("Failed to snooze")
    }
  }

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.success("Email copied")
  }

  const handleContextAction = useCallback(
    (action: string) => {
      if (!selectedMessage) return

      switch (action) {
        case "reply":
          setShowReplyDialog(true)
          break
        case "ai-reply":
          setShowAiReplyDialog(true)
          break
        case "star":
          handleStar(selectedMessage.id, selectedMessage.isStarred || false)
          break
        case "archive":
          handleArchive(selectedMessage.id)
          break
        case "delete":
          handleDelete(selectedMessage.id)
          break
        case "mark-read":
          handleMarkRead(selectedMessage.id, true)
          break
        case "mark-unread":
          handleMarkRead(selectedMessage.id, false)
          break
        case "add-note":
          setShowAddNoteDialog(true)
          break
        case "copy-email":
          handleCopyEmail(selectedMessage.prospectEmail)
          break
        case "show-activity":
          setShowActivitySidebar(true)
          break
      }
    },
    [selectedMessage],
  )

  const handleCommandAction = useCallback(
    (action: string) => {
      switch (action) {
        case "reply":
          if (selectedMessage) setShowReplyDialog(true)
          break
        case "ai-reply":
          if (selectedMessage) setShowAiReplyDialog(true)
          break
        case "archive":
          if (selectedMessage) handleArchive(selectedMessage.id)
          break
        case "star":
          if (selectedMessage) handleStar(selectedMessage.id, selectedMessage.isStarred || false)
          break
        case "delete":
          if (selectedMessage) handleDelete(selectedMessage.id)
          break
        case "show-shortcuts":
          setShowShortcutsDialog(true)
          break
        case "filter-unread":
          setFilter("unread")
          break
        case "filter-starred":
          setFilter("starred")
          break
        case "filter-priority":
          setFilter("high")
          break
        case "filter-interested":
          setFilter("interested")
          break
        case "filter-question":
          setFilter("question")
          break
        case "snooze":
          // Open snooze via button click
          break
        case "mark-read":
          if (selectedMessage) handleMarkRead(selectedMessage.id, true)
          break
        case "mark-unread":
          if (selectedMessage) handleMarkRead(selectedMessage.id, false)
          break
        case "show-activity":
          if (selectedMessage) setShowActivitySidebar(true)
          break
      }
    },
    [selectedMessage],
  )

  useKeyboardNavigation({
    messages: filteredMessages,
    selectedMessage,
    selectedIds,
    onSelectMessage: handleSelectMessage,
    onToggleSelection: toggleSelection,
    onSelectAll: selectAll,
    onDeselectAll: deselectAll,
    onAction: handleCommandAction,
  })

  return (
    <div className="h-full flex flex-col">
      {/* Command Palette */}
      <CommandPalette
        messages={localMessages}
        selectedMessage={selectedMessage}
        onSelectMessage={handleSelectMessage}
        onAction={handleCommandAction}
        selectedIds={selectedIds}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog} />

      {selectedMessage && (
        <ActivitySidebar
          prospectId={selectedMessage.prospectId}
          prospectName={selectedMessage.prospectName}
          open={showActivitySidebar}
          onOpenChange={setShowActivitySidebar}
        />
      )}

      <div className="flex-none space-y-3 pb-3">
        {/* Quick Filter Pills */}
        <QuickFilters activeFilter={filter} onFilterChange={setFilter} counts={filterCounts} />

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <InboxActions
            selectedIds={selectedIds}
            onSuccess={() => {
              setSelectedIds([])
              window.location.reload()
            }}
          />
        )}
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-0 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm"
      >
        {/* Message List Panel */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <div className="h-full flex flex-col border-r border-border/40">
            {/* List Header - Fixed */}
            <div className="flex-none px-4 py-3 border-b border-border/40 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{filteredMessages.length} messages</span>
                <Checkbox
                  checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                  onCheckedChange={toggleSelectAll}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="divide-y divide-border/30">
                {filteredMessages.map((message) => {
                  const categoryConfig = getCategoryConfig(message.category)
                  const isSelected = selectedMessage?.id === message.id
                  const isChecked = selectedIds.includes(message.id)

                  return (
                    <MessageContextMenu
                      key={message.id}
                      onAction={handleContextAction}
                      isRead={message.isRead}
                      isStarred={message.isStarred || false}
                    >
                      <ContextMenuTrigger asChild>
                        <HoverPreview message={message}>
                          <div
                            className={cn(
                              "group relative px-4 py-3 cursor-pointer transition-all duration-150",
                              "hover:bg-accent/50",
                              isSelected && "bg-accent/80 border-l-2 border-l-primary",
                              !message.isRead && "bg-primary/[0.03]",
                            )}
                            onClick={() => handleSelectMessage(message)}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => toggleSelection(message.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 data-[state=checked]:bg-primary"
                              />

                              <AvatarInitials
                                name={message.prospectName}
                                email={message.prospectEmail}
                                size="sm"
                                className="mt-0.5 flex-shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                {/* Name + Time Row */}
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {!message.isRead && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                    <span
                                      className={cn(
                                        "text-sm truncate",
                                        !message.isRead ? "font-semibold" : "font-medium",
                                      )}
                                    >
                                      {message.prospectName}
                                    </span>
                                    {message.isStarred && (
                                      <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <SmartTime
                                    date={message.receivedAt}
                                    className="text-[11px] text-muted-foreground flex-shrink-0"
                                  />
                                </div>

                                {/* Subject */}
                                <p
                                  className={cn(
                                    "text-[13px] line-clamp-1 mb-1",
                                    !message.isRead ? "text-foreground" : "text-muted-foreground",
                                  )}
                                >
                                  {message.subject}
                                </p>

                                {/* Preview text */}
                                <p className="text-xs text-muted-foreground/70 line-clamp-1 mb-2">
                                  {message.body.slice(0, 60)}...
                                </p>

                                {/* Badges + Icons */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    {message.category && (
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "text-[10px] px-1.5 py-0 h-[18px] font-medium gap-1",
                                          categoryConfig.bg,
                                        )}
                                      >
                                        <div className={cn("h-1.5 w-1.5 rounded-full", categoryConfig.dot)} />
                                        {message.category.replace(/_/g, " ")}
                                      </Badge>
                                    )}
                                    {message.priority === "HIGH" && (
                                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-[18px] gap-0.5">
                                        <Zap className="h-2.5 w-2.5" />
                                        HOT
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground/50">
                                    {message.attachments && message.attachments.length > 0 && (
                                      <Paperclip className="h-3 w-3" />
                                    )}
                                    {message.notes && <StickyNote className="h-3 w-3" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverPreview>
                      </ContextMenuTrigger>
                    </MessageContextMenu>
                  )
                })}

                {filteredMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="rounded-full bg-muted/50 p-4 mb-4">
                      <Inbox className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{filter === "all" ? "Inbox Zero!" : "No messages"}</h3>
                    <p className="text-xs text-muted-foreground text-center">
                      {filter === "all" ? "You're all caught up" : `No ${filter} messages`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-transparent hover:bg-border/50 transition-colors w-1" />

        {/* Message Detail Panel */}
        <ResizablePanel defaultSize={65}>
          <div className="h-full flex flex-col bg-background/30">
            {selectedMessage ? (
              <>
                {/* Detail Header - Fixed */}
                <div className="flex-none p-5 border-b border-border/40 bg-muted/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold tracking-tight mb-3 line-clamp-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-3">
                        <AvatarInitials
                          name={selectedMessage.prospectName}
                          email={selectedMessage.prospectEmail}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-sm">{selectedMessage.prospectName}</p>
                          <p className="text-xs text-muted-foreground truncate">{selectedMessage.prospectEmail}</p>
                          <p className="text-[11px] text-muted-foreground/70">
                            {selectedMessage.prospectCompany} • <SmartTime date={selectedMessage.receivedAt} />
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-accent"
                        onClick={() => setShowActivitySidebar(true)}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      <SnoozePopover onSnooze={handleSnooze}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-accent">
                          <Clock className="h-4 w-4" />
                        </Button>
                      </SnoozePopover>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-accent"
                        onClick={(e) => handleStar(selectedMessage.id, selectedMessage.isStarred || false, e)}
                        disabled={isProcessing}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            selectedMessage.isStarred && "fill-amber-500 text-amber-500",
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-accent"
                        onClick={(e) => handleArchive(selectedMessage.id, e)}
                        disabled={isProcessing}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => handleDelete(selectedMessage.id, e)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedMessage.category && (
                      <Badge
                        variant="secondary"
                        className={cn("gap-1 text-xs", getCategoryConfig(selectedMessage.category).bg)}
                      >
                        <div
                          className={cn("h-1.5 w-1.5 rounded-full", getCategoryConfig(selectedMessage.category).dot)}
                        />
                        {selectedMessage.category.replace(/_/g, " ")}
                      </Badge>
                    )}
                    {selectedMessage.sentiment && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          getSentimentConfig(selectedMessage.sentiment).bg,
                          getSentimentConfig(selectedMessage.sentiment).text,
                          getSentimentConfig(selectedMessage.sentiment).border,
                        )}
                      >
                        {selectedMessage.sentiment}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-background/50 text-xs">
                      {selectedMessage.campaignName}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="p-5 space-y-5">
                    {/* Email Body */}
                    <div className="whitespace-pre-wrap bg-muted/20 p-4 rounded-lg border border-border/40 text-sm leading-relaxed">
                      {selectedMessage.body}
                    </div>

                    {/* AI Features Section */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <SmartReplies
                        replyId={selectedMessage.id}
                        emailBody={selectedMessage.body}
                        onSelectReply={() => setShowReplyDialog(true)}
                      />
                      <EmailSummary replyId={selectedMessage.id} emailBody={selectedMessage.body} />
                    </div>

                    {/* Notes */}
                    {selectedMessage.notes && (
                      <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                        <div className="rounded-md bg-blue-500/10 p-2">
                          <StickyNote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs text-blue-700 dark:text-blue-300 mb-1">Notes</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedMessage.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div className="pt-4 border-t border-border/40">
                        <AttachmentList attachments={selectedMessage.attachments} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Footer - Fixed */}
                <div className="flex-none p-4 border-t border-border/40 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Button className="gap-2 rounded-xl shadow-sm" onClick={() => setShowReplyDialog(true)}>
                      <Reply className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-xl bg-transparent"
                      onClick={() => setShowAiReplyDialog(true)}
                    >
                      <Sparkles className="h-4 w-4" />
                      AI Reply
                    </Button>
                    <TemplatesDrawer
                      onSelectTemplate={(template) => {
                        setShowReplyDialog(true)
                        toast.success(`Template "${template.name}" ready to use`)
                      }}
                    >
                      <Button variant="outline" className="gap-2 rounded-xl bg-transparent">
                        <FileText className="h-4 w-4" />
                        Templates
                      </Button>
                    </TemplatesDrawer>
                    <Button
                      variant="ghost"
                      className="gap-2 rounded-xl ml-auto"
                      onClick={() => setShowAddNoteDialog(true)}
                    >
                      <StickyNote className="h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="rounded-full bg-muted/30 p-5 mb-5">
                  <Mail className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-base font-medium mb-2">Select a message</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] mb-5">
                  Choose a message from the list to view details
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">j</kbd>/
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">k</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border text-[10px]">x</kbd> select
                  </span>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Dialogs */}
      {selectedMessage && (
        <>
          <QuickReplyDialog
            isOpen={showReplyDialog}
            onClose={() => setShowReplyDialog(false)}
            replyId={selectedMessage.id}
            prospectName={selectedMessage.prospectName}
            onSuccess={() => window.location.reload()}
          />

          <QuickReplyDialog
            isOpen={showAiReplyDialog}
            onClose={() => setShowAiReplyDialog(false)}
            replyId={selectedMessage.id}
            prospectName={selectedMessage.prospectName}
            onSuccess={() => window.location.reload()}
            useAI={true}
          />

          <AddNoteDialog
            isOpen={showAddNoteDialog}
            onClose={() => setShowAddNoteDialog(false)}
            replyIds={[selectedMessage.id]}
            onSuccess={() => window.location.reload()}
          />
        </>
      )}
    </div>
  )
}
