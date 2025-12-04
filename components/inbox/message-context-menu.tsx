"use client"

import type * as React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu"
import {
  Reply,
  Sparkles,
  Archive,
  Star,
  Trash2,
  Clock,
  Mail,
  MailOpen,
  Tag,
  Copy,
  ExternalLink,
  UserPlus,
  StickyNote,
} from "lucide-react"

interface MessageContextMenuProps {
  children: React.ReactNode
  onAction: (action: string) => void
  isRead: boolean
  isStarred: boolean
}

export function MessageContextMenu({ children, onAction, isRead, isStarred }: MessageContextMenuProps) {
  return (
    <ContextMenu>
      {children}
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onAction("reply")}>
          <Reply className="mr-2 h-4 w-4" />
          Reply
          <ContextMenuShortcut>R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("ai-reply")}>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate AI Reply
          <ContextMenuShortcut>G</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("star")}>
          <Star className={`mr-2 h-4 w-4 ${isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
          {isStarred ? "Remove Star" : "Add Star"}
          <ContextMenuShortcut>S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction(isRead ? "mark-unread" : "mark-read")}>
          {isRead ? (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Mark as Unread
            </>
          ) : (
            <>
              <MailOpen className="mr-2 h-4 w-4" />
              Mark as Read
            </>
          )}
          <ContextMenuShortcut>U</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Clock className="mr-2 h-4 w-4" />
            Snooze
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={() => onAction("snooze-later")}>Later today</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("snooze-tomorrow")}>Tomorrow morning</ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("snooze-week")}>Next week</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onAction("snooze-custom")}>Pick date & time...</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("add-note")}>
          <StickyNote className="mr-2 h-4 w-4" />
          Add Note
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("add-to-sequence")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add to Sequence
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Tag className="mr-2 h-4 w-4" />
            Categorize
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40">
            <ContextMenuItem onClick={() => onAction("category-interested")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
              Interested
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("category-question")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
              Question
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("category-not-interested")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />
              Not Interested
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAction("category-referral")}>
              <span className="mr-2 h-2 w-2 rounded-full bg-purple-500" />
              Referral
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("copy-email")}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Email Address
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("open-profile")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View Prospect Profile
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => onAction("archive")}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
          <ContextMenuShortcut>E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onAction("delete")} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>#</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
