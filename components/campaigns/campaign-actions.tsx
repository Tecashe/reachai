// "use client"

// import { Button } from "@/components/ui/button"
// import { MoreVertical, Play, Pause, Trash2 } from "lucide-react"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { updateCampaignStatus, deleteCampaign } from "@/lib/actions/campaigns"
// import { useTransition } from "react"
// import { useRouter } from "next/navigation"

// interface CampaignActionsProps {
//   campaignId: string
//   currentStatus: string
// }

// export function CampaignActions({ campaignId, currentStatus }: CampaignActionsProps) {
//   const [isPending, startTransition] = useTransition()
//   const router = useRouter()

//   const handleStatusChange = (newStatus: string) => {
//     startTransition(async () => {
//       await updateCampaignStatus(campaignId, newStatus)
//       router.refresh()
//     })
//   }

//   const handleDelete = () => {
//     if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
//       startTransition(async () => {
//         await deleteCampaign(campaignId)
//       })
//     }
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" disabled={isPending}>
//           <MoreVertical className="h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {currentStatus !== "ACTIVE" && (
//           <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")}>
//             <Play className="h-4 w-4 mr-2" />
//             Activate
//           </DropdownMenuItem>
//         )}
//         {currentStatus === "ACTIVE" && (
//           <DropdownMenuItem onClick={() => handleStatusChange("PAUSED")}>
//             <Pause className="h-4 w-4 mr-2" />
//             Pause
//           </DropdownMenuItem>
//         )}
//         <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
//           <Trash2 className="h-4 w-4 mr-2" />
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical, Play, Pause, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateCampaignStatus, deleteCampaign } from "@/lib/actions/campaigns"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

interface CampaignActionsProps {
  campaignId: string
  currentStatus: string
}

export function CampaignActions({ campaignId, currentStatus }: CampaignActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("campaignId", campaignId)
      formData.append("status", newStatus)
      await updateCampaignStatus(formData)
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteCampaign(campaignId)
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
        {currentStatus !== "ACTIVE" && (
          <DropdownMenuItem onClick={() => handleStatusChange("ACTIVE")}>
            <Play className="h-4 w-4 mr-2" />
            Activate
          </DropdownMenuItem>
        )}
        {currentStatus === "ACTIVE" && (
          <DropdownMenuItem onClick={() => handleStatusChange("PAUSED")}>
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
