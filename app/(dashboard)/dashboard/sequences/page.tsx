// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import { SequencesList } from "@/components/sequences/sequences-list"

// export default function SequencesPage() {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Email Sequences</h1>
//           <p className="text-muted-foreground">Create multi-step email sequences for automated follow-ups</p>
//         </div>
//         <Button>
//           <Plus className="h-4 w-4 mr-2" />
//           New Sequence
//         </Button>
//       </div>

//       <SequencesList />
//     </div>
//   )
// }

// import { CreateSequenceDialog } from "@/components/sequences/create-sequence-dialog"
// import { SequencesList } from "@/components/sequences/sequences-list"
// import { getSequences } from "@/lib/actions/sequences"

// export default async function SequencesPage() {
//   const sequences = await getSequences()

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Email Sequences</h1>
//           <p className="text-muted-foreground">Create multi-step email sequences for automated follow-ups</p>
//         </div>
//         <CreateSequenceDialog />
//       </div>

//       <SequencesList sequences={sequences} />
//     </div>
//   )
// }

import { CreateSequenceDialog } from "@/components/sequences/create-sequence-dialog"
import { SequencesList } from "@/components/sequences/sequences-list"
import { SequencesEmptyState } from "@/components/sequences/sequence-empty-state"
import { getSequences } from "@/lib/actions/sequences"
import { getTemplates } from "@/lib/actions/templates"

export default async function SequencesPage() {
  const sequences = await getSequences()
  const templates = await getTemplates()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Sequences</h1>
          <p className="text-muted-foreground">Create multi-step email sequences for automated follow-ups</p>
        </div>
        {templates.length > 0 && <CreateSequenceDialog />}
      </div>

      {templates.length === 0 ? (
        <SequencesEmptyState hasTemplates={false} />
      ) : sequences.length === 0 ? (
        <SequencesEmptyState hasTemplates={true} />
      ) : (
        <SequencesList sequences={sequences} />
      )}
    </div>
  )
}
