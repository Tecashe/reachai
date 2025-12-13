import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const shortcuts = [
    {
      category: "Text Formatting",
      items: [
        { keys: ["Ctrl", "B"], description: "Bold" },
        { keys: ["Ctrl", "I"], description: "Italic" },
        { keys: ["Ctrl", "U"], description: "Underline" },
        { keys: ["Ctrl", "Shift", "X"], description: "Strikethrough" },
      ],
    },
    {
      category: "Paragraph",
      items: [
        { keys: ["Ctrl", "Alt", "1"], description: "Heading 1" },
        { keys: ["Ctrl", "Alt", "2"], description: "Heading 2" },
        { keys: ["Ctrl", "Alt", "3"], description: "Heading 3" },
        { keys: ["Ctrl", "Shift", "7"], description: "Ordered list" },
        { keys: ["Ctrl", "Shift", "8"], description: "Bullet list" },
        { keys: ["Ctrl", "Shift", "9"], description: "Block quote" },
      ],
    },
    {
      category: "Text Alignment",
      items: [
        { keys: ["Ctrl", "Shift", "L"], description: "Align left" },
        { keys: ["Ctrl", "Shift", "E"], description: "Align center" },
        { keys: ["Ctrl", "Shift", "R"], description: "Align right" },
        { keys: ["Ctrl", "Shift", "J"], description: "Justify" },
      ],
    },
    {
      category: "Actions",
      items: [
        { keys: ["Ctrl", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
        { keys: ["Ctrl", "K"], description: "Add link" },
        { keys: ["Ctrl", "S"], description: "Save template" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Speed up your editing with these keyboard shortcuts</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <Kbd>{key}</Kbd>
                          {j < shortcut.keys.length - 1 && <span className="text-muted-foreground text-xs">+</span>}
                        </span>
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
