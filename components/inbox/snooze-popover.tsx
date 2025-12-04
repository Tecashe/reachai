"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Sun, CalendarIcon, ChevronRight } from "lucide-react"
import { addHours, addDays, setHours, setMinutes, nextMonday, format } from "date-fns"

interface SnoozePopoverProps {
  onSnooze: (until: Date) => void
  children: React.ReactNode
}

export function SnoozePopover({ onSnooze, children }: SnoozePopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [showCalendar, setShowCalendar] = React.useState(false)

  const handleSnooze = (until: Date) => {
    onSnooze(until)
    setOpen(false)
    setShowCalendar(false)
  }

  const getLaterToday = () => {
    const now = new Date()
    // Round up to next hour + 3 hours
    const later = setMinutes(setHours(addHours(now, 3), now.getHours() + 3), 0)
    return later
  }

  const getTomorrow = () => {
    const tomorrow = addDays(new Date(), 1)
    return setMinutes(setHours(tomorrow, 9), 0) // 9 AM tomorrow
  }

  const getNextWeek = () => {
    const monday = nextMonday(new Date())
    return setMinutes(setHours(monday, 9), 0) // 9 AM next Monday
  }

  const presets = [
    {
      label: "Later today",
      sublabel: format(getLaterToday(), "h:mm a"),
      icon: Clock,
      getValue: getLaterToday,
    },
    {
      label: "Tomorrow",
      sublabel: format(getTomorrow(), "EEEE, h:mm a"),
      icon: Sun,
      getValue: getTomorrow,
    },
    {
      label: "Next week",
      sublabel: format(getNextWeek(), "EEEE, MMM d"),
      icon: CalendarIcon,
      getValue: getNextWeek,
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        {!showCalendar ? (
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">Snooze until</p>
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handleSnooze(preset.getValue())}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <preset.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{preset.label}</p>
                    <p className="text-xs text-muted-foreground">{preset.sublabel}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowCalendar(true)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pick date & time</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)} className="mb-2">
              Back
            </Button>
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={(date) => {
                if (date) {
                  const snoozedDate = setMinutes(setHours(date, 9), 0)
                  handleSnooze(snoozedDate)
                }
              }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
