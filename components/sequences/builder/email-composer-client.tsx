// "use client"
// import { EmailComposer as MainEmailComposer } from "./email-composer"
// import type { SequenceStep } from "@/lib/types/sequence"

// interface SequenceEmailComposerProps {
//   step: SequenceStep
//   userId: string // Added userId prop instead of reading from step
//   onSave: (subject: string, body: string) => void
//   onClose: () => void
// }

// export function EmailComposer({ step, userId, onSave, onClose }: SequenceEmailComposerProps) {
//   return (
//     <MainEmailComposer
//       step={step}
//       onSave={onSave}
//       onClose={onClose}
//       isOpen={true}
//       onOpenChange={(open) => !open && onClose()}
//       userId={userId} // Using userId from props
//       prospect={null}
//     />
//   )
// }

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
