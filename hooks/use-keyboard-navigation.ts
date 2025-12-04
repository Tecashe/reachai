"use client"

import * as React from "react"
import type { InboxMessage } from "@/lib/services/unified-inbox"

interface UseKeyboardNavigationOptions {
  messages: InboxMessage[]
  selectedMessage: InboxMessage | null
  selectedIds: string[]
  onSelectMessage: (message: InboxMessage | null) => void
  onToggleSelection: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onAction: (action: string) => void
}

export function useKeyboardNavigation({
  messages,
  selectedMessage,
  selectedIds,
  onSelectMessage,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onAction,
}: UseKeyboardNavigationOptions) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      const currentIndex = selectedMessage ? messages.findIndex((m) => m.id === selectedMessage.id) : -1

      switch (e.key.toLowerCase()) {
        // Navigation
        case "j": // Next message
          e.preventDefault()
          if (currentIndex < messages.length - 1) {
            onSelectMessage(messages[currentIndex + 1])
          } else if (currentIndex === -1 && messages.length > 0) {
            onSelectMessage(messages[0])
          }
          break

        case "k": // Previous message
          e.preventDefault()
          if (currentIndex > 0) {
            onSelectMessage(messages[currentIndex - 1])
          }
          break

        case "enter": // Open message
          if (currentIndex >= 0 && !selectedMessage) {
            e.preventDefault()
            onSelectMessage(messages[currentIndex])
          }
          break

        case "escape": // Close/deselect
          e.preventDefault()
          if (selectedIds.length > 0) {
            onDeselectAll()
          } else {
            onSelectMessage(null)
          }
          break

        // Selection
        case "x": // Toggle selection
          e.preventDefault()
          if (selectedMessage) {
            onToggleSelection(selectedMessage.id)
          }
          break

        case "a": // Select all
          if (e.shiftKey) {
            e.preventDefault()
            onSelectAll()
          }
          break

        case "n": // Deselect all
          if (e.shiftKey) {
            e.preventDefault()
            onDeselectAll()
          }
          break

        // Actions
        case "r": // Reply
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            onAction("reply")
          }
          break

        case "g": // Generate AI reply
          e.preventDefault()
          onAction("ai-reply")
          break

        case "e": // Archive
          e.preventDefault()
          onAction("archive")
          break

        case "s": // Star
          e.preventDefault()
          onAction("star")
          break

        case "h": // Snooze
          e.preventDefault()
          onAction("snooze")
          break

        case "#": // Delete
          e.preventDefault()
          onAction("delete")
          break

        case "u": // Mark as unread/read
          e.preventDefault()
          if (e.shiftKey) {
            onAction("mark-read")
          } else {
            onAction("mark-unread")
          }
          break

        case "/": // Focus search
          e.preventDefault()
          onAction("focus-search")
          break

        case "?": // Show shortcuts
          e.preventDefault()
          onAction("show-shortcuts")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [messages, selectedMessage, selectedIds, onSelectMessage, onToggleSelection, onSelectAll, onDeselectAll, onAction])
}
