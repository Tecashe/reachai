"use client"

import type * as React from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { AvatarInitials } from "./avatar-initials"
import { SmartTime } from "./smart-time"
import { Paperclip, Star, Building } from "lucide-react"
import type { InboxMessage } from "@/lib/services/unified-inbox"

interface HoverPreviewProps {
  message: InboxMessage
  children: React.ReactNode
}

export function HoverPreview({ message, children }: HoverPreviewProps) {
  const previewBody = message.body.slice(0, 280) + (message.body.length > 280 ? "..." : "")

  return (
    <HoverCard openDelay={400} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-96 p-0" side="right" align="start">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <AvatarInitials name={message.prospectName} email={message.prospectEmail} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{message.prospectName}</h4>
                {message.isStarred && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{message.prospectEmail}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                {message.prospectCompany && (
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {message.prospectCompany}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <h5 className="font-medium text-sm line-clamp-2">{message.subject}</h5>
            <SmartTime date={message.receivedAt} className="text-xs text-muted-foreground" />
          </div>

          {/* Preview body */}
          <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{previewBody}</p>

          {/* Footer */}
          <div className="flex items-center gap-2 pt-2 border-t">
            {message.category && (
              <Badge variant="secondary" className="text-xs">
                {message.category}
              </Badge>
            )}
            {message.sentiment && (
              <Badge variant="outline" className="text-xs">
                {message.sentiment}
              </Badge>
            )}
            {message.attachments && message.attachments.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Paperclip className="h-3 w-3" />
                {message.attachments.length}
              </span>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
