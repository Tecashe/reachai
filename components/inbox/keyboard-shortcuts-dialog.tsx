"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["j"], description: "Next message" },
        { keys: ["k"], description: "Previous message" },
        { keys: ["Enter"], description: "Open message" },
        { keys: ["Esc"], description: "Close / Deselect" },
      ],
    },
    {
      category: "Actions",
      items: [
        { keys: ["r"], description: "Reply" },
        { keys: ["g"], description: "Generate AI reply" },
        { keys: ["e"], description: "Archive" },
        { keys: ["s"], description: "Toggle star" },
        { keys: ["h"], description: "Snooze" },
        { keys: ["#"], description: "Delete" },
      ],
    },
    {
      category: "Selection",
      items: [
        { keys: ["x"], description: "Select / Deselect message" },
        { keys: ["Shift", "a"], description: "Select all" },
        { keys: ["Shift", "n"], description: "Deselect all" },
      ],
    },
    {
      category: "View",
      items: [
        { keys: ["u"], description: "Mark as unread" },
        { keys: ["Shift", "u"], description: "Mark as read" },
        { keys: ["/"], description: "Focus search" },
        { keys: ["?"], description: "Show shortcuts" },
      ],
    },
    {
      category: "Global",
      items: [
        { keys: ["⌘", "k"], description: "Command palette" },
        { keys: ["⌘", "b"], description: "Toggle sidebar" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">{group.category}</h3>
              <div className="space-y-2">
                {group.items.map((shortcut) => (
                  <div key={shortcut.description} className="flex items-center justify-between py-1">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <Kbd key={i}>{key}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
