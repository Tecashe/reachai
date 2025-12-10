// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Plus, Loader2 } from "lucide-react"
// import { createSequence } from "@/lib/actions/sequences"
// import { getCampaigns } from "@/lib/actions/campaigns"
// import { getTemplates } from "@/lib/actions/templates"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// export function CreateSequenceDialog() {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [campaigns, setCampaigns] = useState<any[]>([])
//   const [templates, setTemplates] = useState<any[]>([])
//   const router = useRouter()

//   useEffect(() => {
//     if (open) {
//       Promise.all([getCampaigns(), getTemplates()]).then(([campaignsData, templatesData]) => {
//         setCampaigns(campaignsData)
//         setTemplates(templatesData)
//       })
//     }
//   }, [open])

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setLoading(true)

//     const formData = new FormData(e.currentTarget)
//     const campaignId = formData.get("campaignId") as string
//     const templateId = formData.get("templateId") as string
//     const stepNumber = Number.parseInt(formData.get("stepNumber") as string)
//     const delayDays = Number.parseInt(formData.get("delayDays") as string)

//     try {
//       const result = await createSequence({
//         campaignId,
//         templateId,
//         stepNumber,
//         delayDays,
//         sendOnlyIfNotReplied: true,
//         sendOnlyIfNotOpened: false,
//       })

//       if (result.success) {
//         toast.success("Sequence step created successfully")
//         setOpen(false)
//         router.refresh()
//       } else {
//         toast.error(result.error || "Failed to create sequence")
//       }
//     } catch (error) {
//       toast.error("An error occurred")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="h-4 w-4 mr-2" />
//           New Sequence Step
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create Sequence Step</DialogTitle>
//             <DialogDescription>Add a new step to an email sequence for automated follow-ups</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="campaignId">Campaign</Label>
//               <Select name="campaignId" required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select campaign" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {campaigns.map((campaign) => (
//                     <SelectItem key={campaign.id} value={campaign.id}>
//                       {campaign.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="templateId">Email Template</Label>
//               <Select name="templateId" required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select template" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {templates.map((template) => (
//                     <SelectItem key={template.id} value={template.id}>
//                       {template.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="stepNumber">Step Number</Label>
//               <Input id="stepNumber" name="stepNumber" type="number" min="1" defaultValue="1" required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="delayDays">Delay (Days)</Label>
//               <Input id="delayDays" name="delayDays" type="number" min="0" defaultValue="2" required />
//               <p className="text-xs text-muted-foreground">
//                 Days to wait after the previous email before sending this one
//               </p>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Create Step
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Loader2, FileText, AlertCircle } from 'lucide-react'
import { createSequence } from "@/lib/actions/sequences"
import { getCampaigns } from "@/lib/actions/campaigns"
import { getTemplates } from "@/lib/actions/templates"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import Link from "next/link"
import { WaveLoader } from "../loader/wave-loader"

export function CreateSequenceDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    if (open) {
      Promise.all([getCampaigns(), getTemplates()]).then(([campaignsData, templatesData]) => {
        setCampaigns(campaignsData)
        setTemplates(templatesData)
      })
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const campaignId = formData.get("campaignId") as string
    const templateId = formData.get("templateId") as string
    const stepNumber = Number.parseInt(formData.get("stepNumber") as string)
    const delayDays = Number.parseInt(formData.get("delayDays") as string)

    try {
      const result = await createSequence({
        campaignId,
        templateId,
        stepNumber,
        delayDays,
        sendOnlyIfNotReplied: true,
        sendOnlyIfNotOpened: false,
      })

      if (result.success) {
        toast.success("Sequence step created successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create sequence")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sequence Step
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Sequence Step</DialogTitle>
            <DialogDescription>Add a new step to an email sequence for automated follow-ups</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {templates.length === 0 && (
              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>No templates found.</strong> You need to create an email template first.{' '}
                  <Link href="/dashboard/templates" className="underline font-medium">
                    Go to Templates
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {templates.length === 0 && (
              <div className="flex justify-center py-4">
                <Link href="/dashboard/templates">
                  <Button type="button" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Template First
                  </Button>
                </Link>
              </div>
            )}

            {templates.length > 0 && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="campaignId">Campaign</Label>
                  <Select name="campaignId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((campaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="templateId">Email Template</Label>
                  <Select name="templateId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stepNumber">Step Number</Label>
                  <Input id="stepNumber" name="stepNumber" type="number" min="1" defaultValue="1" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="delayDays">Delay (Days)</Label>
                  <Input id="delayDays" name="delayDays" type="number" min="0" defaultValue="2" required />
                  <p className="text-xs text-muted-foreground">
                    Days to wait after the previous email before sending this one
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || templates.length === 0}>
              {loading && <WaveLoader size="sm" bars={8} gap="tight" />}
              Create Step
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
