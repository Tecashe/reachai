"use client"
import { toast } from "sonner"

interface UndoToastOptions {
  message: string
  action: () => Promise<void>
  undoAction: () => Promise<void>
  duration?: number
}

export function showUndoToast({ message, action, undoAction, duration = 5000 }: UndoToastOptions) {
  let undone = false

  // Execute the action
  action()

  toast(message, {
    duration,
    action: {
      label: "Undo",
      onClick: async () => {
        if (!undone) {
          undone = true
          await undoAction()
          toast.success("Action undone")
        }
      },
    },
    onAutoClose: () => {
      // Action already executed, no need to do anything
    },
  })
}
