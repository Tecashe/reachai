"use client"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Mail, Star, Flame, MessageCircleQuestion, ThumbsUp, Calendar } from "lucide-react"

interface QuickFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    all: number
    unread: number
    starred: number
    highPriority: number
    interested: number
    questions: number
    thisWeek: number
  }
}

export function QuickFilters({ activeFilter, onFilterChange, counts }: QuickFiltersProps) {
  const filters = [
    { id: "all", label: "All", icon: Mail, count: counts.all },
    { id: "unread", label: "Unread", icon: Mail, count: counts.unread },
    { id: "starred", label: "Starred", icon: Star, count: counts.starred },
    { id: "high", label: "Hot", icon: Flame, count: counts.highPriority, color: "text-orange-500" },
    { id: "interested", label: "Interested", icon: ThumbsUp, count: counts.interested, color: "text-green-500" },
    {
      id: "question",
      label: "Questions",
      icon: MessageCircleQuestion,
      count: counts.questions,
      color: "text-yellow-500",
    },
    { id: "thisWeek", label: "This Week", icon: Calendar, count: counts.thisWeek },
  ]

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              "border border-transparent",
              "hover:bg-accent",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground",
            )}
          >
            <filter.icon className={cn("h-3.5 w-3.5", filter.color)} />
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <Badge
                variant={activeFilter === filter.id ? "secondary" : "outline"}
                className={cn(
                  "h-5 min-w-5 px-1.5 text-xs",
                  activeFilter === filter.id && "bg-primary-foreground/20 text-primary-foreground border-0",
                )}
              >
                {filter.count}
              </Badge>
            )}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}
