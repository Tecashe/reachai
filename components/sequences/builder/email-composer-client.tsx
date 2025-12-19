
"use client"
import { EmailComposer as EmailComposerComponent } from "./email-composer"
import type { SequenceStep } from "@/lib/types/sequence"

interface EmailComposerClientProps {
  step: SequenceStep
  userId: string
  onSave: (subject: string, body: string) => void
  onClose: () => void
}

export function EmailComposerClient({ step, userId, onSave, onClose }: EmailComposerClientProps) {
  return (
    <EmailComposerComponent
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      userId={userId}
      prospect={null}
      step={step}
      onSave={onSave}
      onClose={onClose}
    />
  )
}
