"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteProspect } from "@/lib/actions/prospects"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface ProspectActionsProps {
  prospectId: string
}

export function ProspectActions({ prospectId }: ProspectActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this prospect? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteProspect(prospectId)
        router.refresh()
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Send Email</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
