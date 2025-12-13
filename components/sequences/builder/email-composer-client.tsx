"use client"
import { EmailComposer as MainEmailComposer } from "./email-composer"
import type { SequenceStep } from "@/lib/types/sequence"

interface SequenceEmailComposerProps {
  step: SequenceStep
  userId: string // Added userId prop instead of reading from step
  onSave: (subject: string, body: string) => void
  onClose: () => void
}

export function EmailComposer({ step, userId, onSave, onClose }: SequenceEmailComposerProps) {
  return (
    <MainEmailComposer
      step={step}
      onSave={onSave}
      onClose={onClose}
      isOpen={true}
      onOpenChange={(open) => !open && onClose()}
      userId={userId} // Using userId from props
      prospect={null}
    />
  )
}
