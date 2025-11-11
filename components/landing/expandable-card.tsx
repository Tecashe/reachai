"use client"

import { type ReactNode, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableCardProps {
  trigger: ReactNode
  content: ReactNode
  title: string
  className?: string
}

export function ExpandableCard({ trigger, content, title, className }: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div
        onClick={() => setIsExpanded(true)}
        className={cn("cursor-pointer transition-all duration-300 hover:scale-[1.02]", className)}
      >
        {trigger}
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in-0 duration-300"
          onClick={() => setIsExpanded(false)}
        >
          <div className="absolute inset-0 mesh-gradient" />

          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:bg-muted transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
              <h2 className="text-4xl sm:text-5xl font-bold mb-12 text-balance">{title}</h2>
              {content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
