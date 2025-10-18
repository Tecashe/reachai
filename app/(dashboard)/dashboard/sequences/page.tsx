import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SequencesList } from "@/components/sequences/sequences-list"

export default function SequencesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Sequences</h1>
          <p className="text-muted-foreground">Create multi-step email sequences for automated follow-ups</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sequence
        </Button>
      </div>

      <SequencesList />
    </div>
  )
}
