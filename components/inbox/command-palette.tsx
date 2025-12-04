"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Mail,
  Archive,
  Star,
  Trash2,
  Reply,
  Sparkles,
  Clock,
  Tag,
  CheckCheck,
  Filter,
  Settings,
  Keyboard,
} from "lucide-react"
import type { InboxMessage } from "@/lib/services/unified-inbox"

interface CommandPaletteProps {
  messages: InboxMessage[]
  selectedMessage: InboxMessage | null
  onSelectMessage: (message: InboxMessage) => void
  onAction: (action: string, messageIds?: string[]) => void
  selectedIds: string[]
}

export function CommandPalette({
  messages,
  selectedMessage,
  onSelectMessage,
  onAction,
  selectedIds,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runAction = (action: string) => {
    onAction(action, selectedIds.length > 0 ? selectedIds : selectedMessage ? [selectedMessage.id] : [])
    setOpen(false)
  }

  const unreadMessages = messages.filter((m) => !m.isRead)
  const starredMessages = messages.filter((m) => m.isStarred)
  const highPriorityMessages = messages.filter((m) => m.priority === "HIGH")

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search emails..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runAction("reply")}>
            <Reply className="mr-2 h-4 w-4" />
            Reply to Email
            <CommandShortcut>R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("ai-reply")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Reply
            <CommandShortcut>G</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("archive")}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
            <CommandShortcut>E</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("star")}>
            <Star className="mr-2 h-4 w-4" />
            Toggle Star
            <CommandShortcut>S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("snooze")}>
            <Clock className="mr-2 h-4 w-4" />
            Snooze Email
            <CommandShortcut>H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("mark-read")}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark as Read
            <CommandShortcut>Shift+U</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAction("delete")}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
            <CommandShortcut>#</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Filters */}
        <CommandGroup heading="Filter By">
          <CommandItem onSelect={() => runAction("filter-unread")}>
            <Mail className="mr-2 h-4 w-4" />
            Unread ({unreadMessages.length})
          </CommandItem>
          <CommandItem onSelect={() => runAction("filter-starred")}>
            <Star className="mr-2 h-4 w-4" />
            Starred ({starredMessages.length})
          </CommandItem>
          <CommandItem onSelect={() => runAction("filter-priority")}>
            <Filter className="mr-2 h-4 w-4" />
            High Priority ({highPriorityMessages.length})
          </CommandItem>
          <CommandItem onSelect={() => runAction("filter-interested")}>
            <Tag className="mr-2 h-4 w-4 text-green-500" />
            Interested
          </CommandItem>
          <CommandItem onSelect={() => runAction("filter-question")}>
            <Tag className="mr-2 h-4 w-4 text-yellow-500" />
            Questions
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Search Messages */}
        <CommandGroup heading="Jump to Message">
          {messages.slice(0, 5).map((message) => (
            <CommandItem
              key={message.id}
              onSelect={() => {
                onSelectMessage(message)
                setOpen(false)
              }}
            >
              <div className="flex items-center gap-2 w-full">
                {message.isRead ? (
                  <Mail className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
                <div className="flex-1 truncate">
                  <span className="font-medium">{message.prospectName}</span>
                  <span className="text-muted-foreground ml-2 text-sm truncate">{message.subject}</span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => router.push("/dashboard")}>
            <Settings className="mr-2 h-4 w-4" />
            Go to Dashboard
          </CommandItem>
          <CommandItem onSelect={() => runAction("show-shortcuts")}>
            <Keyboard className="mr-2 h-4 w-4" />
            Keyboard Shortcuts
            <CommandShortcut>?</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
